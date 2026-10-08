# nodavex website

A static GitHub Pages site with animated tabs. No packages or framework are required.

## Structure

| Location | Purpose |
| --- | --- |
| `src/pages/*.html` | Editable page content |
| `src/pages.json` | Page labels, tab order and navigation visibility |
| `scripts/build.py` | Shared layout and page generation |
| `assets/css/site.css` | Shared styles, grouped by component |
| `assets/js/navigation.js` | Tab animation and navigation |
| `assets/js/theme.js` | Light/dark theme preference and toggle |
| `public/images/` | Logos, diagrams and screenshots |
| `favicon.svg` | Browser icon |

Root HTML files and `assets/js/page-data.js` are generated. Edit the sources, then rebuild; commit sources and generated output together.

## Build and check

Python 3 is the only build requirement:

```sh
python3 scripts/build.py
python3 scripts/check.py
```

The local-file preview bundle is regenerated automatically.

The theme follows the device preference until the light/dark toggle is used. That selection is saved in browser storage. Theme colors are defined at the top of `assets/css/site.css`.

## Preview

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. Opening `index.html` directly also works through the generated preview bundle.

## GitHub Pages

Use **Deploy from a branch** with **/(root)**. Generated pages are committed, so no deployment build is needed. `.nojekyll` enables static serving; `CNAME` retains the custom domain.

Documentation sources are preserved but hidden from the main tabs. Hidden pages remain accessible by URL. Change visibility in `src/pages.json` and rebuild to show them again.
