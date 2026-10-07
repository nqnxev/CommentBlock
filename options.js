const {
  DEFAULT_SETTINGS: DEFAULTS,
  DEFAULT_PRAISE_PHRASES,
  EXTERNAL_URLS_KEY,
  EXTERNAL_CACHE_KEY,
  IMPORTED_LISTS_KEY,
  loadPraisePhrases,
  savePraisePhrases,
  resetPraisePhrases,
  loadExternalPraiseState,
  saveExternalListUrls,
  saveExternalPraiseCache,
  saveImportedPraiseLists,
  parseExternalListUrls,
  countPraiseRules
} = globalThis.YTCF_DEFAULTS;

const $ = id => document.getElementById(id);
const I18N = globalThis.CommentBlockI18n;
const t = (key, args) => I18N.t(key, args);

const PRAISE_SLIDER_MAX = 15;
const PRAISE_MANUAL_MAX = 999;
const MAX_IMPORTED_LIST_BYTES = 5 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 20000;
let externalState = { urlsRaw: '', cache: {}, imported: [] };
let statusTimer;
let externalStatusTimer;

function clampPraiseThreshold(value, fallback = DEFAULTS.praiseMinHits) {
  const numeric = Math.trunc(Number(value));
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(1, Math.min(PRAISE_MANUAL_MAX, numeric));
}

function thresholdDescription(value) {
  if (value === 1) return t('thresholdEvery', [value]);
  if (value <= 3) return t('thresholdVeryHigh', [value]);
  if (value <= 5) return t('thresholdHigh', [value]);
  if (value <= 8) return t('thresholdMedium', [value]);
  if (value <= 12) return t('thresholdLow', [value]);
  if (value <= PRAISE_SLIDER_MAX) return t('thresholdVeryLow', [value]);
  return t('thresholdManual', [value]);
}
function updatePraiseControls(source = 'number') {
  const range = $('praiseMinHits');
  const number = $('praiseMinHitsNumber');

  if (source === 'range') number.value = range.value;

  const raw = Number(number.value);
  const value = Number.isFinite(raw) && raw >= 1
    ? Math.min(PRAISE_MANUAL_MAX, Math.trunc(raw))
    : DEFAULTS.praiseMinHits;

  range.value = Math.min(PRAISE_SLIDER_MAX, value);
  const description = thresholdDescription(value);
  $('praiseMinHitsValue').value = description;
  $('praiseMinHitsValue').textContent = description;
}

function pluralRules(count) {
  const n = Math.max(0, Number(count) || 0);
  return n === 1 ? t('oneRule') : t('manyRules', [n]);
}
function formatDate(timestamp) {
  const value = Number(timestamp);
  if (!Number.isFinite(value) || value <= 0) return t('never');
  try {
    return new Intl.DateTimeFormat(I18N.localeTag(), {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(value));
  } catch (_) {
    return new Date(value).toLocaleString(I18N.localeTag());
  }
}
function updateMainRuleCount() {
  $('mainListRuleCount').textContent = pluralRules(countPraiseRules($('praisePhrases').value));
}

function showStatus(message, isError = false) {
  clearTimeout(statusTimer);
  const el = $('status');
  el.textContent = message;
  el.style.color = isError ? '#b3261e' : '#188038';
  statusTimer = setTimeout(() => { el.textContent = ''; }, 5000);
}

function showExternalStatus(message, isError = false) {
  clearTimeout(externalStatusTimer);
  const el = $('externalStatus');
  el.textContent = message;
  el.style.color = isError ? '#b3261e' : '#188038';
  externalStatusTimer = setTimeout(() => { el.textContent = ''; }, 7000);
}

function createSourceItem({ title, meta, error = '', controls = [] }) {
  const item = document.createElement('div');
  item.className = 'source-item';

  const main = document.createElement('div');
  main.className = 'source-item-main';

  const titleEl = document.createElement('div');
  titleEl.className = 'source-item-title';
  titleEl.textContent = title;
  titleEl.title = title;

  const metaEl = document.createElement('div');
  metaEl.className = 'source-item-meta';
  metaEl.textContent = meta;

  main.append(titleEl, metaEl);

  if (error) {
    const errorEl = document.createElement('div');
    errorEl.className = 'source-item-meta source-item-error';
    errorEl.textContent = error;
    main.append(errorEl);
  }

  const controlsEl = document.createElement('div');
  controlsEl.className = 'source-item-controls';
  controls.forEach(control => controlsEl.append(control));

  item.append(main, controlsEl);
  return item;
}

function renderExternalLists() {
  const container = $('externalListItems');
  container.replaceChildren();
  container.classList.remove('empty-state');

  const { urls } = parseExternalListUrls($('externalPraiseListUrls').value);
  if (!urls.length) {
    container.classList.add('empty-state');
    container.textContent = t('noConfiguredUrls');
    return;
  }

  for (const url of urls) {
    const cached = externalState.cache[url];
    const hasContent = cached && typeof cached.content === 'string' && cached.content.trim();
    const meta = hasContent
      ? t('rulesUpdated', [pluralRules(cached.ruleCount ?? countPraiseRules(cached.content)), formatDate(cached.updatedAt)])
      : t('notDownloadedYet');

    container.append(createSourceItem({
      title: url,
      meta,
      error: cached?.lastError || ''
    }));
  }
}

function renderImportedLists() {
  const container = $('importedListItems');
  container.replaceChildren();
  container.classList.remove('empty-state');

  if (!externalState.imported.length) {
    container.classList.add('empty-state');
    container.textContent = t('noImportedFiles');
    return;
  }

  for (const imported of externalState.imported) {
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = imported.enabled !== false;
    toggle.title = t('toggleList');
    toggle.setAttribute('aria-label', t('enableNamedList', [imported.name || t('unnamedList')]));
    toggle.addEventListener('change', async () => {
      imported.enabled = toggle.checked;
      await saveImportedPraiseLists(externalState.imported);
      renderImportedLists();
    });

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'small-button';
    remove.textContent = t('remove');
    remove.addEventListener('click', async () => {
      externalState.imported = externalState.imported.filter(item => item.id !== imported.id);
      await saveImportedPraiseLists(externalState.imported);
      renderImportedLists();
      showExternalStatus(t('listRemoved'));
    });

    const meta = t('rulesImported', [pluralRules(imported.ruleCount ?? countPraiseRules(imported.content)), formatDate(imported.importedAt)]);
    container.append(createSourceItem({
      title: imported.name || t('unnamedList'),
      meta,
      controls: [toggle, remove]
    }));
  }

  updateDisabledState();
}

function renderListSources() {
  renderExternalLists();
  renderImportedLists();
}

async function load() {
  const [data, praisePhrases, state] = await Promise.all([
    chrome.storage.sync.get(DEFAULTS),
    loadPraisePhrases(),
    loadExternalPraiseState()
  ]);

  externalState = state;
  await I18N.setLanguage(data.uiLanguage, true);
  $('uiLanguage').value = I18N.normalizePreference(data.uiLanguage);
  $('enabled').checked = Boolean(data.enabled);
  $('minLengthEnabled').checked = Boolean(data.minLengthEnabled);
  $('minLength').value = Number(data.minLength) || DEFAULTS.minLength;
  $('praiseEnabled').checked = Boolean(data.praiseEnabled);
  const praiseMinHits = clampPraiseThreshold(data.praiseMinHits);
  $('praiseMinHitsNumber').value = praiseMinHits;
  $('praiseMinHits').value = Math.min(PRAISE_SLIDER_MAX, praiseMinHits);
  $('praisePhrases').value = typeof praisePhrases === 'string' ? praisePhrases : DEFAULT_PRAISE_PHRASES;
  $('externalPraiseListUrls').value = state.urlsRaw || '';
  $('filterRepliesEnabled').checked = Boolean(data.filterRepliesEnabled);
  $('collapseFilteredEnabled').checked = Boolean(data.collapseFilteredEnabled);

  updatePraiseControls('number');
  updateMainRuleCount();
  renderListSources();
  updateDisabledState();
}

function updateDisabledState() {
  const master = $('enabled').checked;
  const praiseActive = master && $('praiseEnabled').checked;
  $('minLength').disabled = !master || !$('minLengthEnabled').checked;
  $('praiseMinHits').disabled = !praiseActive;
  $('praiseMinHitsNumber').disabled = !praiseActive;
  $('praisePhrases').disabled = !praiseActive;
  $('externalPraiseListUrls').disabled = !praiseActive;
  $('refreshExternalLists').disabled = !praiseActive;
  $('importPraiseFilesButton').disabled = !praiseActive;
  $('filterRepliesEnabled').disabled = !master;
  $('collapseFilteredEnabled').disabled = !master;
  document.querySelectorAll('#importedListItems input, #importedListItems button').forEach(el => {
    el.disabled = !praiseActive;
  });
}

function refreshLocalizedDynamicUi() {
  updatePraiseControls('number');
  updateMainRuleCount();
  renderListSources();
}

async function changeLanguage() {
  const preference = I18N.normalizePreference($('uiLanguage').value);
  await chrome.storage.sync.set({ uiLanguage: preference });
  await I18N.setLanguage(preference, true);
  refreshLocalizedDynamicUi();
}

async function save() {
  const minLength = Math.max(1, Math.min(5000, Number($('minLength').value) || DEFAULTS.minLength));
  const praiseMinHits = clampPraiseThreshold($('praiseMinHitsNumber').value);
  const { invalid } = parseExternalListUrls($('externalPraiseListUrls').value);

  if (invalid.length) {
    showStatus(t('saveInvalidUrl', [invalid[0]]), true);
    return;
  }

  try {
    await Promise.all([
      chrome.storage.sync.set({
        enabled: $('enabled').checked,
        minLengthEnabled: $('minLengthEnabled').checked,
        minLength,
        praiseEnabled: $('praiseEnabled').checked,
        praiseMinHits,
        filterRepliesEnabled: $('filterRepliesEnabled').checked,
        collapseFilteredEnabled: $('collapseFilteredEnabled').checked,
        uiLanguage: I18N.normalizePreference($('uiLanguage').value)
      }),
      savePraisePhrases($('praisePhrases').value)
    ]);

    const savedSources = await saveExternalListUrls($('externalPraiseListUrls').value);
    externalState.urlsRaw = $('externalPraiseListUrls').value;
    externalState.cache = savedSources.cache;

    await chrome.storage.sync.remove(['praiseMeaningfulWords', 'spoilerEnabled', 'spoilerTerms']);

    $('minLength').value = minLength;
    $('praiseMinHitsNumber').value = praiseMinHits;
    $('praiseMinHits').value = Math.min(PRAISE_SLIDER_MAX, praiseMinHits);
    updatePraiseControls('number');
    renderExternalLists();
    showStatus(t('savedOk'));
  } catch (error) {
    console.error('CommentBlock: nie udało się zapisać ustawień', error);
    showStatus(t('saveError', [error?.message || t('downloadError')]), true);
  }
}

async function reset() {
  try {
    await Promise.all([
      resetPraisePhrases(),
      chrome.storage.local.remove([EXTERNAL_URLS_KEY, EXTERNAL_CACHE_KEY, IMPORTED_LISTS_KEY]),
      chrome.storage.sync.remove(['praiseMeaningfulWords', 'spoilerEnabled', 'spoilerTerms'])
    ]);
    await chrome.storage.sync.set(DEFAULTS);
    await load();
    showStatus(t('resetOk'));
  } catch (error) {
    showStatus(t('resetError', [error?.message || t('downloadError')]), true);
  }
}

function originPattern(urlString) {
  const url = new URL(urlString);
  return `${url.protocol}//${url.host}/*`;
}

async function ensureOriginsPermission(urls) {
  const patterns = [...new Set(urls.map(originPattern))];
  if (!patterns.length) return true;
  // Wywołujemy request bez wcześniejszych awaitów, aby zachować gest użytkownika
  // wymagany przez Chromium do przyznania opcjonalnych uprawnień hosta.
  return chrome.permissions.request({ origins: patterns });
}

async function fetchTextList(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      credentials: 'omit',
      redirect: 'follow',
      signal: controller.signal
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    const bytes = new TextEncoder().encode(text).length;
    if (bytes > MAX_IMPORTED_LIST_BYTES) throw new Error(t('listTooLarge'));
    if (!text.trim()) throw new Error(t('emptyList'));
    return text;
  } finally {
    clearTimeout(timer);
  }
}

async function refreshExternalLists() {
  const parsed = parseExternalListUrls($('externalPraiseListUrls').value);
  if (parsed.invalid.length) {
    showExternalStatus(t('invalidUrl', [parsed.invalid[0]]), true);
    return;
  }

  if (!parsed.urls.length) {
    await saveExternalListUrls($('externalPraiseListUrls').value);
    externalState.urlsRaw = $('externalPraiseListUrls').value;
    externalState.cache = {};
    renderExternalLists();
    showExternalStatus(t('noUrlsToDownload'));
    return;
  }

  $('refreshExternalLists').disabled = true;
  showExternalStatus(t('downloadingLists'));

  try {
    const permissionGranted = await ensureOriginsPermission(parsed.urls);
    if (!permissionGranted) {
      showExternalStatus(t('permissionDenied'), true);
      return;
    }

    const saved = await saveExternalListUrls($('externalPraiseListUrls').value);
    externalState.urlsRaw = $('externalPraiseListUrls').value;
    const cache = { ...saved.cache };
    let ok = 0;
    let failed = 0;

    const results = await Promise.all(parsed.urls.map(async url => {
      try {
        const content = await fetchTextList(url);
        return { url, content };
      } catch (error) {
        return { url, error };
      }
    }));

    const now = Date.now();
    for (const result of results) {
      if (result.content !== undefined) {
        cache[result.url] = {
          content: result.content,
          ruleCount: countPraiseRules(result.content),
          updatedAt: now,
          checkedAt: now,
          lastError: ''
        };
        ok += 1;
      } else {
        const previous = cache[result.url] || {};
        cache[result.url] = {
          ...previous,
          checkedAt: now,
          lastError: result.error?.name === 'AbortError'
            ? t('downloadTimeout')
            : (result.error?.message || t('downloadError'))
        };
        failed += 1;
      }
    }

    await saveExternalPraiseCache(cache);
    externalState.cache = cache;
    renderExternalLists();
    showExternalStatus(
      failed ? t('updatedListsWithErrors', [ok, failed]) : t('updatedLists', [ok]),
      failed > 0 && ok === 0
    );
  } catch (error) {
    console.error('CommentBlock: błąd list zewnętrznych', error);
    showExternalStatus(t('genericError', [error?.message || t('downloadError')]), true);
  } finally {
    updateDisabledState();
  }
}

async function importPraiseFiles(event) {
  const files = Array.from(event.target.files || []);
  event.target.value = '';
  if (!files.length) return;

  let importedCount = 0;
  const errors = [];
  const next = [...externalState.imported];

  for (const file of files) {
    try {
      if (file.size > MAX_IMPORTED_LIST_BYTES) throw new Error(t('fileTooLarge'));
      const content = await file.text();
      if (!content.trim()) throw new Error(t('fileEmpty'));

      const item = {
        id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: file.name,
        content,
        enabled: true,
        importedAt: Date.now(),
        ruleCount: countPraiseRules(content)
      };

      const existingIndex = next.findIndex(existing => existing?.name === file.name);
      if (existingIndex >= 0) {
        item.id = next[existingIndex].id || item.id;
        next[existingIndex] = item;
      } else {
        next.push(item);
      }
      importedCount += 1;
    } catch (error) {
      errors.push(`${file.name}: ${error?.message || t('fileReadError')}`);
    }
  }

  externalState.imported = next;
  await saveImportedPraiseLists(next);
  renderImportedLists();

  if (errors.length) {
    showExternalStatus(t('importedWithErrors', [importedCount, errors.join('; ')]), true);
  } else {
    showExternalStatus(importedCount === 1 ? t('importedOne', [importedCount]) : t('importedMany', [importedCount]));
  }
}

$('uiLanguage').addEventListener('change', changeLanguage);
$('save').addEventListener('click', save);
$('reset').addEventListener('click', reset);
$('refreshExternalLists').addEventListener('click', refreshExternalLists);
$('importPraiseFilesButton').addEventListener('click', () => $('importPraiseFiles').click());
$('importPraiseFiles').addEventListener('change', importPraiseFiles);
$('praisePhrases').addEventListener('input', updateMainRuleCount);
$('externalPraiseListUrls').addEventListener('input', renderExternalLists);
$('praiseMinHits').addEventListener('input', () => updatePraiseControls('range'));
$('praiseMinHitsNumber').addEventListener('input', () => updatePraiseControls('number'));
$('praiseMinHitsNumber').addEventListener('change', () => {
  const value = clampPraiseThreshold($('praiseMinHitsNumber').value);
  $('praiseMinHitsNumber').value = value;
  updatePraiseControls('number');
});
for (const id of ['enabled', 'minLengthEnabled', 'praiseEnabled', 'filterRepliesEnabled', 'collapseFilteredEnabled']) {
  $(id).addEventListener('change', updateDisabledState);
}

load();
