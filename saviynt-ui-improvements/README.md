# Saviynt UI Improvements (Chrome extension)

Converted from the Tampermonkey userscript of the same name. Behaviour, keyboard shortcuts and
all page-specific styling are unchanged.

## Install

1. Open `chrome://extensions` (Edge: `edge://extensions`) and turn on **Developer mode**.
2. Click **Load unpacked** and select this folder (the one containing `manifest.json`).
3. **Disable or delete the Tampermonkey version**, otherwise both run and you get two button bars.

Requires Chrome / Edge 111 or newer. After editing any file, click the reload icon on the extension card, then refresh the Saviynt tab.

## Moving your saved queries over

Saved queries were stored in Tampermonkey's storage, which an extension cannot read.
On the Data Analyzer page of the **old** userscript click **⬇ Export Queries**, then on the
same page with the **extension** click **⬆ Import Queries**.

## What changed vs. the userscript

| Userscript | Extension |
|---|---|
| `@match` / `@exclude` | `content_scripts.matches` / `exclude_matches` in `manifest.json` |
| `@require` (CDN) | Libraries bundled in `lib/` (MV3 forbids remote code) |
| `@import` of CodeMirror CSS | `codemirror.css` + `material.css` loaded via manifest `css` |
| `GM_addStyle` | `<style>` injection (`src/gm-shim.js`) |
| `GM_getValue` / `GM_setValue` | In-memory cache backed by `chrome.storage.local` (`src/gm-shim.js`) |
| `$(table).dataTable()`, `showPreview()` (the page's own jQuery / function) | Small page-world bridge (`src/page-bridge.js`) |
| Re-running `<script>` tags from fetched analytics HTML | Done by the page-world bridge (an extension's own CSP blocks inline scripts created from the content script) |
| `$("#usersList").find('th')...` | Plain DOM code (same result) |

Every edit to the original script is marked `EXT:` in `src/content.js`.

## Bundled library versions

timelines-chart 2.14.3, vis-timeline 8.5.4, CodeMirror 5.65.20, diff 5.2.0 (licenses in `lib/licenses/`).
To update one, replace its file(s) in `lib/` (`npm pack <name>` and copy from `dist/`).

## Editing tips

* Content scripts run in an isolated world: they can't see the page's `$`, `jQuery` or its global functions.
  If you need one, add an allow-listed operation to `src/page-bridge.js` and call it via `gm-shim.js`.
* The script runs in all frames of the matched sites, as the userscript did.
