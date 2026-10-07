const DEFAULTS = {
  enabled: true,
  minLengthEnabled: true,
  minLength: 30,
  praiseEnabled: true,
  praiseMinHits: 2,
  collapseFilteredEnabled: false,
  uiLanguage: 'auto'
};

const RUNTIME_DEFAULTS = { paused: false, globalBlockedCount: 0 };
const I18N = globalThis.CommentBlockI18n;
const t = (key, args) => I18N.t(key, args);

async function refresh() {
  const [s, runtime] = await Promise.all([
    chrome.storage.sync.get(DEFAULTS),
    chrome.storage.local.get(RUNTIME_DEFAULTS)
  ]);

  await I18N.setLanguage(s.uiLanguage, true);

  const paused = Boolean(runtime.paused);
  const globalBlockedCount = Math.max(0, Math.trunc(Number(runtime.globalBlockedCount)) || 0);
  const globalCounter = document.getElementById('globalBlockedCount');
  globalCounter.textContent = new Intl.NumberFormat(I18N.localeTag()).format(globalBlockedCount);
  globalCounter.title = String(globalBlockedCount);

  const button = document.getElementById('pauseButton');
  const icon = document.getElementById('pauseIcon');
  const label = document.getElementById('pauseLabel');
  const status = document.getElementById('pause-status');
  const hint = document.getElementById('pauseHint');

  button.classList.toggle('is-paused', paused && s.enabled);
  button.classList.toggle('is-disabled', !s.enabled);
  button.setAttribute('aria-pressed', String(paused));

  if (!s.enabled) {
    icon.textContent = 'Ⅱ';
    label.textContent = t('disabled');
    status.textContent = t('disabledInSettings');
    hint.textContent = t('pauseDisabledHint');
    button.title = t('disabledTitle');
  } else if (paused) {
    icon.textContent = '▶';
    label.textContent = t('resume');
    status.textContent = t('filterPaused');
    hint.textContent = t('pausePausedHint');
    button.title = t('resumeTitle');
  } else {
    icon.textContent = 'Ⅱ';
    label.textContent = t('pause');
    status.textContent = t('filterActive');
    hint.textContent = t('pauseActiveHint');
    button.title = t('pauseTitle');
  }

  const parts = [];
  if (s.minLengthEnabled) parts.push(t('summaryMin', [s.minLength]));
  if (s.praiseEnabled) parts.push(t('summaryPraise', [Math.max(1, Math.min(999, Math.trunc(Number(s.praiseMinHits)) || 2))]));

  let text;
  if (!s.enabled) {
    text = t('summaryMasterOff');
  } else if (paused) {
    text = t('summaryPaused');
  } else {
    text = parts.length ? `${t('summaryActivePrefix')}${parts.join(' • ')}` : t('summaryNoRules');
    if (s.collapseFilteredEnabled && parts.length) text += t('summaryCollapsed');
  }

  document.getElementById('summary').textContent = text;
}

document.getElementById('pauseButton').addEventListener('click', async () => {
  const [s, runtime] = await Promise.all([
    chrome.storage.sync.get({ enabled: true }),
    chrome.storage.local.get(RUNTIME_DEFAULTS)
  ]);

  if (!s.enabled) {
    chrome.runtime.openOptionsPage();
    return;
  }

  await chrome.storage.local.set({ paused: !Boolean(runtime.paused) });
  await refresh();
});

document.getElementById('options').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' || areaName === 'local') refresh();
});

refresh();
