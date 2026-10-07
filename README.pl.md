# CommentBlock

[English](README.md)

CommentBlock to rozszerzenie dla przeglądarek Chromium służące do filtrowania mało wartościowych komentarzy na YouTube. Może ukrywać komentarze zbyt krótkie lub składające się głównie z ogólnikowych pochwał, pozostawiając użytkownikowi pełną kontrolę nad regułami filtrowania.

## Funkcje

- **Minimalna długość komentarza** — ukrywanie komentarzy krótszych niż określona liczba znaków.
- **Filtr pochlebstw / pustych pochwał** — wykrywanie ogólnikowych pochwał na podstawie dużej, konfigurowalnej listy reguł.
- **Rdzenie słów z `*`** — np. `niesamowit*` może dopasować `niesamowity`, `niesamowita`, `niesamowite` itd.; analogicznie `amaz*` dla różnych angielskich form.
- **Próg wykrywania** — literalna minimalna liczba niezależnych trafień potrzebna do ukrycia komentarza. Domyślna wartość to **2**. Suwak obejmuje zakres 1–15, a pole liczbowe pozwala wpisać wartość do 999.
- **Duże listy filtrów** — przechowywane w `chrome.storage.local`, bez ograniczenia pojedynczego elementu typowego dla pamięci synchronizowanej.
- **Zewnętrzne listy filtrów** — możliwość wczytywania dodatkowych list z URL oraz lokalnych plików `.txt`. Listy pobrane z URL są buforowane lokalnie.
- **Filtrowanie odpowiedzi** — opcjonalne i domyślnie wyłączone. Przy wyłączonej opcji filtrowane są tylko komentarze główne.
- **Zwijanie ukrytych komentarzy** — zamiast całkowicie usuwać komentarz, CommentBlock może zwinąć go do małego paska działającego podobnie do spoilera, który można rozwijać i ponownie zwijać.
- **Licznik na ikonie** — pokazuje liczbę komentarzy aktualnie ukrytych na danej karcie YouTube.
- **Globalny licznik blokad** — przechowuje sumę odfiltrowanych komentarzy od momentu wprowadzenia tej funkcji.
- **Pauza / Wznów** — duży przycisk w popupie pozwalający natychmiast zatrzymać i wznowić filtrowanie bez zmiany konfiguracji.
- **Interfejs polski i angielski** — automatyczny wybór według języka Chromium oraz możliwość ręcznego nadpisania.

## Język

CommentBlock korzysta z natywnego mechanizmu lokalizacji Chromium (`chrome.i18n` oraz `_locales`).

Dostępne tryby:

- **Automatyczny** — polski interfejs, gdy językiem interfejsu Chromium jest polski; w pozostałych przypadkach używany jest angielski.
- **Polski** — ręczne wymuszenie języka polskiego.
- **English** — ręczne wymuszenie języka angielskiego.

Selektor języka znajduje się na górze strony ustawień. Zmiana działa od razu i obejmuje popup, ustawienia oraz elementy CommentBlock wstrzykiwane do sekcji komentarzy YouTube.

## Składnia reguł filtra pochlebstw

Wpisuj jedną regułę w każdej linii.

Przykłady:

```text
super
świetn* robota
niesamowit*
dobrze się słucha
merytoryczn*
```

Reguła bez `*` dopasowuje pełne słowo albo frazę. Gwiazdka na końcu słowa oznacza dopasowanie rdzenia, dzięki czemu można objąć różne odmiany gramatyczne.

Linie zaczynające się od `#` lub `!` mogą służyć jako komentarze. Parser ignoruje również nagłówki sekcji, np. `[Polskie pochwały]`.

Nakładające się reguły nie zwiększają sztucznie liczby trafień. Jeżeli np. jednocześnie pasują `świetn*` i `świetn* materiał` do tego samego fragmentu tekstu, CommentBlock preferuje dłuższe dopasowanie zamiast liczyć oba.

## Zewnętrzne listy filtrów

Strona ustawień obsługuje dodatkowe listy niezależnie od głównej, ręcznie edytowanej listy:

- wklej jeden adres listy w każdej linii i użyj **Pobierz / aktualizuj listy**;
- zaimportuj jeden lub wiele lokalnych plików `.txt`;
- włączaj, wyłączaj, aktualizuj i usuwaj dodatkowe listy bez modyfikowania listy głównej.

Pobrane listy są zapisywane w lokalnym cache. Jeśli serwer listy jest chwilowo niedostępny, CommentBlock może nadal korzystać z ostatniej poprawnie pobranej wersji.

## Instalacja

CommentBlock jest obecnie instalowany jako rozpakowane rozszerzenie Chromium:

1. Pobierz i rozpakuj archiwum ZIP.
2. Otwórz `chrome://extensions/`.
3. Włącz **Tryb dewelopera**.
4. Kliknij **Załaduj rozpakowane**.
5. Wskaż rozpakowany katalog CommentBlock.
6. Odśwież wcześniej otwarte karty YouTube.

## Aktualizacja ze starszej wersji

Aby zachować dotychczasowe ustawienia, własne listy i statystyki, podmień pliki w katalogu już zainstalowanego, rozpakowanego rozszerzenia, a następnie kliknij **Odśwież** przy CommentBlock na stronie `chrome://extensions/`.

CommentBlock celowo zachowuje klucze pamięci używane przez wcześniejsze wersje o nazwie „YouTube Comment Filter”, dlatego aktualizacja istniejącej instalacji powinna zachować jej konfigurację.

Załadowanie nowej wersji z zupełnie innego katalogu może spowodować, że Chromium potraktuje ją jako osobne rozszerzenie z osobnym magazynem danych.

## Prywatność

CommentBlock przetwarza komentarze YouTube lokalnie w przeglądarce. Dostęp do domen zawierających zewnętrzne listy filtrów jest żądany dopiero wtedy, gdy użytkownik sam pobierze lub zaktualizuje listę z danej domeny. Rozszerzenie nie potrzebuje stałego dostępu do wszystkich stron wyłącznie na potrzeby list zewnętrznych.

## Licencja

Projekt nie zawiera obecnie pliku licencji. Przed publikacją warto dodać licencję, jeśli chcesz jednoznacznie zezwolić innym na używanie, modyfikowanie lub rozpowszechnianie kodu.
