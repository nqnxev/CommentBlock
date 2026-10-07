(() => {
  'use strict';

  const DEFAULT_PRAISE_PHRASES = `
# ============================================================
# POLSKI — SILNE POCHWAŁY: SŁOWA I RDZENIE
# ============================================================
super
świetn*
rewelac*
genialn*
fantastyczn*
niesamowit*
wspaniał*
cudown*
znakomit*
znakomic*
doskonał*
doskonal*
kapitaln*
fenomenaln*
wybitn*
perfekcyjn*
imponując*
imponuj*
zachwyc*
wyjątkow*
bezkonkurencyjn*
niezastąpion*
pierwszorzędn*
przepiękn*
piękn*
fajn*
mega
sztos
petard*
kozak*
ogień
bomba
brawo
wow
props*
szacun*
respect
mistrz*
legend*
guru
arcydzieł*
majstersztyk
profeska

# ============================================================
# POLSKI — JAKOŚĆ / MERYTORYKA / PROFESJONALIZM
# ============================================================
merytoryczn*
rzeteln*
rzeczow*
konkretn*
profesjonaln*
kompetentn*
fachow*
wartościow*
informacyjn*
informuj*
edukacyjn*
pouczając*
wnikliw*
wyczerpując*
klarown*
przystępn*
przejrzyst*
logicznie
obiektywn*
bezstronn*
dopracowan*
solidn*
wysoki poziom
najwyższy poziom
poziom premium
pełna profeska
pełen profesjonalizm
pełny profesjonalizm
pełna merytoryka
sama merytoryka
sam konkret
same konkrety
konkretnie i merytorycznie
merytorycznie i konkretnie
bez lania wody
zero lania wody
bez zbędnego gadania
bez zbędnych słów
samo mięso

# ============================================================
# POLSKI — POCHWAŁY AUTORA / PROWADZĄCEGO / EKSPERTA
# ============================================================
uwielb*
kocham
podziw*
doceniam
gratul*
dzięk*
szanuj*
polecam
pozdraw*
pozdro
kibicuj*
wspieram
jesteś najlepsz*
jesteście najlepsi
najlepsz* youtuber*
najlepsz* twórca
najlepsz* prowadząc*
najlepsz* ekspert*
najlepsz* kanał
numer jeden
nr 1
klasa sama w sobie
pierwsza klasa
prawdziwy mistrz
jesteś mistrzem
jesteście mistrzami
mistrzostwo świata
fachowiec
prawdziwy fachowiec
prawdziwy ekspert
autorytet
czapki z głów
chapeau bas
pełen szacun
pełny szacun
wielki szacun
ogromny szacun
szacuneczek
wielkie brawa
ogromne brawa
wielkie brawo
ogromne brawo
ukłony

# ============================================================
# POLSKI — ROBOTA / PRACA / MATERIAŁ
# ============================================================
świetn* robota
dobr* robota
super robota
rewelac* robota
genialn* robota
fantastyczn* robota
kapitaln* robota
profesjonaln* robota
merytoryczn* robota
robi dobr* robotę
robisz dobr* robotę
robicie dobr* robotę
robi świetn* robotę
robisz świetn* robotę
robicie świetn* robotę
robi merytoryczn* robotę
robisz merytoryczn* robotę
robicie merytoryczn* robotę
kawał dobrej roboty
kawał świetnej roboty
mistrzowsk* robota
świetn* praca
dobr* praca
super praca
rewelac* praca
genialn* praca
fantastyczn* praca
kapitaln* praca
świetn* materiał
super materiał
rewelac* materiał
genialn* materiał
fantastyczn* materiał
niesamowit* materiał
wspaniał* materiał
znakomit* materiał
kapitaln* materiał
fenomenaln* materiał
merytoryczn* materiał
rzeteln* materiał
wartościow* materiał
dopracowan* materiał
świetn* film
super film
rewelac* film
genialn* film
fantastyczn* film
niesamowit* film
wspaniał* film
znakomit* film
kapitaln* film
fenomenaln* film
świetn* odcinek
super odcinek
rewelac* odcinek
genialn* odcinek
fantastyczn* odcinek
niesamowit* odcinek
wspaniał* odcinek
znakomit* odcinek
kapitaln* odcinek
fenomenaln* odcinek
rzeteln* pogadank*
świetn* pogadank*

# ============================================================
# POLSKI — WIEDZA / ZNAJOMOŚĆ TEMATU
# ============================================================
zna się na rzeczy
znasz się na rzeczy
znacie się na rzeczy
wie co mówi
wie o czym mówi
wiesz co mówisz
wiecie co mówicie
ogarnia temat
ogarniasz temat
ogarniacie temat
świetnie ogarnia*
doskonale ogarnia*
ma ogromną wiedzę
masz ogromną wiedzę
ogromna wiedza
imponująca wiedza
niesamowita wiedza
wiedza imponuje
wiedza robi wrażenie
kopalnia wiedzy
skarbnica wiedzy
morze wiedzy
masa wiedzy
wiedza i doświadczenie
fachowa wiedza
merytoryczna wiedza
człowiek z wiedzą
człowiek który zna się na rzeczy
widać że zna się na rzeczy
fachowca aż miło posłuchać
fachowca miło posłuchać

# ============================================================
# POLSKI — DOBRZE SIĘ SŁUCHA / OGLĄDA / ODBIERA
# ============================================================
dobrze się słucha
bardzo dobrze się słucha
świetnie się słucha
super się słucha
miło się słucha
przyjemnie się słucha
świetnie się tego słucha
dobrze się tego słucha
można słuchać godzinami
mógłbym słuchać godzinami
mogę słuchać godzinami
można słuchać cały dzień
słucha się z przyjemnością
słucham z przyjemnością
aż chce się słuchać
aż miło posłuchać
miło posłuchać
przyjemność słuchać
przyjemność posłuchać
dobrze się ogląda
bardzo dobrze się ogląda
świetnie się ogląda
super się ogląda
miło się ogląda
przyjemnie się ogląda
ogląda się z przyjemnością
oglądam z przyjemnością
aż chce się oglądać
nie można się oderwać
wciąga od początku
wciąga do końca
miły w odbiorze
świetny w odbiorze
robi dobre wrażenie
robi świetne wrażenie
bardzo dobre wrażenie

# ============================================================
# POLSKI — WYJAŚNIANIE / FORMA PRZEKAZU
# ============================================================
świetnie wytłumaczon*
dobrze wytłumaczon*
prosto wytłumaczon*
jasno wytłumaczon*
świetnie wyjaśnion*
dobrze wyjaśnion*
jasno wyjaśnion*
świetnie tłumaczysz
dobrze tłumaczysz
świetnie tłumaczy
dobrze tłumaczy
prosto i jasno
jasno i konkretnie
krótko i na temat
konkretnie i na temat

# ============================================================
# POLSKI — LOJALNOŚĆ / POWTARZALNE POCHWAŁY
# ============================================================
jak zawsze
jak zwykle
jak zawsze świetn*
jak zawsze super
jak zawsze genialn*
jak zawsze rewelac*
jak zawsze merytoryczn*
jak zwykle świetn*
jak zwykle super
jak zwykle merytoryczn*
świetn* jak zawsze
super jak zawsze
genialn* jak zawsze
rewelac* jak zawsze
merytoryczn* jak zawsze
poziom jak zawsze
forma jak zawsze
klasa jak zawsze
zawsze na poziomie
trzymasz poziom
trzymacie poziom
nie schodzisz z poziomu
nigdy nie zawodz*
jeszcze nigdy nie zawiodł*
nie zawiodł*
zawsze dowozisz
zawsze dowozi
zawsze dostarczasz
zawsze dostarcza
kolejny świetn*
kolejny super
kolejny genialn*
kolejny rewelac*
kolejny świetny materiał
kolejny świetny odcinek
kolejny świetny film

# ============================================================
# POLSKI — PROŚBY O WIĘCEJ / OCZEKIWANIE NA KOLEJNE
# ============================================================
tak trzymaj
tak trzymać
oby tak dalej
więcej takich
oby więcej takich
dawaj więcej
prosimy o więcej
czekam na więcej
czekamy na więcej
czekam na kolejny
czekamy na kolejny
czekam na następny
czekamy na następny
już czekam na kolejny
już czekamy na kolejny
nie mogę się doczekać kolejnego
nie możemy się doczekać kolejnego
oby częściej
nagrywaj częściej
wrzucaj częściej
więcej takich materiałów
więcej takich filmów
więcej takich odcinków

# ============================================================
# POLSKI — WDZIĘCZNOŚĆ / POZDROWIENIA
# ============================================================
wielkie dzięki
ogromne dzięki
serdeczne dzięki
dzięki wielkie
dziękuję bardzo
bardzo dziękuję
serdecznie dziękuję
dzięki za materiał
dziękuję za materiał
dzięki za film
dziękuję za film
dzięki za odcinek
dziękuję za odcinek
dzięki za nagranie
dziękuję za nagranie
dzięki za robotę
dziękuję za robotę
dzięki za pracę
dziękuję za pracę
dzięki za wiedzę
dziękuję za wiedzę
dzięki za wyjaśnienie
dziękuję za wyjaśnienie
dzięki za kolejny materiał
dziękuję za kolejny materiał
dzięki za kolejny odcinek
dziękuję za kolejny odcinek
pozdrawiam serdecznie
serdecznie pozdrawiam
gorąco pozdrawiam
pozdrawiam autora
pozdrawiam prowadzącego
pozdrawiam ekipę

# ============================================================
# POLSKI — KANAŁ / TWÓRCA / SUBSKRYPCJA
# ============================================================
uwielb* ten kanał
uwielb* twój kanał
uwielb* wasz kanał
uwielb* twoje filmy
uwielb* twoje materiały
uwielb* wasze materiały
kocham ten kanał
kocham twój kanał
kocham wasz kanał
kocham twoje filmy
kocham twoje materiały
najlepsz* kanał na youtube
jeden z najlepszych kanałów
jedna z najlepszych treści
jeden z najlepszych twórców
mój ulubion* kanał
mój ulubion* twórca
ulubion* kanał
ulubion* twórca
zasługuje na więcej wyświetleń
zasługujesz na więcej wyświetleń
zasługuje na więcej subskrypcji
zasługujesz na więcej subskrypcji
za mało wyświetleń
za mało subskrypcji
niedocenion* kanał
niedocenion* twórca



# ============================================================
# POLSKI — FORMATY TREŚCI / ROZMOWA / PODCAST / MUZYKA
# ============================================================
dobr* materiał
dobr* film
dobr* odcinek
ciekaw* materiał
ciekaw* film
ciekaw* odcinek
interesując* materiał
interesując* film
interesując* odcinek
świetn* analiza
dobr* analiza
rzeteln* analiza
merytoryczn* analiza
profesjonaln* analiza
świetn* rozmowa
dobr* rozmowa
ciekaw* rozmowa
świetn* wywiad
dobr* wywiad
ciekaw* wywiad
świetn* podcast
dobr* podcast
super podcast
świetn* prowadzenie
dobrze poprowadzon*
świetn* pytania
dobr* pytania
świetn* gość
dobr* gość
świetn* prowadząc*
dobr* prowadząc*
warto obejrzeć
warto posłuchać
warto śledzić
piękn* utwór
świetn* utwór
genialn* utwór
piękn* muzyka
świetn* muzyka
genialn* muzyka
świetn* piosenk*
genialn* piosenk*
piękn* piosenk*
genialn* kawałek
świetn* kawałek

# ============================================================
# POLSKI — DODATKOWE FORMUŁY OCENY / POPARCIA / ZAANGAŻOWANIA
# ============================================================
spoko
pozytywn*
najciekawsz*
tak dobr*
bardzo dobr*
naprawdę dobr*
robi wrażenie
robi ogromne wrażenie
robi niesamowite wrażenie
pełna zgoda
pełne poparcie
zgadzam się w 100%
zgadzam się w stu procentach
100% racji
sto procent racji
nic dodać nic ująć
dokładnie tak
w punkt
samo sedno
sama prawda
szczera prawda
same fakty
sub leci
subik leci
subskrypcja leci
zostawiam suba
sub ode mnie
łapka w górę
łapa w górę
lajk leci
like leci
zasłużony lajk
zasłużony like
zostawiam lajka
lajk i sub
sub i łapka
zasłużona subskrypcja

# ============================================================
# ENGLISH — STRONG PRAISE WORDS / STEMS
# ============================================================
great
awesome
amaz*
fantastic*
excellent*
brilliant*
wonderful*
perfect*
superb
incredibl*
outstand*
phenomenal*
exceptional*
impressive*
beautiful*
genius
masterpiece
banger
fire
goat
kudos
adore
admire
appreciat*
congrat*
thank*
props
nailed it

# ============================================================
# ENGLISH — QUALITY / SUBSTANCE / PROFESSIONALISM
# ============================================================
informative
insightful
educational
professional*
knowledgeable
well researched
well-researched
well made
well-made
high quality
high-quality
quality content
top tier
top-tier
first class
first-class
class act
solid work
great research
excellent research
thorough
well presented
well-presented
clear and concise
straight to the point
no fluff

# ============================================================
# ENGLISH — CREATOR / WORK PRAISE
# ============================================================
great job
awesome job
amaz* job
fantastic* job
excellent* job
brilliant* job
good job
well done
great work
awesome work
amaz* work
fantastic* work
excellent* work
brilliant* work
nice work
keep up the good work
keep it up
keep them coming
absolute legend
what a legend
you are a legend
you're a legend
you are the best
you're the best
best youtuber
best creator
best channel
best on youtube
one of the best
my favorite channel
my favourite channel
favorite creator
favourite creator
much respect
massive respect
mad respect
huge respect

# ============================================================
# ENGLISH — VIDEO / CONTENT PRAISE
# ============================================================
great video
awesome video
amaz* video
fantastic* video
excellent* video
brilliant* video
incredibl* video
outstand* video
great content
awesome content
amaz* content
fantastic* content
excellent* content
brilliant* content
incredibl* content
great episode
awesome episode
amaz* episode
fantastic* episode
excellent* episode
another great video
another awesome video
another amaz* video
another great episode
another awesome episode
another banger
absolute banger
another masterpiece

# ============================================================
# ENGLISH — KNOWLEDGE / EXPERTISE / EXPLANATION
# ============================================================
knows his stuff
knows her stuff
know your stuff
knows what he's talking about
knows what she is talking about
you know what you're talking about
wealth of knowledge
treasure trove of knowledge
gold mine of information
goldmine of information
so knowledgeable
very knowledgeable
great explanation
excellent explanation
awesome explanation
well explained
clearly explained
perfectly explained
easy to understand
so easy to understand

# ============================================================
# ENGLISH — LISTENING / WATCHING EXPERIENCE
# ============================================================
easy to listen to
great to listen to
love listening
love listening to you
could listen all day
could listen for hours
can listen all day
can listen for hours
pleasure to listen
such a pleasure to listen
love watching
love watching your videos
great to watch
so easy to watch
could watch all day
could watch for hours
never gets boring
can't stop watching
cant stop watching

# ============================================================
# ENGLISH — LOYALTY / MORE CONTENT
# ============================================================
as always
great as always
awesome as always
amaz* as always
excellent* as always
brilliant* as always
fantastic* as always
never disappoint*
you never disappoint*
never misses
you never miss
always delivers
you always deliver
can't wait for more
cant wait for more
can't wait for the next
cant wait for the next
looking forward to the next
looking forward to more
more please
more of this
more like this
more videos like this
more content like this
keep making these
keep making videos
keep making content

# ============================================================
# ENGLISH — LOVE / THANKS / SUPPORT
# ============================================================
love your content
love your videos
love this channel
love your channel
love your work
love these videos
love these episodes
appreciate your work
appreciate your content
appreciate the video
thanks for sharing
thank you for sharing
thanks for the video
thank you for the video
thanks for the content
thank you for the content
thanks for the episode
thank you for the episode
thanks for another video
thank you for another video
thanks for all you do
thank you for all you do

# ============================================================
# ENGLISH — UNDERRATED / DESERVES MORE
# ============================================================
underrated
so underrated
criminally underrated
deserves more views
you deserve more views
deserves more subscribers
you deserve more subscribers
should have more views
should have more subscribers
why so few views



# ============================================================
# ENGLISH — CONTENT FORMATS / INTERVIEW / PODCAST / MUSIC
# ============================================================
great analysis
excellent analysis
insightful analysis
great interview
excellent interview
great conversation
excellent conversation
great podcast
awesome podcast
excellent podcast
great host
excellent host
great guest
excellent guest
great questions
excellent questions
worth watching
worth listening to
beautiful song
great song
amaz* song
fantastic* song
excellent* song
love this song
beautiful music
great music
amaz* music
fantastic* music

# ============================================================
# ENGLISH — EXTRA PRAISE / AGREEMENT / ENGAGEMENT
# ============================================================
so good
really good
very good
so great
absolutely amazing
absolutely brilliant
absolutely fantastic
absolutely incredible
great stuff
good stuff
quality stuff
spot on
exactly right
100% agree
completely agree
couldn't agree more
couldnt agree more
so true
nothing to add
subscribed
new subscriber
earned a sub
you earned a sub
you earned my subscription
instant subscribe
like and subscribe
deserved like

# ============================================================
# COMMON INTERNATIONAL PRAISE
# ============================================================
bravo
bravissimo
merci
gracias
danke
grazie
# ============================================================
# POLSKI — SLANG / INTERNETOWE POCHWAŁY / EMOCJONALNE FORMUŁY
# ============================================================
zajebist*
zajebiśc*
zajebioza
dojeban*
sztosiwo
sztosik
miazga
wymiata*
pozamiatane
rozwala system
rozwalił system
rozwaliła system
czyste złoto
to jest złoto
złoto
miód na uszy
miód dla uszu
uczta dla uszu
uczta dla oczu
balsam dla uszu
klasa
top
topka
top 1
top1
sama klasa
pełna klasa
klasa światowa
światowy poziom
poziom światowy
sztos jak zawsze
petarda jak zawsze
miazga jak zawsze
mega jak zawsze
super robota jak zawsze
szacun dla autora
szacun dla prowadzącego
respect dla autora
respect dla prowadzącego
wielki plus
ogromny plus
same plusy
robi robotę
robi mega wrażenie
jest moc
mocny materiał
mocny odcinek
mocna rzecz

# ============================================================
# ENGLISH — INTERNET SLANG / EMOTIONAL PRAISE
# ============================================================
nice
love
love it
loving it
epic
insane
legendary
flawless
immaculate
top notch
top-notch
chef's kiss
chefs kiss
pure gold
absolute gold
this is gold
gold
gem
hidden gem
absolute gem
killed it
crushed it
smashing it
slaps
this slaps
hits different
hits differently
absolute cinema
peak
peak content
peak youtube
goated
goated content
legend
king
queen
massive w
huge w
common w
big w
another w
this never misses
perfect as always
flawless as always
worth every minute
worth the watch
time well spent
made my day
best part of my day
exactly what i needed
needed this
so refreshing
refreshing content
breath of fresh air
such a breath of fresh air
keep these coming
keep 'em coming
keep em coming
can't get enough
cant get enough
big fan
huge fan
long time fan
fan for years
much love
all the love
respect to you
respect to the creator
respect to the host
`.trim();

  const DEFAULT_SETTINGS = Object.freeze({
    enabled: true,
    minLengthEnabled: true,
    minLength: 30,
    praiseEnabled: true,
    praiseMinHits: 2,
    filterRepliesEnabled: false,
    collapseFilteredEnabled: false,
    uiLanguage: 'auto'
  });

  // Od v1.8 treść list nie jest zapisywana w storage.sync. Duże listy i cache
  // źródeł zewnętrznych trafiają do storage.local, dzięki czemu nie podlegają
  // limitowi 8192 B na pojedynczy element synchronizowanej pamięci.
  const LOCAL_PRAISE_KEY = 'praisePhrasesLocal';
  const EXTERNAL_URLS_KEY = 'externalPraiseListUrls';
  const EXTERNAL_CACHE_KEY = 'externalPraiseListCache';
  const IMPORTED_LISTS_KEY = 'importedPraiseLists';
  const PRAISE_STORAGE_VERSION_KEY = 'praiseStorageVersion';
  const PRAISE_STORAGE_VERSION = 2;

  // Klucze używane przez v1.7 i starsze — potrzebne wyłącznie do migracji.
  const LEGACY_PRAISE_KEY = 'praisePhrases';
  const PRAISE_CHUNK_COUNT_KEY = 'praisePhrasesChunkCount';
  const PRAISE_CHUNK_PREFIX = 'praisePhrasesChunk_';

  function praiseChunkKey(index) {
    return `${PRAISE_CHUNK_PREFIX}${index}`;
  }

  function isLegacyPraiseStorageKey(key) {
    return key === LEGACY_PRAISE_KEY || key === PRAISE_CHUNK_COUNT_KEY || key.startsWith(PRAISE_CHUNK_PREFIX);
  }

  function isPraiseLocalStorageKey(key) {
    return key === LOCAL_PRAISE_KEY
      || key === EXTERNAL_URLS_KEY
      || key === EXTERNAL_CACHE_KEY
      || key === IMPORTED_LISTS_KEY
      || key === PRAISE_STORAGE_VERSION_KEY;
  }

  async function readLegacyPraisePhrases() {
    const head = await chrome.storage.sync.get({
      [PRAISE_CHUNK_COUNT_KEY]: 0,
      [LEGACY_PRAISE_KEY]: null
    });

    const count = Math.max(0, Math.trunc(Number(head[PRAISE_CHUNK_COUNT_KEY])) || 0);
    if (count > 0) {
      const keys = Array.from({ length: count }, (_, i) => praiseChunkKey(i));
      const stored = await chrome.storage.sync.get(keys);
      const chunks = keys.map(key => typeof stored[key] === 'string' ? stored[key] : '');
      const joined = chunks.join('\n');
      if (joined.trim()) return joined;
    }

    const legacy = head[LEGACY_PRAISE_KEY];
    return typeof legacy === 'string' ? legacy : null;
  }

  async function removeLegacyPraiseStorage() {
    const all = await chrome.storage.sync.get(null);
    const keys = Object.keys(all).filter(isLegacyPraiseStorageKey);
    if (keys.length) await chrome.storage.sync.remove(keys);
  }

  async function ensurePraiseStorageMigration() {
    const local = await chrome.storage.local.get({
      [LOCAL_PRAISE_KEY]: null,
      [PRAISE_STORAGE_VERSION_KEY]: 0
    });

    const currentVersion = Math.max(0, Math.trunc(Number(local[PRAISE_STORAGE_VERSION_KEY])) || 0);
    const alreadyHasLocalList = typeof local[LOCAL_PRAISE_KEY] === 'string';

    if (currentVersion >= PRAISE_STORAGE_VERSION && alreadyHasLocalList) return;

    if (!alreadyHasLocalList) {
      const legacy = await readLegacyPraisePhrases();
      if (typeof legacy === 'string') {
        await chrome.storage.local.set({ [LOCAL_PRAISE_KEY]: legacy });
      }
    }

    await chrome.storage.local.set({ [PRAISE_STORAGE_VERSION_KEY]: PRAISE_STORAGE_VERSION });
    await removeLegacyPraiseStorage();
  }

  async function loadPraisePhrases() {
    await ensurePraiseStorageMigration();
    const stored = await chrome.storage.local.get({ [LOCAL_PRAISE_KEY]: null });
    return typeof stored[LOCAL_PRAISE_KEY] === 'string'
      ? stored[LOCAL_PRAISE_KEY]
      : DEFAULT_PRAISE_PHRASES;
  }

  async function savePraisePhrases(raw) {
    await ensurePraiseStorageMigration();
    await chrome.storage.local.set({ [LOCAL_PRAISE_KEY]: String(raw ?? '') });
  }

  async function resetPraisePhrases() {
    await chrome.storage.local.remove([LOCAL_PRAISE_KEY]);
    await removeLegacyPraiseStorage();
    await chrome.storage.local.set({ [PRAISE_STORAGE_VERSION_KEY]: PRAISE_STORAGE_VERSION });
  }

  function parseExternalListUrls(raw) {
    const urls = [];
    const invalid = [];
    const seen = new Set();

    for (const originalLine of String(raw ?? '').replace(/\r\n/g, '\n').split('\n')) {
      const line = originalLine.trim();
      if (!line || line.startsWith('#') || line.startsWith('!')) continue;
      try {
        const url = new URL(line);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error('unsupported protocol');
        const normalized = url.href;
        if (!seen.has(normalized)) {
          seen.add(normalized);
          urls.push(normalized);
        }
      } catch (_) {
        invalid.push(originalLine);
      }
    }

    return { urls, invalid };
  }

  function countPraiseRules(raw) {
    const seen = new Set();
    for (const originalLine of String(raw ?? '').replace(/\r\n/g, '\n').split('\n')) {
      const line = originalLine.trim();
      if (!line || line.startsWith('#') || line.startsWith('!')) continue;
      if (line.startsWith('[') && line.endsWith(']')) continue;
      seen.add(line.toLocaleLowerCase());
    }
    return seen.size;
  }

  async function loadExternalPraiseState() {
    const data = await chrome.storage.local.get({
      [EXTERNAL_URLS_KEY]: '',
      [EXTERNAL_CACHE_KEY]: {},
      [IMPORTED_LISTS_KEY]: []
    });

    return {
      urlsRaw: typeof data[EXTERNAL_URLS_KEY] === 'string' ? data[EXTERNAL_URLS_KEY] : '',
      cache: data[EXTERNAL_CACHE_KEY] && typeof data[EXTERNAL_CACHE_KEY] === 'object' && !Array.isArray(data[EXTERNAL_CACHE_KEY])
        ? data[EXTERNAL_CACHE_KEY]
        : {},
      imported: Array.isArray(data[IMPORTED_LISTS_KEY]) ? data[IMPORTED_LISTS_KEY] : []
    };
  }

  async function saveExternalListUrls(raw) {
    const text = String(raw ?? '');
    const { urls } = parseExternalListUrls(text);
    const state = await loadExternalPraiseState();
    const allowed = new Set(urls);
    const prunedCache = {};

    for (const [url, item] of Object.entries(state.cache)) {
      if (allowed.has(url)) prunedCache[url] = item;
    }

    await chrome.storage.local.set({
      [EXTERNAL_URLS_KEY]: text,
      [EXTERNAL_CACHE_KEY]: prunedCache
    });
    return { urls, cache: prunedCache };
  }

  async function saveExternalPraiseCache(cache) {
    await chrome.storage.local.set({ [EXTERNAL_CACHE_KEY]: cache && typeof cache === 'object' ? cache : {} });
  }

  async function saveImportedPraiseLists(imported) {
    await chrome.storage.local.set({ [IMPORTED_LISTS_KEY]: Array.isArray(imported) ? imported : [] });
  }

  async function loadEffectivePraisePhrases() {
    const [main, state] = await Promise.all([
      loadPraisePhrases(),
      loadExternalPraiseState()
    ]);

    const parts = [main];
    const { urls } = parseExternalListUrls(state.urlsRaw);

    for (const url of urls) {
      const cached = state.cache[url];
      if (cached && typeof cached.content === 'string' && cached.content.trim()) {
        parts.push(`\n# --- lista zewnętrzna: ${url} ---\n${cached.content}`);
      }
    }

    for (const item of state.imported) {
      if (!item || item.enabled === false || typeof item.content !== 'string' || !item.content.trim()) continue;
      parts.push(`\n# --- lista z pliku: ${String(item.name || 'bez nazwy').replace(/[\r\n]+/g, ' ')} ---\n${item.content}`);
    }

    return parts.filter(Boolean).join('\n');
  }

  globalThis.YTCF_DEFAULTS = Object.freeze({
    DEFAULT_SETTINGS,
    DEFAULT_PRAISE_PHRASES,
    LOCAL_PRAISE_KEY,
    EXTERNAL_URLS_KEY,
    EXTERNAL_CACHE_KEY,
    IMPORTED_LISTS_KEY,
    PRAISE_STORAGE_VERSION_KEY,
    LEGACY_PRAISE_KEY,
    PRAISE_CHUNK_COUNT_KEY,
    PRAISE_CHUNK_PREFIX,
    loadPraisePhrases,
    savePraisePhrases,
    resetPraisePhrases,
    loadEffectivePraisePhrases,
    loadExternalPraiseState,
    saveExternalListUrls,
    saveExternalPraiseCache,
    saveImportedPraiseLists,
    parseExternalListUrls,
    countPraiseRules,
    ensurePraiseStorageMigration,
    isLegacyPraiseStorageKey,
    isPraiseLocalStorageKey
  });
})();
