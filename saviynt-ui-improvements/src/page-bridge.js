/**
 * page-bridge.js  (runs in the PAGE's own JS world - manifest "world": "MAIN")
 *
 * Content scripts live in an isolated world and cannot see variables the page defines
 * (jQuery, the DataTables plugin, Saviynt's own global functions). The handful of things
 * the userscript did with those are performed here, on request from gm-shim.js.
 *
 * Protocol: gm-shim.js writes a JSON request into a data attribute on the target element and
 * dispatches a bubbling "saviynt-ext:request" event on it. We handle it synchronously and
 * write a JSON response into another data attribute on the same element.
 *
 * Deliberately tiny and allow-listed: it only ever
 *   - reads/updates DataTables display length + sorting on a table and redraws it, and
 *   - calls the functions named in ALLOWED_FUNCTIONS, and
 *   - re-runs <script> tags that already sit inside the containers named in ALLOWED_SCRIPT_CONTAINERS.
 */
(function () {
	'use strict';

	const BRIDGE_EVENT = 'saviynt-ext:request';
	const REQ_ATTR = 'data-saviynt-req';
	const RES_ATTR = 'data-saviynt-res';

	// page-defined global functions the extension may trigger
	const ALLOWED_FUNCTIONS = new Set(['showPreview']);
	// containers whose (innerHTML-inserted, hence inert) <script> tags may be re-run
	const ALLOWED_SCRIPT_CONTAINERS = new Set(['analytics-result', 'analytics-result-count']);
	// DataTables settings the extension may change
	const ALLOWED_DT_PROPS = new Set(['_iDisplayLength', 'aaSorting']);

	function getDataTable(el) {
		const jq = window.jQuery || window.$;
		if (!jq || !jq.fn || typeof jq.fn.dataTable !== 'function') {
			throw new Error('jQuery DataTables is not available on this page');
		}
		return jq(el).dataTable();
	}

	function handle(el, req) {
		switch (req.op) {
			case 'dt-probe': {
				const dt = getDataTable(el);
				return { ok: true, initialised: !!dt.fnSettings().aoColumns };
			}
			case 'dt-apply': {
				const dt = getDataTable(el);
				const settings = dt.fnSettings();
				for (const [key, value] of Object.entries(req.props || {})) {
					if (ALLOWED_DT_PROPS.has(key)) settings[key] = value;
				}
				dt.fnDraw(req.arg);
				return { ok: true };
			}
			case 'call': {
				if (!ALLOWED_FUNCTIONS.has(req.fn)) throw new Error('function not allowed: ' + req.fn);
				const fn = window[req.fn];
				if (typeof fn !== 'function') throw new Error('page function not found: ' + req.fn);
				fn.apply(window, req.args || []);
				return { ok: true };
			}
			case 'run-scripts': {
				if (!ALLOWED_SCRIPT_CONTAINERS.has(req.container)) throw new Error('container not allowed: ' + req.container);
				const container = document.getElementById(req.container);
				if (!container) throw new Error('container not found: #' + req.container);
				// Runs here (page world), so the page's own CSP applies - same as the site's native inline scripts.
				container.querySelectorAll('script').forEach((oldScript) => {
					const newScript = document.createElement('script');
					if (oldScript.src) newScript.src = oldScript.src;
					else newScript.textContent = oldScript.textContent;
					document.body.appendChild(newScript);
					document.body.removeChild(newScript);
				});
				return { ok: true };
			}
			default:
				throw new Error('unknown op: ' + req.op);
		}
	}

	document.addEventListener(BRIDGE_EVENT, (event) => {
		const el = event.target;
		if (!el || typeof el.getAttribute !== 'function') return;
		let res;
		try {
			res = handle(el, JSON.parse(el.getAttribute(REQ_ATTR) || '{}'));
		} catch (err) {
			res = { ok: false, error: String((err && err.message) || err) };
		}
		el.setAttribute(RES_ATTR, JSON.stringify(res));
	}, true);
})();
