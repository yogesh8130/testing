'use strict';

const SETTING_KEY = 'tabManagerEnabled';
const checkbox = document.getElementById('tab-manager-enabled');
const status = document.getElementById('status');

async function loadSetting() {
	const stored = await chrome.storage.sync.get(SETTING_KEY);
	checkbox.checked = stored[SETTING_KEY] !== false;
}

checkbox.addEventListener('change', async () => {
	await chrome.storage.sync.set({ [SETTING_KEY]: checkbox.checked });
	status.textContent = checkbox.checked ? 'Tab management enabled.' : 'Tab management disabled.';
});

loadSetting();
