# Campus & Home — synthetic aggregate demonstration

Separate static project. The original local Manus application is unchanged. This project contains only directly constructed fictional aggregates, a reviewed local logo, and new frontend code. Neither original housing records nor statistics calculated from them are used. All fictional place names start with Demo. This is not real market evidence or a publication-approved real-data release.

## Local use (Node.js 22 or newer; no package installation)

- `npm run build` produces `dist/` from exactly six allowlisted files.
- `npm test` checks calculations, schema rejection, artifacts, and HTTP subpath serving. Build first. Tests need permission to open a localhost port.
- `npm run audit` checks source and built output against explicit file allowlists.
- `npm run dev` serves source; `npm run preview` serves the build.
- Open http://127.0.0.1:4173/ra-manus-hybrid-demo/ . Stop with Ctrl+C.

All asset URLs are relative. Data is resolved relative to the JavaScript module. No client router or root-relative fetch path is used. Deploy the CONTENTS of dist at any GitHub Pages repository subpath; no server-side runtime is needed. The local server intentionally simulates a repository subpath. The future Pages path is /ra-manus-hybrid-demo/; relative assets also support that path without a build-time base change. An audited GitHub Actions workflow is included at `.github/workflows/pages.yml`. The independent source repository is https://github.com/jiisuuann/ra-manus-hybrid-demo. GitHub Pages must be configured manually as described below.

## Supported functionality

Synchronized city/university selections (one fictional university per town), annual selection, counts, single-town annual median sale price, annual count/price trends, and town comparisons grouped by fictional region. Comparisons intentionally retain all towns when one is selected. Regional pooled medians and all-town medians are unavailable: a median cannot be recovered from subgroup medians. Counts can be summed over disjoint town-year cells. Responsive layout, labeled selects, focus states, text chart values, reset and in-page navigation are included. No external fonts, services, database, telemetry, or browser storage.

Removed: property search, transaction tables, detail dialogs, bookmarks, downloads, monthly/type/distance filters, price-per-area, timing metrics, and year-over-year change badges. Regional comparisons mean town-level statistics grouped geographically, not pooled regional price estimates.

## Schema and disclosure limits

The only accepted release is schema version 1, provenance synthetic, publicationStatus demo-only, and cells with city/university/region/year/count/medianPrice. Unknown fields fail closed. Names must be explicitly fictional; periods are restricted to 2023–2025; there must be one unique cell per town-year and complete annual series with consistent geography. Counts must be at least 100 and multiples of 10; medians must be multiples of $5,000. These restrictions validate the demonstration format; they are NOT proof of real-data privacy or permission. There is no arbitrary query API and no private dataset preprocessing path in this project. Ineligible releases fail completely rather than publish partial complementary groups.

Tests verify known fictional totals and medians, not the accuracy of any real-data transformation (none exists). File auditing rejects unexpected source/build files, symbolic links, external URLs and known private field markers in publishable files. Build content must match its reviewed source byte for byte. These checks cannot automatically establish permission, anonymization, or absence of every conceivable encoded disclosure; review remains required.

## Real-data publication approval remains required

Do not replace synthetic cells with real summaries without a new reviewed pipeline outside this project. Obtain source-owner/license permission for derived publication, approve exact populations and metrics, verify direct calculations from eligible private records, and document coverage and missing values. Evaluate the complete release and previous releases together. A minimum group size is insufficient: totals minus subgroups, overlapping university/city populations, adjacent filters, outliers, public auxiliary information, and successive releases can enable inference. Rounding alone is insufficient. Consider complementary suppression, coarser groups, restricted releases, or formal privacy methods with qualified review. Do not calculate pooled medians by averaging town medians.

Before publication, review all source and dist files, confirm only synthetic data remains, run build/test/audit, verify keyboard/mobile browser interactions and chosen repository URL, and obtain explicit approval of the artifact and hosting. GitHub Pages makes shipped files downloadable. Source publication to the named GitHub repository is authorized separately; website deployment still requires explicit approval.


## Automated checks and GitHub Pages

On pull requests targeting main, the workflow builds, runs all tests, and audits source and dist without uploading or deploying. On main pushes (or a manual run on main), it uploads ONLY audited dist and then deploys that artifact through the github-pages environment. It uses Node 22 with no installation or dependency cache because package.json has no dependencies. Deployment waits for successful checks; only the deploy job has Pages/OIDC write permissions. No personal token or repository secret is needed.

The published artifact contains exactly index.html, logo.svg, src/app.js, src/model.js, src/style.css, and data/annual.json. It excludes tests, documentation, workflow files, Git metadata, and parent files. Tests additionally verify every fictional data cell against a fixed fixture and verify relative assets/data under /ra-manus-hybrid-demo/. Refresh and direct section URLs use #overview and #comparisons rather than server routes.

Repository owner setup:
1. Open repository Settings → Pages.
2. Under Build and deployment, set Source to GitHub Actions. Do not select a branch or add another starter workflow.
3. Open Actions → Check and deploy synthetic demo. If the first run failed because Pages was disabled, open that run and select Re-run all jobs; alternatively choose Run workflow on main.
4. If an environment approval is configured, approve the pending github-pages deployment. Keep any environment branch restriction limited to main.
5. After success, visit https://jiisuuann.github.io/ra-manus-hybrid-demo/ and test both section links and refresh.

If Actions are disabled by repository policy, Settings → Actions → General must permit this workflow and the official actions used. Keep the default read-only workflow token setting; the workflow requests Pages and OIDC permissions only for deployment. Do not disable organization restrictions without owner review. No custom domain is required.
