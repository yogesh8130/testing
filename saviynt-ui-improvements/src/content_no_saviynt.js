(async function () {
    'use strict';

    const { GM_addStyle, GM_getValue, GM_setValue, pageDataTable, callPageFunction, runScriptsInPage } = await globalThis.__saviyntShim.ready;

    if (window.location.hostname === 'saviyntsupport.saviynt.com') {

        GM_addStyle(".fr-wrapper {height: auto !important;}\
				div#header-container {padding: 0;}\
				header#header-main {padding: 0;min-height: 10px;}\
				section {margin-top: 5px !important;margin-bottom: 5px !important;}\
				.requester-info {margin: 5px 0 !important;}\
				.description {margin: 5px 0 !important;}\
				.fs-attachment {margin-bottom: 0px !important;}\
				.ticket-show-operations {margin: 0px 24px !important;}\
				section.ticket-show-header {padding: 0 !important;}\
				section.ticket-show-header.is_stuck {top: -5px !important;}\
				.ticket-main-info {padding: 0px !important;}\
				");

        // Function to format the date
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }

        // Function to update time elements
        function updateTimeElements() {
            const timeElements = document.querySelectorAll('time[data-timeago="true"]');
            timeElements.forEach(function (timeElement) {
                let date = timeElement.getAttribute('data-date');
                if (date) {
                    timeElement.textContent = timeElement.textContent + " (" + formatDate(date) + ")";
                }
            });
        }

        // Initial update on page load
        updateTimeElements();

        // Set up a MutationObserver to detect new elements
        const observer = new MutationObserver(function (mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // Check if any new <time> elements have been added
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1 && node.classList.contains('note-detail-card')) {
                            const timenode = node.querySelector('time[data-timeago="true"]');
                            let date = timenode.getAttribute('data-date');
                            if (date) {
                                timenode.textContent = timenode.textContent + " (" + formatDate(date) + ")";
                            }
                        } else if (node.parentElement && node.parentElement.nodeType === 1 && node.parentElement.tagName === 'TIME' && !node.nodeValue.match(/\d{4}/)) {
                            let date = node.parentElement.getAttribute('data-date');
                            if (date) {
                                node.parentElement.textContent = node.parentElement.textContent + " (" + formatDate(date) + ")";
                            }
                        }
                    });
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

    }

    if (window.location.hostname.includes('service-now.com')) {

        GM_addStyle(`::highlight(lightGreenHighlight) { background: #c6ffb3; }
				::highlight(deepRedHighlight){ background: #ff0000ff; color: white;}
				::highlight(lightRedHighlight)   { background: #ffb3b3; }
				::highlight(lightYellowHighlight){ background: #ffe9a6; }
				::highlight(yellowHighlight){ background: yellow; }
				::highlight(magentaHighlight){ background: magenta; }
				::highlight(limeHighlight){ background: lime; }
				::highlight(aquaHighlight){ background: aqua; }
				::highlight(orangeHighlight){ background: orange; color: white;}
				`);

        // helper for applyHighlights
        function isWordBoundary(char) {
            return !char || !/[A-Za-z0-9_]/.test(char);
        }

        function escapeRegExp(s) {
            return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }

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

        if (window.location.href.includes("pa_dashboard.do")) {
            // auto refresh for SNOW dashboard
            setInterval(() => {
                if (document.visibilityState == 'visible') return;
                window.location.reload();
            }, 120000);
        }

        const pageLoadedInterval = setInterval(() => {
            if (document.querySelector("#page_timing_div")) {

                console.log("PAGE LOADED");

                applyHighlights(".sn-widget-list-table-cell", [
                    { word: "Assignment group", highlightName: "limeHighlight", whole: true },
                ])

                clearInterval(pageLoadedInterval);
            }
        }, 1000);
    }

})();