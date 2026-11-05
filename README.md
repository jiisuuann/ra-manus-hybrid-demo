# Campus & Home — synthetic aggregate demonstration

Separate static project. The original local Manus application is unchanged. This project contains only directly constructed fictional aggregates, a reviewed local logo, and new frontend code. Neither original housing records nor statistics calculated from them are used. All fictional place names start with Demo. This is not real market evidence or a publication-approved real-data release.

## Local use (Node.js 22 or newer; no package installation)

- `npm run build` produces `dist/` from exactly six allowlisted files.
- `npm test` checks calculations, schema rejection, artifacts, and HTTP subpath serving. Build first. Tests need permission to open a localhost port.
- `npm run audit` checks source and built output against explicit file allowlists.
- `npm run dev` serves source; `npm run preview` serves the build.
- Open http://127.0.0.1:4173/campus-home-demo/ . Stop with Ctrl+C.

All asset URLs are relative. Data is resolved relative to the JavaScript module. No client router or root-relative fetch path is used. Deploy the CONTENTS of dist at any GitHub Pages repository subpath; no server-side runtime is needed. The local server intentionally simulates a repository subpath. The future Pages path is /ra-manus-hybrid-demo/; relative assets also support that path without a build-time base change. No deployment workflow is included. The independent source repository is https://github.com/jiisuuann/ra-manus-hybrid-demo. GitHub Pages remains disabled.

## Supported functionality

Synchronized city/university selections (one fictional university per town), annual selection, counts, single-town annual median sale price, annual count/price trends, and town comparisons grouped by fictional region. Comparisons intentionally retain all towns when one is selected. Regional pooled medians and all-town medians are unavailable: a median cannot be recovered from subgroup medians. Counts can be summed over disjoint town-year cells. Responsive layout, labeled selects, focus states, text chart values, reset and in-page navigation are included. No external fonts, services, database, telemetry, or browser storage.

Removed: property search, transaction tables, detail dialogs, bookmarks, downloads, monthly/type/distance filters, price-per-area, timing metrics, and year-over-year change badges. Regional comparisons mean town-level statistics grouped geographically, not pooled regional price estimates.

## Schema and disclosure limits

The only accepted release is schema version 1, provenance synthetic, publicationStatus demo-only, and cells with city/university/region/year/count/medianPrice. Unknown fields fail closed. Names must be explicitly fictional; periods are restricted to 2023–2025; there must be one unique cell per town-year and complete annual series with consistent geography. Counts must be at least 100 and multiples of 10; medians must be multiples of $5,000. These restrictions validate the demonstration format; they are NOT proof of real-data privacy or permission. There is no arbitrary query API and no private dataset preprocessing path in this project. Ineligible releases fail completely rather than publish partial complementary groups.

Tests verify known fictional totals and medians, not the accuracy of any real-data transformation (none exists). File auditing rejects unexpected source/build files, symbolic links, external URLs and known private field markers in publishable files. Build content must match its reviewed source byte for byte. These checks cannot automatically establish permission, anonymization, or absence of every conceivable encoded disclosure; review remains required.

## Real-data publication approval remains required

Do not replace synthetic cells with real summaries without a new reviewed pipeline outside this project. Obtain source-owner/license permission for derived publication, approve exact populations and metrics, verify direct calculations from eligible private records, and document coverage and missing values. Evaluate the complete release and previous releases together. A minimum group size is insufficient: totals minus subgroups, overlapping university/city populations, adjacent filters, outliers, public auxiliary information, and successive releases can enable inference. Rounding alone is insufficient. Consider complementary suppression, coarser groups, restricted releases, or formal privacy methods with qualified review. Do not calculate pooled medians by averaging town medians.

Before publication, review all source and dist files, confirm only synthetic data remains, run build/test/audit, verify keyboard/mobile browser interactions and chosen repository URL, and obtain explicit approval of the artifact and hosting. GitHub Pages makes shipped files downloadable. Source publication to the named GitHub repository is authorized separately; website deployment still requires explicit approval.
