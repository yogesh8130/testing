'use strict';

const SETTING_KEY = 'tabManagerEnabled';
const checkbox = document.getElementById('tab-manager-enabled');
const stateLabel = document.getElementById('state-label');
const openOptionsButton = document.getElementById('open-options');

function updateUi(enabled) {
	checkbox.checked = enabled;
	stateLabel.textContent = enabled ? 'Enabled' : 'Disabled';
	stateLabel.style.color = enabled ? '#16825d' : '#777';
}

async function loadSetting() {
	const stored = await chrome.storage.sync.get(SETTING_KEY);
	updateUi(stored[SETTING_KEY] !== false);
}

checkbox.addEventListener('change', async () => {
	const enabled = checkbox.checked;
	await chrome.storage.sync.set({ [SETTING_KEY]: enabled });
	updateUi(enabled);
});

chrome.storage.onChanged.addListener((changes, areaName) => {
	if (areaName === 'sync' && changes[SETTING_KEY]) {
		updateUi(changes[SETTING_KEY].newValue !== false);
	}
});

openOptionsButton.addEventListener('click', () => {
	chrome.runtime.openOptionsPage();
	window.close();
});

loadSetting();
