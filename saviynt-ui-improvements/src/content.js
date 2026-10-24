/**
 * Saviynt UI Improvements - Chrome extension content script
 *
 * Converted from the Tampermonkey userscript "Saviynt UI Improvements" (author: Yogesh).
 * Everything below is the original script; the only edits are marked with "EXT:".
 *   - GM_addStyle / GM_getValue / GM_setValue come from gm-shim.js
 *   - @require'd libraries are bundled in /lib and listed in manifest.json
 *   - things that need the page's own jQuery/functions go through page-bridge.js
 */

(async function () {
	'use strict';

	// EXT: Tampermonkey GM_* APIs are provided by gm-shim.js (loaded before this file)
	const { GM_addStyle, GM_getValue, GM_setValue, pageDataTable, callPageFunction, runScriptsInPage } = await globalThis.__saviyntShim.ready;

	/* TODO:
		1. NA
	*/

	// window.onload = function () {
	// setTimeout(function () {

	// Keyboard Shortcuts
	document.addEventListener("keydown", (event) => {
		// run date format function on ctrl + 3
		if (event.ctrlKey && event.key === "3") {
			event.preventDefault();
			const dataTables = document.querySelectorAll('table.dataTable');
			dataTables.forEach(table => {
				formatDatesToIso(table);
			});
		}
		// Alt + D to open data analyzer
		if (event.altKey && event.key === "d") {
			event.preventDefault();
			window.open('/ECM/dataAnalyzer/index', '_blank');
		}
		// alt + h to open request history
		if (event.altKey && event.key === "h") {
			event.preventDefault();
			window.open('/ECM/jbpmworkflowmanagement/showmyhistoryrequests', '_blank');
		}
		// alt + a to open analytics
		if (event.altKey && event.key === "a") {
			event.preventDefault();
			window.open('/ECM/analyticsConfig/list', '_blank');
		}
		// alt + j to open job control panel
		if (event.altKey && event.key === "j") {
			event.preventDefault();
			window.open('/ECM/flatViewJobcontrol/flatViewJobList', '_blank');
		}
        // alt + p to open pending tasks
        if (event.altKey && event.key === "p") {
            event.preventDefault();
            window.open('/ECM/workflowmanagement/pendingtasklist', '_blank');
        }
		// alt + u to open user list
		if (event.altKey && event.key === "u") {
			event.preventDefault();
			window.open('/ECM/users/list', '_blank');
		}
		if (event.altKey && event.key === "c") {
			event.preventDefault();
			window.open('/ECM/ecmConfig/externalconfig', '_blank');
		}
		if (event.altKey && event.key === "s") {
			event.preventDefault();
			window.open('/ECM/securitysystems/list', '_blank');
		}
		if (event.altKey && event.key === "x") {
			event.preventDefault();
			document.querySelector('#toggleScriptCheckbox').click();
		}
        if (event.altKey && event.key === "b") {
            event.preventDefault();
            openAnalytics('BAU Actionable Report for Incident Management');
        }
        if (event.altKey && event.key === "v") {
            // to open test analytics
            event.preventDefault();
            openAnalytics('85229357');
        }
	});

	// EXT: codemirror.css + material.css are bundled and injected via manifest.json ("css"), no remote @import needed

    GM_addStyle(`
                /* Ayu Light theme for CodeMirror 5 */
                .CodeMirror {
                    background: #fcfcfc !important;
                    color: #5c6166 !important;
                }
                .CodeMirror-selected,
                .CodeMirror-selectedtext {
                    background: #036dd626 !important;
                }
                .CodeMirror-linebackground {
                    background: #8a91991a !important;
                }
                .CodeMirror-gutters {
                    background: #fcfcfc !important;
                    color: #8a919966 !important;
                    border-right: none !important;
                }
                /* Comments */
                .cm-comment {
                    color: #787b8099 !important;
                }
                /* Strings */
                .cm-string {
                    color: #86b300 !important;
                }
                /* Regex */
                .cm-string-2 {
                    color: #4cbf99 !important;
                }
                /* Numbers */
                .cm-number {
                    color: #ffaa33 !important;
                }
                /* Keywords */
                .cm-keyword {
                    color: #fa8d3e !important;
                }
                /* Operators */
                .cm-operator {
                    color: #ed9366 !important;
                }
                /* Variables */
                .cm-variable,
                .cm-variable-2,
                .cm-variable-3 {
                    color: #5c6166 !important;
                }
                /* Properties */
                .cm-property {
                    color: #f2ae49 !important;
                }
                /* Functions */
                .cm-def {
                    color: #f2ae49 !important;
                }
                /* Classes & types */
                .cm-type,
                .cm-qualifier {
                    color: #22a4e6 !important;
                }
                /* Tags */
                .cm-tag {
                    color: #55b4d4 !important;
                }
                /* Attributes */
                .cm-attribute {
                    color: #f2ae49 !important;
                }
                /* Brackets */
                .cm-bracket {
                    color: #5c6166 !important;
                }
                /* Builtins / atoms */
                .cm-atom {
                    color: #ffaa33 !important;
                }
                /* Meta */
                .cm-meta {
                    color: #fa8d3e !important;
                }
                /* Links */
                .cm-link {
                    color: #22a4e6 !important;
                }
                /* Errors */
                .cm-error {
                    color: #ff3333 !important;
                }
                `);

	// codemirror css overrides
	GM_addStyle(`
					.CodeMirror { width: 100% !important; height: auto !important; max-height: 70vh !important; font-size: 13px; line-height: 1.3em; min-height: 35px; }
					.CodeMirror-scroll { max-height: 70vh !important; }
					.CodeMirror pre { white-space: pre-wrap !important; word-break: break-word !important; }
					`);
	// Vis-timeline css overrides
	GM_addStyle(`
					.vis-ltr .vis-label.vis-nested-group .vis-inner { padding-left: 50px; }
					`);
	// Diff Styles
	GM_addStyle(`.subcelldiv span { padding: 0 1px; }
					.subcelldiv .diff-added { background-color: mediumseagreen; color: white; padding: 0 2px; }
					.subcelldiv .diff-removed { background-color: orangered; color: white; padding: 0 2px;}
					.subcelldiv .diff-marker { padding: 0 3px; font-weight: bold; user-select: none; }
					`);

	// HIDE SAVIYNT / CLIENT LOGOS
	// a.Logo_logo__Z22wd { display: none; }
	// a.Logo_logo__15yHg { display: none; }

	// Creating a div to place custom action buttons in
	const customButtonDiv = document.createElement("div");
	customButtonDiv.id = "customButtonDiv";
	document.body.appendChild(customButtonDiv);

	// Create script toggle checkbox
	const toggleScriptCheckbox = document.createElement("input");
	toggleScriptCheckbox.type = "checkbox";
	toggleScriptCheckbox.id = 'toggleScriptCheckbox';
	// Check the initial state from sessionStorage (defaults to true if not set)
	const isChecked = JSON.parse(sessionStorage.getItem('saviyntScriptEnabled')) !== false;
	toggleScriptCheckbox.checked = isChecked;
	toggleScriptCheckbox.addEventListener('change', function () {
		sessionStorage.setItem('saviyntScriptEnabled', JSON.stringify(toggleScriptCheckbox.checked));
		window.location.reload();
	});
	customButtonDiv.appendChild(toggleScriptCheckbox);
	GM_addStyle(`#customButtonDiv {position: fixed;bottom: 0;right: 0;z-index: 9999;display: flex;gap: 5px;background: white;border-radius: 6px 0 0 0 !important;padding: 5px;box-shadow: 3px 4px 13px 6px rgb(0 0 0 / 29%);font-size: 12px;}
			#customButtonDiv > button {border-radius: 5px !important;border: 0;background-color: #d5d5d5; padding: 0 5px;}
			.yogi-textbox { border: none; }
			div#ganttChartContainer { margin-left: 62px; margin-right: 13px;}
			button[aria-label="open drawer"] { opacity: 0.1; }
			.loading-bg {display: none !important}
			`);
	if (!isChecked) {
		// keep the checkbox very transparent
		GM_addStyle(`#customButtonDiv {opacity: 0.0001;}`);
		return; // If unchecked, stop the script from running further
	}


	// GLOBAL STYLES // FOR NEO + CLASSIC

	// to mark PROD env header red and limit its height
	if (!window.location.href.includes('dev') && !window.location.href.includes('test')) {
		GM_addStyle(`header { background: tomato !important; }
						header { height: 64px; }
						`);
	}

	// INVALID PAGE ; REDIRECT TO HOME
	if (document.querySelector("body > div.json-formatter-container")) {
		setTimeout(() => {
			window.location.href = `${baseUrl}/ECM`;
		}, 500);
	}

	// CODE THAT APPLIES TO ALL PAGES

	// GLOBAL VARIABLES
	const baseUrl = window.location.origin;
	const LOG_RECORDS_PER_CALL = 1234;
	const SUBCELLING_MAX_CHARS = 80;

	const HIGHLIGHT_RULES = [
		{ word: "true", highlightName: "lightGreenHighlight", whole: true },
		{ word: "enable", highlightName: "lightGreenHighlight", whole: true },
		{ word: "enable account", highlightName: "lightGreenHighlight", whole: true },
		{ word: "add access", highlightName: "lightGreenHighlight", whole: true },
		{ word: "add", highlightName: "lightGreenHighlight", whole: true },
		{ word: "create", highlightName: "lightGreenHighlight", whole: true },
		{ word: "new account", highlightName: "lightGreenHighlight", whole: true },
		{ word: "approved", highlightName: "lightGreenHighlight", whole: true },
		{ word: "complete", highlightName: "lightGreenHighlight", whole: true },
		{ word: "success", highlightName: "lightGreenHighlight", whole: true },
		{ word: "inactive", highlightName: "deepRedHighlight", whole: true },
		{ word: "suspended from import service", highlightName: "lightRedHighlight", whole: true },
		{ word: "sfis", highlightName: "lightRedHighlight", whole: true },
		{ word: "manually suspended", highlightName: "lightRedHighlight", whole: true },
		{ word: "false", highlightName: "lightRedHighlight", whole: true },
		{ word: "remove", highlightName: "lightRedHighlight", whole: true },
		{ word: "remove account", highlightName: "lightRedHighlight", whole: true },
		{ word: "delete", highlightName: "lightRedHighlight", whole: true },
		{ word: "fail", highlightName: "lightRedHighlight", whole: true },
		{ word: "reject", highlightName: "lightRedHighlight", whole: true },
		{ word: "error", highlightName: "lightRedHighlight", whole: true },
		{ word: "disable", highlightName: "lightRedHighlight", whole: true },
		{ word: "disable account", highlightName: "lightRedHighlight", whole: true },
		{ word: "warn", highlightName: "lightYellowHighlight", whole: true },
		{ word: "update", highlightName: "lightYellowHighlight", whole: true },
		{ word: "update account", highlightName: "lightYellowHighlight", whole: true },
		{ word: "update user", highlightName: "lightYellowHighlight", whole: true },
	];

	// Create a div in the center of the screen for gannt chart
	const ganttChartContainer = document.createElement("div");
	ganttChartContainer.id = "ganttChartContainer";
	document.body.appendChild(ganttChartContainer);
	const ganttChartDiv = document.createElement("div");
	ganttChartDiv.id = "ganttChartDiv";
	ganttChartContainer.appendChild(ganttChartDiv);

	// GLOBAL STYLES
	GM_addStyle(`body {font-family: 'Roboto', 'Tahoma', sans-serif !important; background-color: #f9fafc !important;}
					img.cl-logo-icon {border-radius: 5px !important;margin: 10px;}
					h3.page-title {font-weight: bold !important;font-family: Roboto !important;font-size: xx-large;position: fixed;top: 16px;left: 190px; z-index: 1010; padding-right: 20px}
					h3.page-title {max-height: 45px;overflow: scroll;white-space: nowrap;text-overflow: ellipsis;scrollbar-width: none;}
					#header > div > div.Layout_page__200Hp > div > header > div {box-shadow: 2px 3px 10px 0px #0000003d;}
					a.Logo_logo__15yHg {margin: -15px;}
					.real-field-name {position: absolute;top: -9px;font-size: x-small;color: #4d4d4dff;background: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 1) 50%, rgba(0, 0, 0, 0) 100%); opacity: 0;}
					.real-field-name:hover { opacity: 100; }
					#header > div > div.Layout_page__v9Rri > div > div.MuiDrawer-root-179.MuiDrawer-docked-180.jss94.jss95 > div {z-index: 1020;}
					
					`);
    GM_addStyle(` .yogi-last-clicked-cell { outline: 2px solid cornflowerblue !important; outline-offset: -2px !important; } `);
	// GLOBAL HOTKEYS
	document.addEventListener("keydown", (event) => {
		// RUN QUERY WITH CTRL + 1
		if (event.ctrlKey && event.key === "1") {
			event.preventDefault();
			const dataTables = document.querySelectorAll('table.dataTable');
			dataTables.forEach(table => {
				extendDataTables(table, false);
			});
		}
	});

	// GLOBAL FUNCTIONS

	function addJumpToUsrFields() {
		// add a textbox to jump directly to a username
		const jumptousr = document.createElement("input")
		jumptousr.id = 'jumptousr';
		jumptousr.classList.add('yogi-textbox');
		jumptousr.type = 'text';
		jumptousr.placeholder = 'Usrname';
		customButtonDiv.appendChild(jumptousr)

		jumptousr.addEventListener("keydown", async (e) => {
			if (e.key !== "Enter") return;
			const username = jumptousr.value;
			const rows = await runQuery(
				`select userkey from users where username = '${username}'`
			);
			if (rows.length === 0) {
				alert(`No rows returned for ${username}`);
				return;
			}
			const userkey = rows[0]?.USERKEY;
			window.open(`${baseUrl}/ECM/users/show/${userkey}`, "_blank");
		});

		// add a textbox to jump directly to a systemusername
		const jumptosysusr = document.createElement("input")
		jumptosysusr.id = 'jumptosysusr';
		jumptosysusr.classList.add('yogi-textbox');
		jumptosysusr.type = 'text';
		jumptosysusr.placeholder = 'SysUsrName';
		customButtonDiv.appendChild(jumptosysusr)

		jumptosysusr.addEventListener("keydown", async (e) => {
			if (e.key !== "Enter") return;
			const username = jumptosysusr.value;
			const rows = await runQuery(
				`select userkey from users where systemusername = '${username}'`
			);
			// show alert if multiple rows are returned
			if (rows.length > 1) {
				alert(`Multiple rows returned for ${username}; userkeys: ${rows.map(row => row.USERKEY).join(', ')}`);
				return;
			} else if (rows.length === 0) {
				alert(`No rows returned for ${username}`);
				return;
			}
			const userkey = rows[0]?.USERKEY;
			window.open(`${baseUrl}/ECM/users/show/${userkey}`, "_blank");
		});

		// add a textbox to jump directly to a userkey
		const jumptousrkey = document.createElement("input")
		jumptousrkey.id = 'jumptousrkey';
		jumptousrkey.classList.add('yogi-textbox');
		jumptousrkey.type = 'text';
		jumptousrkey.placeholder = 'Usrkey';
		customButtonDiv.appendChild(jumptousrkey)

		jumptousrkey.addEventListener("keydown", async (e) => {
			if (e.key !== "Enter") return;
			window.open(`${baseUrl}/ECM/users/show/${jumptousrkey.value}`, "_blank");
		});
	}
	function getAccessToken() {
		const cookies = document.cookie.split(';');
		let access_token = '';
		cookies.forEach(cookie => {
			if (cookie.includes('access_token')) {
				access_token = cookie.split('=')[1];
			}
		});
		return access_token;
	}
	// Function to modify DataTables instance for 100 rows
	function extendDataTables(tableElement, sort = true) {
		// console.log(`extendDataTables: ${tableElement.id}`);

		// Define the DataTables instance
		const table = pageDataTable(tableElement); // EXT: was $(tableElement).dataTable() (page-world jQuery, see page-bridge.js)

		// Adjust the AJAX source URL to fetch 100 rows
		// table.fnSettings().sAjaxSource = '/ECM/jobcontrol/jobhistorydetailjson?length=100'; // not required
		// Check if table.fnSettings().aoColumns is defined
		if (table.fnSettings().aoColumns) {
			const tableRecordCountDropdown = document.querySelector(".recordsBlock .select2-chosen");
			// table.fnSettings()._iDisplayLength = parseInt(tableRecordCountDropdown?.textContent) || 100;
			if (tableElement.id === 'flatViewJobControlDatatable') { // /ECM/flatViewJobcontrol/flatViewJobList
				// Adjust the display length to 100
				table.fnSettings()._iDisplayLength = 500;
				// Set the default sorting on the second column (index 1) in ascending order
				table.fnSettings().aaSorting = [[1, 'asc']];
				tableElement.querySelectorAll('th:nth-child(5), th:nth-child(7)').forEach((th) => {
					if (!th.textContent.includes("IST"))
						th.textContent = th.textContent + " (IST)"
				})
			} else if (tableElement.id === 'jobhistorydetail') { // /ECM/jobcontrol/jobhistorydetail
				table.fnSettings().aaSorting = [[5, 'desc']];
				tableElement.querySelectorAll('th:nth-child(6), th:nth-child(7)').forEach((th) => {
					if (!th.textContent.includes("IST"))
						th.textContent = th.textContent + " (IST)"
				})
			} else if (tableElement.id === 'runningjobs') { // /ECM/jobcontrol/runningjobs
				tableElement.querySelectorAll('th:nth-child(3)').forEach((th) => {
					if (!th.textContent.includes("UTC"))
						th.textContent = th.textContent + " (UTC)"
				})
			} else if (tableElement.id === 'myDataTablehistory') { // /ECM/analyticsConfigES/show
				table.fnSettings().aaSorting = [[1, 'desc']];
				tableElement.querySelectorAll('th:nth-child(2)').forEach((th) => {
					if (!th.textContent.includes("IST"))
						th.textContent = th.textContent + " (IST)"
				})
			} else if (tableElement.id === 'datasetList') {
				table.fnSettings()._iDisplayLength = 1000;
			} else if (tableElement.id === 'myDataEntitlementtypelist') {
				table.fnSettings().aaSorting = [[1, 'asc']];
			} else if (tableElement.id === 'workflowVersionList') {
				table.fnSettings().aaSorting = [[3, 'desc']];
			} else if (window.location.href.includes('ECM/jbpmworkflowmanagement/showmyhistoryrequests')) {
				table.fnSettings().aaSorting = [[6, 'desc']];
				tableElement.querySelectorAll('th:nth-child(7), th:nth-child(8)').forEach((th) => {
					if (!th.textContent.includes("IST"))
						th.textContent = th.textContent + " (IST)"
				})
			} else if (window.location.href.includes('ECM/hanaRule/executionTrailList') && (tableElement.id == 'hanarulelistexecutiontrail' || tableElement.id == 'userrulerundataarchive')) {
				table.fnSettings().aaSorting = [[1, 'desc']];
				tableElement.querySelectorAll('th:nth-child(2)').forEach((th) => {
					if (!th.textContent.includes("UTC"))
						th.textContent = th.textContent + " (UTC)"
				})
			} else if (window.location.href.includes('ECM/hanaRule/executionTrailList') && tableElement.id == 'userrulerundata') {
				table.fnSettings().aaSorting = [[1, 'desc']];
				tableElement.querySelectorAll('th:nth-child(3)').forEach((th) => {
					if (!th.textContent.includes("UTC"))
						th.textContent = th.textContent + " (UTC)"
				})
			} else if (window.location.href.includes('ECM/hanaRule/updateuserrulelist') || window.location.href.includes('ECM/hanaRule/technicalrulelist')) {
				table.fnSettings()._iDisplayLength = 100;
				table.fnSettings().aaSorting = [[1, 'asc']];
			} else if (window.location.href.includes('ECM/jbpmworkflowmanagement/showWorkflow')) {
				table.fnSettings().aaSorting = [[3, 'desc']];
			} else if (window.location.href.includes('ECM/ecmConfig/addnewconnection')) {
				table.fnSettings().aaSorting = [[1, 'desc']];
				tableElement.querySelectorAll('th:nth-child(2)').forEach((th) => {
					if (!th.textContent.includes("UTC"))
						th.textContent = th.textContent + " (UTC)"
				})
			} else if (tableElement.id === 'myDataTabledynamicAttribute_register_user') {
				table.fnSettings().aaSorting = [[6, 'asc']];
			} else if (tableElement.id === 'resultTable') {
				// ECM/dataAnalyzer
				table.fnSettings()._iDisplayLength = 100;
				// table.fnSettings().aaSorting = [[0, 'desc']]; // This doesn't work
				// so we have to resort to clicking the damn table header
				const firstColHeader = document.querySelector("#resultTable > thead > tr > th");
				if (firstColHeader.textContent.endsWith('DATE') || firstColHeader.textContent.endsWith('KEY') || firstColHeader.textContent.endsWith('COUNT')) firstColHeader.click();
			} else if (tableElement.id === 'myDataTable') {
				table.fnSettings()._iDisplayLength = 100;
			} else if (tableElement.id.startsWith('sample') && window.location.href.includes('ECM/endpoints/show')) {
				table.fnSettings().aaSorting = [[8, 'asc']];
			} else if (tableElement.id.startsWith('EntitlementValueList') && window.location.href.includes('ECM/endpoints/show')) {
				table.fnSettings().aaSorting = [[0, 'asc']];
			} else if (tableElement.id.startsWith('sample') && window.location.href.includes('ECM/users/show')) {
				// User Accounts Table
				table.fnSettings().aaSorting = [[2, 'asc']];
				table.fnSettings()._iDisplayLength = 100;
			} else if (tableElement.id === 'usersList' && window.location.href.includes('ECM/users/list')) {
				// table.fnSettings()._iDisplayLength = 50;
				if (sort) {
					table.fnSettings().aaSorting = [[22, 'desc']];
				}
			} else if (tableElement.id === 'usersList' && window.location.href.includes('ECM/workflowmanagement/pendingtasklist')) {
				// sort by taskkey
				// table.fnSettings().aaSorting = [[2, 'desc']];
				// sort by updatedate
				// table.fnSettings().aaSorting = [[15, 'desc']];
				table.fnSettings()._iDisplayLength = 50;
				tableElement.querySelectorAll('th:nth-child(13), th:nth-child(16)').forEach((th) => {
					if (!th.textContent.includes("IST"))
						th.textContent = th.textContent + " (IST)"
				})
			} else if (tableElement.id === 'usersList' && window.location.href.includes('ECM/workflowmanagement/completetasklist')) {
				// sort by taskkey
				// table.fnSettings().aaSorting = [[1, 'desc']];
				// sort by updatedate
				// table.fnSettings().aaSorting = [[14, 'desc']];
				table.fnSettings()._iDisplayLength = 50;
			} else if (window.location.href.includes('ECM/savRoles/show')) {
				table.fnSettings()._iDisplayLength = 100;
				table.fnSettings().aaSorting = [[1, 'asc']];
			} else if (window.location.href.includes('ECM/transportAsync/export')) {
				table.fnSettings().aaSorting = [[0, 'asc']];
			} else if (window.location.href.includes('ECM/ecmConfig/externalconfig')) {
				table.fnSettings()._iDisplayLength = 100;
			} else if (window.location.href.includes('ECM/ecmEmailTemplate/list')) {
				table.fnSettings()._iDisplayLength = 100;
			} else if (window.location.href.includes('ECM/analyticsConfig/show')) {
				table.fnSettings().aaSorting = [[1, 'desc']];
			} else if (window.location.href.includes('ECM/analyticsConfig/list')) {
				table.fnSettings()._iDisplayLength = 100;
				table.fnSettings().aaSorting = [[1, 'asc']];
				tableElement.querySelectorAll('th:nth-child(10)').forEach((th) => {
					if (!(th.textContent.includes('IST')))
						th.textContent = th.textContent + " (IST)"
				})
			} else if (window.location.href.includes('ECM/analytics/createsubmit')) {
				table.fnSettings()._iDisplayLength = 100;
				table.fnSettings().aaSorting = [[0, 'desc']];
			} else if (window.location.href.includes('ECM/analyticsHistoryES/list')) {
				tableElement.querySelectorAll('th:nth-child(2)').forEach((th) => {
					if (!(th.textContent.includes('UTC')))
						th.textContent = th.textContent + " (UTC)"
				})
			}
			// Redraw the table with new settings
			table.fnDraw(false); // Use false to keep current paging position
			formatCells();
		}
	}
	// Find all DataTables tables and extend them to 100 rows on initial page load
	console.log('Extending Data Tables to 100 rows on  initial page load...');
	const dataTables = document.querySelectorAll('table.dataTable');

	function formatCells() {
		let gradientCells;
		if (window.location.href.includes('ECM/workflowmanagement/pendingtasklist')) {
			gradientCells = document.querySelectorAll('td:nth-child(4)');
			const accountNameCells = document.querySelectorAll("td:nth-child(7)");
			// remove <BR> from account name
			accountNameCells?.forEach(td => {
				td.innerHTML = td.innerHTML.replace(/<br>/g, '');
			})
			const usernameCells = document.querySelectorAll("td:nth-child(6), td:nth-child(15)");
			// Move username to new line
			// usernameCells?.forEach(td => {
			// 	// add <br> before first "("
			// 	td.innerHTML = td.innerHTML.replace("(", '<br>(');
			// })
			const securitysystemCells = document.querySelectorAll("td:nth-child(8)");
			// replace <BR> from security system name with " "
			securitysystemCells?.forEach(td => {
				td.innerHTML = td.innerHTML.replace(/<br>/g, ' ');
			})
		} else if (window.location.href.includes('ECM/workflowmanagement/completetasklist')) {
			gradientCells = document.querySelectorAll('td:nth-child(3)');
			const accountNameCells = document.querySelectorAll("td:nth-child(6)");
			// remove <BR> from account name
			accountNameCells?.forEach(td => {
				td.innerHTML = td.innerHTML.replace(/<br>/g, '');
			})
			const usernameCells = document.querySelectorAll("td:nth-child(5), td:nth-child(14)");
			// Move username to new line
			// usernameCells?.forEach(td => {
			// 	// add <br> before first "("
			// 	td.innerHTML = td.innerHTML.replace("(", '<br>(');
			// })
			const securitysystemCells = document.querySelectorAll("td:nth-child(7)");
			// replace <BR> from security system name with " "
			securitysystemCells?.forEach(td => {
				td.innerHTML = td.innerHTML.replace(/<br>/g, ' ');
			})
		} else if (window.location.href.includes('ECM/users/show')) {
			gradientCells = document.querySelectorAll('#s2id_statuskey > a > span.select2-chosen, #sample2 > tbody > tr > td:nth-child(8) > span');
		} else if (window.location.href.includes('ECM/dataAnalyzer/index')) {
			gradientCells = document.querySelectorAll('td');
		} else if (window.location.href.includes('ECM/jobcontrol/jobhistorydetail')) {
			gradientCells = document.querySelectorAll('td:nth-child(9), td:nth-child(2), td:nth-child(11)');
		}

		// add class to cells to color them
		// Highlight Cells
		gradientCells?.forEach(cell => {
			if (cell.textContent.trim().toUpperCase().includes('DISABLE')) {
				cell.classList.add('bad-td');
			} else if (cell.textContent.trim().toUpperCase().includes('REMOVE')
				|| cell.textContent.trim().toUpperCase().includes('DELETE')
				|| cell.textContent.trim().toUpperCase().includes('FAIL')
				|| cell.textContent.trim().toUpperCase().includes('REJECT')
				|| cell.textContent.trim().toUpperCase().includes('ERROR')) {
				cell.classList.add('worst-td');
			} else if (cell.textContent.trim().toUpperCase().includes('INACTIVE')
				|| cell.textContent.trim().includes('SUSPENDED FROM IMPORT SERVICE')
				|| cell.textContent.trim().includes('SFIS')
				|| cell.textContent.trim().toUpperCase().includes('MANUALLY SUSPENDED')
				|| cell.textContent.trim().toUpperCase().includes('M_S')
				|| cell.textContent == '0'
				|| cell.textContent == '2') {
				cell.classList.remove('active-div')
				cell.classList.add('inactive-div')
			} else if (cell.textContent == 'false'
				|| cell.textContent == 'FALSE'
				|| cell.textContent.toUpperCase() == 'NO'
				|| cell.textContent.toUpperCase() == 'USER') {
				cell.classList.add('orange-div')
			} else if (cell.textContent.trim().toUpperCase().includes('ENABLE')
				|| cell.textContent.trim().toUpperCase().includes('ADD')
				|| cell.textContent.trim().toUpperCase().includes('CREATE')
				|| cell.textContent.trim().toUpperCase().includes('NEW')
				|| cell.textContent.toUpperCase() == 'YES'
				|| cell.textContent.trim().toUpperCase().includes('APPROVED')
				|| cell.textContent.trim().toUpperCase().includes('SUCCESS')) {
				cell.classList.add('good-td');
			} else if (cell.textContent.trim().toUpperCase().includes('UPDATE')
				|| cell.textContent.trim().toUpperCase() == 'SYSTEM'
				|| cell.textContent.trim().toUpperCase().includes('COMPLETE')) {
				cell.classList.add('dodgerblue-td');
			} else if (cell.textContent.trim().toUpperCase().includes('ACTIVE')
				|| cell.textContent.trim().toUpperCase().includes('MANUALLY PROVISIONED')
				|| cell.textContent.trim().toUpperCase().includes('M_P')
				|| cell.textContent == 'true'
				|| cell.textContent == 'TRUE'
				|| cell.textContent == '1') {
				cell.classList.remove('inactive-div')
				cell.classList.add('active-div')
			}
			cell.classList.add('td-formatted');
		});
	}

	function makeLinks(tableElement) {
		const tableHeaders = tableElement.querySelectorAll('th');

		const indices = {
			accountKeyIndexes: [],
			userKeyIndexes: [],
			endpointKeyIndexes: [],
			systemKeyIndexes: [],
			connectionKeyIndexes: [],
			jbpmprocessinstanceidIndexes: [],
			entitlementValuekeyIndexes: [],
			removeOwnerIndexes: [],
			groupKeyIndexes: [],
			userUpdateRuleIndexes: [],
			technicalRuleIndexes: [],
			roleKeyIndexes: [],
			emailTemplateKeyIndexes: [],
			requestDetailsIndexes: [],
			requestApprovalIndexes: [],
			analyticsKeyIndexes: [],
            customlinkIndexes: []
		};

		tableHeaders.forEach((header, index) => {
			const headerText = header.textContent.toLowerCase();
			if (headerText.includes('accountkey')) indices.accountKeyIndexes.push(index);
			if (headerText.includes('userkey')) indices.userKeyIndexes.push(index);
			if (headerText.includes('endpointkey')) indices.endpointKeyIndexes.push(index);
			if (headerText.includes('systemkey')) indices.systemKeyIndexes.push(index);
			if (headerText.includes('connectionkey')) indices.connectionKeyIndexes.push(index);
			if (headerText.includes('jbpmprocessinstanceid')) indices.jbpmprocessinstanceidIndexes.push(index);
			if (headerText.includes('entitlement_valuekey')) indices.entitlementValuekeyIndexes.push(index);
			if (headerText.includes('remove_owner')) indices.removeOwnerIndexes.push(index);
			if (headerText.includes('groupkey')) indices.groupKeyIndexes.push(index);
			if (headerText.includes('userupdaterulekey')) indices.userUpdateRuleIndexes.push(index);
			if (headerText.includes('technicalrulekey')) indices.technicalRuleIndexes.push(index);
			if (headerText.includes('rolekey')) indices.roleKeyIndexes.push(index);
			if (headerText.includes('emailtemplatekey')) indices.emailTemplateKeyIndexes.push(index);
			if (headerText.includes('requestid')) indices.requestDetailsIndexes.push(index);
			if (headerText.includes('requestapproval')) indices.requestApprovalIndexes.push(index);
			if (headerText.includes('analyticskey')) indices.analyticsKeyIndexes.push(index);
            if (headerText.includes('customlink')) indices.customlinkIndexes.push(index);
		});

		// Helper function to create a link and update the cell
		function createLink(cell, urlPrefix, linkText = null, urlSuffix = '', cellText) {
			if (!linkText) {
				linkText = cellText;
			}
			const link = document.createElement('a');
			link.href = baseUrl + urlPrefix + linkText + urlSuffix;
			link.textContent = cellText;
			cell.innerHTML = '';  // Clear the current content of the cell
			cell.appendChild(link);  // Append the new link
		}

		// Process each index and update the table rows
		const tableRows = tableElement.querySelectorAll('tbody tr');
		tableRows.forEach(row => {
			Object.entries(indices).forEach(([key, indexArray]) => {
				if (indexArray.length > 0) {
					indexArray.forEach(index => {
						let cell;

						cell = row.querySelectorAll('td')[index];
						if (cell.querySelector('.subcelldiv')) {
							cell = row.querySelectorAll('.subcelldiv')[index];
						}

						let cellText = cell?.textContent;

						if (!cellText) {
							return;
						}

						cellText = cellText.trim();

						let urlPrefix = '';
						let urlSuffix = '';
						const cellTextMatch = cellText.match(/^(.*)—/); // match everything before — (not a hyphen) to capture the text you want to display as cell content
						const keyMatch = cellText.match(/—(.*)$/);
						let linkText = null;
						if (cellText.includes('—')) {
							// extract key from the cell text to be used to make links
							linkText = keyMatch ? keyMatch[1] : '';
							cellText = cellTextMatch ? cellTextMatch[1] : ''
						}

						// Determine URL path based on the key
						switch (key) {
							case 'accountKeyIndexes':
								urlPrefix = '/ECM/accounts/show/';
								break;
							case 'userKeyIndexes':
								urlPrefix = '/ECM/users/show/';
								break;
							case 'endpointKeyIndexes':
								urlPrefix = '/ECM/endpoints/show/';
								break;
							case 'systemKeyIndexes':
								urlPrefix = '/ECM/securitysystems/show/';
								break;
							case 'connectionKeyIndexes':
								urlPrefix = '/ECM/ecmConfig/addnewconnection/';
								break;
							case 'jbpmprocessinstanceidIndexes':
								urlPrefix = '/ECM/jbpmworkflowmanagement/showrequestdetails/';
								break;
							case 'entitlementValuekeyIndexes':
								urlPrefix = '/ECM/entitlement_values/show/';
								break;
							/*
							/ECM/accounts/removeowner?accountkey=85915121&accountownerkey=440777_85915121_1_26
							select
									e.endpointname,
									a.name as account_name,a.accountkey,
									u.username as owner_username,u.userkey,
									u.displayname as owner_name,
									u.email as owner_email,
								concat(a.accountkey,'&accountownerkey=',u.userkey,'_',a.accountkey,'_1_',ao.rank) as remove_owner
								from
									accounts a
									join accountowners ao on ao.ACCOUNTKEY = a.ACCOUNTKEY
									join users u on u.userkey = ao.OWNERUSERKEY
									join endpoints e on e.ENDPOINTKEY = a.ENDPOINTKEY
								where u.username = 100536950 */
							case 'removeOwnerIndexes':
								urlPrefix = '/ECM/accounts/removeowner?accountkey=';
								break;
							case 'groupKeyIndexes':
								urlPrefix = '/ECM/user_GroupDetail/show/';
								break;
							case 'userUpdateRuleIndexes':
								urlPrefix = '/ECM/hanaRule/userRuleEdit/';
								urlSuffix = '?type=2';
								break;
							case 'technicalRuleIndexes':
								urlPrefix = '/ECM/hanaRule/technicalRuleEdit/';
								urlSuffix = '?type=1';
								break;
							case 'roleKeyIndexes':
								urlPrefix = '/ECM/roles/show/';
								break;
							case 'emailTemplateKeyIndexes':
								urlPrefix = '/ECM/ecmEmailTemplate/edit?id=';
								break;
							case 'requestDetailsIndexes':
								urlPrefix = '/ECM/jbpmworkflowmanagement/showrequestdetails/';
								break;
							case 'requestApprovalIndexes':
								urlPrefix = '/ECM/workflownewui/requestDetails/';
								urlSuffix = '?view=approval';
								break;
							case 'analyticsKeyIndexes':
								urlPrefix = '/ECM/analyticsConfigES/show/';
								break;
                            case 'customlinkIndexes':
                                urlPrefix = '';
                                break;
						}

						createLink(cell, urlPrefix, linkText, urlSuffix, cellText);
						cell.classList.add('td-link-formatted'); // to check if a table is formatted
					});
				}
			});
		});
	}



	function formatDatesToIso(tableElement) {
		// Iterate over each cell
		const cells = tableElement.querySelectorAll('td');
		cells.forEach(cell => {
			// Check if the cell contains a date
			const date = new Date(cell.textContent);
			if (!isNaN(date)) {
				// Format the date as ISO
				cell.textContent = formatDateToLocal(date);
			}
		});
	}
	// Helper function to format date as YYYY-MM-DD HH:MM:SS in local timezone
	function formatDateToLocal(date) {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		const seconds = String(date.getSeconds()).padStart(2, '0');
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}

	// function to get the "for" attribute from lables and add a div to the parent element of the label with class "real-field-name" and textContent as the "for" value
	// "for" is not available then use name from the input element within the same parent element
	// if that too is not available then use id from the input element within the same parent element
	function showActualFieldNames() {
		const labels = document.querySelectorAll('label');
		labels.forEach(label => {
			const forAttr = label.getAttribute('for');
			const parentElement = label.parentElement;
			const realFieldNameDiv = document.createElement('div');
			realFieldNameDiv.classList.add('real-field-name');
			if (forAttr) {
				realFieldNameDiv.textContent = forAttr;
			} else {
				const input = parentElement.querySelector('input');
				if (input) {
					const inputName = input.getAttribute('name');
					if (inputName) {
						realFieldNameDiv.textContent = inputName;
					} else {
						const inputId = input.getAttribute('id');
						if (inputId) {
							realFieldNameDiv.textContent = inputId;
						}
					}
				}
			}
			parentElement.appendChild(realFieldNameDiv);
		});
	}
	// use ctrl + 2 to show actual field names
	document.addEventListener("keydown", (event) => {
		if (event.ctrlKey && event.key === "2") {
			event.preventDefault();
			showActualFieldNames();
		}
	});

	// Automatically resize the textfields as you type:
	function resizeTextarea() {
		const textareas = document.querySelectorAll('textarea.form-control, textarea#queryArea');
		textareas.forEach(function (textarea) {
			textarea.style.height = ""; // Reset height to allow shrinking
			textarea.style.height = textarea.scrollHeight + 3 + "px"; // Set new height
			if (textarea.id == 'adv_query' && window.location.href.includes('ECM/flatViewJobcontrol/flatViewJobList')) {
				textarea.style.setProperty('height', textarea.scrollHeight + 3 + 'px', 'important');
			}
			textarea.setAttribute('spellcheck', 'false');
		});
	}
	// Resize textareas when they receive input
	document.addEventListener('input', function (event) {
		if (event.target.matches('textarea.form-control, textarea#queryArea')) {
			resizeTextarea();
		}
	});
	resizeTextarea();

	// Function to calculate the job running time
	function calculateRunningTime(start, end, offsetHours) {
		// Parse date strings to Date objects
		const startDate = new Date(start);
		const endDate = new Date(end);
		const offsetMilliSeconds = offsetHours * 60 * 60 * 1000;
		// Calculate the difference in milliseconds
		const difference = endDate - startDate + offsetMilliSeconds;
		// Convert milliseconds to seconds
		let seconds = Math.floor(difference / 1000);
		// Convert seconds to HH:MM:SS format
		let hours = Math.floor(seconds / 3600);
		seconds %= 3600;
		let minutes = Math.floor(seconds / 60);
		seconds %= 60;
		// Format the time
		return {
			hours,
			minutes,
			seconds,
			totalSeconds: hours * 3600 + minutes * 60 + seconds,
			formatted: hours.toString().padStart(2, '0') + ':' +
				minutes.toString().padStart(2, '0') + ':' +
				seconds.toString().padStart(2, '0')
		};
	}

	// Function to show job durations and calculate average running time
	function showJobDurations(tableSelector = '#jobhistorydetail', startTimeColumnSelector = '.UTCDATETIME', endTimeColumnSelector = '.UTCDATETIME', durationColumn = 'td:nth-child(13)', offsetHours = 0) {
		const rows = document.querySelectorAll(tableSelector + " tbody tr");
		let totalSeconds = 0;
		let jobCount = 0;
		let runningTimes = [];
		let runningTimesFormatted = [];

		// Loop through each row
		rows.forEach(function (row) {
			// Get start and end time elements
			let startTime;
			try {
				startTime = row.querySelectorAll(startTimeColumnSelector)[0].textContent;
			} catch (error) {
				startTime = new Date();
			}
			let endTime;
			let runningJob = false;
			try {
				endTime = row.querySelectorAll(endTimeColumnSelector)[1].textContent;
			} catch {
				endTime = new Date();
				runningJob = true;
			}

			// Calculate running time
			const runningTime = calculateRunningTime(startTime, endTime, offsetHours);
			runningTimes.push(runningTime.totalSeconds);
			runningTimesFormatted.push(runningTime.formatted);
			totalSeconds += runningTime.hours * 3600 + runningTime.minutes * 60 + runningTime.seconds;
			jobCount++;

			// Create a new cell for running time and append to the row
			let durationCell = row.querySelector(".job-duration-cell");
			if (durationCell) {
				durationCell.textContent = runningTime.formatted;
			} else {
				durationCell = document.createElement('td');
				durationCell.classList.add('job-duration-cell');
				durationCell.textContent = runningTime.formatted;
				row.appendChild(durationCell);
			}
			if (runningJob && tableSelector.includes('jobhistorydetail')) {
				row.querySelectorAll('td').forEach(td => {
					td.classList.add('job-still-running');
				})
				durationCell.style.cssText = 'color: red !important;';
			}
		});

		// Calculate average running time
		const averageSeconds = totalSeconds / jobCount;
		const avgHours = Math.floor(averageSeconds / 3600);
		let remainingSeconds = averageSeconds % 3600;
		const avgMinutes = Math.floor(remainingSeconds / 60);
		remainingSeconds %= 60;
		const avgFormatted = avgHours.toString().padStart(2, '0') + ':' +
			avgMinutes.toString().padStart(2, '0') + ':' +
			Math.floor(remainingSeconds).toString().padStart(2, '0');

		// Calculate median running time
		runningTimes.sort((a, b) => a - b);
		let medianSeconds;
		const middleIndex = Math.floor(runningTimes.length / 2);
		if (runningTimes.length % 2 === 0) {
			medianSeconds = (runningTimes[middleIndex - 1] + runningTimes[middleIndex]) / 2;
		} else {
			medianSeconds = runningTimes[middleIndex];
		}
		const medianHours = Math.floor(medianSeconds / 3600);
		let remainingSeconds2 = medianSeconds % 3600;
		const medianMinutes = Math.floor(remainingSeconds2 / 60);
		remainingSeconds2 %= 60;
		const medianFormatted = medianHours.toString().padStart(2, '0') + ':' +
			medianMinutes.toString().padStart(2, '0') + ':' +
			Math.floor(remainingSeconds2).toString().padStart(2, '0');

		// Add median running time to the header cell
		const headerRow = document.querySelector(tableSelector + ' thead tr');
		let medianDurationHeaderCell = document.querySelector("#jobhistorydetail th.median-duration");
		if (medianDurationHeaderCell && tableSelector.includes('jobhistorydetail')) {
			medianDurationHeaderCell.textContent = medianFormatted;
		}
	}


	function focusFirstSearchField() {
		let inputElements = document.getElementsByTagName('input');
		for (let i = 0; i < inputElements.length; i++) {
			let input = inputElements[i];
			if (input.id && input.id.toLowerCase().includes('search')) {
				input.focus();
				return;
			}
		}
	}
	try {
		focusFirstSearchField();
	} catch (error) {
		console.warn("Search box not found");
	}

	async function runQuery(query) {
		const url = baseUrl + "/ECM/dataAnalyzer/fetchResult";

		// Generate a random 10-digit action_id
		const actionId = Math.floor(1000000000 + Math.random() * 9000000000);

		// Clean & encode SQL
		const formattedQuery = encodeURIComponent(query.replace(/;$/, ""));

		const response = await fetch(url, {
			headers: {
				"accept": "application/json, text/javascript, */*; q=0.01",
				"accept-language": "en-US,en;q=0.9",
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				"x-requested-with": "XMLHttpRequest"
			},
			referrer: url.replace("ECM/dataAnalyzer/fetchResult", ""),
			referrerPolicy: "origin",
			body: `query=${formattedQuery}&action_id=${actionId}&isSchema=false`,
			method: "POST",
			mode: "cors",
			credentials: "include"
		});

		const result = await response.json();
		// sample response
		// {"data":[{"USERKEY":"119779","USERNAME":"00004"},{"USERKEY":"18617","USERNAME":"00005"}]}

		if (result?.error && (result.error.includes("SELECT command denied") || result.error.includes("Query has been terminated due to longer execution time"))) {
			throw new Error("PERMISSION_DENIED");
		}

		if (result?.error) {
			throw new Error(result.error);
		}

		// Success condition
		return result.data;
	}
    async function runAnalyticsQuery(extendedQuery) {
		const response = await fetch("/ECM/analytics/detailspreviewV2", {
			method: "POST",
			headers: {
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				"x-requested-with": "XMLHttpRequest"
			},
            body: "analyticsQry=" + encodeURIComponent(extendedQuery) +
				"&runtime=false&sqlAnalytics=true&externalConnection=&version=v2",
			credentials: "include"
		});

		const html = await response.text();

		const resultDiv = document.querySelector("#result");
		if (!resultDiv) {
			console.error("#result not found!");
			return;
		}

		const alertDiv = resultDiv.querySelector(".alert");
		if (!alertDiv) {
			console.error("alert not found inside #result!");
			return;
		}

		// Create analytics-result div only if missing
		let analyticsDiv = document.getElementById("analytics-result");
		if (!analyticsDiv) {
			analyticsDiv = document.createElement("div");
			analyticsDiv.id = "analytics-result";

			// Insert after the alert div
			alertDiv.insertAdjacentElement("afterend", analyticsDiv);
		}

		// Inject content
		analyticsDiv.innerHTML = html;

		// --- Execute embedded scripts ---
		// EXT: was: create <script> elements here. In an extension that is checked against the extension's own CSP
		// (no inline scripts allowed), so the page-world bridge re-runs the scripts already inside the container instead.
		runScriptsInPage("analytics-result");

		console.log("Analytics result displayed");
	}
    async function runAnalyticsQueryForCount(analyticsCountQuery, extendedQuery) {
		const response = await fetch("/ECM/analytics/detailspreviewV2", {
			method: "POST",
			headers: {
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				"x-requested-with": "XMLHttpRequest"
			},
            body: "analyticsQry=" + encodeURIComponent(analyticsCountQuery) +
				"&runtime=false&sqlAnalytics=true&externalConnection=&version=v2",
			credentials: "include"
		});

		const html = await response.text();

		const resultDiv = document.querySelector("#result");
		if (!resultDiv) {
			console.error("#result not found!");
			return;
		}

		const alertDiv = resultDiv.querySelector(".alert");
		if (!alertDiv) {
			console.error("alert not found inside #result!");
			return;
		}

		// Create analytics-result-count div only if missing
		let analyticsCountsDiv = document.getElementById("analytics-result-count");
		if (!analyticsCountsDiv) {
			analyticsCountsDiv = document.createElement("div");
			analyticsCountsDiv.id = "analytics-result-count";

			// Insert after the alert div
			alertDiv.insertAdjacentElement("afterend", analyticsCountsDiv);
		}

		// Inject content
		analyticsCountsDiv.innerHTML = html;

		// --- Execute embedded scripts ---
		// EXT: was: create <script> elements here. In an extension that is checked against the extension's own CSP
		// (no inline scripts allowed), so the page-world bridge re-runs the scripts already inside the container instead.
		runScriptsInPage("analytics-result-count");


		let record_count_cell;

		const countInterval = setInterval(() => {
			// Keeps checking if the count has been loaded, then writes the count above the alert and clears the second table which we loaded just to get the result, messy but works
			console.log("checking count");
            // to check the record count if the count query succeeded
			record_count_cell = document.querySelector("#analytics-result-count td");
            // to check if running the count query failed, returns an error like "Error while previewing control.Please check logs for detail error."
            const note_warning = document.querySelector(".note-warning")
            // continue to run the actual query if counting failed or succeeded, even when counting fails the actual query might run, that's saviynt for you
            if (!record_count_cell?.textContent && !note_warning?.textContent?.includes("Error while previewing control.Please check logs for detail error.")) {
				return;
			}
			clearInterval(countInterval);
            if (record_count_cell?.textContent) {
			const record_count = record_count_cell.textContent;
			console.log("analytics_record_count", record_count);


			let recordCountSpan = document.getElementById("recordCountSpan");
			if (!recordCountSpan) {
				recordCountSpan = document.createElement("div");
				recordCountSpan.id = "recordCountSpan";
			}
			document.getElementById("result").insertAdjacentElement("afterbegin", recordCountSpan);
			const formattedRecords = parseInt(record_count).toLocaleString("en-US") || record_count
			recordCountSpan.textContent = `(Total Records: ${formattedRecords})`;
			console.log("Analytics results count displayed");
            }
			analyticsCountsDiv.innerHTML = "";
            runAnalyticsQuery(extendedQuery);
		}, 1000);

	}

	function applyCodeMirror(selector, language) {
		const textareas = document.querySelectorAll(selector);
		if (!textareas.length) {
			console.log("No textareas found for selector:", selector);
			return;
		}

		function toggleBlockComment(editor) {
			const cursor = editor.getCursor();
			const line = editor.getLine(cursor.line);
			const indentation = line.match(/^\s*/)[0];
			const content = line.trim();

			if (!content) {
				editor.replaceRange(`${indentation}/*  */`, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
				editor.setCursor({ line: cursor.line, ch: indentation.length + 3 });
				return;
			}

			if (content.startsWith("/*") && content.endsWith("*/")) {
				const uncommented = content.slice(2, -2).trim();
				editor.replaceRange(indentation + uncommented, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
				editor.setCursor({ line: cursor.line, ch: indentation.length + uncommented.length });
				return;
			}

			const commented = `${indentation}/* ${content} */`;
			editor.replaceRange(commented, { line: cursor.line, ch: 0 }, { line: cursor.line, ch: line.length });
			editor.setCursor({ line: cursor.line, ch: Math.min(cursor.ch + 3, commented.length) });
		}

		const modes = {
			sql: "text/x-sql",
			json: { name: "javascript", json: true },
			html: "htmlmixed"
		};

		const mode = modes[language] || "text/plain";

		textareas.forEach(textarea => {
			const editor = CodeMirror.fromTextArea(textarea, {
				lineNumbers: true,
				mode: mode,
                // theme: "material",
				indentWithTabs: false,
				smartIndent: true,
				indentUnit: 4,
				matchBrackets: true,
				lineWrapping: true,
				extraKeys: {
					"Ctrl-/": toggleBlockComment
				},
				// readOnly: textarea.disabled ? "nocursor" : false
			});

			// Keep textarea updated
			editor.on("change", () => {
				editor.save();
				textarea.dispatchEvent(new Event("input", { bubbles: true }));
				textarea.dispatchEvent(new Event("change", { bubbles: true }));
			});

			if (selector === "#queryArea") {
				editor.focus();
			}
		});
	}

	// helper for applyHighlights
	function isWordBoundary(char) {
		return !char || !/[A-Za-z0-9_]/.test(char);
	}

	function escapeRegExp(s) {
		return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}

	// === main function ===
	function applyHighlights(selector, highlightRules = HIGHLIGHT_RULES) {
		console.log('applying highlights');

		const roots = document.querySelectorAll(selector);
		if (!roots || roots.length === 0) return;

		// Clear any previous highlights for our known names
		for (const rule of highlightRules) {
			try { CSS.highlights.delete(rule.highlightName); } catch (e) { /* ignore */ }
		}

		// Prepare buffers: highlightName -> array of Ranges
		const buffers = {};
		for (const rule of highlightRules) {
			buffers[rule.highlightName] = [];
		}

		// Walk text nodes inside each matched root
		for (const root of roots) {
			// protect against null root or non-element
			if (!root || !(root.nodeType === Node.ELEMENT_NODE || root.nodeType === Node.DOCUMENT_FRAGMENT_NODE)) continue;

			const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
			let node = walker.nextNode();

			while (node) {
				// Safely get text content (nodeValue works with text nodes)
				const text = node.nodeValue || "";
				if (text.length > 0) {
					const lower = text.toLowerCase();

					for (const rule of highlightRules) {
						const word = (rule.word || "").toLowerCase();
						if (!word) continue;

						if (rule.whole) {
							// use indexOf + boundary checks
							let pos = 0;
							while ((pos = lower.indexOf(word, pos)) !== -1) {
								const before = text[pos - 1];
								const after = text[pos + word.length];

								if (isWordBoundary(before) && isWordBoundary(after)) {
									const r = new Range();
									// Range expects start/end within the same text node for this approach
									r.setStart(node, pos);
									r.setEnd(node, pos + word.length);
									buffers[rule.highlightName].push(r);
								}
								pos += word.length;
							}
						} else {
							// partial match allowed - regex approach handles overlapping and is case-insensitive
							const re = new RegExp(escapeRegExp(rule.word), "gi");
							let m;
							while ((m = re.exec(text)) !== null) {
								const r = new Range();
								r.setStart(node, m.index);
								r.setEnd(node, m.index + m[0].length);
								buffers[rule.highlightName].push(r);

								// avoid infinite loops for zero-length matches
								if (m.index === re.lastIndex) re.lastIndex++;
							}
						}
					}
				}

				node = walker.nextNode();
			}
		}

		// Commit buffers to CSS.highlights
		for (const hlName in buffers) {
			const arr = buffers[hlName];
			if (arr && arr.length) {
				try {
					CSS.highlights.set(hlName, new Highlight(...arr));
				} catch (err) {
					// If a Range is invalid or spans nodes incorrectly, catch and continue
					console.error("Failed to set highlight", hlName, err);
				}
			}
		}
	}

	function makeLinksJs(tableSelector, connectionMap) {
		if (!tableSelector) return;

		const table = document.querySelector(tableSelector)
		if (!table) return;

		table.addEventListener('click', (e) => {
			// make sure alt or control is not held
			if (e.altKey || e.ctrlKey) return;

			const cell = e.target.closest("td");
			if (!cell) return;
			// console.log(cell.textContent);

			// check if cell header (th) is 'username' or 'manager', ie th corresponding to the cell
			const header = table.querySelector(`th:nth-child(${cell.cellIndex + 1})`);
			if (!header) return;

			// console.log(header.textContent);

			if (header.textContent.toLowerCase() === 'username' || header.textContent.toLowerCase() === 'manager') {
				runQuery(`select userkey from users where username = '${cell.textContent}'`)
					.then(data => {
						const userkey = data[0]?.USERKEY;
						if (!userkey) return;
						const url = `/ECM/users/show/${userkey}`;
						window.open(url, "_blank");
					})
			}
			if (header.textContent.toLowerCase() === 'display name (username)') {
				runQuery(`select userkey from users where username = '${cell.textContent.split(/\(|\)/)[1]}'`)
					.then(data => {
						const userkey = data[0]?.USERKEY;
						if (!userkey) return;
						const url = `/ECM/users/show/${userkey}`;
						window.open(url, "_blank");
					})
			}
			if (header.textContent.toLowerCase() === 'system') {
				runQuery(`select systemkey from securitysystems where systemname = '${cell.textContent}'`)
					.then(data => {
						const systemkey = data[0]?.SYSTEMKEY;
						if (!systemkey) return;
						const url = `/ECM/securitysystems/show/${systemkey}`;
						window.open(url, "_blank");
					})
			}
			if (header.textContent.toLowerCase() === 'security system') {
				runQuery(`select systemkey from securitysystems where replace(displayname, ' ', '') = '${cell.textContent.replaceAll(' ', '')}'`)
					.then(data => {
						const systemkey = data[0]?.SYSTEMKEY;
						if (!systemkey) return;
						const url = `/ECM/securitysystems/show/${systemkey}`;
						window.open(url, "_blank");
					})
			}
			if (header.textContent.toLowerCase() === 'endpoint') {
				runQuery(`select endpointkey from endpoints where replace(displayname, ' ', '') = '${cell.textContent.replaceAll(' ', '')}'`)
					.then(data => {
						const endpointkey = data[0]?.ENDPOINTKEY;
						if (!endpointkey) return;
						const url = `/ECM/endpoints/show/${endpointkey}`;
						window.open(url, "_blank");
					})
			}
			if (header.textContent.toLowerCase() === 'connection') {
				const connectionKey = connectionMap.get(cell.textContent);
				if (!connectionKey) return;
				const url = `/ECM/ecmConfig/addnewconnection/${connectionKey}`;
				window.open(url, "_blank");
			}
		});

	}

	function applyTableTextDiff(tableSelector, oldColIndex, newColIndex) {
		const table = document.querySelector(tableSelector);
		if (!table || !window.Diff) return;

		const rows = table.querySelectorAll("tbody tr");

		rows.forEach(row => {
			const cells = row.children;
			if (!cells[oldColIndex] || !cells[newColIndex]) return;

			const oldDiv = cells[oldColIndex].querySelector("div.subcelldiv");
			const newDiv = cells[newColIndex].querySelector("div.subcelldiv");

			if (!oldDiv || !newDiv) return;

			const oldText = oldDiv.textContent;
			const newText = newDiv.textContent;

			// Avoid double-processing
			if (oldDiv.dataset.diffed || newDiv.dataset.diffed) return;

			const diff = Diff.diffWords(oldText, newText);

			oldDiv.innerHTML = "";
			newDiv.innerHTML = "";

			for (let i = 0; i < diff.length; i++) {
				const part = diff[i];

				const span = document.createElement("span");
				span.textContent = part.value;

				const markerSpan = document.createElement("span");

				if (part.added) {
					span.className = "diff-added";
					markerSpan.className = "diff-added diff-marker";
				}

				if (part.removed) {
					span.className = "diff-removed";
					markerSpan.className = "diff-removed diff-marker";
				}

				if (!part.added) {
					oldDiv.appendChild(span.cloneNode(true));
				} else if (!diff[i - 1]?.removed) {
					markerSpan.textContent = '+';
					oldDiv.appendChild(markerSpan.cloneNode(true));
				}

				if (!part.removed) {
					newDiv.appendChild(span);
				} else if (!diff[i + 1]?.added) {
					markerSpan.textContent = '-';
					newDiv.appendChild(markerSpan);
				}
			}


			oldDiv.dataset.diffed = "1";
			newDiv.dataset.diffed = "1";
		});
	}

	function enableLastClickedCellHighlight(tableSelector = 'table') {
		let lastCell = null;

		document.addEventListener('click', (e) => {
			const cell = e.target.closest(`${tableSelector} td`);
			if (!cell) return;

			// remove previous highlight
			if (lastCell && lastCell !== cell) {
				lastCell.classList.remove('yogi-last-clicked-cell');
			}

			// highlight current cell
			cell.classList.add('yogi-last-clicked-cell');
			lastCell = cell;
		});
	}

	enableLastClickedCellHighlight();
    function enableTableCellSelection(tableSelector = 'table') {
        const selectedCells = new Set();
        let anchorCell = null;
        GM_addStyle(`
            ${tableSelector} th.yogi-selected-cell,
            ${tableSelector} td.yogi-selected-cell {
                background: #87bfff !important;
                color: #111 !important;
                box-shadow: inset 0 0 0 2px #1769aa !important;
            }
            ${tableSelector} th.yogi-selection-anchor,
            ${tableSelector} td.yogi-selection-anchor {
                box-shadow: inset 0 0 0 3px #003f7f !important;
            }
        `);
        function clearSelection() {
            selectedCells.forEach(cell => cell.classList.remove('yogi-selected-cell', 'yogi-selection-anchor'));
            selectedCells.clear();
        }
        function selectCell(cell) {
            selectedCells.add(cell);
            cell.classList.add('yogi-selected-cell');
        }
        function setAnchor(cell) {
            document.querySelectorAll('.yogi-selection-anchor').forEach(el => el.classList.remove('yogi-selection-anchor'));
            anchorCell = cell;
            cell.classList.add('yogi-selection-anchor');
        }
        function getRows(table) {
            return Array.from(table.querySelectorAll('thead tr, tbody tr, tfoot tr'));
        }
        function getPosition(cell) {
            const table = cell.closest(tableSelector);
            if (!table) return null;
            const rows = getRows(table);
            const rowIndex = rows.indexOf(cell.parentElement);
            return rowIndex < 0 ? null : { table, rows, rowIndex, columnIndex: cell.cellIndex };
        }
        function selectRectangle(fromCell, toCell, additive) {
            const from = getPosition(fromCell), to = getPosition(toCell);
            if (!from || !to || from.table !== to.table) return;
            if (!additive) clearSelection();
            for (let r = Math.min(from.rowIndex, to.rowIndex); r <= Math.max(from.rowIndex, to.rowIndex); r++) {
                for (let c = Math.min(from.columnIndex, to.columnIndex); c <= Math.max(from.columnIndex, to.columnIndex); c++) {
                    const cell = from.rows[r]?.cells[c];
                    if (cell) selectCell(cell);
                }
            }
        }
        function getCellText(cell) {
            const sub = cell.querySelector('.subcelldiv');
            return (sub ? sub.innerText : cell.innerText).replace(/\\r?\\n/g, ' ').trim();
        }
        async function copySelection() {
            const live = Array.from(selectedCells).filter(cell => cell.isConnected);
            if (!live.length) return;
            const blocks = [];
            for (const table of [...new Set(live.map(cell => cell.closest(tableSelector)))]) {
                const rows = getRows(table);
                const cells = live.filter(cell => cell.closest(tableSelector) === table);
                const positions = cells.map(cell => getPosition(cell));
                const minRow = Math.min(...positions.map(p => p.rowIndex));
                const maxRow = Math.max(...positions.map(p => p.rowIndex));
                const minCol = Math.min(...positions.map(p => p.columnIndex));
                const maxCol = Math.max(...positions.map(p => p.columnIndex));
                const chosen = new Set(cells), lines = [];
                for (let r = minRow; r <= maxRow; r++) {
                    const values = [];
                    for (let c = minCol; c <= maxCol; c++) {
                        const cell = rows[r]?.cells[c];
                        values.push(cell && chosen.has(cell) ? getCellText(cell) : '');
                    }
                    lines.push(values.join('\	'));
                }
                blocks.push(lines.join('\n'));
            }
            await navigator.clipboard.writeText(blocks.join('\\n\\n'));
        }
        // Capture phase prevents DataTables/site handlers from sorting Ctrl-clicked headers.
        document.addEventListener('click', event => {
            const cell = event.target.closest(`${tableSelector} th, ${tableSelector} td`);
            if (!cell || (!event.ctrlKey && !event.shiftKey)) return;
            if (event.target instanceof HTMLAnchorElement) return;
            event.preventDefault();
            event.stopImmediatePropagation();
            if (event.shiftKey && anchorCell?.isConnected) {
                selectRectangle(anchorCell, cell, event.ctrlKey);
                anchorCell.classList.add('yogi-selection-anchor');
            } else if (event.ctrlKey) {
                if (selectedCells.has(cell)) {
                    selectedCells.delete(cell);
                    cell.classList.remove('yogi-selected-cell', 'yogi-selection-anchor');
                    if (anchorCell === cell) anchorCell = null;
                } else {
                    selectCell(cell);
                    setAnchor(cell);
                }
            }
        }, true);
        ['pointerdown', 'mousedown'].forEach(type => document.addEventListener(type, event => {
            const cell = event.target.closest(`${tableSelector} th, ${tableSelector} td`);
            if (cell && event.ctrlKey) {
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        }, true));
        document.addEventListener('keydown', event => {
            if (!(event.ctrlKey && event.key.toLowerCase() === 'c') || !selectedCells.size) return;
            if (document.activeElement?.matches('input, textarea, [contenteditable="true"], .CodeMirror textarea')) return;
            event.preventDefault();
            copySelection().catch(error => console.error('Could not copy selected cells:', error));
        }, true);
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && selectedCells.size) {
                clearSelection();
                anchorCell = null;
            }
        });
    }
    enableTableCellSelection();
    function openAnalytics(searchTermForAnalyticsName) {
        runQuery(`select ANALYTICSKEY from analyticsconfiges where analyticsname LIKE "%${searchTermForAnalyticsName}%" limit 1`).then(data => {
            const analyticsKey = data[0]?.ANALYTICSKEY;
            if (!analyticsKey) alert('BAU Actionable Report not found');
            const url = `/ECM/analyticsConfigES/show/${analyticsKey}`;
            window.open(url, "_blank");
        })
    }
    // GLOBAL FUNCTIONS END --FENDD
	// NEO UI DOESN'T PLAY WELL, SO BELOW STUFF DOESNT APPLY FOR NEO STYLED PAGES:
	if (!window.location.href.includes('ECM/workflowmanagement/createrequest')
		&& !window.location.href.includes('ECM/jbpmworkflowmanagement/showrequestdetails')
		&& !window.location.href.includes('/ECM/jbpmworkflowmanagement/confirm')
		&& !window.location.href.includes('ECM/workflowmanagement/requestaccessforothers?tileType=RequestAccessforOthers')
		&& !window.location.href.includes('ECM/workflowmanagement/createupdateuserrequestfirststep')
		&& !window.location.href.includes('ECM/roles/create')
		&& !window.location.href.includes('ECM/roles/selectowner')
		&& !window.location.href.includes('ECM/roles/selectentitlement')
		&& !window.location.href.includes('ECM/roles/selectChildAccount')
		// && !window.location.href.includes('ECM/roles/show')
		&& !window.location.href.includes('ECM/jbpmworkflowmanagement/viewopenrequests')
		&& !window.location.href.includes('ECM/jbpmworkflowmanagement/showmyhistoryrequests')
		&& !window.location.href.includes('admin/adminHome/uiConfig/manage-labels')
		&& !window.location.href.includes('ECM/transportAsync/viewHistory')
		&& !window.location.href.includes('ECM/transportAsync/importTransport')
		&& !window.location.href.includes('ECM/SSO')
		&& !window.location.href.includes('ECM/jbpmworkflowmanagement/jbpmworkfloweditor')
		&& !window.location.href.includes('ECM/workflowmanagement/createrequestfirststep')
		&& !window.location.href.includes('ECM/workflowmanagement/requestaccessforothers')
		&& !window.location.href.includes('ECM/login/auth')
		&& !window.location.href.includes('ECM/logout/logout')
		&& !window.location.href.includes('ECM/campaign/create')
		&& !window.location.href.includes('ECM/certification/list')
		&& !window.location.href.includes('ECM/certification/detailedView')
		&& !window.location.href.includes('ECM/dashboard/dashboardList')
		&& !window.location.href.includes('ECM/ecmConfig/createanalyticsconfig/ANALYTICS')
		&& !window.location.href.includes('ECM/workflownewui/uploadAccessRequestFile_v2')
		&& !window.location.href.includes('login.microsoftonline.com')) {
		console.log("CLASSIC");
		GM_addStyle(`td { padding: 3px !important;}
						body.page-header-fixed {margin-left: 15px !important;}
						.EicAppHeader {height: 60px;}
						.Logo_logo__Z22wd {margin-left: 0;}
						.job-still-running.job-still-running.job-still-running.job-still-running {background-color: yellow !important}
						.form-group:before, .form-group:after {display: none !important;}
						.form-group>label {flex-basis: 48%;margin: 0 0px !important;}
						.page-title{margin: 0 0 5px 0 !important}
						.page-content #rounded .panel-heading {padding: 5px;}
						body .table thead tr th, body #userListDataTable thead th, body #myDataTableDelay thead th, body #myDataTableuser thead th, body #entmappingcontainer table th {padding: 5px; text-align: center;}
						.page-breadcrumb.breadcrumb {margin: 5px !important; height: auto !important;padding: 0px !important;}
						.page-content .ui-tabs-nav.ui-helper-reset {margin-bottom: 4px !important;}
						.top-spacing {margin-top: 0px;}
						.btn {padding: 4px !important;font-size: 12px !important;height: 26px;}
						.btn.btn-default {padding: 4px !important;}
						.btn.btn-primary.btn.btn-primary.btn.btn-primary.btn.btn-primary {padding: 4px !important;}
						button#yui-gen3- {padding: 2px !important;margin: 0 4px 0 8px;}
						.input-group-btn {padding: 0 !important;}
						.input-group-btn {padding: 4px;font-size: 12px;}
						.select2-container .select2-choice {padding: 3px !important;line-height: normal !important; height: auto !important; min-height: 25px !important; border-radius: 5px !important;border: none !important;}
						.col-md-4 {max-width: 400px;}
						table {width: fit-content !important;};
						th {width: auto !important;}
						td {width: auto !important;}
						.dataTable {width: fit-content !important;}
						table.table {width: fit-content !important;margin-bottom: 0px !important; overflow-wrap: anywhere !important;}
						#arsReqApprovalColumn.btn {margin-top: 7px !important; padding: 4px !important;font-size: 12px !important; height: auto !important;}
						.row.dtProcessing {display: flex; padding: 2px 5px;}
						body .table tbody>tr.even>td {background-color: rgba(250, 250, 250) !important;}
						.btn.svicon {padding: 0 !important;height: 0;margin-top: -10px;}
						.dashboard-stat .relativeLayer {height: auto !important;}
						.dashboard-stat .visual {display: none !important; height: auto !important;padding-top: 0px !important;}
						.dashboard-stat .details .number {top: unset !important;}
						.totJobForDays {display: none;}
						.btnArea {margin-top: 16px !important;padding: 4px 15px !important;}
						.col-md-5 {width: 50%;}
						.col-md-5.recordsBlock {width: auto; white-space: nowrap;}
						.col-md-7.searchBlock {width: auto; margin-top: -4px !important;}
						.modal.fade.in {display: block !important;width: auto !important;margin: auto !important;position: fixed !important;top: 50% !important;left: 50% !important;transform: translate(-50%, -50%) !important;border-radius: 10px !important;padding: 5px;}
						div.modal-body > div.slimScrollDiv {height: auto !important; overflow: unset !important;}
						div.modal-body > div.slimScrollDiv > div.scroller {height: auto !important; overflow: unset !important;}
						.col-md-4 {text-wrap: nowrap;}
						.table-designSystem.reviewRequest-list .table {border-spacing: 0 !important;}
						.form-body {display: flex !important;flex-direction: row !important;;flex-wrap: wrap !important;;align-content: left !important;;justify-content: flex-start !important;;align-items: stretch !important;}
						.form-section {flex-basis: 100% !important; margin: 5px !important; padding: 5px !important;}
						.form-body>.row {margin-right: 0;margin-left: 0;display: flex;flex-direction: row;flex-wrap: wrap; width: 100%;border-bottom: 1px dashed #dddddd;}
						.form-control {height: auto;padding: 3px; overflow: auto !important;outline: 1px dashed #0000007a; border: none !important;}
						.form-control:focus { border: none !important; outline: 2px dashed #0a66ff !important; z-index: 1; }
						.modal .form-body .col-md-6 {min-width: 300px;}
						.ui-dialog .form-body .col-md-6 {min-width: 300px;}
						.col-md-6:has(textarea) {flex-basis: 100%;}
						.form-actions.right {display: flex !important; flex-basis: 100% !important; gap: 5px !important;padding: 10px 0 !important;background-color: transparent !important;}
						#configData > div.portlet > div > div > div:nth-child(3) {flex-basis: 100% !important;}
						div#advconfig {flex-basis: 100%;}
						li.select2-search-choice {margin: 1px !important;border-radius: 4px !important;}
						.select2-container-multi .select2-choices .select2-search-field input {min-height: 10px !important;padding: 0px !important; border: none !important;}
						.select2-container-multi .select2-choices {min-height: 26px;border-radius: 5px !important; padding: 0px !important;border: none !important;}
						.dynamic_Attribute {height: 80% !important;}
						.input-group {width: 100%;}
						h3.m-portlet__subgroup-text {flex-basis: 100%;}
						.portlet-title {display: flex;flex-direction: row;flex-wrap: wrap;align-content: center;justify-content: flex-start;align-items: center;gap: 5px;}
						.portlet>.portlet-title>.actions {position: unset;}
						.page-content .page-breadcrumb.breadcrumb .btn-group {right: unset;position: unset;margin-top: unset !important;}
						button#reset {padding: 4px !important;}
						.has-switch { border-radius: 10px !important; min-width: 65px !important; height: 20px; margin-top: 1px; }
						.has-switch label, .has-switch span {padding: 0 !important;font-size: small;}
						ul.list-inline.sidebar-tags {margin: 0 !important;}
						.form-group {display: flex; text-wrap: wrap;align-items: flex-start !important;margin-bottom: 0px !important;min-width: 250px !important;padding: 0px !important;border-radius: 5px !important;justify-content: space-between !important;}
						.form-group:has(.has-switch)>.control-label {flex-basis: 80%;}
						.form-group:has(textarea) {flex-direction: column !important;align-items: flex-start !important;}
						.form-group.scroller {flex-direction: column !important;align-items: flex-start !important;}
						span.help-block {margin: 0;}
						.ui-dialog-content {max-height: 80vh !important;overflow: auto;}
						.ui-dialog .slimScrollDiv {height: auto !important;overflow: auto !important;}
						.ui-dialog .scroller {height: auto !important;overflow: auto !important; padding: 0px !important;}
						.modal-header {padding: 5px;}
						.modal-body .slimScrollDiv {height: auto !important;overflow: auto !important;}
						.modal-body .scroller {height: auto !important;overflow: auto !important; padding: 0px !important;}
						.ui-dialog .slimScrollRail, .slimScrollBar {display: none !important;}
						.modal-body {padding: 0 !important;}
						.modal-body .row {margin: 0px !important;}
						.modal-body .form-body {display: flex !important;flex-direction: column !important;margin-left: 0px !important; padding: 5px !important;}
						.modal-body .form-group {display: flex;flex-direction: column !important;width: 100% !important; padding: 0px !important;}
						.modal-body .form-group:has(.has-switch) {flex-direction: row !important;}
						.modal-body .form-group>* {width: 100% !important;text-align: left !important}
						.modal-body .form-horizontal .form-group {margin: 0 !important;margin-bottom: 5px !important;}
						.modal-body .col-md-2 {padding: 0 !important;margin: 0 !important;}
						.modal-body .col-md-3 {padding: 0 !important;margin: 0 !important;}
						.modal-body .col-md-4 {width: 50%;padding: 0 5px !important;margin: 0 !important;}
						.modal-body .col-md-5 {padding: 0 !important;margin: 0 !important;}
						.modal-body .col-md-6 {padding: 0 3px !important;margin: 0 !important;width: 50% !important; float: left;}
						.modal-body .col-md-7 {padding: 0 !important;margin: 0 !important;}
						.modal-body .col-md-8 {padding: 0 !important;margin: 0 !important;}
						.modal-body .col-md-9 {padding: 0 !important;margin: 0 !important;}
						.modal-body .col-md-10 {padding: 0 !important;margin: 0 !important;}
						.modal-body .col-md-12 {padding: 0 5px !important;margin: 0 !important;}
						.modal-body .col-sm-3 {padding: 0 !important;margin: 0 !important;}
						.modal-body .col-sm-9 {padding: 0 !important;margin: 0 !important;}
						.modal {max-height: 80vh !important;overflow: auto !important;}
						span.uneditable-input { height: 26px; }
						input.select2-input {width: 100% !important;}
						.dropdown-menu {min-width: 80px !important;}
						body .dropdown-menu li>a {padding: 5px !important;}
						.dropdown-menu.pull-right {right: auto !important;}
						.datatable-scroll {padding-bottom: 0px !important; overflow: auto !important; scrollbar-width: thin;}
						.slimScrollRailH {display: none !important;height: 25px !important;}
						.slimScrollBarH {display: none !important; height: 25px !important;}
						.portlet.box.blue {border-radius: 10px !important;padding: 10px !important; margin-bottom: 0px !important;}
						.select2-search-choice-close {top: 3px !important;}.scroller-uploadent {height: auto !important;overflow: auto !important;}
						div#select2-drop {max-height: 70vh !important;height: auto !important;}
						.select2-drop .select2-results {max-height: calc(70vh - 45px) !important;}
						.select2-drop-active {min-width: fit-content !important;border: 1px solid #999999;border-radius: 5px !important;}
						.select2-result-label {font-size: small;padding: 2px 5px !important;}
						.select2-search .select2-input {border-radius: 5px !important;height: 10px !important;}
						.ui-tabs-panel {border-radius: 10px !important;background-color: #fafafa !important;}
						.row:has(>.pagingBlock) {width: fit-content;background: #f1f1f1;border-radius: 8px !important;margin-top: 10px !important;margin-left: 0px;font-size: small;}
						.row:has(>.pagingBlock) * {background: none !important;margin: 0;padding: 0px 2px;display: flex;flex-direction: row;flex-wrap: nowrap;align-content: center;justify-content: center;align-items: center;top: auto;width: fit-content;}
						.row:has(>.pagingBlock) > * {padding: 0 10px !important; float: left}
						.col-md-6.pagingBlock {padding: 0 !important;display: flex;justify-content: flex-end;}
						.dropdown-menu > li {margin: 0 !important;}
						a[data-toggle="tab"] {border-radius: 5px !important;}
						.ui-tabs-anchor {border-radius: 5px !important;}
						.ui-tabs-anchor .ui-state-hover {border-radius: 5px !important;}
						.ui-tabs .ui-tabs-nav li.ui-tabs-active {background-color: #0060ff1f !important;border-radius: 5px !important;}
						body .ui-state-active a, body .ui-state-active a:link, body .ui-state-active a:visited, body .ui-tabs .ui-tabs-nav .ui-tabs-anchor:focus, body .ui-tabs .ui-tabs-nav .ui-tabs-anchor:hover, body .ui-tabs-nav .ui-state-active .ui-tabs-anchor, body .ui-tabs-nav .ui-state-active .ui-tabs-anchor:hover, body .ui-tabs-nav .ui-state-active .ui-tabs-anchor:focus, body .tabbable-custom .nav-tabs>li.active a, body .tabbable-custom .nav-tabs>li.active a:hover, body .tabbable-custom .nav-tabs>li.active a:focus, body .tabbable-custom .nav-tabs>li a:hover, body .tabbable-custom .nav-tabs>li a:focus {background: #0060ff1f !important;}
						ul.ui-tabs-nav {margin-top: 5px;}
						ul.page-breadcrumb.breadcrumb.breadcrumb.breadcrumb {border-radius: 5px !important;background: #ededed !important;padding: 0px 0px !important;font-size: small;width: fit-content;margin: 0 0 10px !important;}
						ul.page-breadcrumb.breadcrumb:not(:has(li:nth-child(1))) {display: none;}
						body .portlet.box.blue .portlet-title.portlet-title {padding: 5px !important;}
						.portlet.box>.portlet-body {padding: 5px !important;}
						.page-content.remove-leftmargin {padding: 20px 15px 0px 15px !important;}
						td.worst-td.worst-td.worst-td.worst-td {background-color: red !important; font-weight: normal !important; color: white !important}
						td.bad-td.bad-td.bad-td.bad-td {background-color: orange !important; font-weight: normal !important; color: white !important}
						td.good-td.good-td.good-td.good-td {font-weight: normal !important; background-color: mediumseagreen !important; color: white !important}
						td.dodgerblue-td.dodgerblue-td.dodgerblue-td.dodgerblue-td {background-color: dodgerblue !important; font-weight: normal !important; color: white !important}
						.inactive-div.inactive-div.inactive-div.inactive-div {background-color: orangered !important;color: white !important;}
						.orange-div.orange-div.orange-div.orange-div {background-color: orange !important;color: white !important;}
						.active-div.active-div.active-div.active-div {background-color: mediumseagreen !important;color: white !important;}
						.inactive-div.inactive-div.inactive-div.inactive-div a, .active-div.active-div.active-div.active-div a, td.worst-td.worst-td.worst-td.worst-td a, td.bad-td.bad-td.bad-td.bad-td a, td.good-td.good-td.good-td.good-td a, td.dodgerblue-td.dodgerblue-td.dodgerblue-td.dodgerblue-td a {color: white}
						#pageLayout.LayoutWithSideNav {margin-left: 60px !important;}
						html {scrollbar-width: thin;}
						textarea{tab-size: 4; font-family: 'Courier New', consolas, monospace; line-height: normal !important; max-height: 60vh;}
						th {overflow-wrap: break-word;text-wrap: pretty !important;align-content: center;}
						.active-status {background-color: mediumseagreen !important;color: white !important;}
						.inactive-status {background-color: orangered !important;color: white !important;}
						span.failed-status {background-color: orangered;color: white !important;}
						body .table tbody>tr:hover>td {background-color: #dbe6f3 !important;}
						body .table { border-collapse: separate !important; border: none !important } body .table thead>tr>th { border-top: 1px solid #dae0ef !important; border-bottom: 1px solid #dae0ef !important; border-right: 1px solid #dae0ef !important; } body .table tbody>tr>td { border-bottom: 1px solid #dae0ef !important; border-right: 1px solid #dae0ef !important; } body .table thead>tr>th:first-child, body .table tbody>tr>td:first-child { border-left: 1px solid #dae0ef !important; }
						.select2-choice.select2-choice.select2-choice.select2-choice { border: none !important; }
						tbody > tr > th { padding: 0 5px !important; outline: 1px solid #e7e7e7 !important; }
						.checker:has(.checked) { background: limegreen !important; }
						::highlight(lightGreenHighlight) { background: #c6ffb3; }
						::highlight(deepRedHighlight){ background: #ff0000ff; color: white;}
						::highlight(lightRedHighlight)   { background: #ffb3b3; }
						::highlight(lightYellowHighlight){ background: #ffe9a6; }
						::highlight(yellowHighlight){ background: yellow; }
						::highlight(magentaHighlight){ background: magenta; color: white;}
						::highlight(limeHighlight){ background: lime; }
						::highlight(aquaHighlight){ background: aqua; }
						::highlight(orangeHighlight){ background: orange; color: white;}
						`);

		// remove whitespace from breadcrumb
		const breadcrumb = document.querySelector('.breadcrumb');
		if (breadcrumb) {
			breadcrumb.style = "border-bottom : none !important;";
		}

		// modifications for data analyzer
		if (window.location.href.includes("ECM/dataAnalyzer/index")) {
			// --da--
			document.title = "💾 Data Analyzer";

			addJumpToUsrFields();

			if (document.querySelector('.json-formatter-container')) {
				// INVALID PAGES ; REDIRECT TO HOME
				setTimeout(() => {
					const homeUrl = baseUrl + "/ECM"
					console.log("Routing to home: " + homeUrl);
					window.location.href = homeUrl;
				}, 2000);
			}

			GM_addStyle(`#pageLayout > div > div:nth-child(2) {display: flex;flex-direction: row;margin: 0; gap: 10px;}
							/* update for brisbane ; pane layout get borked for schema view as a main container is introduced */
							#pageLayout > main > div > div:nth-child(2) { display: flex; flex-direction: row; margin: 0; gap: 10px; }
							.portlet-title {text-transform: uppercase;font-family: courier new;}
							.portlet.box.blue {border-radius: 10px !important;padding: 5px !important;height: calc(100vh - 95px);overflow: auto;display: flex;flex-direction: column;scrollbar-width: thin;}
							div#result {overflow: auto;height: 100%;max-height: 100%;scrollbar-width: thin; min-height: 80vh}
							div#resultTable_wrapper  {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin;}
							#resultTable_wrapper > div.slimScrollDivH {height: calc(100vh - 267px);overflow: auto !important;scrollbar-width: thin;}
							.datatable-scroll {height: 100%}
							#message {display: none !important;}
							td {text-wrap-mode: nowrap;max-width: 40vw;scrollbar-width: none; position: relative;}
							td:not(:has(.subcelldiv)) { overflow: auto; }
							.subcelldiv { position: absolute; width: 100%; top: 0; left: 0; padding: 3px 3px; opacity: 0; max-height: 100%; white-space: nowrap; overflow: hidden; }
							.subcelldiv:hover { background: white; opacity: 1; height: 100px !important; z-index: 50; transition: all 0.3s; max-height: unset; height: fit-content !important; color: black; box-shadow: 2px 2px 10px 0px;  white-space: normal; overflow: auto; }
							.subcelldiv:hover:has(a) { background: #95d3ff; }
							.slimScrollDiv {height: auto !important;overflow: auto !important;}
							.slimScrollBar, .slimScrollRail {display: none !important;}
							.tablediv {height: auto !important;overflow: auto !important;}
							textarea#queryArea {max-height: 55vh;}
							#pageLayout > div > div:nth-child(2) > div.col-md-9.custpaddingleft > div > div:nth-child(4) {max-height: 70vh;}
							div#view_current_query {font-size: small;max-height: 86px;overflow: scroll;}
							.row:has(>.pagingBlock) {position: fixed;bottom: 20px;box-shadow: 2px 3px 6px 0px #0000007a; display:none}
							#recordCountSpan {font-weight: bold; color: #0060ff;}
							.modal-scrollable {display: none !important;}
							.modal-backdrop.fade.in {display: none !important;}
							.custpaddingright.custpaddingright {width: 400px !important;padding: 0px !important; overflow: auto; display: none; scrollbar-width: thin;}
							.custpaddingleft.custpaddingleft {width: unset !important;flex: 1;overflow: auto;padding: 0 !important; scrollbar-width: thin;}
							.page-content.remove-leftmargin {padding: 20px 10px 0px 10px !important;overflow: hidden;}
							#resultTable > thead {position: sticky !important;top: 0px !important; z-index: 2}
							#resultTable td:nth-child(2), #resultTable th:nth-child(2) { position: sticky; left: 0px; z-index: 1; }
							li.jstree-node {padding-bottom: 0px !important;}
							.jstree-node>a>:nth-child(2) {max-width: calc(100% - 52px);display: block;overflow: scroll;scrollbar-width: none;}
							i.tooltips:not(.copy_text) {margin-top: -23px;}
							i.copy_text {margin-top: -24px;}
							th {text-transform: lowercase !important}
							a {color: black;text-decoration: underline;}
							.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
							.slimScrollDivH { overflow: auto; height: calc(100vh - 560px); }
							.datatable-scroll { height: 100%; overflow: auto; }
							table#myDataTable { height: auto; overflow: auto; }
							thead { top: 0px; position: sticky; z-index: 2; }
							#myDataTable td:nth-child(2), #myDataTable th:nth-child(2) { position: sticky; left: 0px; z-index: 1; }
							#myDataTable th {overflow-wrap: nowrap;text-wrap: nowrap !important;align-content: center;}
							#analytics-result .modal-header, #analytics-result .modal-footer, #analytics-result .portlet-title {display: none;}
							#analytics-result .portlet.box.blue.col.no-adv { height: calc(100vh - 520px); overflow: hidden; }
							div#view_current_query { display: none; }
							button#querySubmit { position: absolute; z-index: 10; right: 28px; bottom: 20px; }
							.alert.alert-danger { margin: 0; padding: 5px; }
							td > br { display: none; }
							table { padding-bottom: 30%; }
							.searchBox { background: #414141; height: 25px; padding: 0 5px; }
							div#query_key { display: none; }
							.col-md-9.custpaddingleft { width: calc(100vw - 83px) !important; }
							`);
			document.addEventListener("keydown", (event) => {
				// RUN QUERY WITH CTRL + ENTER
				if (event.ctrlKey && event.key === "Enter") {
					document.getElementById("querySubmit").click();

					const actionArea = document.getElementById("action_area");
					let recordCountSpan = document.getElementById("recordCountSpan");
					if (!recordCountSpan) {
						recordCountSpan = document.createElement("div");
						recordCountSpan.id = "recordCountSpan";
					}
					actionArea.appendChild(recordCountSpan);
					recordCountSpan.textContent = "(Running Query ...)";

					// Build count(*) query
					const queryArea = document.getElementById("queryArea");
					const query = queryArea.value.replace(';', '');
					const countsQuery = `select count(*) as RECORD_COUNT from (${query}) as t`;

					const queryStartTime = new Date();

					runQuery(countsQuery)
						.then(data => {
							const queryEndTime = new Date();
							const runtime = queryEndTime - queryStartTime;

							const totalRecords = data[0].RECORD_COUNT;
							const formattedRecords = parseInt(totalRecords).toLocaleString("en-IN") || totalRecords;

							recordCountSpan.textContent =
								`(Total Records: ${formattedRecords} /// Runtime: ${runtime} ms)`;
						})
						.catch(err => {
							if (err.message === "PERMISSION_DENIED") {
								console.error("Permission denied to run query;; trying analytics interface");
								const extendedQuery = `${query} limit 100;--`;

								// add divs for analytics tables
								const resultDiv = document.querySelector("#result");
								if (!resultDiv) {
									console.error("#result not found!");
									return;
								}
								const alertDiv = resultDiv.querySelector(".alert");
								if (!alertDiv) {
									console.error("alert not found inside #result!");
									return;
								}
								// Create analytics-result div only if missing
								let analyticsDiv = document.getElementById("analytics-result");
								if (!analyticsDiv) {
									analyticsDiv = document.createElement("div");
									analyticsDiv.id = "analytics-result";
									// Insert after the alert div
									alertDiv.insertAdjacentElement("afterend", analyticsDiv);
								}
								// Create analytics-result-count div only if missing
								let analyticsCountsDiv = document.getElementById("analytics-result-count");
								if (!analyticsCountsDiv) {
									analyticsCountsDiv = document.createElement("div");
									analyticsCountsDiv.id = "analytics-result-count";

									// Insert after the alert div
									analyticsDiv.insertAdjacentElement("afterend", analyticsCountsDiv);
								}
                                // runAnalyticsQuery(extendedQuery, query);
								const analyticsCountQuery = `select count(*) as RECORD_COUNT from (${query}) as t`;
                                runAnalyticsQueryForCount(analyticsCountQuery, extendedQuery);
							} else {
								console.error("Unknown error in run query");
								recordCountSpan.textContent = "(Total Records: Error Running Query)";
							}
						});

					// store the query in sessionStorage
					sessionStorage.setItem('lastQuery', query);

					// persist query under the current tab name
					const currentTabName = getCurrentTabName();
					if (currentTabName && currentTabName !== '💾' && currentTabName !== '') {
						saveQueryToStorage(currentTabName, query);
					}
				}
				// HIDE TABLE LIST SIDEBAR WITH CTRL + '
				if (event.ctrlKey && event.key === "'") {
					if (tablelistbox.style.display != "block") {
						tablelistbox.style.display = "block";
						document.getElementById("schemaSearchBox").focus();
					} else {
						tablelistbox.style.display = "none";
					}
				}
			});

			// BUTTON TO SHOW HIDE TABLE LIST IN DATA ANALYZER
			// Create a button element
			const tablelistbox = document.querySelector(".custpaddingright");
			const toggleTableListinDAButton = document.createElement("button");
			toggleTableListinDAButton.textContent = "Toggle Table List";
			toggleTableListinDAButton.id = "toggleTableList";
			toggleTableListinDAButton.title = "Ctrl + '";
			customButtonDiv.appendChild(toggleTableListinDAButton);
			toggleTableListinDAButton.addEventListener("click", () => {
				if (!(tablelistbox.style.display) || tablelistbox.style.display === "none") {
					tablelistbox.style.display = "block";
				} else {
					tablelistbox.style.display = "none";
				}
			});

			// BUTTON TO Copy Table contents
			// Create a button element
			const copyTableButton = document.createElement("button");
			copyTableButton.textContent = "©";
			copyTableButton.id = "copyTableButton";
			customButtonDiv.appendChild(copyTableButton);
			copyTableButton.addEventListener("click", () => {
				const table = document.querySelector('table');
				if (!table) return;
				const lines = [];
				/* ---------- HEADERS ---------- */
				const headerCells = table.querySelectorAll('thead th');
				if (headerCells.length) {
					const headerLine = Array.from(headerCells)
						.map(th => th.innerText.trim())
						.join('\t');
					lines.push(headerLine);
				}
				/* ---------- BODY ROWS ---------- */
				const rows = table.querySelectorAll('tbody tr');
				rows.forEach(row => {
					const cells = row.querySelectorAll('td');
					const rowLine = Array.from(cells)
						.map(td => {
							const sub = td.querySelector('.subcelldiv');
							return sub ? sub.innerText.trim().replaceAll(/\n/g, '') : td.innerText.trim().replaceAll(/\n/g, '');
						})
						.join('\t');
					lines.push(rowLine);
				});

				const tsv = lines.join('\n');
				navigator.clipboard.writeText(tsv);
			});

			// check box to create subcelldivs
			const enableSubCellingCheckbox = document.createElement('input');
			enableSubCellingCheckbox.id = 'enableSubCellingCheckbox';
			enableSubCellingCheckbox.type = 'checkbox';
			enableSubCellingCheckbox.checked = true;
			enableSubCellingCheckbox.title = 'enable sub-celling for hover'
			customButtonDiv.appendChild(enableSubCellingCheckbox);

			function expandSchemaLabels(node) {
				const labels = node.querySelectorAll('.jstree-node>a>:nth-child(2)');
				labels.forEach(label => {
					label.textContent = label.getAttribute('data-original-title').toLowerCase();
				})
			}

			function enableSchemaSearch() {
				const parent = document.querySelector(".jstree-container-ul");
				if (!parent) return;

				let searchBox = document.querySelector("#schemaSearchBox");
				if (!searchBox) {
					// Create search input
					searchBox = document.createElement("input");
					searchBox.id = "schemaSearchBox";
					searchBox.className = "searchBox";
					searchBox.type = "text";
					searchBox.placeholder = "Search tree…";
					// Insert search box above the tree
					parent.parentNode.insertBefore(searchBox, parent);
				}

				// Filtering logic
				searchBox.addEventListener("keydown", e => {
					const query = searchBox.value.trim().toLowerCase();
					const nodes = parent.querySelectorAll(".jstree-node");

					// If cleared → show all
					if (query === "") {
						nodes.forEach(n => n.style.display = "");
						return;
					}

					nodes.forEach(node => {
						const text = node.textContent.toLowerCase();
						if (text.includes(query)) {
							node.style.display = "";  // show
						} else {
							node.style.display = "none"; // hide
						}
					});
				});

				// Also restore when user manually clears input
				searchBox.addEventListener("input", () => {
					if (searchBox.value.trim() === "") {
						const nodes = parent.querySelectorAll(".jstree-node");
						nodes.forEach(n => n.style.display = "");
					}
				});
			}

			const dataAnalyzerObserver = new MutationObserver(function (mutations) {
				mutations.forEach(mutation => {
					mutation.addedNodes.forEach(node => {
						// console.log(node);
						if (node?.classList?.contains("jstree-node") || node?.classList?.contains("jstree-container-ul")) {
							// console.log("jstree-node added");
							expandSchemaLabels(node);
						}
						if (node?.classList?.contains("jstree-container-ul")) {
							enableSchemaSearch();
						}
						// data analyzer table and analytics tables load differently as data anablyzer table is a client side datatable and analytics table is a server side datatable, so data analyzer table loads whole 100 rows at once and remaining transforms are done client side like sort, filter etc. but analytics table loads empty table on initialization and then table body is updated via server side api. Hence different approach for detection:
						if (node?.nodeName === "TABLE" || node?.nodeName === "TBODY") {
							if (node?.nodeName === "TABLE") {
								// console.log("table added");
								extendDataTables(node);
							}

							if (node?.nodeName === "TBODY") {
								if (!node.classList.contains("body-extended")) {
									console.log("tbody added for analytics table");
									const analyticsTable = document.querySelector("#myDataTable");
									extendDataTables(analyticsTable);
									node.classList.add("body-extended");
								}
							}

							if (document.getElementById('enableSubCellingCheckbox')?.checked) {
								const cells = node.querySelectorAll('td');
								console.log("moving cell contents to inner divs");
								for (const cell of cells) {
									// enable hover functionality for cell only above certain length
									if (cell.innerHTML.length < SUBCELLING_MAX_CHARS) {
										continue;
									}
									const tdSubDiv = document.createElement('div');
									tdSubDiv.classList.add('subcelldiv');
									tdSubDiv.innerHTML = cell.innerHTML.replaceAll('///', '<br>');
									// cell text helps with setting widths of cells but too long and it makes table scroll too much to right so trimming text to first '—' (remove everything after) or first 100 chars
									if (cell.textContent.includes('—')) {
										cell.textContent = cell.textContent.substring(0, cell.textContent.indexOf('—'));
									}
									cell.textContent = cell.textContent.substring(0, 100);
									cell.appendChild(tdSubDiv);
								}
							}
							if (!node.querySelector('td.td-link-formatted')) {
								makeLinks(document.querySelector('table'));
							}
						}
					});
				});
			});
			const config = { attributes: false, childList: true, subtree: true };
			dataAnalyzerObserver.observe(document.body, config);

			document.querySelectorAll('textarea').forEach(textarea => {
				textarea.setAttribute('spellcheck', 'false');
				textarea.setAttribute('tab-size', '4');
			})

			// ── Saved-query helpers ──────────────────────────────────────────────────
			const SAVED_QUERIES_KEY = 'saviyntSavedQueries'; // localStorage key for the index
			const MAX_SAVED_QUERIES = 500;

			function getSavedQueriesIndex() {
				try { return JSON.parse(GM_getValue(SAVED_QUERIES_KEY, '[]')); } catch { return []; }
			}

			function saveQueryToStorage(tabName, query) {
				if (!tabName || !tabName.trim()) return;
				const name = tabName.trim();
				const storageKey = 'saviyntQuery_' + name;

				GM_setValue(storageKey, query);

				let index = getSavedQueriesIndex().filter(e => e.key !== name);
				index.push({ key: name, savedAt: Date.now() });

				if (index.length > MAX_SAVED_QUERIES) {
					const removed = index.splice(0, index.length - MAX_SAVED_QUERIES);
					removed.forEach(e => GM_setValue('saviyntQuery_' + e.key, undefined));
				}

				GM_setValue(SAVED_QUERIES_KEY, JSON.stringify(index));
			}

			function loadQueryFromStorage(tabName) {
				if (!tabName) return null;
				const val = GM_getValue('saviyntQuery_' + tabName.trim(), null);
				return val ?? null;
			}

			function getMatchingTabNames(partial) {
				const index = getSavedQueriesIndex();
				const lower = partial.toLowerCase();
				return index
					.filter(e => e.key.toLowerCase().includes(lower))
					.map(e => e.key)
					.reverse(); // most recent first
			}

			function getCurrentTabName() {
				// Title format is "💾 <tabName>"
				return document.title.replace(/^💾\s*/, '').trim();
			}
			// ────────────────────────────────────────────────────────────────────────

			// ── Export / Import saved queries ──────────────────────────────────────────

			function exportSavedQueries() {
				const index = getSavedQueriesIndex();
				if (!index.length) {
					alert('No saved queries to export.');
					return;
				}

				const bundle = index.map(entry => ({
					key: entry.key,
					savedAt: entry.savedAt,
					query: GM_getValue('saviyntQuery_' + entry.key, '')
				}));

				const json = JSON.stringify(bundle, null, 2);
				const blob = new Blob([json], { type: 'application/json' });
				const url = URL.createObjectURL(blob);

				const a = document.createElement('a');
				a.href = url;
				const ts = new Date().toISOString().replace(/[:.]/g, '-');
				a.download = `saviynt-saved-queries_${ts}.json`;
				document.body.appendChild(a);
				a.click();
				a.remove();
				URL.revokeObjectURL(url);
			}

			function importSavedQueries() {
				const fileInput = document.createElement('input');
				fileInput.type = 'file';
				fileInput.accept = 'application/json,.json';
				fileInput.style.display = 'none';

				fileInput.addEventListener('change', () => {
					const file = fileInput.files[0];
					if (!file) return;

					const reader = new FileReader();
					reader.onload = () => {
						let bundle;
						try {
							bundle = JSON.parse(reader.result);
						} catch (e) {
							alert('Could not parse file: not valid JSON.');
							return;
						}

						if (!Array.isArray(bundle)) {
							alert('Invalid file format: expected a JSON array of saved queries.');
							return;
						}

						let index = getSavedQueriesIndex();
						let imported = 0;
						let skipped = 0;

						bundle.forEach(entry => {
							if (!entry || typeof entry.key !== 'string' || typeof entry.query !== 'string' || !entry.key.trim()) {
								skipped++;
								return;
							}
							const name = entry.key.trim();
							const savedAt = Number.isFinite(entry.savedAt) ? entry.savedAt : Date.now();

							GM_setValue('saviyntQuery_' + name, entry.query);
							index = index.filter(e => e.key !== name);
							index.push({ key: name, savedAt });
							imported++;
						});

						if (index.length > MAX_SAVED_QUERIES) {
							const removed = index
								.sort((a, b) => a.savedAt - b.savedAt)
								.splice(0, index.length - MAX_SAVED_QUERIES);
							removed.forEach(e => GM_setValue('saviyntQuery_' + e.key, undefined));
						}

						GM_setValue(SAVED_QUERIES_KEY, JSON.stringify(index));
						alert(`Imported ${imported} quer${imported === 1 ? 'y' : 'ies'}${skipped ? `, skipped ${skipped} invalid entr${skipped === 1 ? 'y' : 'ies'}` : ''}.`);
					};
					reader.readAsText(file);
				});

				document.body.appendChild(fileInput);
				fileInput.click();
				fileInput.remove();
			}

			// Buttons
			const exportQueriesButton = document.createElement("button");
			exportQueriesButton.textContent = "⬇ Export Queries";
			exportQueriesButton.id = "exportQueriesButton";
			exportQueriesButton.title = "Export all saved queries to a JSON file";
			customButtonDiv.appendChild(exportQueriesButton);
			exportQueriesButton.addEventListener("click", exportSavedQueries);

			const importQueriesButton = document.createElement("button");
			importQueriesButton.textContent = "⬆ Import Queries";
			importQueriesButton.id = "importQueriesButton";
			importQueriesButton.title = "Import saved queries from a JSON file";
			customButtonDiv.appendChild(importQueriesButton);
			importQueriesButton.addEventListener("click", importSavedQueries);

			// ────────────────────────────────────────────────────────────────────────

			function renameTab() {
				const queryArea = document.querySelector('textarea#queryArea');
				if (!queryArea) {
					console.log("Can't find textarea#queryArea");
					return;
				}

				const datalist = document.createElement('datalist');
				datalist.id = 'renameTabSuggestions';

				const textField = document.createElement('input');
				textField.type = 'text';
				textField.id = 'renameTabInput';
				textField.className = 'searchBox';
				textField.placeholder = 'Rename tab...';
				textField.setAttribute('list', 'renameTabSuggestions');
				textField.autocomplete = 'off';

				queryArea.parentNode.insertBefore(datalist, queryArea);
				queryArea.parentNode.insertBefore(textField, queryArea);
                const suggestions = document.createElement('div');
                suggestions.id = 'renameTabSuggestions';
                suggestions.setAttribute('role', 'listbox');
                suggestions.hidden = true;
                textField.insertAdjacentElement('afterend', suggestions);
                GM_addStyle(`
                        #renameTabSuggestions {
                        position: fixed;
                            z-index: 10000;
                            overflow-y: auto;
                            background: #fff;
                            border: 1px solid #888;
                            box-shadow: 2px 3px 8px #0000004d;
                        }
                        #renameTabSuggestions[hidden] { display: none; }
                        #renameTabSuggestions button {
                            display: block;
                            width: 100%;
                            border: 0;
                            background: #fff;
                            color: #222;
                            text-align: left;
                        }
                        #renameTabSuggestions button:hover,
                        #renameTabSuggestions button[aria-selected="true"] {
                            background: #0060ff1f;
                        }
                    `);
                let selectedSuggestionIndex = -1;
                function hideSuggestions() {
                    suggestions.hidden = true;
                    selectedSuggestionIndex = -1;
                }
                function selectSuggestion(name) {
                    textField.value = name;
                    hideSuggestions();
				textField.focus();
                }
                function markQueryAsUsed(name) {
                    const index = getSavedQueriesIndex();
                    const entry = index.find(item => item.key === name);
                    if (!entry) return;
                    const updatedIndex = index.filter(item => item.key !== name);
                    updatedIndex.push({ key: name, savedAt: Date.now() });
                    GM_setValue(SAVED_QUERIES_KEY, JSON.stringify(updatedIndex));
                }
                function positionSuggestions() {
                    const fieldBounds = textField.getBoundingClientRect();
                    suggestions.style.left = `${fieldBounds.left}px`;
                    suggestions.style.top = `${fieldBounds.bottom}px`;
                    suggestions.style.width = `${fieldBounds.width}px`;
                }
                function renderSuggestions() {
                    const value = textField.value.trim();
                    const names = value ? getMatchingTabNames(value).slice(0, 15) : [];
                    suggestions.replaceChildren();
                    selectedSuggestionIndex = -1;
                    if (!names.length) {
                        hideSuggestions();
                        return;
                    }
                    names.forEach((name, index) => {
                        const option = document.createElement('button');
                        option.type = 'button';
                        option.textContent = name;
                        option.setAttribute('role', 'option');
                        option.addEventListener('mousedown', event => event.preventDefault());
                        option.addEventListener('click', () => selectSuggestion(name));
                        suggestions.appendChild(option);
                    });
                    positionSuggestions();
                    suggestions.hidden = false;
                }
                function updateSelectedSuggestion() {
                    const options = suggestions.querySelectorAll('button');
                    options.forEach((option, index) => {
                        option.setAttribute('aria-selected', String(index === selectedSuggestionIndex));
                    });
                }
                textField.focus();
				textField.addEventListener('input', () => {
                    renderSuggestions();
				});

				textField.addEventListener('keydown', (event) => {
                    const options = suggestions.querySelectorAll('button');
                    if (event.key === 'ArrowDown' && options.length) {
                        event.preventDefault();
                        selectedSuggestionIndex = (selectedSuggestionIndex + 1) % options.length;
                        updateSelectedSuggestion();
                        return;
                    }
                    if (event.key === 'ArrowUp' && options.length) {
                        event.preventDefault();
                        selectedSuggestionIndex = (selectedSuggestionIndex - 1 + options.length) % options.length;
                        updateSelectedSuggestion();
                        return;
                    }
					if (event.key === 'Enter') {
						event.preventDefault();
						event.stopPropagation();
                        const name = selectedSuggestionIndex >= 0
                            ? options[selectedSuggestionIndex].textContent
                            : textField.value.trim() || 'Untitled';
						const savedQuery = loadQueryFromStorage(name);
                        hideSuggestions();
						commitRename(name, savedQuery);
                    } else if (event.key === 'Escape') {
                        hideSuggestions();
					}
				});
                document.addEventListener('click', event => {
                    if (event.target !== textField && !suggestions.contains(event.target)) {
                        hideSuggestions();
                    }
                });
				function commitRename(name, queryToLoad) {
                    textField.value = name;
					document.title = "💾 " + name;
                    markQueryAsUsed(name);
					if (queryToLoad !== null && queryToLoad !== undefined) {
						const queryArea = document.querySelector('textarea#queryArea');
						if (queryArea) queryArea.value = queryToLoad.trimStart();
						sessionStorage.setItem('lastQuery', queryToLoad.trimStart());
					}

					if (document.querySelector('.CodeMirror')) {
						document.querySelector('.CodeMirror').remove();
					}
					applyCodeMirror("#queryArea", "sql");
				}
			}
			renameTab();

			// enable query submit button:
			document.querySelector("#querySubmit").disabled = false;

			// load the last query from sessionStorage
			const lastQuery = sessionStorage.getItem('lastQuery');
			if (lastQuery) {
				document.querySelector("#queryArea").value = lastQuery;
			}

			setInterval(() => {
				const check = document.querySelector('.td-formatted')
				if (check == null) {
					formatCells();
				}
			}, 2000);

		} else if (window.location.href.includes("ECM/users/list")) {
			// --ul--
			document.title = "== 🤦‍♂️ Users ==";
			GM_addStyle(`.modal-body .form-group {display: flex !important;flex-direction: row !important;width: 100% !important; padding: 0px !important; gap: 5px !important;}
						.modal-body .col-md-6 {padding-left: 0 !important;padding-right: 0 !important;margin: 2px !important;width: 48% !important; float: left;}
						table#usersList {text-wrap: nowrap !important;}
						div#usersList_column_toggler {height: auto !important;text-wrap: nowrap;right: 0 !important;}
						.row:has(>.pagingBlock) {position: fixed;bottom: 20px;box-shadow: 2px 3px 6px 0px #0000007a;}
						.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
						.slimScrollDivH { overflow: auto; height: calc(100vh - 230px); }
						.datatable-scroll { height: 100%; overflow: auto; }
						table#usersList { height: auto; overflow: auto; }
						thead { top: 0px; position: sticky; z-index: 2; }
						#usersList td:first-child, #usersList th:first-child { position: sticky; left: 0px; z-index: 1; }
						#usersList th {overflow-wrap: nowrap;text-wrap: nowrap !important;align-content: center;}
						body .datatable-td-word-wrap tbody > tr > td { overflow-wrap: break-word !important; word-break: unset !important; white-space: nowrap !important; }
						#usersList_column_toggler label { padding: 2px 0px; font-family: Roboto; }
						body .datatable-td-word-wrap tbody > tr > td { max-width: unset !important; }
						`);

			extendDataTables(document.querySelector("table#usersList"));

			// Add "show all columns" button on user repository page
			const button = document.createElement("button");
			button.textContent = "Show All Fields";
			button.id = "toggleTableList";
			// Add the button to the page
			customButtonDiv.appendChild(button);
			// Get the table list box element
			// Add an event listener to the button
			button.addEventListener("click", () => {
				// Get the div that contains the checkboxes
				const checkboxDiv = document.getElementById("usersList_column_toggler");
				// Get all checkboxes within the div
				// const checkboxes = checkboxDiv.querySelectorAll("input[type='checkbox']");
				// // Loop through the checkboxes and check them
				// checkboxes.forEach(checkbox => {
				//     checkbox.checked = true;
				// });
				// get all spans and add "checked" class to them
				// const spans = checkboxDiv.querySelectorAll("span");
				// for (let i = 0; i < spans.length; i++) {
				//     spans[i].classList.add("checked");
				// }
				const labels = checkboxDiv.getElementsByTagName("label");
				for (let i = 0; i < labels.length; i++) {
					const span = labels[i].getElementsByTagName("span")[0];
					if (!span.classList.contains("checked")) {
						labels[i].click();
					}
				}
			});
			const checkboxDiv = document.getElementById("usersList_column_toggler");
			const labels = checkboxDiv.getElementsByTagName("label");
			for (let i = 0; i < labels.length; i++) {
				const span = labels[i].getElementsByTagName("span")[0];
				if (!span.classList.contains("checked")
					&& ['Create Date',
						'Update Date',
						'Employee Class',
						// 'Employee Type',
						'Create Date',
						'Update Date',
						'Start Date',
						'End Date',
						'System Username',
						// 'Organization',
						// 'Job Code',
						// 'Company Name',
						'Association Type',
						'Legal Entity Description',
						'Secondary Manager',
						'Display Name'].includes(labels[i].textContent.trim())) {
					labels[i].click();
				}
				if (span.classList.contains("checked")
					&& ['Risk Score',
						'Job Code Desc',
						'City'].includes(labels[i].textContent.trim())) {
					labels[i].click();
				}
			}

			const observer = new MutationObserver((mutations) => {
				let foundRow = false;
				for (const mutation of mutations) {
					for (const node of mutation.addedNodes) {
						if (node.nodeName === 'TR') {
							foundRow = true;
							break;
						}
					}
					if (foundRow) break;
				}
				if (foundRow) {
					// console.log("updating headers");
					// EXT: was jQuery ($("#usersList").find('th').each(...)); jQuery is not available in the extension's isolated world
					document.querySelectorAll('#usersList th').forEach(function (th) {
						const cellText = th.textContent.trim();
						if (cellText.includes('Organization')) {
							th.textContent = 'Org';
						} else if (cellText.includes('Company Name')) {
							th.textContent = 'Company';
						}
					});
				}
			});
			observer.observe(document.querySelector('#usersList'), {
				childList: true,
				subtree: true
			});
		} else if (window.location.href.includes("ECM/workflowmanagement/pendingtasklist") || window.location.href.includes("ECM/workflowmanagement/completetasklist")) {
			// --t-- --td--
			GM_addStyle(".datatable-scroll {padding-bottom: 150px !important;}\
							.modal-body .form-group {display: flex !important;flex-direction: column !important;width: 100% !important; padding: 5px !important;}\
							.main-scroller {overflow: auto !important;}\
							pre {height: auto !important;overflow: auto !important;}\
							.form-group {text-wrap: wrap !important;overflow-wrap: anywhere;}\
							.form-horizontal .form-group {margin-right: 0 !important;margin-left: 0 !important;}\
							.form-control {height: auto !important;min-height: 1rem;}\
							.col-md-12 {padding-right: 25px !important;padding-left: 5px !important;}\
							.col-md-4 {max-width: none !important;}\
							.row {margin-left: 0 !important;}\
							.scroller1,.scroller2,.scroller3,.scroller4 {height: auto !important;overflow: auto !important;}\
							.customScrollDiv {height: auto !important;overflow: auto !important;}\
							.dropdown-menu {position: absolute !important;}\
							.row:has(>.pagingBlock) {position: fixed;bottom: 20px;box-shadow: 2px 3px 6px 0px #0000007a;}\
							div#advSearchBox_usersList {min-width: 800px;min-height: 522px;}\
							th {align-content: baseline;}\
							.portlet {margin-bottom: 0;}\
							");
			document.querySelector("#usersList > thead > tr > th.th_5.sorting_disabled.center").textContent = 'Display Name (Username)';
			if (window.location.href.includes("ECM/workflowmanagement/pendingtasklist")) {
				// --pending tasks-- --pt--
				document.title = "⏱ Pending Tasks";
				GM_addStyle(`td:nth-child(4) {text-wrap: nowrap !important;}
								td:nth-child(5), td:nth-child(6), td:nth-child(7), td:nth-child(8), td:nth-child(9), td:nth-child(10), td:nth-child(12) {text-wrap: nowrap !important;}
								td:nth-child(7) {max-width: 200px;overflow-wrap: break-word !important;text-wrap: balance !important;min-width: 150px;}
								.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
								.slimScrollDivH { overflow: auto; height: calc(100vh - 230px); }
								.datatable-scroll { height: 100%; overflow: auto; }
								table#usersList { height: auto; overflow: auto; }
								thead { top: 0px; position: sticky; z-index: 2; }
								#usersList td:nth-child(3), #usersList th:nth-child(3) { position: sticky; left: 0px; z-index: 1; }
								#usersList td:nth-child(14), #usersList th:nth-child(14) { position: sticky; right: 0px; z-index: 1; }
								#usersList th {overflow-wrap: nowrap;text-wrap: nowrap !important;align-content: center;}
								#usersList td:nth-child(6), #usersList td:nth-child(8), #usersList td:nth-child(9) {cursor: pointer;}
								`);
				// add select all checkbox
				const checkAllHeader = document.querySelector("th:nth-child(1)");
				const checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkAllHeader.appendChild(checkbox);
				checkbox.addEventListener("click", () => {
					const checkboxes = document.getElementById("usersList").querySelector("tbody").querySelectorAll("input[type='checkbox']");
					checkboxes.forEach(checkbox => {
						checkbox.click();
					});
				})
			} else if (window.location.href.includes("ECM/workflowmanagement/completetasklist")) {
				// --Completed Tasks-- --ct--
				document.title = "✔ Completed Tasks";
				document.querySelector("#usersList > thead > tr > th.th_4.sorting_disabled.center").textContent = 'Display Name (Username)';
				document.querySelector("#usersList > thead > tr > th.th_5.sorting_disabled.center").textContent = 'Account Name';
				GM_addStyle(`td:nth-child(3) {text-wrap: nowrap !important;}
								td:nth-child(5), td:nth-child(6), td:nth-child(7), td:nth-child(8), td:nth-child(11), td:nth-child(14) {text-wrap: nowrap !important;}
								td:nth-child(9) {min-width: 200px !important;}
								td:nth-child(6) {max-width: 200px;overflow-wrap: break-word !important;text-wrap: balance !important;min-width: 150px;}
								.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
								.slimScrollDivH { overflow: auto; height: calc(100vh - 230px); }
								.datatable-scroll { height: 100%; overflow: auto; }
								table#usersList { height: auto; overflow: auto; }
								thead { top: 0px; position: sticky; z-index: 2; }
								#usersList td:nth-child(2), #usersList th:nth-child(2) { position: sticky; left: 0px; z-index: 1; }
								#usersList td:nth-child(13), #usersList th:nth-child(13) { position: sticky; right: 0px; z-index: 1; }
								#usersList th {overflow-wrap: nowrap;text-wrap: nowrap !important;align-content: center;}
								#usersList td:nth-child(5), #usersList td:nth-child(7), #usersList td:nth-child(8) {cursor: pointer;}
								`);
			}

			const tasksObserver = new MutationObserver((mutations) => {
				mutations.forEach(mutation => {
					mutation.addedNodes.forEach(node => {
						// console.log(node);
						if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TBODY') {
							formatCells();

							const tasksTable = document.querySelector('#usersList');
							if (tasksTable && !tasksTable.classList.contains('listener-added-table')) {
								console.log("making links");
								makeLinksJs("#usersList");
								tasksTable.classList.add('listener-added-table');
							}
						}
					});
				});
			});
			tasksObserver.observe(document, { childList: true, subtree: true });

		} else if (window.location.href.includes("ECM/jobcontrol/runningjobs")) {
			document.title = ">> 🟢 Running Jobs >>";
			GM_addStyle(`.page-content.remove-leftmargin { min-height: unset !important; }
							`);
			// setInterval(function () {
			// 	showJobDurations('table#runningjobs', 'td:nth-child(3)', null, 'td:nth-child(4)', -5.5);
			// 	formatCells();
			// }, 1000);

			const ganttChartHeader = document.createElement('div');
			ganttChartHeader.id = 'ganttChartHeader';

			ganttChartHeader.innerHTML = `
												<div style="display: flex; justify-content: space-between;">
													<h3 style="text-align: center;">Job History</h3>
													<div style="display: flex; align-items: center; margin-right: 10px; gap: 10px;">
														<label for="show-only-failed-jobs">View Failed Jobs Only:</label>
														<input type="checkbox" id="show-only-failed-jobs" style="margin: 0;">
														<label for="alternate-gantt-view">Alternate View:</label>
														<input type="checkbox" id="alternate-gantt-view" style="margin: 0;" checked>
														<label for="timeRangeInput" style="margin-right: 5px;">Time Range:</label>
														<input type="number" id="timeRangeInput" value="2" min="1" max="365" style="border: none; outline: 1px dashed; width: 50px; text-align: end;">
													</div>
												</div>
												`;
			ganttChartContainer.insertBefore(ganttChartHeader, ganttChartContainer.firstChild);
			const mainGanttDiv = document.createElement('div');
			mainGanttDiv.id = 'mainGanttDiv';
			ganttChartContainer.appendChild(mainGanttDiv);
			const altGanttDiv = document.createElement('div');
			altGanttDiv.id = 'altGanttDiv';
			ganttChartContainer.appendChild(altGanttDiv);
			const ganttErrorDiv = document.createElement('div');
			ganttErrorDiv.id = 'ganttErrorDiv';
			ganttChartContainer.appendChild(ganttErrorDiv);

			/* create job filter */
			const JOB_NAMES = [
				"ApplicationDataImportJob",
				"ArchiveJob",
				"AsyncRequestRetryJob",
				"AttestationexpiredJob",
				"BaseLineApplicationJob",
				"CampaignReassignJob",
				"CampaignReminderJob",
				"CampaignScheduleJob",
				"CustomQueryV2Job",
				"DetectiveProvisioningRulesJob",
				"EmailHistoryJob",
				"ExternalJarJob",
				"IncomingMailARSJob",
				"JBPMRetryJob",
				"JobHistoryArchivalJob",
				"LaunchCertificationFromRuleJob",
				"RefreshJob",
				"RetroFitJob",
				"RoleAccessMismatchJob",
				"RunAllAnalyticsJob",
				"SchemaUserJob",
				"TestConnectionsJob",
				"TriggerChainJob",
				"UserImportJob",
				"UserLoginAuditTrailArchivalJob",
				"WSRetryJob"
			];
			const jobFilterDiv = document.createElement('div');
			jobFilterDiv.style = "display:flex; flex-wrap:wrap; gap:10px; margin-top:10px; max-height:120px; overflow:auto; border:1px dashed; padding:8px;";
			JOB_NAMES.forEach(job => {
				const label = document.createElement('label');
				label.style = "display:flex; align-items:center; gap:4px; font-size:12px;";

				const checkbox = document.createElement('input');
				checkbox.type = "checkbox";
				checkbox.value = job;
				checkbox.checked = ["ApplicationDataImportJob", "UserImportJob"].includes(job);

				label.appendChild(checkbox);
				label.appendChild(document.createTextNode(job));
				jobFilterDiv.appendChild(label);
			});
			ganttChartHeader.appendChild(jobFilterDiv);

			// Gantt Chart Objects
			let mainGanttChart;
			let altGanttChart;

			const timeRangeInput = document.getElementById('timeRangeInput');
			timeRangeInput.addEventListener('keydown', function (event) {
				if (event.key === 'Enter') {
					showGantt(timeRangeInput.value);
				}
			});

			const alternateGanttViewCheckbox = document.getElementById('alternate-gantt-view');
			alternateGanttViewCheckbox.addEventListener('change', function () {
				showGantt(timeRangeInput.value);
			});

			const showOnlyFailedJobsCheckbox = document.getElementById('show-only-failed-jobs');
			showOnlyFailedJobsCheckbox.addEventListener('change', function () {
				showGantt(timeRangeInput.value);
			});

			jobFilterDiv.addEventListener('change', function (e) {
				if (e.target && e.target.type === 'checkbox') {
					showGantt(timeRangeInput.value);
				}
			});

			function showGantt(daysInterval = 2) {

				/* get selected jobs */
				const selectedJobs = Array.from(
					document.querySelectorAll('#ganttChartHeader input[type="checkbox"]')
				)
					.filter(cb => cb.checked && JOB_NAMES.includes(cb.value))
					.map(cb => `'${cb.value}'`);

				let jobFilterClause = selectedJobs.length
					? `AND JOBNAME in (${selectedJobs.join(",")})`
					: ``; // if nothing selected, return all jobs

				runQuery(`select
								groupname,
								group_concat(data) as data
							from
								(
									SELECT
										jobname as groupname,
										concat(
											'{*l*: *',
											triggername,
											'*,*d*: [',
											group_concat(
												concat(
													'{*t*: [*',
													DATE_FORMAT(JOBSTARTDATE, '%m-%d-%y %H:%i:%s'),
													'*,*',
													DATE_FORMAT(JOBENDDATE, '%m-%d-%y %H:%i:%s'),
													'*],*v*: *',
													CASE
														WHEN SAVRESPONSE = 'SUCCESS' THEN 'SUCCESS'
														ELSE 'FAIL'
													END,
													'*}'
												)
												order by
													jobid desc
											),
											']}'
										) as data
									from
										ECMIMPORTJOB
									where
										TRIGGERNAME IS NOT NULL
										AND TRIGGERNAME != ''
										${jobFilterClause}
										AND JOBSTARTDATE > NOW() - INTERVAL ${daysInterval} DAY
										${showOnlyFailedJobsCheckbox.checked ? 'AND (SAVRESPONSE != "SUCCESS" or SAVRESPONSE IS NULL)' : ''}
									group by
										TRIGGERNAME
									order by
										jobid desc
								) t
							group by
								groupname
							`).then(data => {
					// console.log(data);


					// ganttDataUnprocessed will be 'almost' ready, i.e. the keys are all caps GROUP, LABEL, TIMERANEGE, VAL, DATA, and timestamps are just strings
					const ganttData = [];
					data.forEach(GROUP => {
						// console.log("GROUP");
						// console.log(GROUP);
						// console.log("GROUP.GROUPNAME");
						// console.log(GROUP.GROUPNAME);
						const triggersDataAlmostJsonString = `[${GROUP.DATA}]`.replaceAll('*l*', '"LABEL"').replaceAll('*d*', '"DATA"').replaceAll('*t*', '"TIMERANGE"').replaceAll('*v*', '"VAL"').replaceAll('*', '"');
						// console.log("triggersDataAlmostJsonString: ", triggersDataAlmostJsonString);
						// should look like this, but can be very long and get trimmed by server due to how Saviynt limits length per cell:
						// [{"LABEL": "DefaultDetectiveExternalClassificationRulesTrigger","DATA": [{"TIMERANGE": ["12-13-25 01:00:00","12-13-25 01:00:01"],"VAL": 1}]}]
						// fails parsing as data analyzer has limit per cell, so needs to be trimmed after last comma

						let DATA;
						try {
							DATA = JSON.parse(triggersDataAlmostJsonString);
						} catch (error) {
							console.error("unable to parse as json, trying to trim last comma");
							// console.log(triggersDataAlmostJsonString);
							// remove everything after last comma, including the comma, then append closing brackets
							const trimmedTriggersDataAlmostJsonString = triggersDataAlmostJsonString.substring(0, triggersDataAlmostJsonString.lastIndexOf('},')) + '}]}]';

							// console.log("trimmedTriggersDataAlmostJsonString");
							// console.log(trimmedTriggersDataAlmostJsonString);

							// console.log("trimmedTriggersDataAlmostJsonString: ", trimmedTriggersDataAlmostJsonString);
							DATA = JSON.parse(trimmedTriggersDataAlmostJsonString);
						}
						// console.log(DATA);
						GROUP.DATA = DATA;
						// console.log(GROUP);

						ganttData.push(GROUP);
					})

					// console.log(ganttDataUnprocessed);

					// data for vis-timeline (https://visjs.github.io/vis-timeline/docs/timeline/)
					const items = [];
					const itemStyle = "font-size: 10px; padding: 0 !important; border: none !important;";
					const groups = [];
					const groupStyle = "font-size: 11px; padding: 0 !important; border: none !important;";

					// convert jobData to gantt chart data format i.e. make all keys lowercase and convert the strings to Date objects in the TIMERANGE key
					//  GROUP becomes group
					//  LABEL becomes label
					//  TIMERANGE becomes timeRange // if endtime is null or same as starttime, set it as starttime + 1 sec
					//  VAL becomes val
					//  DATA becomes data
					ganttData.forEach(GROUP_OBJECT => {
						GROUP_OBJECT.group = GROUP_OBJECT.GROUPNAME;
						delete GROUP_OBJECT.GROUPNAME;
						GROUP_OBJECT.data = GROUP_OBJECT.DATA;
						delete GROUP_OBJECT.DATA;

						const parentGroup = {
							id: GROUP_OBJECT.group,
							content: GROUP_OBJECT.group,
							nestedGroups: [],
							showNested: true,
							style: groupStyle,
						}

						GROUP_OBJECT.data.forEach(LABEL_OBJECT => {
							LABEL_OBJECT.label = LABEL_OBJECT.LABEL;
							delete LABEL_OBJECT.LABEL;
							LABEL_OBJECT.data = LABEL_OBJECT.DATA;
							delete LABEL_OBJECT.DATA;

							const group = {
								id: LABEL_OBJECT.label,
								content: LABEL_OBJECT.label,
								style: groupStyle,
							}
							groups.push(group);

							LABEL_OBJECT.data.forEach(TIMERANGE_OBJECT => {
								const startTime = new Date(TIMERANGE_OBJECT.TIMERANGE[0]);
								const endTime = new Date(TIMERANGE_OBJECT.TIMERANGE[1]);
								if (endTime.getTime() === startTime.getTime()) {
									endTime.setSeconds(startTime.getSeconds() + 1);
								}
								// convert to local times
								startTime.setMinutes(startTime.getMinutes() - startTime.getTimezoneOffset());
								endTime.setMinutes(endTime.getMinutes() - endTime.getTimezoneOffset());

								TIMERANGE_OBJECT.timeRange = [startTime, endTime];
								TIMERANGE_OBJECT.val = TIMERANGE_OBJECT.VAL;
								delete TIMERANGE_OBJECT.TIMERANGE;
								delete TIMERANGE_OBJECT.VAL;

								const item = {
									start: TIMERANGE_OBJECT.timeRange[0],
									end: TIMERANGE_OBJECT.timeRange[1],
									content: "",
									group: LABEL_OBJECT.label,
									style: `background-color: ${TIMERANGE_OBJECT.val.toUpperCase() === 'SUCCESS' ? 'green' : 'red'}; ${itemStyle}`,
								}
								items.push(item);
							})
							parentGroup.nestedGroups.push(LABEL_OBJECT.label);
						})
						groups.push(parentGroup);
					})
					// console.log(ganttData);

					// console.log("items");
					// console.log(items);
					// console.log("groups");
					// console.log(groups);

					if (alternateGanttViewCheckbox.checked) {
						altGanttDiv.style.display = 'block';
						mainGanttDiv.style.display = 'none';
						// RENDER CHART USING TIMELINES-CHART
						// Documentation: https://github.com/vasturiano/timelines-chart
						if (altGanttChart) {
							altGanttChart.data(ganttData);
							// altGanttChart.sortChrono(false);
							// altGanttChart.sortAlpha(true);
							altGanttChart.refresh();
						} else {
							altGanttDiv.innerHTML = '';
							altGanttChart = new TimelinesChart(altGanttDiv).data(ganttData);
							altGanttChart.maxHeight(10000);
							altGanttChart.leftMargin(200);
							altGanttChart.rightMargin(350);
							altGanttChart.maxLineHeight(12);
							// altGanttChart.sortChrono(false);
							// altGanttChart.sortAlpha(true);
							altGanttChart.minSegmentWidth(2);
							altGanttChart.zQualitative(true); // ordinal scale (SUCCESS / FAIL JOB) instead of quantitative (ie a continuous scale from 0 to 1)
							altGanttChart.refresh();
						}
					} else {
						altGanttDiv.style.display = 'none';
						mainGanttDiv.style.display = 'block';
						// RENDER CHART USING VIS-TIMELINE
						// Documentation: https://visjs.github.io/vis-timeline/docs/timeline/
						if (mainGanttChart) {
							mainGanttChart.setData({ items: items, groups: groups });
							mainGanttChart.redraw();
							mainGanttChart.fit();
						} else {
							const itemsDataset = new vis.DataSet();
							itemsDataset.add(items);
							const groupsDataset = new vis.DataSet();
							groupsDataset.add(groups);
							const options = {
								groupOrder: "content",
								stack: false,
								orientation: "both",
							};
							mainGanttChart = new vis.Timeline(mainGanttDiv, itemsDataset, groupsDataset, options);
						}
					}
				}).catch(err => {
					console.log(err);
					ganttErrorDiv.innerHTML = `<div style="color: red; font-weight: bold;">Error loading Gantt Chart: ${err}</div>`;
				});
			};
			showGantt();


		} else if (window.location.href.includes("ECM/jobcontrol/runningjobdetails")) {
			GM_addStyle("#runningjobdetails td:nth-child(1) {text-wrap-mode: nowrap;}\
							#runningjobdetails td:nth-child(2) {text-wrap-mode: wrap;}\
							");
		} else if (window.location.href.includes("ECM/flatViewJobcontrol/flatViewJobList")) {
			// -- jc-- --jobs--
			document.title = "== 🧰 Job Control ==";
			GM_addStyle(`.col-sm-3 {width: 15%;}
							.col-md-8 {width: 100% !important;}
							.col-md-4 {text-wrap: wrap;}
							td:nth-child(5), td:nth-child(7) {text-wrap-mode: nowrap;}
							.pull-right.btnArea {float: left !important;margin-top: 22px !important;}
							i#editIcon {width: 30px !important;align-self: flex-end;}
							small.popovers.trigger-Chain-warning {position: absolute;left: 113px;width: auto !important;}
							#blockingjobsdiv {margin: 0 15px !important;font-size: small;}
							div#flatViewJobControlDatatable_wrapper {border-radius: 10px !important;}
							label.control-label {padding-left: 0px;}
							.form-group:has(.checker) {flex-direction: row !important;justify-content: space-between !important;}
							.form-group:has(.checker)>* {flex-basis: fit-content;}
							.row:has(>.pagingBlock) {position: fixed;bottom: 20px;box-shadow: 2px 3px 6px 0px #0000007a; z-index: 2;}
							.pull-right.btnArea {margin-top: 19px !important;margin-left: -11px;}
							span.tooltips {top: -10px;position: relative;height: 0;}
							.btn.svicon {margin-top: -12px;}
							table#flatViewJobControlDatatable { height: auto; overflow: auto; }
							thead { top: -1px; position: sticky; z-index: 2; }
							.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
							.slimScrollDivH { overflow: auto; height: calc(100vh - 280px); }
							.datatable-scroll { height: 100%; overflow: auto; }
							thead { top: 0px; position: sticky; z-index: 2; }
							#flatViewJobControlDatatable td:nth-child(2), #flatViewJobControlDatatable th:nth-child(2) { position: sticky; left: 0px; z-index: 1; }
							#flatViewJobControlDatatable td:nth-child(9), #flatViewJobControlDatatable th:nth-child(9) { position: sticky; right: 0px; z-index: 1; border-left: 1px solid #dae0ef}
							#flatViewJobControlDatatable th {overflow-wrap: nowrap;text-wrap: nowrap !important;align-content: center;}
							td {text-wrap-mode: nowrap;}
							body .table tbody>tr>td {border-left: none; border-top: none;}
							body .table tbody>tr.odd>td {background-color: rgba(255, 255, 255);}
							div#runningJobsDiv { height: 23px; position: absolute; overflow: hidden; outline: 1px dashed #3751ff;  margin-top: 9px; background: #000000; color: white; border-radius: 5px !important; z-index: 10;}
							div#runningJobsDiv:hover { height: auto; transition: all 0.3s !important; overflow: auto; }
							.runningHeader { display: flex; }
							div.runningJobsBody { display: grid; grid-template-columns: auto auto auto auto; font-size: 14px; padding: 0 5px; gap: 0 10px;}
							.scheduleDiv, .jobDurationDiv { place-self: end; }
							.runningHeader { padding: 0 5px; }
							.loadingCirleDiv { margin-left: 0; max-height: 11px !important; overflow: hidden; top: -3px; padding: 0 14px; margin-top: 5px; }
							.loader { width: 120px; height: 20px; transform: skewX(-45deg); background: linear-gradient(#f03355 0 0) left -30px top 0/30px 20px no-repeat #ccc; animation: l3 1s infinite linear; } @keyframes l3 { 100% {background-position: right -30px top 0} }
							#pageLayout > div > div:nth-child(4) { margin-top: 17px; }
							#pageLayout > main > div > div:nth-child(4) { margin-top: 17px; }
							.dashboard-stat .details { width: 100% !important; }
							`);

			extendDataTables(document.querySelector('#flatViewJobControlDatatable'))

			const observer = new MutationObserver((mutations) => {
				mutations.forEach(mutation => {
					// console.log(mutation);
					mutation.addedNodes.forEach(node => {

						if (node.nodeName === 'TR') {
							// console.log("modifying cron expression");
							const cells = node.querySelectorAll('td');
							cells.forEach(function (cell) {
								var cellText = cell.textContent.trim();
								if (cellText.match(/only in 2.99$/) || cellText.match(/, 2.99 /)) {
									cell.textContent = '- - -';
								}
							});
						}
					});
				});
			});
			observer.observe(document.querySelector('#flatViewJobControlDatatable'), {
				childList: true,
				subtree: true
			});

			async function getRunningJobs() {
				const response = await fetch("/ECM/jobcontrol/runningjobsjson", {
					headers: {
						"accept": "application/json, text/javascript, */*; q=0.01",
						"accept-language": "en-US,en;q=0.9",
						"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
						"x-requested-with": "XMLHttpRequest"
					},
					"body": "sEcho=19&iColumns=3&sColumns=&iDisplayStart=0&iDisplayLength=100&mDataProp_0=triggername&mDataProp_1=jobname&mDataProp_2=schedule&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&iSortCol_0=2&sSortDir_0=desc&iSortingCols=1&bSortable_0=false&bSortable_1=false&bSortable_2=true&jsontype=datatable",
					"method": "POST",
					"mode": "cors",
					"credentials": "include"
				});

				const result = await response.json();
				// sample response from API:

				// {
				//   "iTotalRecords": 1,
				//   "iTotalDisplayRecords": 1,
				//   "results": [
				//     {
				//       "triggername": "<a href=\"/ECM/jobcontrol/runningjobdetails/MT_4sfsti7or2e17%23MANUAL_TRIGGER\">MT_4sfsti7or2e17<\u002fa>",
				//       "jobname": "User Import via a Connection (UserImportJob)",
				//       "schedule": "Dec 11, 2025 11:39:18 AM"
				//     }
				//   ]
				// }

				return result?.results;
			}

			// create a div after this element : document.querySelector("#pageLayout > div > div:nth-child(2)")
			const runningJobsDiv = document.createElement("div");
			runningJobsDiv.id = "runningJobsDiv";
			let targetElement = document.querySelector("#pageLayout > div > div:nth-child(2)")
			if (!targetElement) {
				targetElement = document.querySelector("#pageLayout > main > div > div:nth-child(2)")
			}

			if (targetElement) {
				targetElement.insertAdjacentElement("afterend", runningJobsDiv);
			}

			const runningHeader = document.createElement("div");
			runningHeader.className = "runningHeader";
			const runningJobsTitle = document.createElement("div");
			runningJobsTitle.className = "runningJobsTitle";
			runningJobsTitle.textContent = "Running Jobs";
			runningHeader.appendChild(runningJobsTitle);
			runningJobsDiv.appendChild(runningHeader);

			const loadingCirleDiv = document.createElement("div");
			loadingCirleDiv.className = "loadingCirleDiv";
			loadingCirleDiv.innerHTML = '<div class="loader"></div>';
			runningHeader.appendChild(loadingCirleDiv);

			var runningJobsBody = document.createElement("div");
			runningJobsBody.className = "runningJobsBody";
			runningJobsDiv.appendChild(runningJobsBody);


			async function showRunningJobs() {
				// exit early if tab not active
				if (document.visibilityState !== 'visible') return;

				const runningJobs = await getRunningJobs();

				if (runningJobs) {
					runningJobsTitle.textContent = "Running Jobs (" + runningJobs.length + ")";

					if (runningJobs.length === 0) {
						// hide loading circle
						loadingCirleDiv.style.display = "none";
					} else {
						// show loading circle
						loadingCirleDiv.style.display = "block";
					}

					// add new jobs to the runningJobsBody
					for (const job of runningJobs) {
						// sample triggername:
						// "triggername":"<a href=\"/ECM/jobcontrol/runningjobdetails/MT_4nn8utpe8b7kf%23MANUAL_TRIGGER\">MT_4nn8utpe8b7kf<\u002fa>"

						const tempTriggerDiv = document.createElement("div");
						tempTriggerDiv.innerHTML = job.triggername;

						// check if there's already a triggerDiv element with the same href (baseUrl removed), if so, skip
						const existingTriggerDiv = document.querySelector(`.triggerDiv a[href*="${tempTriggerDiv.querySelector('a').href.replace(baseUrl, '')}"]`);
						if (existingTriggerDiv) {
							continue;
						}

						const triggerDiv = document.createElement("div");
						triggerDiv.className = "triggerDiv";
						triggerDiv.innerHTML = job.triggername;
						runningJobsBody.appendChild(triggerDiv);
						const jobDiv = document.createElement("div");
						jobDiv.className = "jobDiv";
						jobDiv.innerHTML = job.jobname;
						runningJobsBody.appendChild(jobDiv);

						const jobStartTime = document.createElement("div");
						jobStartTime.className = "jobStartTimeDiv";
						// job.schedule is in UTC , converting to local time, format as Jan 31, 12:00:00 AM
						const date = new Date(job.schedule);
						const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
						// Save original UTC time for calculations
						// job.schedule is a UTC timestamp string → convert to UTC milliseconds
						const utcStartMs = new Date(job.schedule).getTime();
						jobStartTime.setAttribute("data-utc-ms", utcStartMs);
						jobStartTime.innerHTML = localDate.toLocaleString(
							'en-US',
							{ month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }
						);
						runningJobsBody.appendChild(jobStartTime);

						const jobDurationDiv = document.createElement("div");
						jobDurationDiv.className = "jobDurationDiv";
						runningJobsBody.appendChild(jobDurationDiv);


					}

					// remove jobs from the body if no longer running
					for (const triggerDiv of document.querySelectorAll(".triggerDiv")) {
						const href = triggerDiv.querySelector('a').href;
						if (!runningJobs.some(job => job.triggername.includes(href.replace(baseUrl, '')))) {
							triggerDiv.nextElementSibling.remove();
							triggerDiv.nextElementSibling.remove();
							triggerDiv.nextElementSibling.remove();
							triggerDiv.remove();
						}
					}

				} else {
					runningJobsBody.innerHTML = "Error Fetching Running Jobs";
				}
			};
			setInterval(() => {
				showRunningJobs();
			}, 3000);

			function startDurationUpdater() {
				function pad(n, size = 2) {
					return String(n).padStart(size, '0');
				}

				function formatDuration(ms) {
					const total = Math.floor(ms / 1000);
					const h = Math.floor(total / 3600);
					const m = Math.floor((total % 3600) / 60);
					const s = total % 60;

					return `(${pad(h)}:${pad(m)}:${pad(s)})`;
				}

				setInterval(() => {
					const durationDivs = document.querySelectorAll(".jobDurationDiv");

					durationDivs.forEach(div => {
						const startDiv = div.previousElementSibling;
						if (!startDiv) return;

						const startUtcMs = Number(startDiv.getAttribute("data-utc-ms"));
						if (!startUtcMs) return;

						// CURRENT TIME IN UTC
						const nowUtcMs = Date.now() + (new Date().getTimezoneOffset() * 60 * 1000);

						const diff = nowUtcMs - startUtcMs;
						div.textContent = formatDuration(diff);
					});
				}, 1000);
			}

			startDurationUpdater();

		} else if (window.location.href.includes("ECM/jobcontrol/jobhistorydetail")) {
			// --jhd--
			// add checkbox for auto-reload functionality
			const autoReloadCheckbox = document.createElement('input');
			autoReloadCheckbox.type = 'checkbox';
			autoReloadCheckbox.id = 'autoReloadCheckbox';
			autoReloadCheckbox.checked = true;
			const autoReloadLabel = document.createElement('label');
			autoReloadLabel.htmlFor = 'autoReloadCheckbox';
			autoReloadLabel.textContent = 'Auto-Reload';
			customButtonDiv.appendChild(autoReloadCheckbox);
			customButtonDiv.appendChild(autoReloadLabel);

			GM_addStyle(`.text-right {text-align: left !important;padding: 15px 0 !important;}
							.modal-body td:nth-child(1) {min-width: 230px;}
							#pageLayout > div > div:nth-child(2) { margin-left: 0px !important; padding-top: 0px !important; margin-top: 10px; }
							#pageLayout > div > div:nth-child(3) { margin-left: 0px; margin-top: 5px; }
							.form-group {display: flex !important;flex-direction: row;flex-wrap: nowrap;max-width: 400px !important;gap: 5px !important;}
							.col-sm-3 {width: 33% !important;max-width: 400px !important;}
							.text-right {padding: 5px 0 !important;}
							.row:has(>.pagingBlock) {position: fixed;bottom: 20px;box-shadow: 2px 3px 6px 0px #0000007a;}
							.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
							.slimScrollDivH { overflow: auto; height: calc(100vh - 360px); }
							.datatable-scroll { height: 100%; overflow: auto; }
							table#usersList { height: auto; overflow: auto; }
							thead { top: 0px; position: sticky; z-index: 2; }
							#usersList td:first-child, #usersList th:first-child { position: sticky; left: 0px; z-index: 1; }
							#usersList th {overflow-wrap: nowrap;text-wrap: nowrap !important;align-content: center;}
							.form-group.col-sm-3.custom_col { margin-right: 10px; }
							.row.top-spacing .col-sm-3 { padding: 0px !important; margin-right: 10px; }
							#jobhistorydetail td:nth-child(4), #jobhistorydetail td:nth-child(5) { cursor: pointer; }
							`);

			const pageTitleElement = document.querySelector("#s2id_trigger > a > span.select2-chosen");
			if (pageTitleElement && pageTitleElement.textContent) {
				if (!pageTitleElement.textContent.includes('Select')) {
					document.title = "🧰 " + pageTitleElement.textContent;
				}
			}

			const connectionMap = new Map();
			function getConnectionList() {
				fetch(`${baseUrl}/ECM/ecmConfig/externalconnectionlistjson`, {
					"headers": {
						"accept": "application/json, text/javascript, */*; q=0.01",
						"accept-language": "en-US,en;q=0.9,pt;q=0.8",
						"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
						"priority": "u=1, i",
						"sec-ch-ua-mobile": "?0",
						"sec-fetch-dest": "empty",
						"sec-fetch-mode": "cors",
						"sec-fetch-site": "same-origin"
					},
					"body": "sEcho=3&iColumns=7&sColumns=&iDisplayStart=0&iDisplayLength=100&mDataProp_0=chkbx&mDataProp_1=connectionname&mDataProp_2=connectiontype&mDataProp_3=connectiondescription&mDataProp_4=statusForEnableDisable&mDataProp_5=status&mDataProp_6=action&sSearch=&bRegex=false&sSearch_0=&bRegex_0=false&bSearchable_0=true&sSearch_1=&bRegex_1=false&bSearchable_1=true&sSearch_2=&bRegex_2=false&bSearchable_2=true&sSearch_3=&bRegex_3=false&bSearchable_3=true&sSearch_4=&bRegex_4=false&bSearchable_4=true&sSearch_5=&bRegex_5=false&bSearchable_5=true&sSearch_6=&bRegex_6=false&bSearchable_6=true&iSortCol_0=0&sSortDir_0=asc&iSortingCols=1&bSortable_0=false&bSortable_1=true&bSortable_2=true&bSortable_3=true&bSortable_4=true&bSortable_5=true&bSortable_6=false&controller=ecmConfig&action=externalconfig&actionType=Show&objectKey=Connection+List&jsontype=datatable",
					"method": "POST",
					"mode": "cors",
					"credentials": "include"
				}).then(response => response.json())
					.then(data => {
						const connectionsArray = data.results;
						// console.log("connectionsArray");
						// console.log(connectionsArray);
						for (let i = 0; i < connectionsArray.length; i++) {
							// each item in arrray contains :
							// connectionname : "<a href=\"/ECM/ecmConfig/addnewconnection/24\">Active Directory</a>"
							// extract a map of connectionname -> connectionid by parsing as HTML node and then extracting the text as connection name and connection id fromt the href
							const tempDiv = document.createElement('div');
							tempDiv.innerHTML = connectionsArray[i].connectionname;
							const connectionName = tempDiv.querySelector('a').textContent;
							const connectionId = tempDiv.querySelector('a').href.split('/').pop();
							connectionMap.set(connectionName, connectionId);
						}
						// console.log(connectionMap);
						// console.log(connectionMap.get("SAP LDS"));
					});
			}
			getConnectionList();

			// Function to check if the table has fully loaded its content
			function checkTableLoaded(table) {
				// Check if the table has rows and cells
				const rows = table.querySelectorAll('tbody tr');
				if (rows.length > 0 && Array.from(rows).every(row => row.cells.length > 0 && row.cells[0].textContent.trim() !== '')) {
					return true;
				}
				return false;
			}

			// INTERVALS

			setInterval(function () {
				// exit early if tab not active
				if (document.visibilityState !== 'visible') return;
				const autoReloadCheckbox = document.querySelector('#autoReloadCheckbox');
				if (autoReloadCheckbox && autoReloadCheckbox.checked) {
					extendDataTables(document.querySelector('table'));
				}
			}, 9900);

			setInterval(function () {
				// exit early if tab not active
				if (document.visibilityState !== 'visible') return;
				showJobDurations();
			}, 1000);


			// add median duration column to #jobhistorydetail table's header row
			const medianDurationHeaderCell = document.querySelector("#jobhistorydetail th.median-duration");
			if (!medianDurationHeaderCell) {
				const medianDurationCell = document.createElement('th');
				medianDurationCell.className = 'median-duration';
				medianDurationCell.textContent = 'Median Duration';
				const medianDurationHeaderRow = document.querySelector("#jobhistorydetail thead tr");
				medianDurationHeaderRow.appendChild(medianDurationCell);
			}

			// Observe for dynamic content updates
			const jobDetailsObserver = new MutationObserver((mutations) => {
				mutations.forEach(mutation => {
					mutation.addedNodes.forEach(node => {
						// console.log(node);
						if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TBODY') {
							formatCells();
							showJobDurations();

							const jobhistorydetailTable = document.getElementById('jobhistorydetail');
							if (jobhistorydetailTable && !jobhistorydetailTable.classList.contains('listener-added-table')) {
								makeLinksJs('#jobhistorydetail', connectionMap);
								jobhistorydetailTable.classList.add('listener-added-table');
							}
						}
						// highlight status in trigger chain job details
						if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('modal-body')) {
							formatCells();
							const cells = document.querySelectorAll('.table-hover td:nth-child(2)')
							cells.forEach(cell => {
								cell.innerHTML = cell.innerHTML.replaceAll('##', '<BR>')
							})
						}
					});
				});
			});
			jobDetailsObserver.observe(document.body, { childList: true, subtree: true });
		} else if (window.location.href.includes("ECM/jobcontrol/joblog")) {
			GM_addStyle("td:nth-child(1) {text-wrap: nowrap;}\
							td:nth-child(2) {min-width: 200px !important;text-wrap: pretty !important;}\
							");
		} else if (window.location.href.includes("ECM/hanaRule/technicalrulelist") || window.location.href.includes("ECM/hanaRule/updateuserrulelist")) {

			dataTables?.forEach(table => {
				extendDataTables(table);
			});

			// --rules-- --uur-- --tr--
			GM_addStyle(`.svicon2-enable, .svicon2-disable {margin: 2px !important;}
					td:nth-child(3) {line-height: normal !important;}
					td.sorting_1 {min-width: 200px;}
					.mediumseagreen-span {color: mediumseagreen; font-weight: bold;}
					.dodgerblue-span {color: dodgerblue; font-weight: bold;}
					.darkviolet-span {color: darkviolet; font-weight: bold;}
					.crimson-span {color: crimson; font-weight: bold;}
					.row:has(>.pagingBlock) {position: fixed;bottom: 20px;box-shadow: 2px 3px 6px 0px #0000007a;}
					.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
					.slimScrollDivH { overflow: auto; height: calc(100vh - 200px); }
					.datatable-scroll { height: 100%; overflow: auto; }
					table#hanarulelistupdateUser { height: auto; overflow: auto; }
					thead { top: 0px; position: sticky; z-index: 2; }
					#hanarulelistupdateUser td:first-child, #hanarulelistupdateUser th:first-child { position: sticky; left: 0px; z-index: 1; }
					#hanarulelistupdateUser th {overflow-wrap: nowrap;text-wrap: nowrap !important;align-content: center;}
					`);
			function highlightRules() {
				if (window.location.href.includes("ECM/hanaRule/updateuserrulelist")) {
					const spans = document.querySelectorAll('td:nth-child(3)>span');
					spans.forEach(function (span) {
						if (span.textContent.includes('Enable')) {
							span.style.color = 'mediumseagreen';
						} else if (span.textContent.includes('Disable') || span.textContent.includes('Deprovision') || span.textContent.includes('Remove')) {
							span.style.color = 'red';
						} else if (span.textContent.includes('Update Login')) {
							span.style.color = 'white';
							span.style.backgroundColor = 'dodgerblue';
							span.style.padding = '0 2px';
							span.style.margin = '0 1px';
						} else if (span.textContent.includes('Update User')) {
							span.style.color = 'white';
							span.style.backgroundColor = 'dodgerblue';
							span.style.padding = '0 2px';
							span.style.margin = '0 1px';
						} else if (span.textContent.includes('Update')) {
							span.style.color = 'dodgerblue';
						} else if (span.textContent.includes('Technical')) {
							span.style.color = 'fuchsia';
						} else if (span.textContent.includes('Provisioning rule')) {
							span.style.color = 'fuchsia';
						} else if (span.textContent.includes('Certification')) {
							span.style.color = 'darkorange';
							span.style.fontWeight = 'bold';
						} else if (span.textContent.includes('Generate')) {
							span.style.color = 'white';
							span.style.backgroundColor = 'mediumseagreen';
							span.style.padding = '0 2px';
							span.style.margin = '0 1px';
						} else if (span.textContent.includes('Password')) {
							span.style.color = 'white';
							span.style.backgroundColor = 'darkorange';
							span.style.padding = '0 2px';
							span.style.margin = '0 1px';
						} else if (span.textContent.includes('Notify')) {
							span.style.color = 'black';
							span.style.backgroundColor = 'yellow';
							span.style.padding = '0 2px';
							span.style.margin = '0 1px';
						} else {
							span.style.color = 'black';
						}
					})
				}
				if (window.location.href.includes("ECM/hanaRule/technicalrulelist")) {
					console.log("highlighting technical rules");

					const spans = document.querySelectorAll('td:nth-child(3)>span');
					spans.forEach(function (span) {
						span.style.color = 'black';
					})
					const tds = document.querySelectorAll("td:nth-child(3)");
					tds.forEach(function (td) {
						if (td.textContent.includes("Create Account")) {
							td.innerHTML = td.innerHTML.replaceAll("Create Account", "<span class='mediumseagreen-span'>Create Account</span>");
						}
						if (td.textContent.includes("Assign ROLE")) {
							td.innerHTML = td.innerHTML.replaceAll("Assign ROLE", "<span class='dodgerblue-span'>Assign ROLE</span>");
						}
						if (td.textContent.includes("Assign Groups")) {
							td.innerHTML = td.innerHTML.replaceAll("Assign Groups", "<span class='darkviolet-span'>Assign Groups</span>");
						}
						if (td.textContent.includes("Assign SAVRoles")) {
							td.innerHTML = td.innerHTML.replaceAll("Assign SAVRoles", "<span class='crimson-span'>Assign SAVRoles</span>");
						}
					})
				}
			}

			// Function to update edit links so they open in new tabs
			function updateEditLinks() {
				const elements = document.querySelectorAll('[data-original-title="Edit"]');
				elements.forEach(function (element) {
					const anchor = element.closest('a');
					if (anchor) {
						const onclickAttr = anchor.getAttribute('onclick');
						if (onclickAttr && onclickAttr.includes('window.location.replace')) {
							const urlMatch = onclickAttr.match(/window\.location\.replace\('([^']+)'\)/);
							if (urlMatch && urlMatch[1]) {
								const url = urlMatch[1];
								anchor.onclick = function (event) {
									event.preventDefault();
									window.open(url, '_blank');
								};
							}
						}
					}
				});
			}
			// Observe for dynamic content updates
			const rulesObserver = new MutationObserver((mutations) => {
				mutations.forEach(mutation => {
					mutation.addedNodes.forEach(node => {
						// console.log(node);
						if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TBODY') {
							updateEditLinks();
							highlightRules();

							const userUpdateRulesTable = document.getElementById('hanarulelistupdateUser');
							if (userUpdateRulesTable) {
								// add new column to show rule's trigger source
								if (!document.getElementById('triggerSourceColumn')) {
									const triggerSourceColumn = document.createElement('th');
									triggerSourceColumn.id = 'triggerSourceColumn';
									triggerSourceColumn.textContent = 'Trigger Source';
									userUpdateRulesTable.querySelector('thead').querySelector('tr').appendChild(triggerSourceColumn);


								}
								if (document.getElementById('triggerSourceColumn')) {
									// add cells
									userUpdateRulesTable.querySelectorAll('tbody tr').forEach(row => {
										const triggerSourceCell = document.createElement('td');
										triggerSourceCell.classList.add('triggerSourceCell');
										row.appendChild(triggerSourceCell);
									})
								}

								// get all rule names from second column of the table and store in an array
								const ruleNames = [];
								userUpdateRulesTable.querySelectorAll('tbody tr').forEach(row => {
									const ruleName = row.querySelector('td:nth-child(2)').textContent;
									ruleNames.push(ruleName);
								});
								// convert the array to a string like SQL in query
								const ruleNamesString = ruleNames.map(name => `'${name}'`).join(', ');
								runQuery(`select NAME, case when hr.eventsource=2 then 'Create from Import' when hr.eventsource=4 then 'Update from UI' when hr.eventsource=5 then 'Update from Import' when hr.eventsource=6 then 'Update from API' else hr.eventsource end as eventsource from hanarule hr where name in (${ruleNamesString})`).then(data => {
									// console.log(data);
									// sample: [ { "NAME": "AP_DeleteAccount_Testing", "EVENTSOURCE": "Update from UI" }, { "NAME": "ChangePassword-NotifyManager", "EVENTSOURCE": "Update from Import" }]
									userUpdateRulesTable.querySelectorAll('tbody tr').forEach(row => {
										const ruleName = row.querySelector('td:nth-child(2)').textContent;
										const ruleData = data.find(item => item.NAME === ruleName);
										if (ruleData) {
											const triggerSource = ruleData.EVENTSOURCE;
											row.querySelector('.triggerSourceCell').textContent = triggerSource;
										}
									});
								});
							}
						}
					});
				});
			});
			rulesObserver.observe(document.body, { childList: true, subtree: true });

		} else if (window.location.href.includes("ECM/hanaRule/technicalRuleEdit")) {
			GM_addStyle(`.select2-container .select2-choice {max-width: fit-content !important;}
							ul.ui-tabs-nav.ui-helper-reset.ui-helper-clearfix.ui-widget-header.ui-corner-all {margin: 5px 16px;}
							#CONDTABLE td, #ACTIONTABLE td { padding: 0px !important; }
							.select2-choice.select2-choice.select2-choice.select2-choice { max-width: unset !important; border-radius: 0 !important; border: none !important; }
							body .table { border-collapse: collapse !important; }
							#CONDTABLE, #ACTIONTABLE, #myDataTableRuleowner {min-width: 100%;}
							#CONDTABLE .form-control { width: 100% !important; }
							#myDataTableRuleowner_wrapper > .row:has(.pagingBlock) {display: none;}
							#CONDTABLE th:last-child, #ACTIONTABLE th:last-child { float: inline-end; }
							.col-md-6 { padding: 0px; }
							.portlet.box.blue { margin: 0; min-width: 100%; padding: 0 !important; }
							.col-md-6 { display: flex; width: 100%; } .col-md-6 > *:first-child { width: 170px; }
							a.btn.green { display: flex; justify-content: flex-start; flex-direction: row; flex-wrap: nowrap; align-items: baseline; }
							i.icon-star.top-news-icon { font-size: 22px; bottom: 5px; }
							// td:nth-child(3), td:nth-child(2) {min-width: 400px;}
							td:nth-child(1) {white-space: nowrap;}
							#CONDTABLE { overflow: scroll; }
							table#CONDTABLE td { white-space: nowrap !important; }
							table#CONDTABLE th { white-space: nowrap !important; }
							div#basicconfig { overflow: scroll; }
							`);
			const pageTitleElement = document.querySelector('.page-title');
			if (pageTitleElement && pageTitleElement.textContent) {
				document.title = "TR: " + pageTitleElement.textContent;
			}

			const textarea = document.querySelector("#adv_query");
			setTimeout(() => {
				if (textarea) {
					applyCodeMirror("#adv_query", "sql")
				}
			}, 2000);
		} else if (window.location.href.includes("ECM/hanaRule/createTechnicalRule")) {
			GM_addStyle(`table#ACTIONTABLE { border-collapse: collapse !important; }
							#ACTIONTABLE td { padding: 0 !important; }
							#CONDTABLE, #ACTIONTABLE, #myDataTableRuleowner {min-width: 100%;}
							.col-md-6 { padding: 0px; }
							.portlet.box.blue { margin: 0; min-width: 100%; padding: 0 !important; }
							.col-md-6 { display: flex; width: 100%; } .col-md-6 > *:first-child { width: 170px; }
							#myDataTableRuleowner_wrapper > .row:has(.pagingBlock) {display: none;}
							#CONDTABLE th:last-child, #ACTIONTABLE th:last-child { float: inline-end; }
							.col-md-3, .col-md-4, .col-md-2 {padding: 0px; width: unset;}
							.col-md-6 { padding: 0 7px; }
							.row { margin: 0; }
							#ACTIONTABLE .row > * { flex: 1; }
							.top-news > a.btn.green { display: flex; justify-content: flex-start; flex-direction: row; flex-wrap: nowrap; align-items: baseline; width: 150px; margin-left: 22px; }
							i.icon-star.top-news-icon { font-size: 22px; bottom: 5px; }
							.select2-choice.select2-choice.select2-choice.select2-choice { border: none !important; }
							#CONDTABLE { overflow: scroll; }
							table#CONDTABLE td { white-space: nowrap !important; }
							table#CONDTABLE th { white-space: nowrap !important; }
							div#basicconfig { overflow: scroll; }
							`);
		} else if (window.location.href.includes("ECM/hanaRule/userRuleEdit")) {
			GM_addStyle(`td:nth-child(1) {white-space: nowrap;}
							#ACTIONTABLE td { padding: 0px !important; }
							#tab_1_1 > div > div > div > div > div > div:nth-child(2) > div:nth-child(2) {display: flex;flex-wrap: nowrap;align-content: center;justify-content: center;align-items: center;gap: 0px;padding: 0 18px; padding-left: 20px; padding-right: 15px;}
							#tab_1_1 > div > div > div > div > div > div:nth-child(2) > div:nth-child(2) > * {text-wrap: nowrap;}
							#tab_1_1 > div > div > div > div > div > div:nth-child(3) > div:nth-child(1) > div > label {flex-basis: 100%;}
							#tab_1_1 > div > div > div > div > div > div:nth-child(3) > div:nth-child(1) > div > span {flex-basis: fit-content;overflow: hidden !important;}
							#tab_1_1 > div > div > div > div > div > div:nth-child(2) > div:nth-child(2) > label {flex-basis: 100%;}
							#ruledesc {flex-basis: 200%;}
							.innerPadding {padding: 15px;}
							.form-actions::before {display: none;}
							#tab_1_1 > div > div > div > div > div > div.portlet.box.blue.no-col.no-adv > div.form-actions.right {margin: 0 15px;}
							table {min-width: 100%;}
							table#ACTIONTABLE { border-collapse: collapse !important; }
							.portlet.box.blue { min-width: 100%; margin: 0 }
							#myDataTableRuleowner_wrapper > .row:has(.pagingBlock) {display: none;}
							#ACTIONTABLE .row > * { flex: 1; }
							div#dowith5, div#dowithu5 { outline: 1px dashed black; }
							.select2-container { width: 100%; }
							.select2-choice.select2-choice.select2-choice.select2-choice { border: none !important; }
							#CONDTABLE { overflow: scroll; }
							table#CONDTABLE td { white-space: nowrap !important; }
							table#CONDTABLE th { white-space: nowrap !important; }
							div#basicconfig { overflow: scroll; }
							#CONDTABLE > tbody > tr > td > .form-control { width: 100% !important; }
							#CONDTABLE > tbody > tr > td > .form-control { width: 100% !important; }
							#CONDTABLE td { padding: 0 !important; border: 0 !important; }
							#applicationListTable td:nth-child(3), #applicationListTable td:nth-child(2) { min-width: 300px; }
							`);
			const pageTitleElement = document.querySelector("#pageLayout > div > form > div.row > div > h3 > small");
			if (pageTitleElement && pageTitleElement.textContent) {
				document.title = "UR: " + pageTitleElement.textContent;
			}

			const textarea = document.querySelector("#adv_query");
			setTimeout(() => {
				if (textarea) {
					applyCodeMirror("#adv_query", "sql")
				}
			}, 2000);
		} else if (window.location.href.includes("ECM/hanaRule/createUserUpdateRule")) {
			GM_addStyle(`table#ACTIONTABLE {margin: 10px 0 0 6px;}
							#pageLayout > div > form > div:nth-child(8) > div > div > div > div > div:nth-child(2) > div:nth-child(2) {display: flex;flex-wrap: nowrap;align-content: center;justify-content: center;align-items: center;gap: 5px;padding: 0 18px;}
							#pageLayout > div > form > div:nth-child(8) > div > div > div > div > div:nth-child(2) > div:nth-child(2) > * {text-wrap: nowrap;}
							.col-md-5:has(#ruledesc) {justify-content: space-between !important;}
							input#ruledesc {width: 66.8%;margin: 0 -2px 0 0;}
							span.form-control:has(.checker) {width: fit-content;scrollbar-width: none;}
							#pageLayout > div > form > div:nth-child(8) > div > div > div > div > div:nth-child(3) > div:nth-child(1) > div > label {flex-basis: 90%;}
							.row:has(>.pagingBlock) > * {min-width: unset;}
							table {min-width: 100%;}
							table#ACTIONTABLE { border-collapse: collapse !important; }
							#ACTIONTABLE td { padding: 0 !important; }
							#ACTIONTABLE .row { display: flex; flex-direction: row; flex-wrap: nowrap; align-items: flex-start; }
							.portlet.box.blue { min-width: 100%;  margin: 0 }
							#myDataTableRuleowner_wrapper > .row:has(.pagingBlock) {display: none;}
							.col-md-3, .col-md-4, .col-md-2 {padding: 0px; width: unset;}
							.col-md-6 { padding: 0 7px; }
							.row { margin: 0; }
							#ACTIONTABLE .row > * { flex: 1; }
							#CONDTABLE { overflow: scroll; }
							table#CONDTABLE td { white-space: nowrap !important; }
							table#CONDTABLE th { white-space: nowrap !important; }
							div#basicconfig { overflow: scroll; }
							`);
		} else if (window.location.href.includes("ECM/hanaRule/createTechnicalRule")) {
			GM_addStyle(".row:has(>.pagingBlock) > * {min-width: unset;}\
							");
		} else if (window.location.href.includes("ECM/roles/selectowner")) {
			GM_addStyle(".datatable-scroll {height: 500px;overflow: scroll;}");
		} else if (window.location.href.includes("ECM/analytics/createsubmit")) {
			document.title = "💹 Create Analytics";
			GM_addStyle(".ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-front.ui-dialog-osx {width: calc(100vw - 200px) !important;left: 50% !important;transform: translate(-50%) !important; max-width: 90vw;}\
							div#v2basecount, div#v2history {flex-basis: 100%;}\
							textarea#analyticsQry {width: calc(100vw - 170px);}\
							");
			document.addEventListener("keydown", (event) => {
				// RUN QUERY WITH CTRL + ENTER
				if (event.ctrlKey && event.key === "Enter") {
					callPageFunction('showPreview'); // EXT: showPreview is defined by the page, so it is called in the page world (page-bridge.js)
				}
			});

			const observer = new MutationObserver(() => {
				const textarea = document.querySelector("#analyticsQry");
				if (textarea) {
					observer.disconnect();
					// console.log("Textarea ready");
					applyCodeMirror("#analyticsQry", "sql")
				}
			});
			observer.observe(document.body, { childList: true, subtree: true });
		} else if (window.location.href.includes("ECM/analytics/editV1")) {
			GM_addStyle(`.custom-height { height: unset !important; }
							`);

			const observer = new MutationObserver(() => {
				const textarea = document.querySelector("#analyticsQry");
				if (textarea) {
					observer.disconnect();
					// console.log("Textarea ready");
					applyCodeMirror("#analyticsQry", "sql")
				}
			});
			observer.observe(document.body, { childList: true, subtree: true });
		} else if (window.location.href.includes("ECM/analyticsConfig/show")) {
			const observer = new MutationObserver(() => {
				const textarea = document.querySelector("#analytics > div.form-body > div > div:nth-child(3) > div > input");
				if (textarea) {
					observer.disconnect();
					// console.log("Textarea ready");
					applyCodeMirror("#analytics > div.form-body > div > div:nth-child(3) > div > input", "sql")
				}
			});
			observer.observe(document.body, { childList: true, subtree: true });
		} else if (window.location.href.includes("ECM/securitysystems/list")) {
			// --ss-- --sl--
			GM_addStyle(`#tab_1_2 > .row { display: flex; flex-direction: column; }
							ul.ver-inline-menu.tabbable.margin-bottom-10 { display: inline-flex; flex-direction: row; flex-wrap: wrap; gap: 10px; }
							.btn.svicon {margin-top: -48px;}
							.col-md-3 {width: auto !important;}
							.col-md-9 {width: auto !important;}
							td:nth-child(1), td:nth-child(3), td:nth-child(8), td:nth-child(9) {min-width: 250px;}
							.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
							.slimScrollDivH { overflow: auto; height: calc(100vh - 265px); }
							.datatable-scroll { height: 100%; overflow: auto; }
							table#securitysystemsList { height: auto; overflow: auto; }
							thead { top: 0px; position: sticky; z-index: 2; }
							#securitysystemsList td:first-child, #securitysystemsList th:first-child { position: sticky; left: 0px; z-index: 1; }
							.endpointsCell a { background: dodgerblue; padding: 0 3px; border-radius: 3px !important; color: white; }
							`);
			document.title = "== 💻 Security Systems ==";

			// Class name to mark processed cells
			const LINKED_CLASS = "converted-to-link";           // marks connection columns processed
			const WORKFLOW_LINKED_CLASS = "workflow-converted"; // marks workflow column processed

			async function enhanceConnectionCells() {
				const table = document.getElementById("securitysystemsList");
				if (!table) return;

				if (table.querySelector("." + LINKED_CLASS)) return;

				const query = "select systemkey, externalconnection, provisioningconnection from securitysystems";
				let data;
				try {
					data = await runQuery(query);
				} catch (err) {
					console.error("runQuery failed:", err);
					return;
				}
				if (!Array.isArray(data) || data.length === 0) return;

				const lookup = {};
				data.forEach(item => {
					lookup[String(item.SYSTEMKEY)] = {
						external: item.EXTERNALCONNECTION,
						provisioning: item.PROVISIONINGCONNECTION
					};
				});

				const rows = table.querySelectorAll("tbody tr");
				rows.forEach(row => {
					// find the anchor in the first column that has the /ECM/securitysystems/show/{key} href
					const anchor = row.querySelector("td a[href*='/ECM/securitysystems/show/']");
					if (!anchor) return;

					// extract the key from the href's last segment
					const href = anchor.getAttribute("href");
					const parts = href.split("/").filter(Boolean);
					const systemKey = parts[parts.length - 1]; // '12' in /ECM/securitysystems/show/12
					if (!systemKey) return;

					const info = lookup[String(systemKey)];
					if (!info) return;

					// 0-based cell indices: column 8 -> cells[7], column 9 -> cells[8]
					const externalCell = row.cells[7];
					const provisioningCell = row.cells[8];

					// convert external connection if present and not already converted
					if (info.external && externalCell && !externalCell.classList.contains(LINKED_CLASS)) {
						const key = info.external;
						// preserve the visible text (if any) or show the key
						const visible = (externalCell.textContent || key).trim();
						externalCell.innerHTML = `<a href="/ECM/ecmConfig/addnewconnection/${key}" target="_blank" rel="noopener noreferrer">${visible}</a>`;
						externalCell.classList.add(LINKED_CLASS);
					}

					// convert provisioning connection if present and not already converted
					if (info.provisioning && provisioningCell && !provisioningCell.classList.contains(LINKED_CLASS)) {
						const key = info.provisioning;
						const visible = (provisioningCell.textContent || key).trim();
						provisioningCell.innerHTML = `<a href="/ECM/ecmConfig/addnewconnection/${key}" target="_blank" rel="noopener noreferrer">${visible}</a>`;
						provisioningCell.classList.add(LINKED_CLASS);
					}
				});
			}

			// ----- Workflow fetcher: builds name -> workflowId map -----
			async function fetchWorkflows() {
				// Call the same endpoint you stored in context; adjust body as needed
				const response = await fetch("/ECM/jbpmworkflowmanagement/workflowlistjson", {
					method: "POST",
					headers: {
						"content-type": "application/x-www-form-urlencoded; charset=UTF-8"
					},
					// ask for enough rows; adjust iDisplayLength if you expect more
					body: "jsontype=datatable&iDisplayStart=0&iDisplayLength=500"
				});

				const json = await response.json();
				const wfLookup = {};

				if (!json || !Array.isArray(json.results)) return wfLookup;

				// Parse the HTML in wfname to extract anchor href and text
				json.results.forEach(item => {
					const wfnameHtml = item.wfname || "";
					// Create a temporary DOM node to parse HTML safely
					const tmp = document.createElement("div");
					tmp.innerHTML = wfnameHtml;

					const a = tmp.querySelector("a[href*='/ECM/jbpmworkflowmanagement/showWorkflow/']");
					if (a) {
						const href = a.getAttribute("href");
						// extract numeric id from href (last path segment)
						const parts = href.split("/").filter(Boolean);
						const wfId = parts[parts.length - 1];
						const name = a.textContent.trim();
						if (name && wfId) {
							// map raw name -> id (string)
							wfLookup[name] = String(wfId);
						}
					}
				});

				return wfLookup;
			}

			// ----- Convert workflow column (index 2) to links using lookup -----
			async function enhanceWorkflowCells() {
				const table = document.getElementById("securitysystemsList");
				if (!table) return;

				// If all rows already have workflow conversion, skip.
				if (table.querySelector("td." + WORKFLOW_LINKED_CLASS)) return;

				let wfLookup;
				try {
					wfLookup = await fetchWorkflows();
				} catch (err) {
					console.error("fetchWorkflows failed:", err);
					return;
				}
				if (!wfLookup || Object.keys(wfLookup).length === 0) return;

				const rows = table.querySelectorAll("tbody tr");
				rows.forEach(row => {
					const wfCell = row.cells[2]; // workflow column (0-based index 2)
					if (!wfCell || wfCell.classList.contains(WORKFLOW_LINKED_CLASS)) return;

					// Get the plain visible text lines (innerText preserves line breaks)
					const text = wfCell.innerText || wfCell.textContent || "";
					// Split lines by newline or by the <br> separators that might have rendered as line breaks
					const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

					// We'll operate on innerHTML so we preserve existing formatting (icons etc.)
					let newHtml = wfCell.innerHTML;

					let anyReplaced = false;
					lines.forEach(line => {
						// look for Add :-NAME or Remove :-NAME patterns in each line
						const m = line.match(/^(?:Add|Remove)\s*:-\s*(.+)$/i);
						if (!m) return;
						const wfName = m[1].trim();
						if (!wfName) return;

						const wfId = wfLookup[wfName];
						if (!wfId) return;

						// Replace occurrences of the plain workflow name in the innerHTML with anchor.
						// Escape the name for use in regex:
						const escName = wfName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
						// Only replace the raw text occurrence (not inside attributes), using a simple regex:
						// This is safe because workflow names appear as text nodes in the HTML snippet.
						const replaceRegex = new RegExp(escName, "g");
						const anchorHtml = `<a href="/ECM/jbpmworkflowmanagement/showWorkflow/${wfId}" target="_blank">${wfName}</a>`;
						if (replaceRegex.test(newHtml)) {
							newHtml = newHtml.replace(replaceRegex, anchorHtml);
							anyReplaced = true;
						}
					});

					if (anyReplaced) {
						wfCell.innerHTML = newHtml;
						wfCell.classList.add(WORKFLOW_LINKED_CLASS);
					}
				});
			}

			function createEndpointsColumn() {
				console.log("creating endpoints column");

				const securitysystemsList = document.getElementById('securitysystemsList');

				if (!securitysystemsList) {
					return
				}

				// add new column to show rule's trigger source
				if (!document.getElementById('endpointsColumn')) {
					const endpointsColumn = document.createElement('th');
					endpointsColumn.id = 'endpointsColumn';
					endpointsColumn.textContent = 'Endpoint(s)';
					securitysystemsList.querySelector('thead').querySelector('tr').appendChild(endpointsColumn);


				}
				if (document.getElementById('endpointsColumn')) {
					// add cells
					securitysystemsList.querySelectorAll('tbody tr').forEach(row => {
						const endpointsCell = document.createElement('td');
						endpointsCell.classList.add('endpointsCell');
						row.appendChild(endpointsCell);
					})
				}

				// get all rule names from second column of the table and store in an array
				const ssDisplayNames = [];
				securitysystemsList.querySelectorAll('tbody tr').forEach(row => {
					const ssDisplayName = row.querySelector('td:nth-child(1)').textContent;
					ssDisplayNames.push(ssDisplayName);
				});
				// convert the array to a string like SQL in query
				const ruleNamesString = ssDisplayNames.map(name => `'${name}'`).join(', ');
				// console.log(ruleNamesString);

				runQuery(`select
								ss.systemkey as sskey,
								ss.systemname as ssname,
								ss.displayname as ssdisplayname,
								ss.status as ssstatus,
								e.endpointkey as epkey,
								e.endpointname as epname,
								e.displayname as epdisplayname,
								e.status as epstatus
							from
								securitysystems ss
								left join endpoints e on e.SECURITYSYSTEMKEY = ss.systemkey
							where
								ss.displayname in (${ruleNamesString})
							order by e.endpointname
						`).then(data => {
					// console.log(data);
					securitysystemsList.querySelectorAll('tbody tr').forEach(row => {
						const ssCell = row.querySelector('td:nth-child(1)');
						const ssDisplayName = ssCell.textContent;
						// find all matching endpoints with ssdisplayname, there might be multiple
						const matchingEndpoints = data.filter(endpoint => endpoint.SSDISPLAYNAME === ssDisplayName);
						// add endpoint names (not displayname) to the cell, as a spans separated by <br> and each span should have a href as a link to the endpoint, format: <a href="/ECM/endpoints/show/${endpoint.EPKEY}">${endpoint.EPNAME}</a>
						const endpointsCell = row.querySelector('.endpointsCell');
						endpointsCell.innerHTML = matchingEndpoints.map(endpoint => `<div><a href="/ECM/endpoints/show/${endpoint.EPKEY}">${endpoint.EPDISPLAYNAME}</a>${endpoint.EPDISPLAYNAME == endpoint.EPNAME ? '' : '<BR>(' + endpoint.EPNAME + ')'}</div>`).join('');

						// add ssname the first column if ssdisplayname is different from ssname
						const ssName = data.find(ss => ss.SSDISPLAYNAME === ssDisplayName).SSNAME;
						if (ssDisplayName !== ssName) {
							// add a <br> and span with the ssname to current content without replacing
							ssCell.innerHTML += `<br><div>(${ssName})</div>`;
						}
					});
				});
			}

			const ssObserver = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					for (const node of mutation.addedNodes) {
						// console.log(node);
						if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TBODY') {
							applyHighlights("td:nth-child(5), td:nth-child(6)", [
								{ word: "true", highlightName: "lightGreenHighlight", whole: true },
								{ word: "false", highlightName: "lightRedHighlight", whole: true }
							])

							enhanceConnectionCells();
							enhanceWorkflowCells();
							createEndpointsColumn();
						}
					}
				}
			});
			ssObserver.observe(document.querySelector('#securitysystemsList'), {
				childList: true,
				subtree: true
			});

		} else if (window.location.href.includes("ECM/securitysystems/show")) {
			// --ss--
			GM_addStyle("span.help-block {text-wrap: nowrap;}\
							.icheck-inline > * {min-width: 80px;}\
							");
			const pageTitleElement = document.querySelector('.page-title');
			if (pageTitleElement && pageTitleElement.textContent) {
				document.title = "🛡️ " + pageTitleElement.textContent;
			}
			// make connection links clickable
            // uses the REST api calls which are not called by the UI normally
            // const labelElements = document.querySelectorAll('label');
            // labelElements.forEach(label => {
            // 	if (!label.textContent.includes("Connection")) return;
            // 	const connectionDropdown = label.parentNode.querySelector('.select2-chosen');
            // 	if (connectionDropdown && connectionDropdown.textContent !== "Select Connection") {
            // 		const connectionName = connectionDropdown.textContent;
            // 		fetch(baseUrl + '/ECM/api/v5/getConnectionDetails', {
            // 			method: 'POST',
            // 			headers: {
            // 				'Content-Type': 'application/json',
            // 				'Authorization': 'Bearer ' + getAccessToken()
            // 			},
            // 			body: JSON.stringify({ connectionname: connectionName })
            // 		}).then(response => response.json())
            // 			.then(data => {
            // 				if (data && data.connectionkey) {
            // 					const link = document.createElement('a');
            // 					link.href = '/ECM/ecmConfig/addnewconnection/' + data.connectionkey;
            // 					link.textContent = label.textContent;
            // 					label.innerHTML = '';
            // 					label.appendChild(link);
            // 				}
            // 			})
            // 	}
            // });
		} else if (window.location.href.includes("ECM/endpoints/show")) {
			// --e-- --ep--
			GM_addStyle(`.modal.fade.in {width: 800px !important;}
							.modal-body .form-group {display: flex;flex-direction: row !important;width: 100% !important; padding: 0px !important; gap: 5px !important;}
							.modal-body .col-md-6 {padding-left: 0 !important;padding-right: 0 !important;margin: 2px !important;width: 48% !important; float: left;}
							.modal-body table {width: 100% !important;}
							#attrTable td:nth-child(1) {width: 175px !important;}
							#accountrulediv {flex-direction: column !important;}
							#correlationdiv {flex-direction: column !important;}
							#correlationdiv>.row {flex-wrap: nowrap;display: flex;}
							#correlationdiv>.row .form-group {padding: 0 !important;}
							textarea#sqlquery {border-radius: 5px !important;}
							#updateendpoint > div.form-body > div:nth-child(1) > div:nth-child(2) { display: grid; grid-template-columns: 230px 10px 1fr; gap: 0 10px; }
							#displayName {flex-basis: 202%;}
							#updateendpoint > div.form-body > div:nth-child(19) > div {border-bottom: 1px dashed #dbdbdb;}
							.form-group:has(textarea) {flex-direction: row !important;align-items: flex-start !important;}
							.col-md-6:has(textarea) {flex-basis: 50%;}
							#updateendpoint > div.form-body > div:nth-child(7) > div { display: grid; grid-template-columns: 250px 1fr; gap: 0 10px; }
							input#allowChangePassword_sqlquery { margin-bottom: 0; }
							#updateendpoint > div.form-body > div:nth-child(19) { display: grid; grid-template-columns: 1fr 1fr; gap: 0 10px; padding: 0 10px; }
							#updateendpoint > div.form-body > div:nth-child(19) > div:nth-child(14) { display: grid; grid-template-columns: 200px 1fr; gap: 0 10px; }
							#updateendpoint > div.form-body > div:nth-child(19) > div:nth-child(4) { grid-column: 1; }
							.form-body>.row { margin: 0 !important; display: grid; border-bottom: 1px dashed #dddddd; grid-template-columns: 0 1fr 1fr 0; gap: 10px; min-width: 100%; }
							.form-body .col-md-6 { min-width: 100%; display: grid; }
							.form-group { display: grid; text-wrap: wrap; margin: 0px !important; padding: 0px !important; grid-template-columns: 250px 1fr; gap: 0 10px; place-items: stretch !important; height: 100%;}
							label.control-label { align-self: center; }
							.col-md-6 { margin: 0 !important; padding: 0 !important; }
							@media (max-width: 1400px) { .form-body > .row { grid-template-columns: 1fr; gap: 0;} }
							@media (max-width: 1400px) { #updateendpoint>div.form-body>div:nth-child(19) { grid-template-columns: 1fr; gap: 0; padding: 0;} }
							.select2-container.select2-container.select2-container { height: 100% !important; }
							.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
							.slimScrollDivH { overflow: auto; height: calc(100vh - 325px); }
							.slimScrollDivH:has(#myDataTableDynamicAttribute) { height: calc(100vh - 384px); }
							.datatable-scroll { height: 100%; overflow: auto; }
							table.dataTable { height: auto; overflow: auto; }
							thead { top: 0px; position: sticky; z-index: 2; }
							table.dataTable td:first-child, table.dataTable th:first-child { position: sticky; left: 0px; z-index: 1; }
							table#myDataTableDynamicAttribute td:nth-child(2), table.dataTable th:nth-child(2) { position: sticky; left: 0px; z-index: 1; }
							table.dataTable th {overflow-wrap: nowrap;text-wrap: nowrap !important;align-content: center;}
							#myDataTableDynamicAttribute td:nth-child(2) { white-space: nowrap; }
							#myDataTableDynamicAttribute td:nth-child(5), #myDataTableDynamicAttribute td:nth-child(6) { min-width: 350px; }
							`);
			const pageTitleElement = document.querySelector('.page-title');
			if (pageTitleElement && pageTitleElement.textContent) {
				document.title = "📍 " + pageTitleElement.textContent;
			}
			const observer = new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					mutation.addedNodes.forEach(node => {
						if (node.nodeType === 1 && node.classList.contains('datatable-scroll')) {
							const table = node.querySelector('table');
							extendDataTables(table);
						}
						// console.log(node);

						if (document.querySelectorAll("#attvalue, #defaultvaluestext").length > 0) {
							if (!document.querySelector("#s2id_att_type")?.textContent?.includes("SQL")) return;
							["#attvalue", "#defaultvaluestext"].forEach(selector => {
								const element = document.querySelector(selector);
								if (element && element.style.display !== "none") {
									applyCodeMirror(selector, "sql");
								}
							})
						}
					});
				});
			});
			observer.observe(document.body, { childList: true, subtree: true });

			// Make Security System hyperlink
			const labelElements = document.querySelectorAll('label');
			labelElements.forEach(label => {
				if (!label.textContent.includes("Security System")) return;
				const securitySystemID = document.querySelector("#securitysystems")?.value;
				if (securitySystemID) {
					const link = document.createElement('a');
					link.href = '/ECM/securitysystems/show/' + securitySystemID;
					link.textContent = label.textContent;
					label.innerHTML = '';
					label.appendChild(link);
				}
			});

		} else if (window.location.href.includes("ECM/dataset/show")) {
			GM_addStyle("a.btn.svicon {margin-top: -34px;}");
		} else if (window.location.href.includes("ECM/savRoles/show")) {
			// --sr-- --savrole--
			GM_addStyle(`a.btn.svicon {margin-top: -34px;}
							.row>* {flex-basis: 50%;}
							#tab_1_1 > form:nth-child(2) > div.form-body > div:nth-child(5) > div:nth-child(1) > div { display: grid; grid-template-columns: 231px 10px 1fr; }
							span.input-group-btn { outline: 1px dashed #939393; min-width: 22px; height: 26px; width: 100%; }
							.col-md-6 { padding: 0 5px; }
							#tab_1_1 > form:nth-child(2) > div.form-body > div:nth-child(5) > div:nth-child(3) > div { display: grid; grid-template-columns: 216px 10px 10px 1fr 7px; gap: 0 5px; }
							#tab_1_1 > form:nth-child(2) > div.form-body > div:nth-child(5) > div:nth-child(3) > div > div { margin: 0; display: grid; grid-template-columns: 0 1fr 10px 0; gap: 0; }
							#tab_1_1 > form:nth-child(2) > div.form-body > div:nth-child(5) > div:nth-child(3) > div > div > div.col-md-11 { padding: 0; width: 100%; }
							#tab_1_1 > form:nth-child(2) > div.form-body > div:nth-child(5) > div:nth-child(3) > div > div > div.col-md-1 { height: 100%; padding: 0; width: 100%; }
							.form-group { display: grid; grid-template-columns: 246px 1fr; gap: 5px; place-items: stretch; width: 100%; gap: 0 5px; }
							input#customproperty18 { width: 100%; place-self: stretch !important; }
							div#STAT_25_SMALL { width: 100%; }
							div#s2id_STAT_25 { width: 100% !important; }
							#tab_1_1 > form:nth-child(2) > div.form-body > div:nth-child(5) > div:nth-child(2) > div { display: grid; grid-template-columns: 230px 10px 1fr; gap: 0 5px; /* place-items: stretch !important; */ }
							.input-group-addon, .input-group-btn, .input-group .form-control { display: block; }
							.input-group.fixedwidth { display: grid; grid-template-columns: 1fr 50px; }
							.input-group { display: grid; grid-template-columns: 1fr 22px; }
							#tab_1_1 > form:nth-child(2) > div.form-body > div:nth-child(5) > div:nth-child(2) > div > div { height: 100%; }
							#tab_1_1 > form:nth-child(2) > div.form-body > div:nth-child(5) > div:nth-child(2) > div > div > div { height: 100%; }
							.has-switch.switch-animate.switch-off { top: -2px; }
							.row.dtProcessing { display: grid; grid-template-columns: 0 auto auto auto 0; justify-content: start; } .input-cont.pull-right { float: unset !important; }
							#myDataTable1 td:nth-child(2), #myDataTable1 td:nth-child(7) { cursor: pointer; }
							`);
			const pageTitleElement = document.querySelector('.page-title');
			if (pageTitleElement && pageTitleElement.textContent) {
				document.title = "👨‍💼" + pageTitleElement.textContent;
			}

			// Observe for dynamic content updates
			const savRolesObserver = new MutationObserver((mutations) => {
				mutations.forEach(mutation => {
					mutation.addedNodes.forEach(node => {
						// console.log(node);
						if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TBODY') {
							const savRolesTable = document.querySelector('#myDataTable1');
							if (savRolesTable && !savRolesTable.classList.contains('listener-added-table')) {
								console.log("making links");
								makeLinksJs("#myDataTable1");
								savRolesTable.classList.add('listener-added-table');
							}
						}
					});
				});
			});
			savRolesObserver.observe(document, { childList: true, subtree: true });
		} else if (window.location.href.includes("ECM/users/show")) {
			// --u--
			GM_addStyle(`td:nth-child(4) {text-wrap: wrap !important;}
							div#accordionrolehis {display: flex;flex-direction: column-reverse;}
							.portlet.box.blue.no-col.no-adv {max-width: 1500px;}
							table.list.table.table-striped.table-hover.table-bordered.dataTable {width: 100% !important; margin: 0 !important}
							table.list.table.table-striped.table-hover.table-bordered.dataTable th {display: none;}
							table.list.table.table-striped.table-hover.table-bordered.dataTable td {width: 25% !important;}
							.panel-body {padding: 0;}
							h4.panel-title {font-size: medium !important;}
							.panel.panel-info {margin-top: 0 !important;}
							.page-content #rounded .panel-heading {padding: 3px;}
							.form-group { display: grid; text-wrap: wrap; margin-bottom: 0px !important; padding: 0px !important; border-radius: 5px !important; grid-template-columns: 163px 1fr; gap: 0; place-items: stretch !important; height: 100%;}
							.form-body>.row { border: none; }
							label.control-label { align-self: stretch; outline: 1px dashed #d9d9d9; padding: 0 5px; }
							table#sample2 td:nth-child(3), table#sample2 td:nth-child(4) {cursor: pointer;}
							`);
			const pageTitleElement = document.querySelector('.page-title');
			const userdisplayname = document.querySelector('#displayname')?.value;
			if (pageTitleElement && pageTitleElement.textContent) {
				document.title = "🤦‍♂️ " + pageTitleElement.textContent + ' (' + userdisplayname + ')';
			}

			async function convertCellTextToLinks(selector) {
				const cells = document.querySelectorAll(selector);

				const allRuleNames = new Set();
				const cellPartsMap = new Map();
				for (const cell of cells) {
					const originalText = cell.textContent;
					if (!originalText) continue;

					const parts = originalText.split(/([:,;])/);
					cellPartsMap.set(cell, parts);

					for (let part of parts) {
						const trimmed = part.trim();

						if (!trimmed) continue;
						if (part === ':' || part === ',' || part === ';') continue;
						if (trimmed === 'User Update Rules' || trimmed === 'Technical Rules') continue;

						allRuleNames.add(trimmed);
					}
				}

				// -------- SINGLE BULK QUERY --------
				const ruleMap = new Map();
				if (allRuleNames.size > 0) {
					const escapedNames = [...allRuleNames]
						.map(name => `'${name.replace(/'/g, "''")}'`)
						.join(',');

					const query = `select name, hanarulekey, case when (birthright = true) then 1 else 2 end as birthright from hanarule where name in (${escapedNames})`;

					try {
						const data = await runQuery(query);

						data?.forEach(row => {
							ruleMap.set(row.NAME, {
								ruleKey: row.HANARULEKEY,
								birthright: row.BIRTHRIGHT
							});
						});
					} catch (err) {
						console.error("Bulk query failed", err);
					}
				}

				// -------- SECOND PASS: Render cells --------
				for (const [cell, parts] of cellPartsMap.entries()) {

					const fragment = document.createDocumentFragment();

					for (let part of parts) {
						const trimmed = part.trim();

						// Separators
						if (part === ':' || part === ',' || part === ';') {
							fragment.appendChild(document.createTextNode(part));
							fragment.appendChild(document.createElement('br'));
							continue;
						}

						if (!trimmed) continue;

						// Bold headers
						if (trimmed === 'User Update Rules' || trimmed === 'Technical Rules') {
							const bold = document.createElement('strong');
							bold.textContent = trimmed;
							fragment.appendChild(bold);
							continue;
						}

						const ruleData = ruleMap.get(trimmed);

						if (ruleData?.ruleKey) {
							const type = ruleData.birthright;
							const url = `${baseUrl}/ECM/hanaRule/${type == 1 ? 'technicalRuleEdit' : 'userRuleEdit'
								}/${ruleData.ruleKey}?type=${type}`;

							const link = document.createElement('a');
							link.href = url;
							link.textContent = trimmed;
							link.target = '_blank';

							fragment.appendChild(link);
						} else {
							fragment.appendChild(document.createTextNode(trimmed));
						}
					}

					cell.innerHTML = '';
					cell.appendChild(fragment);
				}
			}

			addJumpToUsrFields();

			// make manager and secondary manager inputs open the respective user page on click
			const managerInput = document.querySelector('#managername');
			managerInput.addEventListener('click', (e) => {
				// process only if ctrl and alt are not pressed
				if (e.altKey || e.ctrlKey) return;

				// get manager username from the brackets
				const managerUsername = managerInput.value?.split('(')[1].split(')')[0];
				if (managerUsername) {
					runQuery(`select userkey from users where username = '${managerUsername}'`).then(data => {
						const userkey = data[0]?.USERKEY;
						if (!userkey) return;
						const url = `/ECM/users/show/${userkey}`;
						window.open(url, "_blank");
					})
				}
			})
			const secondaryManagerInput = document.querySelector('#secondaryManagerName');
			secondaryManagerInput.addEventListener('click', (e) => {
				// process only if ctrl and alt are not pressed
				if (e.altKey || e.ctrlKey) return;

				// get manager username from the brackets
				const managerUsername = secondaryManagerInput.value?.split('(')[1].split(')')[0];
				if (managerUsername) {
					runQuery(`select userkey from users where username = '${managerUsername}'`).then(data => {
						const userkey = data[0]?.USERKEY;
						if (!userkey) return;
						const url = `/ECM/users/show/${userkey}`;
						window.open(url, "_blank");
					})
				}
			})

			const observer = new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					mutation.addedNodes.forEach(node => {
						// console.log(node);
						if (node.nodeType === 1 && node.classList.contains('datatable-scroll')) {
							const table = node.querySelector('table');
							extendDataTables(table);
							// Custom stuff for accounts table
							// if (table?.id?.includes('sample')) {

							// }
						}
						// if (node.nodeType === 1 && node.classList.contains('tab-pane')) {
						// 	// breaking up the triggered rules into separate lines
						// 	const RuleRunNodes = node.querySelectorAll('td:nth-child(4)');
						// 	RuleRunNodes.forEach(node => {
						// 		node.innerHTML = node.innerHTML.replace(/(,|:|;)/g, '$1<br>');
						// 		node.innerHTML = node.innerHTML.replace(/(Technical Rules)/g, '<b>$1</b>');
						// 		node.innerHTML = node.innerHTML.replace(/(User Update Rules)/g, '<b>$1</b>');
						// 	})
						// }
						if (node.id === 'tab_1_12') {
							// Highlight important changes in user history like statuskey changes
							applyHighlights(".panel-collapse table td:nth-child(1), .panel-collapse table td:nth-child(2), .panel-collapse table td:nth-child(3)", [
								{ word: "email", highlightName: "magentaHighlight", whole: true },
								{ word: "oneid", highlightName: "aquaHighlight", whole: true },
								{ word: "systemusername", highlightName: "aquaHighlight", whole: true },
								{ word: "username", highlightName: "aquaHighlight", whole: true },
								{ word: "status", highlightName: "aquaHighlight", whole: true },
								{ word: "start date", highlightName: "limeHighlight", whole: true },
								{ word: "J_NOTIFY", highlightName: "limeHighlight", whole: true },
								{ word: "J_CONVERT", highlightName: "limeHighlight", whole: true },
								{ word: "J_PREHIRE", highlightName: "limeHighlight", whole: true },
								{ word: "end date", highlightName: "deepRedHighlight", whole: true },
								{ word: "TERMDATE", highlightName: "deepRedHighlight", whole: true },
								{ word: "active", highlightName: "lightGreenHighlight", whole: true },
								{ word: "a", highlightName: "lightGreenHighlight", whole: true },
								{ word: "inactive", highlightName: "deepRedHighlight", whole: true },
								{ word: "remove", highlightName: "deepRedHighlight", whole: true },
								{ word: "suspend", highlightName: "deepRedHighlight", whole: true },
								{ word: "t", highlightName: "deepRedHighlight", whole: true },
								{ word: "closed", highlightName: "deepRedHighlight", whole: true },
								{ word: "L_DELETE", highlightName: "deepRedHighlight", whole: true },
								{ word: "L_LEAVER", highlightName: "deepRedHighlight", whole: true },
								{ word: "L_INTUNE_DISABLE", highlightName: "deepRedHighlight", whole: true },
								{ word: "Retrospective Leaver", highlightName: "deepRedHighlight", whole: true },
								{ word: "n/a", highlightName: "magentaHighlight", whole: true },
								{ word: "JML Flag", highlightName: "orangeHighlight", whole: true },
								{ word: "O365 License", highlightName: "aquaHighlight", whole: true },
								{ word: "Event Reason (SF) [CP8]", highlightName: "orangeHighlight", whole: true },
								{ word: "Mover Effective Date (SF) [CP38]", highlightName: "orangeHighlight", whole: true },
								{ word: "L_7DAYS", highlightName: "orangeHighlight", whole: true },
							])
							// update history header
							const historyheader = document.querySelector("#tab_1_12 > div > div.portlet-title > div");
							historyheader.textContent = 'History (Timestamps are in Local Time, with most recent updates on top)'

							// make the rules into links
							convertCellTextToLinks("#tab_1_12 td:nth-child(4)");
						}
						if (node.id === 'tab_1_1') {
							// show actual attribute names for renamed customproperties
							// console.log("showing field names");
							showActualFieldNames();
						}
						// make security system and endpoint name links on accounts page
						if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TBODY') {
							const accountsTable = document.querySelector('#sample2');
							if (accountsTable && !accountsTable.classList.contains('listener-added-table')) {
								console.log("making links");
								makeLinksJs("#sample2");
								accountsTable.classList.add('listener-added-table');
							}
						}
					});
				});
			});
			observer.observe(document.body, { childList: true, subtree: true });
			showActualFieldNames();

		} else if (window.location.href.includes("ECM/user_GroupDetail/list")) {
			GM_addStyle("i.icon-trash.svred.iconSVYNT-delete.tooltips {top: -11px;}\
							");
		} else if (window.location.href.includes("ECM/accounts/list")) {
			GM_addStyle("#upLoadAccount#upLoadAccount {top: 50% !important;}\
							");
		} else if (window.location.href.includes("ECM/accounts/show")) {
			// --a--
			GM_addStyle(".form-group>.slimScrollDiv {width: 100% !important;}\
							");
			const pageTitleElement = document.querySelector('.page-title');
			if (pageTitleElement && pageTitleElement.textContent) {
				document.title = "👤 " + pageTitleElement.textContent;
			}

			addJumpToUsrFields();

			showActualFieldNames();
			const observer = new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					mutation.addedNodes.forEach(node => {
						// console.log(node);
						// check if node class contains portlet box blue
						if (node.nodeType === 1 && node.classList.contains('portlet') && node.classList.contains('box')) {
							// show actual attribute names for renamed customproperties
							// console.log("showing field names");
							showActualFieldNames();
						}
					});
				});
			});
			observer.observe(document.body, { childList: true, subtree: true });

		} else if (window.location.href.includes("ECM/analyticsConfig/list")) {
			document.title = "== 📈 Analytics ==";
			GM_addStyle(`.datatable-scroll {padding-bottom: 100px !important;}
							#myDataTable .th_7.th_7 {width: auto;}
							#myDataTable .th_8.th_8 {width: auto;}
							td:nth-child(3) {text-wrap: nowrap;}
							td:nth-child(2) {min-width: 250px !important;}
							#pageLayout > div > div:nth-child(4) > div > div > div.portlet-title > div.actions > div > ul > li:nth-child(1) {display: none;}
							.row:has(>.pagingBlock) {position: fixed;bottom: 20px;box-shadow: 2px 3px 6px 0px #0000007a;}
							/* scrollable tables */
							.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
							.slimScrollDivH { overflow: auto; height: calc(100vh - 221px); }
							.datatable-scroll { height: 100%; overflow: auto; }
							table#myDataTable { height: auto; overflow: auto; }
							thead { top: 0px; position: sticky; z-index: 2; }
							/* ---------------- */
							`);
		} else if (window.location.href.includes("ECM/analyticsConfigES/show") || window.location.href.includes("ECM/analytics/editV2")) {
			// --analytics
			GM_addStyle("div#s2id_securityContext {width: auto !important;}\
							div#securityContextDiv {margin: 0 5px 0 0 !important;width: 48% !important;}\
							textarea#analyticsQry {width: calc(100vw - 170px);}\
							");

			// enable the update button as soon as the page loads
			document.querySelector("#updatebutton")?.classList.remove("disabled");

			const pageTitleElement = document.querySelector('.portlet-title');
			if (pageTitleElement && pageTitleElement.textContent) {
				document.title = '📈' + pageTitleElement.textContent.replace("Analytics Configuration Details", "View");
			}

			const observer = new MutationObserver(() => {
				const textarea = document.querySelector("#analyticsQry");
				if (textarea) {
					observer.disconnect();
					// console.log("Textarea ready");
					applyCodeMirror("#analyticsQry", "sql")
				}
			});
			observer.observe(document.body, { childList: true, subtree: true });

			const analyticsObserver = new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					mutation.addedNodes.forEach(node => {

						if (node?.nodeName === "TBODY") {

							if (!node.classList.contains("body-extended")) {
								console.log("tbody added for history table");
								const historyTable = document.querySelector("#myDataTablehistory");
								extendDataTables(historyTable);
								node.classList.add("body-extended");
							}

							const cells = node.querySelectorAll('#myDataTablehistory td');
							console.log("moving cell contents to inner divs");
							for (const cell of cells) {
								const tdSubDiv = document.createElement('div');
								tdSubDiv.classList.add('subcelldiv');
								tdSubDiv.innerHTML = cell.innerHTML;
								// cell text helps with setting widths of cells but too long and it makes table scroll too much to right so trimming text to first '—' (remove everything after) or first 100 chars
								if (cell.textContent.includes('—')) {
									cell.textContent = cell.textContent.substring(0, cell.textContent.indexOf('—'));
								}
								// cell.textContent = cell.textContent.substring(0, 100);
								// cell.textContent = "\u00A0";
								cell.textContent = "";
								cell.appendChild(tdSubDiv);
							}

							// showing diff
							applyTableTextDiff(
								"#myDataTablehistory",
								4, // old value column
								5  // new value column
							);
						}
					});
				});
			});
			analyticsObserver.observe(document.body, { childList: true, subtree: true });

			// select all checkboxes while editing an analytics
			document.addEventListener('keydown', function (event) {
				if (event.ctrlKey && event.key === 'a') {
					// Select all checkboxes in the table with the given selector
					const checkboxes = document.querySelectorAll('table td:nth-child(2) > input[type="checkbox"]');
					if (checkboxes.length > 0) {
						event.preventDefault();
						checkboxes.forEach(function (checkbox) {
							checkbox.checked = true;
						});
					}
				}
			});

		} else if (window.location.href.includes("ECM/ecmConfig/externalconfig")) {
			// --cl--
			GM_addStyle(`#tab_1_2 > .row { display: flex; flex-direction: column; }
							ul.ver-inline-menu.tabbable.margin-bottom-10 { display: inline-flex; gap: 10px; height: 40px; width: 400px; }
							a.btn.svicon {margin-top: -35px;}
							#tab_1_2 > div > div.col-md-3 { padding: 0 5px; }
							.row:has(>.pagingBlock) {position: fixed;bottom: 20px;box-shadow: 2px 3px 6px 0px #0000007a;}
							table#externalconnectypedata  td:nth-child(2) {text-wrap: auto;}
							.col-md-9 { width: 100%; }
							.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
							.slimScrollDivH { overflow: auto; height: calc(100vh - 265px); }
							.datatable-scroll { height: 100%; overflow: auto; }
							table#externelconnecdata { height: auto; overflow: auto; }
							thead { top: 0px; position: sticky; z-index: 2; }
							#externelconnecdata td:nth-child(2), #externelconnecdata th:nth-child(2) { position: sticky; left: 0px; z-index: 1; }
							#externelconnecdata td{ white-space: nowrap; }
							`);
			document.title = "== 🔗 Connections ==";

			extendDataTables(document.querySelector('#externelconnecdata'), false);

			const connectionListObserver = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					for (const node of mutation.addedNodes) {
						// console.log(node);
						if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TBODY') {
							// highlight source connections
							applyHighlights("td:nth-child(2)", [
								{ word: "successfactors", highlightName: "lightRedHighlight", whole: true },
								{ word: "rai", highlightName: "lightYellowHighlight", whole: true },
								{ word: "global", highlightName: "lightGreenHighlight", whole: true },
							])
						}
					}
				}
			});
			connectionListObserver.observe(document.querySelector('#externelconnecdata'), {
				childList: true,
				subtree: true
			});
		} else if (window.location.href.includes("ECM/ecmConfig/addnewconnection")) {
			// --c--
			GM_addStyle(`table.table.table-striped.table-condensed.table-hover {border-collapse: collapse !important;}
							table.table.table-striped.table-condensed.table-hover > tbody > tr > td:nth-child(2) {width: 100% !important;}
							#tab_1_2 > div > div.col-md-3 > ul { display: inline-flex; flex-direction: row-reverse; flex-wrap: wrap; gap: 10px;}
							#tab_1_2 > div > div.col-md-3 > ul li a { border-radius: 5px !important}
							.col-md-3 {width: auto;}
							.col-md-9 {width: auto;}
							div#certificateBtnDiv {margin: 0px !important;}
							div#showSaveTemplateBtn {margin: 0px !important;}
							.form-actions {position: fixed !important;bottom: 10px !important;left: 70px !important;border-radius: 10px !important;box-shadow: 2px 3px 6px 0px #0000007a;}
							.tab-pane .form-actions, .ui-tabs-panel .form-actions, .portlet.box.blue .form-actions {background-color: #fff;padding: 10px !important;margin: 0px 18px;}
							label {flex-basis: 30%;}
							td{position: relative;padding: 0px !important;}
							td:nth-child(1){padding: 3px !important;}
							#myDataTableconhistory td {padding: 3px !important; max-width: 30vw;}
							td > small {font-family: 'Courier New', 'consolas'; max-height: calc(100% - 20px);display: block;overflow: scroll;position: absolute;background: white;padding: 4px 4px;/* z-index: 99; */scrollbar-width: none;border: 1px solid #d1d1d1;border-radius: 5px;margin: 3px 3px;left: 0px;}
							td > small:hover {max-height: unset;z-index: 99;box-shadow: 2px 3px 10px 0px #616161;transition: all 0.1s;}
							.table tbody>tr>td:has(small) {line-height: 0.9;}
							textarea {height: 10px}
							table.table.table-striped.table-condensed.table-hover td:nth-child(1) {white-space: nowrap; font-weight: bold;}
							span.svicontext {font-weight: bold !important;}
							td > small {white-space: normal; font-weight: normal;opacity: 0.1;}
							table.table.table-striped.table-condensed.table-hover td:nth-child(1) > *:hover {font-size: 1em; opacity: 1;}
							i.iconSVPAM-help.svblue.tooltips {margin-top: 12px;}
							.select2-container-active .select2-choice, .select2-container-active .select2-choices {border: none !important;}
							.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
							.slimScrollDivH { overflow: auto; height: calc(100vh - 315px); }
							.datatable-scroll { height: 100%; overflow: auto; }
							table#myDataTableconhistory { height: auto; overflow: auto; width: max-content !important; padding-right: 10px;}
							thead { top: 0px; position: sticky; z-index: 2; }
							#myDataTableconhistory td:first-child, #myDataTableconhistory th:first-child { position: sticky; left: 0px; z-index: 1; }
							#myDataTableconhistory th {overflow-wrap: nowrap;text-wrap: nowrap !important;align-content: center;}
							#myDataTableconhistory td:is(:nth-child(1), :nth-child(2), :nth-child(3)) {white-space: nowrap;}
							.portlet.box.blue.no-col.no-adv2 { margin-bottom: 0; }
							ul.ver-inline-menu.tabbable.margin-bottom-10 { display: inline-flex; flex-direction: row; flex-wrap: wrap; gap: 10px; }
							#tab_1_2 > div > div.col-md-3 { padding: 0 5px; }
							#tab_1_2 > div { display: flex; flex-direction: column; }
							#myDataTableconhistory td:is(:nth-child(5), :nth-child(6)) { min-width: 300px; }
							/* render newlines in connection history */ td:is(:nth-child(5), :nth-child(6)) .subcelldiv { white-space: break-spaces; }
							.portlet.box.blue.no-col.no-adv2 { max-height: calc(100vh - 192px); overflow: scroll; }
							`);
			// custom styles for the cell overflow on hover
			GM_addStyle(`.collapsed-table .subcelldiv { max-height: 15px; overflow: hidden; }
							.collapsed-table .subcelldiv:hover {max-height: unset;position: absolute;z-index: 10;background: white;outline: 1px dotted; padding: 3px; top: 0; left: 0; box-shadow: 1px 1px 6px;}
							`);
			const pageTitleElement = document.querySelector('.page-title');
			if (pageTitleElement && pageTitleElement.textContent) {
				document.title = "🔗" + pageTitleElement.textContent;
			}

			// alt + w to turn table wrapping on and off
			const toggleTableWrap = (event) => {
				if (event.altKey && event.key === 'w') {
					const table = document.querySelector("#myDataTableconhistory");
					if (table.classList.contains("collapsed-table")) {
						table.classList.remove("collapsed-table");
					} else {
						table.classList.add("collapsed-table");
					}
				}
			}
			document.addEventListener('keydown', toggleTableWrap);

			const connectionObserver = new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					mutation.addedNodes.forEach(node => {
						// console.log(node.id);
						// if (node.nodeType === 1 && node.id === 'myDataTableconhistory_wrapper') {
						// 	const table = document.querySelector("#myDataTableconhistory");
						// 	// console.log(table);
						// }

						if (node?.nodeName === "TBODY") {
							// const table = document.querySelector("#myDataTableconhistory");
							// extendDataTables(table);

							if (!node.classList.contains("body-extended")) {
								console.log("tbody added for history table");
								const historyTable = document.querySelector("#myDataTableconhistory");
								extendDataTables(historyTable);
								node.classList.add("body-extended");
							}

							const cells = node.querySelectorAll('#myDataTableconhistory td');
							console.log("moving cell contents to inner divs");
							for (const cell of cells) {
								const tdSubDiv = document.createElement('div');
								tdSubDiv.classList.add('subcelldiv');
								tdSubDiv.innerHTML = cell.innerHTML;
								// cell text helps with setting widths of cells but too long and it makes table scroll too much to right so trimming text to first '—' (remove everything after) or first 100 chars
								if (cell.textContent.includes('—')) {
									cell.textContent = cell.textContent.substring(0, cell.textContent.indexOf('—'));
								}
								// cell.textContent = cell.textContent.substring(0, 100);
								// cell.textContent = "\u00A0";
								cell.textContent = "";
								cell.appendChild(tdSubDiv);
							}

							// showing diff
							applyTableTextDiff(
								"#myDataTableconhistory",
								4, // old value column
								5  // new value column
							);
						}
					});
				});
			});
			connectionObserver.observe(document.body, { childList: true, subtree: true });

			document.querySelectorAll('textarea').forEach(textarea => {
				textarea.setAttribute('spellcheck', 'false');
				textarea.setAttribute('tab-size', '4');
			})
			resizeTextarea();

			// textarea observer for making sure the textarea is ready else code mirror will start with empty editor
			// using a second observer as this one uses an "for of" loop to break out early
			const observer2 = new MutationObserver((mutations) => {
				let foundTextArea = false;
				for (const mutation of mutations) {
					for (const node of mutation.addedNodes) {
						if (document.querySelector('textarea')) {
							foundTextArea = true;
							break;
						}
					}
					if (foundTextArea) break;
				}
				if (foundTextArea) {
					observer2.disconnect();
					console.log("text areas loaded, applying code mirror editors");
					setTimeout(() => {
						applyCodeMirror("#CreateAccountJSON, #ENDPOINTS_FILTER, #CREATEACCOUNTJSON, #UPDATEACCOUNTJSON, #ENABLEACCOUNTJSON, #RESETANDCHANGEPASSWRDJSON, #REMOVEACCOUNTACTION, #groupImportMapping, #STATUSKEYJSON, #STATUS_THRESHOLD_CONFIG, #DISABLEACCOUNTJSON, #MODIFYUSERDATAJSON, #ConfigJSON, #ImportUserJSON, #UpdateUserJSON, #ImportAccountEntJSON, #UpdateUserJSON, #TicketStatusJSON, #CreateTicketJSON, #DELETEACCOUNTJSON, #ACCOUNTS_IMPORT_JSON, #AddAccessJSON, #RemoveAccessJSON, #UpdateAccountJSON, #EnableAccountJSON, #DisableAccountJSON, #ENTITLEMENT_FILTER_JSON, #ENTITLEMENT_ATTRIBUTE, #ACCOUNT_ATTRIBUTES, #RemoveAccountJSON", "json");
					}, 2000);
				}
			});
			observer2.observe(document.body, {
				childList: true,
				subtree: true
			});

		} else if (window.location.href.includes("ECM/ecmConfig/generalConfigNew")) {
			document.title = "⚙ Global Config";
			GM_addStyle("#myDataTabledynamicAttribute_register_user>tbody>tr>td:nth-child(2) {text-wrap: nowrap;}\
							.col-md-6:has(.dropdown-large) {width: fit-content;}\
							.form-group { justify-content: flex-start !important; text-wrap: wrap !important; border-bottom: 1px dashed #dddddd; border-radius: 0 !important; }\
							.form-group .checkbox {padding-left: 0;}\
							.control-label {padding: 0 !important;}\
							.form-group.chk-blk.chkBox-new-config>label {flex-basis: auto !important; padding: 0 !important;}\
							.chkBox-new-config .checker {position: absolute;top: 3px !important;left: -4px;}\
							.row {gap: 0px;}\
							.row:before {display: none;}\
							.clearfix {display: none;}\
							.info-text-checkbox {padding: 0 !important;}\
							.chkBox-new-config .chkBox-lbl-msg {margin-left: 20px !important;}\
							a.dropdown-toggle.select-multi-dropdown {border-radius: 5px !important;}\
							.portlet {border-radius: 10px !important;}\
							.col-md-6 {width: calc(50% - 5px);}\
							.form-body .col-md-6 {min-width: 200px;}\
							div#myDataTabledynamicAttribute_register_user_wrapper {width: calc(100vw - 170px) !important;}\
							a.dropdown-toggle.select-multi-dropdown {padding: 2px 8px;}\
							#pageLayout > div > div:nth-child(2) > div.col-md-6 {padding: 10px 5px 0 15px;}\
							.form-group>.col-md-6 { padding: 0 !important; }\
							#attrTable td { min-width: 150px; }\
							table#myDataTabledynamicAttribute_register_user td:nth-child(5) { min-width: 350px; }\
							");

			const observer = new MutationObserver(mutations => {
				mutations.forEach(mutation => {
					mutation.addedNodes.forEach(node => {
						if (node.nodeType === 1 && node.classList.contains('datatable-scroll')) {
							const table = node.querySelector('table');
							extendDataTables(table);
						}
						// console.log(node);

						if (document.querySelectorAll("#attvalue, #defaultvaluestext").length > 0) {
							if (!document.querySelector("#s2id_att_type")?.textContent?.includes("SQL")) return;
							["#attvalue", "#defaultvaluestext"].forEach(selector => {
								const element = document.querySelector(selector);
								if (element && element.style.display !== "none") {
									applyCodeMirror(selector, "sql");
								}
							})
						}
					});
				});
			});
			observer.observe(document.body, { childList: true, subtree: true });

		} else if (window.location.href.includes("admin/adminHome/manageLogs") || window.location.href.includes("/admin/logs")) {
			// --l-- --logs--

			GM_addStyle(`.logsWrapper {max-width: calc(100vw - 100px); width: 100%;}
						.log-entry {    border: 1px solid #ddd;    border-radius: 4px;    padding: 6px;    margin-bottom: 4px;    font-size: 12px; width = calc(100vw - 80px)}
						.log-entry.log-error {    border-color: #ff4444;    background: rgba(255, 0, 0, 0.05);}
						.log-header {    font-size: 11px;    margin-bottom: 4px;    opacity: 0.8;}
						.log-service { font-weight: bold; }
						.log-level { margin-left: 6px; text-transform: uppercase; }
						.log-time { float:right; }
						.log-class {    font-weight: bold;    color: #444;    margin-bottom: 4px; margin-left: 4px;}
						.log-msg {margin-left: 4px;overflow-wrap: break-word;}
						.log-red { color: red; font-weight:bold; }
						.log-orange { color: orange; font-weight:bold; }
						.log-green { color: limegreen; font-weight:bold; }
						.log-bold { font-weight: bold; }
						.log-url { color: blue; text-decoration: underline; }
						.log-index { background: #000000; padding: 0 4px; border-radius: 3px; margin-right: 6px; font-weight: bold; color: #ffffff; }
						.log-ui-panel { width: 100%; border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; border-radius: 6px; background: #f9f9f9; font-size: 13px; position: sticky; top: 69px; z-index: 10; box-shadow: 2px 2px 13px 0px;}
						.log-ui-section { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 10px; align-items: flex-end; margin: 3px 0; gap: 0 8px; }
						.log-ui-field { display: flex; flex-direction: column; } .log-ui-field input { padding: 0px 3px; border-radius: 4px; border: 1px solid #bbb; } .log-btn { padding: 6px 10px; border-radius: 6px; background: #0078ff; border: none; color: white; cursor: pointer; font-weight: bold; } .log-btn:hover { background: #005fcc; } .log-services-list { display: flex; gap: 8px; flex-wrap: wrap; } .log-service-check { background: #fff; padding: 0px 3px; border-radius: 4px; border: 1px solid #ddd; cursor: pointer; } .log-status { padding: 4px; font-style: italic; color: #666; }
						.Logs_defaultContainer__ogFg7 {justify-content: flex-start;margin-top: 0; height: auto; }
						.Logs_defaultContainer__2-Ayf {justify-content: flex-start;margin-top: 0;}
						.admin_container__u6eJe { width: 100%; margin: 0; padding: 15px; }
						div#logStatus { padding: 0; }
						label { display: flex; /* flex-direction: row; */ gap: 3px; }
						.log-level-list { display: flex; gap: 5px; }
						.log-ui-header-controls { display: flex; }
						/* Hide the emails being shown in the custom log viewer */
						.log-msg table { display: none; }
						`);

			function formatLogMessage(text) {
				if (!text) return "";
				return text
					.replace(/(error|exception|fail|unable)/gi, '<span class="log-red">$1</span>')
					.replace(/(warning|warn)/gi, '<span class="log-orange">$1</span>')
					.replace(/(response|calling|success)/gi, '<span class="log-green">$1</span>')
					.replace(/(\bhttps?:\/\/[^\s"'<>\[\]{}()|^`]*[^\s"'<>\[\]{}()|^`]\b)/gi, '<span class="log-url">$1</span>');
			}

			const SERVICE_STORAGE_KEY = "customLogViewer.selectedServices";

			function saveSelectedServices() {
				const selected = [...document.querySelectorAll(".service-select:checked")]
					.map(chk => chk.dataset.service);
				localStorage.setItem(SERVICE_STORAGE_KEY, JSON.stringify(selected));
			}

			function loadSelectedServices() {
				const saved = JSON.parse(localStorage.getItem(SERVICE_STORAGE_KEY) || "[]");
				if (!saved.length) return;

				document.querySelectorAll(".service-select").forEach(chk => {
					chk.checked = saved.includes(chk.dataset.service);
				});
			}

			// Create a button element
			const customLogViewerButton = document.createElement("button");
			customLogViewerButton.textContent = "Custom Log Viewer";
			customLogViewerButton.id = "toggleTableList";
			customLogViewerButton.title = "Ctrl + '";
			customButtonDiv.appendChild(customLogViewerButton);
			customLogViewerButton.addEventListener("click", () => {
				let container = document.querySelector('.Logs_defaultContainer__ogFg7');
				if (!container) {
					container = document.querySelector('.Logs_defaultContainer__2-Ayf');
				}
				container.innerHTML = '';

				(async function () {
					// Create UI controls
					const ui = document.createElement('div');
					ui.className = "log-ui-panel";

					ui.innerHTML = `
										<div class="log-ui-section">
											<div class="log-ui-field">
												<label>Search Key</label>
												<input id="logSearchKey" type="text" placeholder="optional keyword...">
											</div>

											<div class="log-ui-field">
												<label>From (Local Time)</label>
												<input id="logFrom" type="datetime-local">
											</div>

											<div class="log-ui-field">
												<label>To (Local Time)</label>
												<input id="logTo" type="datetime-local">
											</div>

											<div class="log-ui-field">
												<label>Last X minutes</label>
												<input id="logLastX" type="number" min="1" value="5">
											</div>

											<button id="btnLoadLogs" class="log-btn">Fetch Logs</button>
										</div>

										<div class="log-ui-section">
											<label style="font-weight:bold;">Services Filter</label>

											<div class = "log-ui-header-controls">
												<label>
													<input type="checkbox" id="servicesSelectAll" checked>
													Select All
												</label>
												&nbsp;&nbsp;
												<label>
													<input type="checkbox" id="servicesInvert">
													Invert Selection
												</label>
											</div>

											<div class="log-services-list">
												${["arsms", "authms", "bouncer", "certms", "connectorms", "ecm", "ecm-worker", "externalms", "gateway", "idwms", "notificationms", "userms", "windows-connectorms"].map(s => `
													<label class="log-service-check">
														<input type="checkbox" class="service-select" data-service="${s}" checked>
														${s}
													</label>
												`).join("")}
											</div>
										</div>

										<div class="log-ui-section">
											<label style="font-weight:bold;">Log Level Filter</label>
											<div class="log-level-list">
												${["NULL", "INFO", "DEBUG", "ERROR"].map(s => `
													<label class="log-level-check">
														<input type="checkbox" class="level-select" data-service="${s}" checked>
														${s}
													</label>
												`).join("")}
											</div>
										</div>

										<div class="log-ui-section">
											<div class="log-ui-field">
												<label>Highlight Keywords</label>
												<input id="logHighlightKeys" type="text" placeholder="keyword1, keyword2...">
											</div>

											<button id="btnHighlightLogs" class="log-btn">Highlight Logs</button>
										</div>

										<div id="logStatus" class="log-status"></div>
										`;

					container.appendChild(ui);

					// Load saved services on first render
					loadSelectedServices();

					// Save on individual service change
					document.querySelectorAll(".service-select").forEach(chk => {
						chk.addEventListener("change", () => {
							saveSelectedServices();
							updateSelectAllState();
						});
					});

					// Select All
					document.getElementById("servicesSelectAll").addEventListener("change", (e) => {
						const checked = e.target.checked;
						document.querySelectorAll(".service-select").forEach(chk => {
							chk.checked = checked;
						});
						saveSelectedServices();
					});

					// Invert selection
					document.getElementById("servicesInvert").addEventListener("change", () => {
						document.querySelectorAll(".service-select").forEach(chk => {
							chk.checked = !chk.checked;
						});
						saveSelectedServices();
						updateSelectAllState();
						document.getElementById("servicesInvert").checked = false; // reset toggle
					});

					// Keep Select All checkbox in sync
					function updateSelectAllState() {
						const all = [...document.querySelectorAll(".service-select")];
						const allChecked = all.every(chk => chk.checked);
						document.getElementById("servicesSelectAll").checked = allChecked;
					}

					// Initialize select-all state correctly
					updateSelectAllState();

					// Display area for logs
					const logsWrapper = document.createElement('div');
					logsWrapper.style.marginTop = '10px';
					logsWrapper.classList.add('logsWrapper');
					container.appendChild(logsWrapper);

					// Collect currently selected log levels
					function getSelectedLevels() {
						return [...document.querySelectorAll(".level-select:checked")]
							.map(chk => chk.dataset.service.toUpperCase());
					}

					// Hide/show already rendered logs
					function applyLevelFilters() {
						const allowedLevels = getSelectedLevels();

						document.querySelectorAll(".log-entry").forEach(entry => {
							const level = entry.dataset.level?.toUpperCase() || "";

							// If level exists in checkboxes → filter using them
							if (allowedLevels.includes(level) ||
								!document.querySelector(`.level-select[data-service="${level}"]`)
							) {
								// show: either allowed OR level is unknown
								entry.style.display = "";
							} else {
								entry.style.display = "none";
							}
						});
					}

					// Attach listeners to log-level checkboxes
					document.querySelectorAll(".level-select").forEach(chk => {
						chk.addEventListener("change", applyLevelFilters);
					});

					async function fetchLogs() {
						logsWrapper.innerHTML = "";
						document.getElementById("logStatus").textContent = "Fetching logs...";

						const searchKey = document.getElementById("logSearchKey").value.trim();

						let from = document.getElementById("logFrom").value;
						let to = document.getElementById("logTo").value;
						const lastX = parseInt(document.getElementById("logLastX").value) || 5;

						const nowUTC = new Date();
						const xMinutesAgoUTC = new Date(Date.now() - lastX * 60000);

						// Auto-fill rules
						if (!from && !to) {
							to = nowUTC.toISOString();
							from = xMinutesAgoUTC.toISOString();
						} else if (from && !to) {
							to = nowUTC.toISOString();
						}

						// Final ISO conversion to ensure correct format
						from = new Date(from).toISOString();
						to = new Date(to).toISOString();

						const accessToken = await getAccessToken();

						let searchAfter = "";
						let totalFetched = 0;

						const headers = {
							"Authorization": `Bearer ${accessToken}`,
							"Content-Type": "application/json"
						};

						let callCount = 0;

						async function fetchBatch() {
							callCount++;
							if (callCount > 5) {
								console.log("Reached maximum batch fetch limit (5).");
								return false;
							}

							const selectedServices = [...document.querySelectorAll(".service-select:checked")]
								.map(chk => chk.dataset.service);

							const body = {
								searchKey,
								fromDate: from,
								toDate: to,
								searchAfter,
								recordsCount: LOG_RECORDS_PER_CALL,
								servicename: selectedServices
							};

							const response = await fetch(`${baseUrl}/ECMv6/api/logms/logsearch`, {
								method: "POST",
								headers,
								body: JSON.stringify(body)
							});

							const data = await response.json();

							if (!data.logs || data.logs.length === 0) {
								document.getElementById("logStatus").textContent =
									`No more logs. Total fetched: ${totalFetched}`;
								return false;
							}

							// ---- BUFFER & MERGE (NO DOM TOUCHING HERE) ----
							const mergedLogs = [];
							let last = null;

							for (const log of data.logs) {
								totalFetched++;

								const level = log.level?.trim() ? log.level.toUpperCase() : "NULL";
								const message = log.message;

								const canMerge =
									last &&
									last.servicename === log.servicename &&
									last.threadName === log.threadName &&
									last.className === (log.className || "") &&
									(last.level === level || level === "NULL");

								if (canMerge) {
									last.messages.push(message);
									continue;
								}

								last = {
									servicename: log.servicename,
									threadName: log.threadName,
									className: log.className || "",
									level,
									searchId: log.searchId,
									timestamp: log.timestamp,
									messages: [message]
								};

								mergedLogs.push(last);
							}

							// ---- RENDER ONCE USING DOCUMENT FRAGMENT ----
							const fragment = document.createDocumentFragment();

							for (const log of mergedLogs) {
								const item = document.createElement("div");
								item.className = "log-entry";
								if (log.level === "ERROR") item.classList.add("log-error");

								item.dataset.service = log.servicename;
								item.dataset.level = log.level;
								item.dataset.thread = log.threadName;
								item.dataset.class = log.className;

								const utcDate = new Date(log.timestamp);
								const localFormatted = utcDate.toLocaleString("en-GB", {
									day: "numeric",
									month: "short",
									hour: "numeric",
									minute: "numeric",
									hour12: true
								});

								item.innerHTML = `
													<div class="log-header">
														<span class="log-index">#${totalFetched}</span>
														<span class="log-service">Service: ${log.servicename}</span>
														<span class="log-level">Level: ${log.level}</span>
														<span class="log-searchid"> | SearchID: ${log.searchId}</span>
														<span class="log-thread"> | Thread: ${log.threadName}</span>
														<div class="log-time">
															<span class="log-time-local">${localFormatted}</span>
															<span class="log-time-utc">(UTC: ${log.timestamp})</span>
														</div>
													</div>
													<div class="log-class">${log.className ? `Class: ${log.className}` : ""}</div>
													<div class="log-msg">${log.messages.join("<br>")}</div>
												`;

								fragment.appendChild(item);
							}

							logsWrapper.appendChild(fragment);

							applyLevelFilters();

							searchAfter = data.logs[data.logs.length - 1].searchId;
							document.getElementById("logStatus").textContent =
								`Fetched: ${totalFetched} | Batch: ${callCount}/5`;

							return data.logs.length === LOG_RECORDS_PER_CALL;
						}

						// Pagination loop (max: 5 calls)
						while (await fetchBatch()) { }

					}

					document.getElementById("btnLoadLogs").addEventListener("click", fetchLogs);

					function highlightKeywords() {
						const highlightString = document.getElementById("logHighlightKeys").value;
						// split the string at commas and apply highlights
						const words = highlightString.split(",");
						const highlightRules = words.map(word => ({ word: word.trim(), highlightName: "magentaHighlight", whole: false }));
						applyHighlights(".log-msg", highlightRules);
					}

					document.getElementById("btnHighlightLogs").addEventListener("click", function () {
						highlightKeywords();
					})
					document.getElementById("logHighlightKeys").addEventListener("keyup", function (event) {
						if (event.key === "Enter") {
							highlightKeywords();
						}
					})
				})();
			});
		} else if (window.location.href.includes("ECM/transportAsync/export")) {
			GM_addStyle("label.col-sm-3.control-label {padding: 0;}\
							.form-group.btm-ExtraSpacing {display: flex;flex-direction: column;align-content: flex-start;justify-content: flex-start;align-items: flex-start !important;flex-wrap: wrap;}\
							.row.form-group.btm-ExtraSpacing {width: 100%;margin: 0;}\
							.row {margin: 5px;}\
							div.dataTables_wrapper {background: transparent;}\
							.col-md-12.tsp-package {margin: 5px 0;padding: 3px;font-size: small;}\
							.col-md-5 {padding: 0;}\
							div.col-md-6 {width: calc(50vw - 100px);}\
							td {white-space: normal !important;}\
							a.btn.btn.btn.btn.btn.btn {padding: 2px !important;}\
							");
		} else if (window.location.href.includes("ECM/analyticsHistoryES/analyticsDetails")) {
			GM_addStyle(`.customScrollDiv, .slimScrollDiv {overflow: auto !important;height: auto !important;}
							td {text-wrap-mode: nowrap;}
							/* scrollable tables */
							.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
							.slimScrollDivH { overflow: auto; height: calc(100vh - 221px); }
							.datatable-scroll { height: 100%; overflow: auto; }
							table#analyticsDetailsList { height: auto; overflow: auto; }
							thead { top: 0px; position: sticky; z-index: 2; }
							/* ---------------- */
							`);
		} else if (window.location.href.includes("ECM/analyticsConfig/runtimeanalytics")) {
			GM_addStyle(`/* scrollable tables */
							.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
							.slimScrollDivH { overflow: auto; height: calc(100vh - 221px); }
							.datatable-scroll { height: 100%; overflow: auto; }
							table#analyticsDetailsList { height: auto; overflow: auto; }
							thead { top: 0px; position: sticky; z-index: 2; }
							/* ---------------- */
							`);
		} else if (window.location.href.includes("ECM/jbpmworkflowmanagement/list")) {
			document.title = "== ➡️ Workflows ==";
		} else if (window.location.href.includes("ECM/jbpmworkflowmanagement/showWorkflow")) {
			const pageTitleElement = document.querySelector('.page-title');
			if (pageTitleElement && pageTitleElement.textContent) {
				document.title = "➡️" + pageTitleElement.textContent;
			}
		} else if (window.location.href.includes("ECM/ecmEmailTemplate/list")) {
			// --email--
			document.title = "== ✉️ Email Templates ==";
			GM_addStyle(`td:nth-child(1) {min-width: 300px;}
							td:nth-child(2), td:nth-child(3) {min-width: 200px;}
							.row:has(>.pagingBlock) {position: fixed;bottom: 20px;box-shadow: 2px 3px 6px 0px #0000007a;}
							.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
							.slimScrollDivH { overflow: auto; height: calc(100vh - 230px); }
							.datatable-scroll { height: 100%; overflow: auto; }
							table#emaillist { height: auto; overflow: auto; }
							thead { top: 0px; position: sticky; z-index: 2; }
							#emaillist td:first-child, #emaillist th:first-child { position: sticky; left: 0px; z-index: 1; }
							#emaillist th {overflow-wrap: nowrap;text-wrap: nowrap !important;align-content: center;}
							`);
		} else if (window.location.href.includes("ECM/savRoles/list")) {
			document.title = "== 👨‍💼 SAV Roles ==";
		} else if (window.location.href.includes("ECM/entitlement_values/show")) {
			// Press escape key to press close button
			document.addEventListener('keydown', function (event) {
				const closeModalButton = document.querySelector("body > div.modal-scrollable > div > div.modal-footer > button");
				if (event.key === 'Escape' && closeModalButton) {
					closeModalButton.click();
				}
			})
		} else if (window.location.href.includes("ECM/users/auditLogs")) {
			GM_addStyle(`.row { padding: 0 !important; }
							.form-inline.row { display: grid; grid-template-columns: 0 1fr 1fr 1fr 1fr 0; gap: 0 10px; padding: 0 10px !important; }
							.form-group.col-sm-3.custom_col { place-self: stretch; width: 100%; }
							.text-right.btnArea.audit-btnArea { padding: 0px !important; margin: 0px !important; place-self:  flex-end start; }
							table#auditLogsJson { border-collapse: collapse !important; }
							th { text-wrap-mode: nowrap !important; }
							.row.dtProcessing { display: grid; grid-template-columns: 0 165px 1fr 1fr 0; margin-top: 26px; }
							.btn-group.pull-right.column-list { left: 90px; top: 8px !important; float: left !important; }
							.dropdown.pull-right.audit-action-btn { left: 15px; top: 15px !important; float: left !important; }
							.col-md-7.searchBlock.searchBlock.searchBlock.searchBlock.searchBlock.searchBlock { width: fit-content; right: 0 !important; }
							.col-md-5.recordsBlock { width: fit-content; }
							input#dtsearch_auditLogsJson { width: 300px !important; }
							.dataTables_wrapper {height: 100%;max-height: 100%;scrollbar-width: thin;}\
							.slimScrollDivH { overflow: auto; height: calc(100vh - 413px); }
							.datatable-scroll { height: 100%; overflow: auto; }
							table#auditLogsJson { height: auto; overflow: auto; }
							thead { top: 0px; position: sticky; z-index: 2; }
							#auditLogsJson th {overflow-wrap: nowrap;text-wrap: nowrap !important;align-content: center;}
							.portlet.box.no-adv2.audit-log-list {margin: 0;}
							`);
		} else if (window.location.href.includes("ECM/savRoles/applicationRestart")) {
			GM_addStyle("button.btn.green {margin-right: 0 !important;}\
							");
		} else if (window.location.href.includes("ECM/campaign/list")) {
			GM_addStyle("i.icon-trash.svred.iconSVYNT-delete.svblue.tooltips {top: -11px;}\
							");
		} else if (window.location.href.includes("ECM/roles/list")) {
			// --rl-- --role--
			GM_addStyle(`.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}
							.slimScrollDivH { overflow: auto; height: calc(100vh - 245px); }
							.datatable-scroll { height: 100%; overflow: auto; }
							table#roleList { height: auto; overflow: auto; }
							thead { top: 0px; position: sticky; z-index: 2; }
							#roleList td:first-child, #roleList th:first-child { position: sticky; left: 0px; z-index: 1; }
							#roleList th {overflow-wrap: nowrap;text-wrap: nowrap !important;align-content: center;}
							.portlet.box.blue.no-col {margin-bottom: 0px !important;}
							/* modal elements */
							p.help-block { font-size: small; }
							.modal-body .form-group:has(.has-switch) { flex-direction: column !important; }
							.form-row-seperated .form-group { border: none !important; }
							label.control-label { font-weight: bold; }
							/* export role button */
							#pageLayout > div > div:nth-child(2) > div.col-md-12 > div > div.portlet-title > div.actions > div:nth-child(2) > a { padding: 5px !important; }
							`);
		} else if (window.location.href.includes("ECM/certificateManagement/certificateList")) {
			GM_addStyle(`a.btn.svicon { margin-top: -32px; }
							.modal-body .form-group { display: grid; grid-template-columns: 200px 1fr; justify-items: stretch; /* align-items: stretch; */ /* justify-content: stretch; */ align-content: stretch; /* max-width: 100%; */ }
							#createUpdateCertificate>div>div:nth-child(3)>div>div { display: grid; grid-template-columns: 1fr 1fr; }
							#CertificateUploadDiv { grid-column: 1 / span 2; }
							label.col-md-4.control-label { left: 0 !important; }
							div#CertificateUploadDiv { right: unset !important; padding: 0; width: 100%; }
							.input-group { display: grid; }
							.col-md-8 { /* width: 100% !important; */ }
							select#certificateList { width: 100%; }
							span.uneditable-input { width: 100%; }
							span.input-group-btn { width: 100%; }
							`);
		} else if (window.location.href.includes("ECM/roles/show")) {
			GM_addStyle("th { width: auto;}\
							");
		} else if (window.location.href.includes("ECM/ecmConfig/create/MAILCONFIG")) {
			GM_addStyle("#tab_1_2 > .row { display: flex; flex-direction: column; }\
							ul#sendreceivetile { display: flex; gap: 10px; }\
							.col-md-9 { width: 100%; max-width: 1400px; }\
							");
		} else if (window.location.href.includes("ECM/ecmEmailTemplate/show")) {
			// --emailshow--
			GM_addStyle("#pageLayout > div > div.row.inbox > div.col-md-3 { display: none; }\
							#pageLayout > div > div.row.inbox > div.col-md-9 > div > div.portlet-title { display: none; }\
							.col-md-9 { width: 100%; max-width: 1400px; }\
							");
		} else if (window.location.href.includes("ECM/ecmEmailTemplate/create")) {
			// --emailcreate--
			GM_addStyle(`#pageLayout > div > div.row.inbox > div.col-md-3 { display: none; }
							span.inbox-cc-bcc {display: none !important;}\
							.controls { margin: 0 !important; padding: 0 !important; }
							.inbox-form-group.mail-to { display: grid; grid-template-columns: 90px 1fr; }
							a.close { display: none; }
							`);
			resizeTextarea();

			// show cc and bcc fields
			document.querySelector("#createemailtemplate > div.inbox-form-group.input-cc").classList.remove("display-hide");
			document.querySelector("#createemailtemplate > div.inbox-form-group.input-bcc").classList.remove("display-hide");
			// for adding grid css layout
			document.querySelector("#createemailtemplate > div.inbox-form-group.input-cc").classList.add("mail-to");
			document.querySelector("#createemailtemplate > div.inbox-form-group.input-bcc").classList.add("mail-to");

			// activate advanced html editor
			// textarea observer for making sure the textarea is ready else code mirror will start with empty editor
			// using "for of" loop to break out early
			const emailEditObserver = new MutationObserver((mutations) => {
				let foundTextArea = false;
				for (const mutation of mutations) {
					for (const node of mutation.addedNodes) {
						if (document.querySelector('textarea')) {
							foundTextArea = true;
							break;
						}
					}
					if (foundTextArea) break;
				}
				if (foundTextArea) {
					emailEditObserver.disconnect();
					console.log("text areas loaded, applying code mirror editors");
					applyCodeMirror("#advtemplatecontenthtml", "html");
				}
			});
			emailEditObserver.observe(document.body, {
				childList: true,
				subtree: true
			});

		} else if (window.location.href.includes("ECM/ecmEmailTemplate/edit")) {
			GM_addStyle(`.controls { margin: 0 !important; padding: 0 !important; }
							label.control-label { text-align: left !important; padding: 0 4px; color: black !important; height: 0;}
							.input-cc, .input-bcc { display: block !important; }
							.row.inbox { display: flex; flex-direction: column; }
							#pageLayout > div > div.row.inbox > div.col-md-3 { display: none; }
							.col-md-9 { width: 100%;}
							#ecmemail > div { display: grid; grid-template-columns: 150px 1fr; }
							.inbox-form-group.mail-to { grid-column: 1 / span 2; grid-row: 3; }
							.inbox-form-group.input-cc.display-hide { grid-column: 1 / span 2; grid-row: 4; }
							.inbox-form-group.input-bcc.display-hide { grid-column: 1 / span 2; grid-row: 5; }
							#ecmemail > div > div:nth-child(8) { grid-column: 1 / span 2; grid-row: 6; }
							#ecmemail > div > div:nth-child(9) { grid-column: 1 / span 2; grid-row: 7; }
							div#htmltextdiv { grid-column: 1 / span 2; grid-row: 8; }
							div#advhtmltextdiv { grid-column: 1 / span 2; grid-row: 9; }
							span.inbox-cc-bcc {display: none !important;}
							#ecmemail>div { display: grid; grid-template-columns: 150px 1fr; }
							#ecmemail>div>div.inbox-form-group.mail-to { grid-column: 1 / span 2; grid-row: 3; display: grid !important; grid-template-columns: 150px 1fr; }
							.inbox-form-group.input-cc.display-hide { grid-column: 1 / span 2; grid-row: 4; display: grid !important; grid-template-columns: 150px 1fr; }
							.inbox-form-group.input-bcc.display-hide { grid-column: 1 / span 2; grid-row: 5; display: grid !important; grid-template-columns: 150px 1fr; }
							#ecmemail>div>div:nth-child(8) { grid-column: 1 / span 2; grid-row: 6; display: grid; grid-template-columns: 150px 1fr; }
							#ecmemail>div>div:nth-child(9) { grid-column: 1 / span 2; grid-row: 7; }
							div#htmltextdiv { grid-column: 1 / span 2; grid-row: 8; }
							div#advhtmltextdiv { grid-column: 1 / span 2; grid-row: 9; }
							form#deleteForm { position: fixed; bottom: 11px; background: white; padding: 8px; border-radius: 10px; box-shadow: 3px 3px 4px 2px #00000045; }
							button.btn.red { background-color: #ff9999 !important; color: white !important; }
							button.btn.red:hover { background-color: #ff0000ff !important; color: white !important; }
							.portlet-body { display: grid; grid-template-columns: 1fr 1fr; gap: 0 10px; }
							iframe { width: 100%; height: calc(100vh - 200px); margin-bottom: 20px; }
							`);
			resizeTextarea();

			// email template preview
			(function () {
				const ta = document.querySelector("textarea#advtemplatecontenthtml");
				if (!ta) return console.warn("Textarea not found");

				// Create preview iframe
				const iframe = document.createElement("iframe");

				// Insert iframe
				const portletBody = document.querySelector(".portlet-body");
				portletBody.appendChild(iframe);

				// Function to update preview
				function updatePreview() {
					const doc = iframe.contentDocument || iframe.contentWindow.document;
					doc.open();
					doc.write(ta.value);
					doc.close();
				}

				// Initial preview
				updatePreview();

				// Auto-update on input
				ta.addEventListener("input", updatePreview);

				console.log("HTML preview loaded.");
			})();

			// textarea observer for making sure the textarea is ready else code mirror will start with empty editor
			// using "for of" loop to break out early
			const emailEditObserver = new MutationObserver((mutations) => {
				let foundTextArea = false;
				for (const mutation of mutations) {
					for (const node of mutation.addedNodes) {
						if (document.querySelector('textarea')) {
							foundTextArea = true;
							break;
						}
					}
					if (foundTextArea) break;
				}
				if (foundTextArea) {
					emailEditObserver.disconnect();
					console.log("text areas loaded, applying code mirror editors");
					applyCodeMirror("#advtemplatecontenthtml", "html");
				}
			});
			emailEditObserver.observe(document.body, {
				childList: true,
				subtree: true
			});

		} else if (window.location.href.includes("ECM/hanaRule/executionTrailList")) {
			GM_addStyle(`#pageLayout > div > br:nth-child(2), #pageLayout > div > br:nth-child(3) { display: none; }
							#tab_1_1 > div.row > div > div > br { display: none; }
							.disclaimer { padding: 0 3px; }
							#tab_1_1 > br:nth-child(2), #tab_1_1 > br:nth-child(3) { display: none; }
							#tab_1_1 > div.portlet.box.blue.no-col > div.row { display: grid; grid-template-columns: 0 1fr 1fr 1fr 62px 0; padding: 0 11px; max-width: 1400px; gap: 0 10px; height: 35px; }
							.col-md-4, .col-md-3, .col-md-1 { padding: 0; width: 100%; }
							#tab_1_1 > div.portlet.box.blue.no-col > br { display: none; }
							label.control-label.col-md-2 { padding: 0 5px; outline: 1px dashed #bdbdbd; height: 26px; place-content: center; }
							select#et_statusFilter { width: 100% !important; }
							#tab_1_2 > div:nth-child(2) { display: grid; grid-template-columns: 0 1fr 1fr 1fr 62px 0; padding: 0 11px; max-width: 1400px; gap: 0 10px; height: 35px; }
							select#rr_statusFilter { width: 100% !important; }
							select#rr_ar_statusFilter { width: 100% !important; }
							#tab_1_3>div.row { display: grid; grid-template-columns: 0 1fr 1fr 1fr 62px 0; padding: 0 11px; max-width: 1400px; gap: 0 10px; height: 35px; }
							#tab_1_2>br:nth-child(1), #tab_1_3>br:nth-child(1), #tab_1_3>br:nth-child(3), #tab_1_3>br:nth-child(4), #tab_1_2>br:nth-child(4), #tab_1_2>br:nth-child(5) { display: none; }
							.btn-group.pull-right { float: left !important; padding: 5px 5px; }
							ul.dropdown-menu { left: 4px !important; right: unset !important; top: 31px; }
							.dataTables_wrapper {overflow: hidden;height: 100%;max-height: 100%;scrollbar-width: thin; max-width: calc(100vw - 150px);}\
							.slimScrollDivH { overflow: auto; height: calc(100vh - 327px); }\
							.datatable-scroll { height: 100%; overflow: auto; }\
							table#userrulerundataarchive { height: auto; overflow: auto; }\
							thead { top: 0px; position: sticky; z-index: 2; }\
							#userrulerundataarchive td:first-child, #userrulerundataarchive th:first-child { position: sticky; left: 0px; z-index: 1; }\
							#userrulerundataarchive th {overflow-wrap: nowrap;text-wrap: nowrap !important;align-content: center;}\
							`)
		} else if (window.location.href.includes("ECM/policyRule/show")) {
			GM_addStyle(`#pwdExpiry > div.row > div { margin-left: 15px; }
							#helpdeskservice .row, #userLockoutPolicy .row { padding: 0 15px; }
							small.popovers { position: absolute; left: 207px; z-index: 1; top: 2px; }
							#createpolicy > div.row.profile > div > div > div.portlet-body.form > div.form-body > div:nth-child(12) > div:nth-child(3) > div > sapn, #requiredField, #userLockoutPolicy > div > div > div:nth-child(1) > div > span, #userLockoutPolicy > div > div > div:nth-child(2) > div > span { position: absolute; left: 212px; top: -8px; }
							#daystonotifyrow > div > div { margin-top: 18px; }
							`)
		} else if (window.location.href.includes("xxxxxxxxxxxxxxxxxxxxxxxxxxxx")) {
			GM_addStyle(`
							`)
		} else if (window.location.href.includes("ECM/dataset/create")) {
			GM_addStyle(`.col-md-6 { padding: 0 !important; }
							.row { margin: 0 !important; }
							.form-group { padding: 0 10px !important; }
							#createDataset > div > div > div:nth-child(3) > div > div { display: grid; grid-template-columns: 104px 9px 1fr; }
							textarea#attributeConfig { grid-column: 1 / span 3; }
							#createDataset > div > div > div.portlet.box.blue.col.no-adv {top: 2px;padding: 0 !important;}
							p#selectFile { grid-row: 1; }
							.col-md-12 { padding: 0; }
							.form-actions.right { margin-left: 5px; }
							#createDataset > div > div > div:nth-child(5) > div > div { display: grid; }
							`)
		} else if (window.location.href.includes("ECM/grails/login.dispatch")
			|| window.location.href.includes("ECM/login/unauthorized")
			|| window.location.href.includes("/ECM/flatViewJobcontrol/jobstatus?_=")
			|| window.location.href.includes("ECM/login/loginfailed")) {
			// INVALID PAGES ; REDIRECT TO HOME
			setTimeout(() => {
				const homeUrl = baseUrl + "/ECM"
				console.log("Routing to home: " + homeUrl);
				window.location.href = homeUrl;
			}, 10);
		} else if (window.location.href.includes("ECM/flatViewJobcontrol/fireJobAction")) {
			// INVALID PAGE ; REDIRECT TO JOB CONTROL
			setTimeout(() => {
				window.location.href = `${baseUrl}/ECM/flatViewJobcontrol/flatViewJobList`;
			}, 500);
		} else if (window.location.href.includes("ECMv6/request/requestHome")) {
			setInterval(() => {
				window.location.reload();
			}, 120000);

			GM_addStyle(`td:nth-child(4) {text-wrap: wrap !important;}
					`);
			addJumpToUsrFields();
		} else if (window.location.href.includes("/ECM/users/update")) {
			addJumpToUsrFields();
		}

		// devs at saviynt use !imporant in table css, we need to do this to override with own important property
		const tables = document.querySelectorAll('table.table');
		tables.forEach(table => {
			table.style.setProperty('max-width', 'fit-content', 'important');
		});
		const dropdownfields = document.querySelectorAll('.adjuestField .select2-container .select2-choice');
		dropdownfields.forEach(field => {
			field.style.setProperty('height', 'fit-content', 'important');
		});

		// BUTTON TO FETCH 100 records for all tables
		// const tableLoadAndSortButton = document.createElement("button");
		// tableLoadAndSortButton.id = "tableLoadAndSortButton";
		// tableLoadAndSortButton.textContent = "Load Tables";
		// tableLoadAndSortButton.title = "Ctrl + 1";
		// // Add the tableLoadAndSortButton to the page
		// customButtonDiv.appendChild(tableLoadAndSortButton);
		// // Add an event listener to the tableLoadAndSortButton
		// tableLoadAndSortButton.addEventListener("click", () => {
		// 	const dataTables = document.querySelectorAll('table.dataTable');
		// 	dataTables.forEach(table => {
		// 		extendDataTablesTo100Rows(table);
		// 	});
		// });

	} else if (window.location.href.includes("login.microsoftonline.com")) {
		// Function to check if #tilesHolder exists and run the logic, this is the element containing all MS accounts
		function waitForTilesHolderAndProcess() {
			const tilesHolder = document.querySelector("#tilesHolder");
			if (tilesHolder) {
				Array.from(tilesHolder.children).forEach(accountRow => {
					let accountText = accountRow.textContent;
					if ((/@[^.\s]{3}\.[^.\s]{3}/i.test(accountText) && window.location.href.includes("ff9c7474-421d-4957-8d47-c4b64dec87b5")) ||
						(/@[^.\s]{7}\.[^.\s]{3}/i.test(accountText) && window.location.href.includes("f66fae02-5d36-495b-bfe0-78a6ff9f8e6e")) ||
						(/@[^.\s]{3}\.[^.\s]{2}\.[^.\s]{3}/i.test(accountText) && window.location.href.includes("5b973f99-77df-4beb-b27d-aa0c70b8482c"))) {
						const button = accountRow.querySelector('[role="button"]');
						if (button) {
							button.click();
						}
					}
				});
			} else {
				setTimeout(waitForTilesHolderAndProcess, 500); // Check every 500ms till #tilesHolder is found
			}
		}
		waitForTilesHolderAndProcess();
	} else {
		// FOR NEO UI PAGES
		console.log("NEO");
		if (window.location.href.includes("ECM/jbpmworkflowmanagement/showmyhistoryrequests")
			|| window.location.href.includes("ECM/jbpmworkflowmanagement/viewopenrequests")) {
			GM_addStyle("td {padding: 7px !important;}\
							");
		} else if (window.location.href.includes("ECM/workflowmanagement/createrequestfirststep")) {
			GM_addStyle("tr {padding: 10px !important;}\
							");
		} else if (window.location.href.includes("ECM/jbpmworkflowmanagement/showrequestdetails")) {
			GM_addStyle(".modal-body .slimScrollDiv { height: auto !important; }\
							.modal-body .scrollerhistory { height: auto !important; }\
							.ui-dialog { max-height: calc(90vh - 90px); overflow: scroll; }\
							");
			addJumpToUsrFields();
		} else if (window.location.href.includes('ECM/workflowmanagement/requestaccessforothers')) {
			GM_addStyle("tr {padding: 10px !important;}\
							");
		} else if (window.location.href.includes('ECM/campaign/create')) {
			GM_addStyle("body {font-family: 'Roboto', 'Tahoma', sans-serif !important; background-color: #f9fafc !important;}\
							.form-group {margin-bottom: 3px;}\
							");
		} else if (window.location.href.includes('ECMv6/admin/adminHome/uiConfig/manage-labels')) {
			GM_addStyle(`.admin_page__sJajD { display: none; }
							.MuiBox-root.jss144 { padding: 0 !important; }
							.UIBrandConfiguration_container__6AwGJ { top: 0 !important; }
							.divTableCell.msgValue { padding: 3px; }
							.divTableCell.msgKey { padding: 10px; }
							.MuiInputBase-root.jss280.MuiInputBase-formControl.MuiInputBase-multiline { margin-bottom: 0px; padding-bottom: 0; margin-top: 7px; }
							.UIBrandConfiguration_active__LdAUa.UIBrandConfiguration_linkContainer__whKnD { padding: 10px 0 !important; }
							#full-width-tabpanel-2 > div > div.gridContainer.changeLabel > div.GridBoot_gridFilter__Q-gP5 > div > div.grid-filterBlk.d-flex > div > div > div > svg { margin-top: 5px; }
							`);

		} else if (window.location.href.includes('ECM/login/auth') || window.location.href.includes('ECM/logout/logout')) {
			document.title = "🧧🧧🧧🧧LOGIN🧧🧧🧧🧧";
		}
	}

	// }, 1000); // 2000 milliseconds (adjust as needed) // if using timeout
	// } // if using Window.onload
	//end

})();