# Cassette Collars – website improvement prototypes

Five clickable greyscale prototypes for improvements to cassettecollars.co.uk, following the phase 1 review (19 October 2026). They are deliberately unstyled: `src/css/theme.css` is empty, and the Cassette Collars look will be applied there in phase 3 without touching the pages.

## View
Live: https://hrhlescargotleo.github.io/Cassette-Collars-Roadmap/ (once GitHub Pages is switched on)

Or open `docs/index.html` in a browser. No server or install needed.

GitHub Pages settings: Settings → Pages → Deploy from a branch → `main` / `/docs`.

## Prototypes
1. Fitment finder – `pages/fitment-finder.html`
2. Quote builder – `pages/quote.html` (`?custom=1` opens the custom collar form)
3. Product page – `pages/product.html?size=650|750|850|1000|1200`
4. RAL colour selector – `pages/colours.html` (`?ral=9005` preselects a colour)
5. Projects and reviews – `pages/projects.html`

Module library: `modules/library.html`. Requirements: `requirements/requirements.md`.

## Data
`src/js/data.js`. Collar sizes, depth bands, hole sizes and prices are copied from the live product pages; brands, ranges, model numbers and facia references from the live brand pages. Deflector prices, delivery, RAL surcharge and lead time, volume discount, the facia-to-collar mapping and the projects are sample data, and are labelled as such on the pages.

## Build
```
node build-includes.js && node validate.js
```
Edit files in `src/`; `docs/` is generated (commit it, as GitHub Pages serves it). The prototype navigator and the previous/next footer live in `src/includes/`.

## Status
Version 1, greyscale prototypes for internal review. Notes are off by default; switch "Notes on" in the top bar to see what each prototype proposes and why, plus in-page annotations (yellow: behaviour; red: questions for Cassette Collars).
