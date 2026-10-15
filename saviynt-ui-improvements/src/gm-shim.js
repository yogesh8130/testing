/**
 * gm-shim.js  (runs in the extension's isolated content-script world)
 *
 * Replaces the Tampermonkey APIs the original userscript relied on:
 *
 *   GM_addStyle  -> injects a <style> element
 *   GM_getValue  -> synchronous read from an in-memory cache of chrome.storage.local
 *   GM_setValue  -> updates the cache immediately + writes through to chrome.storage.local
 *
 * It also provides two helpers that talk to page-bridge.js (which runs in the page's
 * own JS world) for the few things that need the page's jQuery / DataTables / functions:
 *
 *   pageDataTable(tableElement)   -> stand-in for  $(tableElement).dataTable()
 *   callPageFunction(name)        -> stand-in for calling a global function defined by the page
 *   runScriptsInPage(containerId) -> re-runs the <script> tags inside a container in the page world
 *
 * Exposes: globalThis.__saviyntShim.ready  (Promise resolving to the API object)
 * The promise resolves once chrome.storage has been read, which is what lets
 * GM_getValue stay synchronous like it was under Tampermonkey.
 */
(function () {
	'use strict';

	const BRIDGE_EVENT = 'saviynt-ext:request';
	const REQ_ATTR = 'data-saviynt-req';
	const RES_ATTR = 'data-saviynt-res';

	// ---- GM_addStyle -------------------------------------------------------------------
	function GM_addStyle(css) {
		const style = document.createElement('style');
		style.textContent = css;
		(document.head || document.documentElement).appendChild(style);
		return style;
	}

	// ---- Page-world bridge client ------------------------------------------------------
	// DOM events + attributes are shared between the isolated world and the page world,
	// and dispatchEvent() is synchronous, so the request/response below is synchronous too.
	function bridgeRequest(target, request) {
		target.setAttribute(REQ_ATTR, JSON.stringify(request));
		target.removeAttribute(RES_ATTR);
		target.dispatchEvent(new CustomEvent(BRIDGE_EVENT, { bubbles: true }));
		const raw = target.getAttribute(RES_ATTR);
		target.removeAttribute(REQ_ATTR);
		target.removeAttribute(RES_ATTR);
		if (!raw) return { ok: false, error: 'page bridge did not respond' };
		try { return JSON.parse(raw); } catch (e) { return { ok: false, error: 'invalid bridge response' }; }
	}

	/**
	 * Stand-in for $(tableElement).dataTable() as used by the userscript.
	 * Supports exactly what the script uses:
	 *   table.fnSettings().aoColumns            (truthy when a DataTable is initialised)
	 *   table.fnSettings()._iDisplayLength = n  (recorded)
	 *   table.fnSettings().aaSorting = [[..]]   (recorded)
	 *   table.fnDraw(arg)                       (applies the recorded values in the page world, then redraws)
	 */
	function pageDataTable(tableElement) {
		const probe = bridgeRequest(tableElement, { op: 'dt-probe' });
		if (!probe.ok && probe.error) console.debug('[Saviynt UI] DataTables not available for', tableElement.id || tableElement, '-', probe.error);

		const settings = {};
		if (probe.ok && probe.initialised) settings.aoColumns = true;

		return {
			fnSettings: () => settings,
			fnDraw: (arg) => {
				if (!settings.aoColumns) return;
				const props = Object.assign({}, settings);
				delete props.aoColumns;
				const res = bridgeRequest(tableElement, { op: 'dt-apply', props, arg });
				if (!res.ok) console.error('[Saviynt UI] Failed to update DataTable:', res.error);
			}
		};
	}

	/** Calls an allow-listed global function defined by the page itself (e.g. showPreview). */
	function callPageFunction(name, args) {
		const res = bridgeRequest(document.documentElement, { op: 'call', fn: name, args: args || [] });
		if (!res.ok) console.error('[Saviynt UI] Page function "' + name + '" failed:', res.error);
		return res.ok;
	}

	/**
	 * Re-executes the <script> elements that are inside #containerId (content that was inserted with
	 * innerHTML, which leaves scripts inert). They run in the page world under the site's own CSP; scripts
	 * created from the isolated world would be blocked by the extension's CSP ("Executing inline script violates ...").
	 */
	function runScriptsInPage(containerId) {
		const res = bridgeRequest(document.documentElement, { op: 'run-scripts', container: containerId });
		if (!res.ok) console.error('[Saviynt UI] Could not run scripts in #' + containerId + ':', res.error);
		return res.ok;
	}

	// ---- GM_getValue / GM_setValue -----------------------------------------------------
	const ready = chrome.storage.local.get(null).then((initial) => {
		const cache = Object.assign({}, initial);

		// keep the cache in sync when another tab / frame writes a value
		chrome.storage.onChanged.addListener((changes, area) => {
			if (area !== 'local') return;
			for (const [key, { newValue }] of Object.entries(changes)) {
				if (newValue === undefined) delete cache[key]; else cache[key] = newValue;
			}
		});

		function GM_getValue(key, defaultValue) {
			return Object.prototype.hasOwnProperty.call(cache, key) ? cache[key] : defaultValue;
		}

		function GM_setValue(key, value) {
			if (value === undefined) {
				// the userscript uses GM_setValue(key, undefined) to delete an entry
				delete cache[key];
				chrome.storage.local.remove(key);
			} else {
				cache[key] = value;
				chrome.storage.local.set({ [key]: value });
			}
		}

		return { GM_addStyle, GM_getValue, GM_setValue, pageDataTable, callPageFunction, runScriptsInPage };
	});

	globalThis.__saviyntShim = { ready };
})();
