# Content Localization and Internationalization (i18n)

This document explains how content localization and internationalization are handled in this project.

## Overview

The site supports multiple languages using a directory-based structure. Each language has its own directory under `src/` (e.g., `src/en/`, `src/de/`, `src/ar/`).

A language switcher component is included in the navigation bar to allow users to switch between available languages.

## Key Components

1.  **Language-specific Directories**:
    *   Content for each language resides in its respective directory (e.g., `src/de/` for German).
    *   Files in these directories should mirror the structure of the default language (English, in `src/en/`).

2.  **Frontmatter**:
    *   Every page (`.md` or `.html` file) within a language-specific directory *must* include a `locale` variable in its frontmatter, specifying the language code. For example, a page in `src/fr/` should have `locale: fr`.

3.  **Global Language Configuration (`src/_data/site.json`)**:
    *   The file `src/_data/site.json` contains global site settings, including language definitions.
    *   `languages`: An array of language objects. Each object defines:
        *   `code`: The language code (e.g., "en", "es"). This must match the directory name and the `locale` frontmatter value.
        *   `label`: The display name of the language (e.g., "English", "Español").
        *   `direction`: The text direction, either "ltr" (left-to-right) or "rtl" (right-to-left).
    *   `defaultLanguageCode`: Specifies the code of the default language (e.g., "en").

4.  **Language Switcher (`src/_includes/language_switcher.liquid`)**:
    *   This Liquid template generates the language navigation links.
    *   It uses the `languages` array and the current page's `locale` to construct the correct URLs for each language.
    *   It's included in the main navigation template (`src/_includes/nav.liquid`).

## Adding a New Language

1.  **Create a New Directory**:
    *   Add a new directory under `src/` with the language code (e.g., `src/es/` for Spanish).

2.  **Update Global Configuration**:
    *   In `src/_data/site.json`, add a new language object to the `languages` array. For example:
        ```json
        {
          "code": "es",
          "label": "Español",
          "direction": "ltr"
        }
        ```

3.  **Translate Content**:
    *   Copy the content files from the default language directory (e.g., `src/en/`) into your new language directory (`src/es/`).
    *   Translate the content within these files.

4.  **Set `locale` in Frontmatter**:
    *   For every page in the new language directory, ensure the frontmatter includes the correct `locale` variable (e.g., `locale: es`).

## Translating Existing Content

*   To translate an existing page into an already configured language, create the corresponding file in that language's directory.
*   Ensure the `locale` frontmatter is set correctly.
*   Translate the content of the page.

## Static Strings in Templates (i18n-TODO)

Some templates (like `src/_includes/nav.liquid`) may contain hardcoded strings (e.g., "Home", "About"). These are marked with `<!-- i18n-TODO: Translate 'Text' -->`.

Proper internationalization of these strings would require a more advanced setup, possibly involving:
*   A dictionary of translations for each language, likely in `src/_data/`.
*   A Liquid filter or shortcode to look up translations based on the current `locale`.

This is a potential area for future improvement. For now, these strings will remain in the default language or would need to be manually updated in duplicated templates if per-language versions are created.

## Testing

After adding new languages or translations, thoroughly test the language switcher and navigate the site in each language to ensure links are correct and content displays as expected.
