'use strict';

const STATE_KEY = 'tabManagerState';
const SETTING_KEY = 'tabManagerEnabled';
const windowStates = new Map();
let tabManagerEnabled = true;

const ready = Promise.all([
	chrome.storage.session.get(STATE_KEY),
	chrome.storage.sync.get(SETTING_KEY),
	chrome.tabs.query({ active: true })
]).then(([stored, setting, activeTabs]) => {
	tabManagerEnabled = setting[SETTING_KEY] !== false;
	for (const [windowId, state] of Object.entries(stored[STATE_KEY] || {})) {
		windowStates.set(Number(windowId), state);
	}
	for (const tab of activeTabs) {
		if (!windowStates.has(tab.windowId)) {
			windowStates.set(tab.windowId, { activeTabId: tab.id, previousTabId: null });
		}
	}
});

async function persistWindowStates() {
	await chrome.storage.session.set({ [STATE_KEY]: Object.fromEntries(windowStates) });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
	if (areaName === 'sync' && changes[SETTING_KEY]) {
		tabManagerEnabled = changes[SETTING_KEY].newValue !== false;
	}
});

chrome.tabs.onActivated.addListener(async ({ tabId, windowId, previousTabId }) => {
	await ready;
	if (!tabManagerEnabled) return;

	const state = windowStates.get(windowId);
	windowStates.set(windowId, {
		activeTabId: tabId,
		previousTabId: previousTabId ?? state?.activeTabId ?? null
	});
	await persistWindowStates();
});

chrome.tabs.onCreated.addListener(async (tab) => {
	await ready;
	if (!tabManagerEnabled || !tab.active || tab.windowId < 0) return;

	const state = windowStates.get(tab.windowId);
	const anchorTabId = state?.activeTabId === tab.id
		? state.previousTabId
		: state?.activeTabId;

	windowStates.set(tab.windowId, { activeTabId: tab.id, previousTabId: anchorTabId ?? null });
	await persistWindowStates();

	if (!Number.isInteger(anchorTabId) || anchorTabId === tab.id) return;

	try {
		const [createdTab, anchorTab] = await Promise.all([
			chrome.tabs.get(tab.id),
			chrome.tabs.get(anchorTabId)
		]);
		if (createdTab.windowId !== anchorTab.windowId || createdTab.pinned || anchorTab.pinned) return;

		const targetIndex = anchorTab.index + 1;
		if (createdTab.index !== targetIndex) {
			await chrome.tabs.move(createdTab.id, { index: targetIndex });
		}
	} catch (error) {
		console.debug('[Tab Manager] Could not position the new tab:', error);
	}
});