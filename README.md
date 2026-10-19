# Cassette Collars – website improvement prototypes

Five clickable prototypes for improvements to cassettecollars.co.uk, following the phase 1 review (19 October 2026). The Cassette Collars design layer (Plus Jakarta Sans and Montserrat, black on paper, pill buttons, the mint gradient and charcoal footer) lives entirely in `src/css/theme.css`; remove that file to get the greyscale prototypes back. Filled buttons use a deeper green than the live site (#0E7A14 rather than #12B71A) so white button text passes WCAG AA.

Photography is Cassette Collars' own, loaded directly from cassettecollars.co.uk by `src/js/photos.js` (the mapping of images to products, galleries and projects lives there). Where the images can't load, illustrated placeholders in the brand palette show instead. Stock and AI-generated images on the live site are not used. Photography © Cassette Collars; the repository and site are public, so treat them accordingly.

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
Version 2, designed prototypes for internal review. Notes are off by default; switch "Notes on" in the top bar to see what each prototype proposes and why, plus in-page annotations (yellow: behaviour; red: questions for Cassette Collars).
