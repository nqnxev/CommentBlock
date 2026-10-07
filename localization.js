(() => {
  'use strict';

  const LANGUAGE_KEY = 'uiLanguage';
  const DEFAULT_LANGUAGE = 'en';
  const SUPPORTED = new Set(['en', 'pl']);

  let currentLanguage = DEFAULT_LANGUAGE;
  let currentPreference = 'auto';
  let messages = Object.create(null);

  function normalizePreference(value) {
    const v = String(value || 'auto').toLowerCase();
    return v === 'pl' || v === 'en' ? v : 'auto';
  }

  function autoLanguage() {
    const ui = String(chrome.i18n.getUILanguage?.() || '').toLowerCase();
    return ui === 'pl' || ui.startsWith('pl-') ? 'pl' : DEFAULT_LANGUAGE;
  }

  function resolveLanguage(preference) {
    const normalized = normalizePreference(preference);
    return normalized === 'auto' ? autoLanguage() : normalized;
  }

  async function readLocaleFile(language) {
    const lang = SUPPORTED.has(language) ? language : DEFAULT_LANGUAGE;
    const url = chrome.runtime.getURL(`_locales/${lang}/messages.json`);
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Cannot load locale ${lang}: HTTP ${response.status}`);
    return response.json();
  }

  function replaceArgs(value, substitutions = []) {
    const args = Array.isArray(substitutions) ? substitutions : [substitutions];
    return String(value ?? '').replace(/\{(\d+)\}/g, (match, index) => {
      const value = args[Number(index)];
      return value === undefined || value === null ? match : String(value);
    });
  }

  function t(key, substitutions = []) {
    const raw = messages?.[key]?.message;
    if (typeof raw === 'string') return replaceArgs(raw, substitutions);

    // Fallback do natywnego chrome.i18n. Jest szczególnie użyteczny, gdy
    // plik językowy został uszkodzony lub brakuje pojedynczego klucza.
    const native = chrome.i18n.getMessage(key);
    return native || key;
  }

  function localizeDocument(root = document) {
    if (!root?.querySelectorAll) return;

    const apply = (selector, fn) => {
      root.querySelectorAll(selector).forEach(fn);
      if (root.matches?.(selector)) fn(root);
    };

    apply('[data-i18n]', el => { el.textContent = t(el.dataset.i18n); });
    apply('[data-i18n-html]', el => { el.innerHTML = t(el.dataset.i18nHtml); });
    apply('[data-i18n-title]', el => { el.title = t(el.dataset.i18nTitle); });
    apply('[data-i18n-placeholder]', el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
    apply('[data-i18n-aria-label]', el => { el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel)); });

    if (root === document) {
      document.documentElement.lang = currentLanguage;
      const titleKey = document.documentElement.dataset.i18nTitle;
      if (titleKey) document.title = t(titleKey);
    }
  }

  async function setLanguage(preference = 'auto', localize = false) {
    currentPreference = normalizePreference(preference);
    const language = resolveLanguage(currentPreference);

    if (language !== currentLanguage || !Object.keys(messages).length) {
      try {
        messages = await readLocaleFile(language);
        currentLanguage = language;
      } catch (error) {
        console.warn('CommentBlock: locale load failed', error);
        if (language !== DEFAULT_LANGUAGE) {
          messages = await readLocaleFile(DEFAULT_LANGUAGE);
          currentLanguage = DEFAULT_LANGUAGE;
        }
      }
    }

    if (localize) localizeDocument(document);
    return currentLanguage;
  }

  async function init({ localize = false, preference } = {}) {
    let selected = preference;
    if (selected === undefined) {
      const stored = await chrome.storage.sync.get({ [LANGUAGE_KEY]: 'auto' });
      selected = stored[LANGUAGE_KEY];
    }
    return setLanguage(selected, localize);
  }

  function localeTag() {
    return currentLanguage === 'pl' ? 'pl-PL' : 'en-US';
  }

  globalThis.CommentBlockI18n = Object.freeze({
    LANGUAGE_KEY,
    normalizePreference,
    resolveLanguage,
    init,
    setLanguage,
    localizeDocument,
    t,
    localeTag,
    get language() { return currentLanguage; },
    get preference() { return currentPreference; }
  });
})();
