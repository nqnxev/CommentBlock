# CommentBlock

[Polski](README.pl.md)

CommentBlock is a Chromium extension for filtering low-value comments on YouTube. It can hide comments that are too short or consist mainly of generic praise, while keeping the filtering rules fully configurable.

## Features

- **Minimum comment length** — hide comments shorter than a configurable number of characters.
- **Praise / sycophancy filter** — detect generic praise using a large, configurable rule list.
- **Word stems with `*`** — for example, `amaz*` can match `amazing`, `amazingly`, etc.; Polish stems such as `niesamowit*` can match multiple grammatical forms.
- **Detection threshold** — a literal minimum number of independent matches required to hide a comment. The default is **2**. A slider covers values 1–15, while the numeric field allows values up to 999.
- **Large filter lists** — stored in `chrome.storage.local`, avoiding the small per-item limits of synchronized storage.
- **External filter lists** — load additional rule lists from URLs or local `.txt` files. Downloaded URL lists are cached locally.
- **Reply filtering** — optional and disabled by default. When disabled, only top-level comments are filtered.
- **Collapsible hidden comments** — instead of removing a filtered comment completely, CommentBlock can collapse it into a small spoiler-like bar that can be expanded and collapsed again.
- **Per-tab badge counter** — shows how many comments are currently hidden on the active YouTube tab.
- **Global blocked counter** — keeps a persistent count of filtered comments since the feature was introduced.
- **Pause / Resume button** — a large popup button for instantly disabling or re-enabling filtering without changing your configuration.
- **English and Polish UI** — automatic language selection based on Chromium's UI language, with an optional manual override.

## Language

CommentBlock uses Chromium's native internationalization system (`chrome.i18n` and `_locales`).

Available modes:

- **Automatic** — Polish is used when Chromium's UI language is Polish; English is used for other languages.
- **Polski** — forces the Polish interface.
- **English** — forces the English interface.

The language selector is available at the top of the settings page and applies immediately to the popup, settings page, and CommentBlock controls inserted into YouTube.

## Praise-filter rule syntax

Enter one rule per line.

Examples:

```text
awesome
great job
amaz*
niesamowit*
well researched
```

A rule without `*` matches a complete word or phrase. A trailing `*` matches a word stem, which is useful for grammatical or inflectional variants.

Lines beginning with `#` or `!` can be used as comments. Section headers such as `[Polish praise]` are ignored by the parser as well.

Overlapping rules do not artificially increase the match count. For example, if both `great` and `great video` match the same text span, CommentBlock prefers the longer match instead of counting both.

## External filter lists

The settings page supports additional filter lists independently of the main editable list:

- paste one list URL per line and use **Download / Update lists**;
- import one or more local `.txt` files;
- enable, disable, update, or remove imported lists without modifying the main list.

Downloaded lists are cached locally. If a remote server is temporarily unavailable, CommentBlock can continue using the last successfully downloaded copy.

## Installation

CommentBlock is currently installed as an unpacked Chromium extension:

1. Download and extract the ZIP archive.
2. Open `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the extracted CommentBlock directory.
6. Refresh any already-open YouTube tabs.

## Updating from an older version

To preserve your existing settings, custom lists, and statistics, replace the files in the directory of your existing unpacked extension and then click **Reload** on `chrome://extensions/`.

CommentBlock intentionally keeps the storage keys used by earlier versions named "YouTube Comment Filter", so updating the existing unpacked extension should preserve its configuration.

Loading the new version from a completely different directory may cause Chromium to treat it as a separate unpacked extension with separate storage.

## Privacy

CommentBlock processes YouTube comments locally in the browser. Remote filter-list domains are requested only when you explicitly download or update a list from that domain. The extension does not need a permanent all-sites permission solely for remote lists.

## License

No license file is currently included. Add a license before publishing the project if you want others to have explicit permission to reuse, modify, or redistribute the code.
