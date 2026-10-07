'use strict';

const BADGE_COLOR = '#d93025';
const GLOBAL_COUNT_KEY = 'globalBlockedCount';
let globalCountQueue = Promise.resolve();

function sanitizeCount(value) {
  return Math.max(0, Math.trunc(Number(value)) || 0);
}

function sanitizeIncrement(value) {
  return Math.max(0, Math.trunc(Number(value)) || 0);
}

async function incrementGlobalCount(amount) {
  const increment = sanitizeIncrement(amount);
  if (increment <= 0) return;

  // Serializacja zapisu zapobiega utracie naliczeń, gdy kilka kart YouTube
  // raportuje zablokowane komentarze prawie jednocześnie.
  globalCountQueue = globalCountQueue.catch(() => {}).then(async () => {
    const stored = await chrome.storage.local.get({ [GLOBAL_COUNT_KEY]: 0 });
    const current = sanitizeCount(stored[GLOBAL_COUNT_KEY]);
    await chrome.storage.local.set({ [GLOBAL_COUNT_KEY]: current + increment });
  });

  return globalCountQueue;
}

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === 'install') {
    chrome.storage.local.set({ [GLOBAL_COUNT_KEY]: 0 }).catch(() => {});
  }
});

function badgeText(count) {
  const value = Math.max(0, Number(count) || 0);
  if (value === 0) return '';
  return value > 999 ? '999+' : String(value);
}

async function setCount(tabId, count) {
  if (!Number.isInteger(tabId)) return;

  await chrome.action.setBadgeText({
    tabId,
    text: badgeText(count)
  });

  await chrome.action.setBadgeBackgroundColor({
    tabId,
    color: BADGE_COLOR
  });

  // Dostępne w nowszych wersjach Chromium. Brak tej metody nie wpływa na działanie badge'a.
  if (chrome.action.setBadgeTextColor) {
    try {
      await chrome.action.setBadgeTextColor({ tabId, color: '#ffffff' });
    } catch (_) {}
  }
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type === 'ytcf:increment-global-count') {
    incrementGlobalCount(message.amount).catch(() => {});
    return;
  }

  if (message?.type !== 'ytcf:update-count') return;
  const tabId = sender.tab?.id;
  if (!Number.isInteger(tabId)) return;
  setCount(tabId, message.count).catch(() => {});
});

// Czyścimy licznik na początku przeładowania/nawigacji; content script ustawi go ponownie po skanowaniu.
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    setCount(tabId, 0).catch(() => {});
  }
});
