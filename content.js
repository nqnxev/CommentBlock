(() => {
  'use strict';

  const {
    DEFAULT_SETTINGS: DEFAULTS,
    DEFAULT_PRAISE_PHRASES,
    loadEffectivePraisePhrases,
    isPraiseLocalStorageKey
  } = globalThis.YTCF_DEFAULTS;

  const I18N = globalThis.CommentBlockI18n;
  const t = (key, args) => I18N.t(key, args);

  const COMMENT_SELECTOR = 'ytd-comment-view-model, ytd-comment-renderer';
  const FILTERED_SELECTOR = 'ytd-comment-view-model[data-ytcf-filtered], ytd-comment-renderer[data-ytcf-filtered]';
  const HIDDEN_CLASS = 'ytcf-hidden-by-extension';
  const COLLAPSED_CLASS = 'ytcf-collapsed-by-extension';
  const COLLAPSED_REVEALED_CLASS = 'ytcf-collapsed-revealed';
  const PLACEHOLDER_CLASS = 'ytcf-filter-placeholder';
  const PLACEHOLDER_TEXT_CLASS = 'ytcf-filter-placeholder-text';
  const TOGGLE_BUTTON_CLASS = 'ytcf-filter-toggle';
  const STYLE_ID = 'ytcf-extension-style';

  // Znormalizowane ogólniki: nie liczą się jako „konkretna treść” po wykryciu pochwały.
  const GENERIC_WORDS = new Set([
    // PL
    'ale','bardzo','mega','super','swietnie','swietny','swietna','swietne','fajnie','fajny','fajna','fajne',
    'dobry','dobra','dobre','genialnie','genialny','genialna','genialne','rewelacyjnie','rewelacyjny','rewelacyjna','rewelacyjne','rewelacja',
    'fantastycznie','fantastyczny','fantastyczna','fantastyczne','niesamowity','niesamowita','niesamowite','wspaniale','wspanialy','wspaniala','wspaniale',
    'cudownie','cudowny','cudowna','cudowne','pieknie','piekny','piekna','piekne','znakomity','znakomita','znakomite',
    'doskonale','doskonaly','doskonala','perfekcyjnie','perfekcyjny','perfekcyjne','najlepszy','najlepsza','najlepsze','najlepsi',
    'mistrz','mistrzu','mistrzostwo','klasa','sztos','kozak','petarda','ogien','top','brawo','szacun','szacunek','respect','propsy','wow',
    'kocham','uwielbiam','podziwiam','gratulacje','gratuluje','dzieki','dziekuje','pozdro','pozdrawiam','serdecznie',
    'film','filmu','filmik','filmiku','material','materialu','odcinek','odcinka','kanal','kanalu','wideo','video','robota','praca','tresc','content',
    'jak','zawsze','zwykle','kolejny','kolejna','kolejne','naprawde','po','prostu','oby','tak','trzymaj','wiecej','takich','czekam',
    'jestes','jestescie','jestesmy','najlepszy','najlepsza','oglada','ogladac','ogladania','milo','sie','ten','ta','te','to','tu',
    // EN
    'very','really','so','super','great','awesome','amazing','fantastic','excellent','brilliant','wonderful','perfect','nice','superb',
    'incredible','outstanding','beautiful','best','legend','legendary','goat','respect','wow','love','adore','congrats','congratulations',
    'thanks','thank','video','videos','channel','content','job','work','always','another','keep','it','up','well','done','you','your','youre',
    'are','the','this','that','as','never','disappoints','banger','masterpiece','much','good'
  ]);

  let settings = { ...DEFAULTS, praisePhrases: DEFAULT_PRAISE_PHRASES };
  let paused = false;
  let praiseEntries = [];
  let processed = new WeakMap();
  let scanTimer = null;
  let observer = null;
  let lastReportedCount = -1;
  let navigating = false;
  let settingsRevision = 0;

  // Globalny licznik: dany element komentarza jest liczony tylko przy pierwszym
  // zakwalifikowaniu do filtra w życiu bieżącego dokumentu. Dzięki temu ponowne
  // skany DOM-u, Pauza/Wznów oraz pokaż/zwiń nie nabijają sumy drugi raz.
  const globallyCountedComments = new WeakSet();
  let pendingGlobalBlocked = 0;
  let globalCountTimer = null;

  function normalize(value) {
    return String(value ?? '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[łŁ]/g, 'l')
      .toLocaleLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function wildcardTokenPattern(token) {
    const hasTrailingWildcard = token.endsWith('*') && token.length > 1 && !token.slice(0, -1).includes('*');
    if (!hasTrailingWildcard) return escapeRegExp(token);

    const stem = token.slice(0, -1);
    return `${escapeRegExp(stem)}\\p{L}*`;
  }

  function compileEntries(raw) {
    const unique = [...new Set(String(raw ?? '')
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#') && !line.startsWith('!'))
      .filter(line => !(line.startsWith('[') && line.endsWith(']')))
      .map(normalize)
      .filter(Boolean))];

    return unique
      .map(entry => {
        const source = entry.split(/\s+/).map(wildcardTokenPattern).join('\\s+');
        return {
          entry,
          source,
          regex: new RegExp(`(^|[^\\p{L}\\p{N}])(${source})(?=$|[^\\p{L}\\p{N}])`, 'gu')
        };
      })
      .sort((a, b) => b.entry.length - a.entry.length);
  }

  function collectPraiseMatches(text, entries) {
    const candidates = [];

    for (const entry of entries) {
      const re = entry.regex;
      re.lastIndex = 0;
      let match;
      while ((match = re.exec(text)) !== null) {
        const matchedText = match[2];
        const start = match.index + match[1].length;
        const end = start + matchedText.length;
        candidates.push({ start, end, entry: entry.entry, text: matchedText });
        if (match[0].length === 0) re.lastIndex += 1;
      }
    }

    // Przy nakładających się regułach preferujemy najdłuższe dopasowanie,
    // aby np. „świetn* film” nie liczyło jednocześnie „świetn*” jako drugiego trafienia.
    candidates.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

    const selected = [];
    let occupiedUntil = -1;
    for (const candidate of candidates) {
      if (candidate.start < occupiedUntil) continue;
      selected.push(candidate);
      occupiedUntil = candidate.end;
    }
    return selected;
  }

  function removeMatchSpans(text, matches) {
    if (!matches.length) return text;
    let result = '';
    let cursor = 0;
    for (const match of matches) {
      result += text.slice(cursor, match.start);
      result += ' ';
      cursor = match.end;
    }
    result += text.slice(cursor);
    return result;
  }

  function codePointLength(text) {
    return Array.from(String(text ?? '').trim()).length;
  }

  function extractText(comment) {
    const el = comment.querySelector('#content-text');
    return (el?.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function meaningfulTokensFrom(text) {
    const cleaned = normalize(text)
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/www\.\S+/g, ' ')
      .replace(/@[\p{L}\p{N}_.-]+/gu, ' ')
      .replace(/\b\d{1,2}:\d{2}(?::\d{2})?\b/g, ' ')
      .replace(/[^\p{L}\p{N}'-]+/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleaned) return [];

    return cleaned
      .split(' ')
      .map(word => word.replace(/^[-']+|[-']+$/g, ''))
      .filter(word => word.length >= 2)
      .filter(word => !GENERIC_WORDS.has(word));
  }

  function isPositiveEmojiOnlyOrMostly(text) {
    const hasPraiseEmoji = /[❤♥💖💕💗💙💚💛💜🧡🔥👏🙌👍😍🥰😘💯⭐🌟🏆✨]/u.test(text);
    return hasPraiseEmoji && meaningfulTokensFrom(text).length === 0;
  }

  function isEmptyPraise(text) {
    const normalized = normalize(text);
    if (!normalized) return false;

    const matches = collectPraiseMatches(normalized, praiseEntries);
    if (matches.length === 0 && !/[❤♥💖💕💗💙💚💛💜🧡🔥👏🙌👍😍🥰😘💯⭐🌟🏆✨]/u.test(text)) return false;

    // Emoji stanowi dodatkowy sygnał tylko wtedy, gdy po usunięciu wykrytych
    // pochwał nie zostaje istotna treść. Dzięki temu „świetny materiał ❤️”
    // daje 2 trafienia, ale komentarz merytoryczny z sercem nie dostaje
    // automatycznie dodatkowego punktu.
    const remainder = removeMatchSpans(normalized, matches);
    const emojiPraise = /[❤♥💖💕💗💙💚💛💜🧡🔥👏🙌👍😍🥰😘💯⭐🌟🏆✨]/u.test(text)
      && meaningfulTokensFrom(remainder).length === 0;

    const praiseHits = matches.length + (emojiPraise ? 1 : 0);
    const minHits = Math.max(1, Math.min(999, Number(settings.praiseMinHits) || DEFAULTS.praiseMinHits));
    return praiseHits >= minHits;
  }

  function isReplyComment(comment) {
    // YouTube uses more than one DOM layout for replies. In the current layout
    // replies may be rendered as nested ytd-comment-thread-renderer elements,
    // so "first comment in the nearest thread" is NOT sufficient: a nested
    // reply can itself be the first comment of its own sub-thread.
    //
    // Detect a reply using explicit reply containers first, then by checking
    // whether the nearest thread is nested inside another comment thread.
    if (comment.closest('ytd-comment-replies-renderer')) return true;

    const repliesHost = comment.closest('#replies');
    if (repliesHost?.closest('ytd-comment-thread-renderer')) return true;

    // Newer YouTube layouts use sub-thread wrappers for nested replies.
    if (comment.closest('.ytSubThreadSubThreadContent, #collapsed-threads')) return true;

    const thread = comment.closest('ytd-comment-thread-renderer');
    if (!thread) return false;

    const parentThread = thread.parentElement?.closest('ytd-comment-thread-renderer');
    if (parentThread) return true;

    // In the classic layout the top-level comment is usually the direct
    // #comment child of ytd-comment-thread-renderer. If we can identify it,
    // use that as the authoritative top-level marker.
    const directCommentHost = thread.querySelector(':scope > #comment');
    if (directCommentHost && (directCommentHost === comment || directCommentHost.contains(comment))) {
      return false;
    }

    // Fallback for layouts without #comment. Only consider a comment top-level
    // when it is the first comment of a NON-nested thread.
    const firstComment = thread.querySelector(COMMENT_SELECTOR);
    return Boolean(firstComment && firstComment !== comment);
  }

  function getHideTarget(comment) {
    const thread = comment.closest('ytd-comment-thread-renderer');
    if (!thread) return comment;

    const firstComment = thread.querySelector(COMMENT_SELECTOR);
    // Dla komentarza głównego chowamy cały wątek, żeby odpowiedzi nie zostały bez kontekstu.
    return firstComment === comment ? thread : comment;
  }

  function directPlaceholder(target) {
    return Array.from(target.children).find(child => child.classList?.contains(PLACEHOLDER_CLASS)) || null;
  }

  function removePlaceholder(target) {
    directPlaceholder(target)?.remove();
  }

  function resetCommentPresentation(comment) {
    const target = getHideTarget(comment);
    target.classList.remove(HIDDEN_CLASS, COLLAPSED_CLASS, COLLAPSED_REVEALED_CLASS);
    delete target.dataset.ytcfReason;
    removePlaceholder(target);

    delete comment.dataset.ytcfFiltered;
    delete comment.dataset.ytcfReason;
  }

  function hardHide(comment, reason) {
    const target = getHideTarget(comment);
    target.classList.add(HIDDEN_CLASS);
    target.dataset.ytcfReason = reason;
    comment.dataset.ytcfFiltered = 'hidden';
    comment.dataset.ytcfReason = reason;
  }

  function reasonLabel(reason) {
    if (reason === 'short') return t('hiddenLength');
    if (reason === 'empty-praise') return t('hiddenPraise');
    return t('hiddenGeneric');
  }

  function ensureCollapsedPlaceholder(comment, reason) {
    const target = getHideTarget(comment);
    let placeholder = directPlaceholder(target);
    if (placeholder) return placeholder;

    placeholder = document.createElement('div');
    placeholder.className = PLACEHOLDER_CLASS;

    const text = document.createElement('span');
    text.className = PLACEHOLDER_TEXT_CLASS;
    text.textContent = reasonLabel(reason);

    const button = document.createElement('button');
    button.type = 'button';
    button.className = TOGGLE_BUTTON_CLASS;
    button.setAttribute('aria-expanded', 'false');
    button.textContent = t('showComment');

    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();

      const revealed = target.classList.toggle(COLLAPSED_REVEALED_CLASS);
      button.setAttribute('aria-expanded', String(revealed));
      button.textContent = revealed ? t('collapseComment') : t('showComment');
      text.textContent = revealed ? `${reasonLabel(reason)}${t('expandedSuffix')}` : reasonLabel(reason);
      reportCount();
    });

    placeholder.append(text, button);
    target.prepend(placeholder);
    return placeholder;
  }

  function collapseFiltered(comment, reason) {
    const target = getHideTarget(comment);
    target.classList.remove(HIDDEN_CLASS, COLLAPSED_REVEALED_CLASS);
    target.classList.add(COLLAPSED_CLASS);
    target.dataset.ytcfReason = reason;

    comment.dataset.ytcfFiltered = 'collapsed';
    comment.dataset.ytcfReason = reason;
    ensureCollapsedPlaceholder(comment, reason);
  }

  function flushGlobalBlockedCount() {
    clearTimeout(globalCountTimer);
    globalCountTimer = null;

    const amount = pendingGlobalBlocked;
    if (amount <= 0) return;
    pendingGlobalBlocked = 0;

    chrome.runtime.sendMessage({ type: 'ytcf:increment-global-count', amount }).catch(() => {
      // Jeśli service worker był chwilowo niedostępny, nie gubimy naliczenia.
      pendingGlobalBlocked += amount;
      clearTimeout(globalCountTimer);
      globalCountTimer = setTimeout(flushGlobalBlockedCount, 500);
    });
  }

  function countGlobalBlockedOnce(comment) {
    if (globallyCountedComments.has(comment)) return;
    globallyCountedComments.add(comment);
    pendingGlobalBlocked += 1;

    // Grupujemy komentarze wykryte w jednym skanie w pojedynczą wiadomość.
    clearTimeout(globalCountTimer);
    globalCountTimer = setTimeout(flushGlobalBlockedCount, 120);
  }

  function applyFilteredPresentation(comment, reason) {
    countGlobalBlockedOnce(comment);

    if (settings.collapseFilteredEnabled) {
      collapseFiltered(comment, reason);
    } else {
      hardHide(comment, reason);
    }
  }

  function processComment(comment) {
    if (!(comment instanceof HTMLElement)) return;

    const text = extractText(comment);
    if (!text) return;

    const signature = `${settingsRevision}|${text}`;

    if (processed.get(comment) === signature) return;
    processed.set(comment, signature);

    resetCommentPresentation(comment);

    if (!settings.enabled || paused) return;

    // Domyślnie filtrujemy wyłącznie komentarze główne. Odpowiedzi YouTube
    // są zwykle zwinięte i wymagają świadomego rozwinięcia przez użytkownika,
    // dlatego ich filtrowanie jest osobną, domyślnie wyłączoną opcją.
    if (!settings.filterRepliesEnabled && isReplyComment(comment)) return;

    if (settings.minLengthEnabled && codePointLength(text) < Number(settings.minLength || 0)) {
      applyFilteredPresentation(comment, 'short');
      return;
    }

    if (settings.praiseEnabled && isEmptyPraise(text)) {
      applyFilteredPresentation(comment, 'empty-praise');
    }
  }

  function currentHiddenCount() {
    let count = 0;
    document.querySelectorAll(FILTERED_SELECTOR).forEach(comment => {
      const state = comment.dataset.ytcfFiltered;
      if (state === 'hidden') {
        count += 1;
        return;
      }

      if (state === 'collapsed') {
        const target = getHideTarget(comment);
        if (!target.classList.contains(COLLAPSED_REVEALED_CLASS)) count += 1;
      }
    });
    return count;
  }

  function reportCount(forcedCount = null) {
    const count = forcedCount === null ? currentHiddenCount() : Math.max(0, Number(forcedCount) || 0);
    if (count === lastReportedCount) return;
    lastReportedCount = count;
    chrome.runtime.sendMessage({ type: 'ytcf:update-count', count }).catch(() => {});
  }

  function scan() {
    if (navigating) return;
    document.querySelectorAll(COMMENT_SELECTOR).forEach(processComment);
    reportCount();
  }

  function scheduleScan(delay = 120) {
    clearTimeout(scanTimer);
    scanTimer = setTimeout(scan, delay);
  }

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .${HIDDEN_CLASS} {
        display: none !important;
      }

      .${COLLAPSED_CLASS}:not(.${COLLAPSED_REVEALED_CLASS}) > :not(.${PLACEHOLDER_CLASS}) {
        display: none !important;
      }

      .${PLACEHOLDER_CLASS} {
        box-sizing: border-box !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 12px !important;
        width: 100% !important;
        min-height: 42px !important;
        margin: 6px 0 !important;
        padding: 8px 12px !important;
        border: 1px solid rgba(127, 127, 127, 0.36) !important;
        border-radius: 10px !important;
        background: rgba(127, 127, 127, 0.08) !important;
        color: var(--yt-spec-text-secondary, inherit) !important;
        font-family: Roboto, Arial, sans-serif !important;
      }

      .${COLLAPSED_REVEALED_CLASS} > .${PLACEHOLDER_CLASS} {
        margin-bottom: 10px !important;
        background: rgba(127, 127, 127, 0.05) !important;
      }

      .${PLACEHOLDER_TEXT_CLASS} {
        min-width: 0 !important;
        font-size: 12px !important;
        line-height: 18px !important;
        opacity: 0.85 !important;
      }

      .${TOGGLE_BUTTON_CLASS} {
        flex: 0 0 auto !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        min-height: 30px !important;
        padding: 5px 11px !important;
        border: 1px solid rgba(127, 127, 127, 0.45) !important;
        border-radius: 999px !important;
        background: rgba(127, 127, 127, 0.12) !important;
        color: var(--yt-spec-text-primary, inherit) !important;
        font: inherit !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
      }

      .${TOGGLE_BUTTON_CLASS}:hover {
        background: rgba(127, 127, 127, 0.22) !important;
      }
    `;
    document.documentElement.appendChild(style);
  }

  function clearAllFiltering() {
    document.querySelectorAll(COMMENT_SELECTOR).forEach(resetCommentPresentation);
    processed = new WeakMap();
    reportCount(0);
  }

  async function loadSettings() {
    const [stored, runtime, praisePhrases] = await Promise.all([
      chrome.storage.sync.get(DEFAULTS),
      chrome.storage.local.get({ paused: false }),
      loadEffectivePraisePhrases()
    ]);
    settings = { ...DEFAULTS, ...stored, praisePhrases };
    await I18N.setLanguage(settings.uiLanguage, false);
    paused = Boolean(runtime.paused);
    praiseEntries = compileEntries(settings.praisePhrases);
    settingsRevision += 1;
  }

  async function refreshSettingsAndRescan() {
    await loadSettings();
    clearAllFiltering();
    scan();
  }

  function startObserver() {
    observer?.disconnect();
    observer = new MutationObserver(scheduleScan);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync') {
      const relevant = Object.keys(changes).some(key => key in DEFAULTS);
      if (relevant) refreshSettingsAndRescan();
      return;
    }

    if (areaName === 'local') {
      const relevant = Object.keys(changes).some(key => key === 'paused' || isPraiseLocalStorageKey(key));
      if (relevant) refreshSettingsAndRescan();
    }
  });

  // YouTube jest SPA: zerujemy badge podczas zmiany filmu i skanujemy ponownie po zakończeniu nawigacji.
  window.addEventListener('yt-navigate-start', () => {
    flushGlobalBlockedCount();
    navigating = true;
    clearTimeout(scanTimer);
    lastReportedCount = -1;
    reportCount(0);
  }, true);

  window.addEventListener('yt-navigate-finish', () => {
    navigating = false;
    processed = new WeakMap();
    scheduleScan(180);
  }, true);

  window.addEventListener('pagehide', () => {
    flushGlobalBlockedCount();
    reportCount(0);
  }, true);

  (async () => {
    ensureStyle();
    await loadSettings();
    startObserver();
    scan();
  })();
})();
