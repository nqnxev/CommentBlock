# CommentBlock — v2.0.0

Rozszerzenie Chromium do filtrowania komentarzy na YouTube. Filtruje zbyt krótkie komentarze i komentarze pochwalne/pochlebcze na podstawie konfigurowalnych list reguł.

## Język

CommentBlock używa natywnej infrastruktury internacjonalizacji Chromium (`chrome.i18n`, katalog `_locales`). Obsługiwane są polski i angielski.

- `Automatyczny` — polski interfejs, gdy język interfejsu Chromium jest polski; dla pozostałych języków używany jest angielski.
- `Polski` — ręczne wymuszenie polskiego.
- `English` — ręczne wymuszenie angielskiego.

Ręczny wybór języka znajduje się na górze strony ustawień i działa natychmiast. Obejmuje popup, ustawienia oraz komunikaty „Pokaż komentarz / Zwiń komentarz” w sekcji komentarzy YouTube.

## Najważniejsze funkcje

- minimalna długość komentarza;
- filtr pochlebstw z szeroką domyślną listą i rdzeniami `*`;
- literalny próg liczby trafień, domyślnie 2, z suwakiem 1–15 i ręcznym polem do 999;
- duże listy przechowywane w `chrome.storage.local`;
- dodatkowe listy z URL i plików `.txt`;
- opcjonalne filtrowanie odpowiedzi (domyślnie wyłączone);
- opcjonalne zwijanie odfiltrowanych komentarzy zamiast całkowitego ukrywania;
- badge na ikonie z liczbą aktualnie ukrytych komentarzy;
- globalny licznik blokad od instalacji;
- duży przycisk Pauza/Wznów w popupie.

## Instalacja

1. Rozpakuj ZIP.
2. Otwórz `chrome://extensions/`.
3. Włącz „Tryb dewelopera”.
4. Kliknij „Załaduj rozpakowane” i wybierz katalog CommentBlock.
5. Odśwież otwarte karty YouTube.

## Aktualizacja ze starszej wersji

CommentBlock zachowuje dotychczasowe klucze ustawień i magazynu danych używane przez wcześniejsze wersje „YouTube Comment Filter”, dzięki czemu własne listy, ustawienia i globalny licznik nie powinny zostać wyzerowane po podmianie plików rozszerzenia.
