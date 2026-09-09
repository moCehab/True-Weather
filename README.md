# True Weather

A responsive weather website using JetBrains Mono, weather-aware backgrounds, worldwide city search, browser geolocation, today/tomorrow forecasts and practical daily advice.

## Publish on your GitHub repository

1. Push this project, including `.github/workflows/pages.yml`, to your repository's `main` branch. Do not upload `node_modules`, `dist`, or `.git` via the GitHub website.
2. Open the repository's **Settings → Pages → Build and deployment**. Select **GitHub Actions** as the source.
3. Open **Actions → Deploy True Weather to GitHub Pages → Run workflow**. Future pushes to `main` deploy automatically. If your default branch has another name, update the workflow's branch setting.
4. After the workflow succeeds, find your website URL in **Settings → Pages** or the deployment's environment link.

The workflow detects the Pages base path, so both `username.github.io/repository/` and a configured custom domain are supported. No repository URL or personal access token belongs in the code. The workflow uses GitHub's built-in deployment credentials.

GitHub Free supports Pages from public repositories; private-repository Pages requires an eligible paid GitHub plan. See [GitHub Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Local development and checks

```sh
npm ci
npm run dev
```

```sh
npx tsc --noEmit
node --experimental-strip-types --test tests/*.test.mjs
npm run build:pages
```

The Pages build is written to `dist/pages`. To test a repository path, use `PAGES_BASE_PATH=/your-repository npm run build:pages` on macOS/Linux. The normal `npm run build` preserves the original server-backed build, while `build:pages` builds the same weather interface as a standalone Vite application for static hosting.

## Live weather on GitHub Pages

Pages cannot run the project's optional server API routes. In the Pages build, the browser calls Open-Meteo's public forecast and geocoding HTTPS APIs directly. No secret is embedded. Successful forecasts are cached in memory per browser tab for 15 minutes and refreshed while the tab is visible, and when returning to it. Cache size is bounded. Requests are debounced/canceled where appropriate; timeouts and failed updates are surfaced without silently inventing forecasts.

Times use the forecast location's timezone. Device coordinates are requested only after the user chooses “Use my location” and grants browser permission. There is no account or persistent location storage.

Open-Meteo attribution appears in the footer. Confirm provider licensing, usage limits and a suitable plan before monetizing; the public no-key endpoint is for the initial non-commercial evaluation.

## Interpretation and validation

Advice is deterministic, not LLM-generated. Precipitation probability, amounts and weather codes determine rain advice. Apparent temperature drives clothing advice. Outdoor windows require three consecutive dry daylight observations, apparent temperature above 0 and below 35°C, wind below 35 km/h and no fog, storm or snow codes. These are general-purpose heuristics, not official alerts or personalized guidance.

Type checking and eight automated tests cover forecast interpretation, direct browser API transport, caching and response failures. The static build is checked for correct asset paths and absence of a server requirement. Browser interaction QA was not requested. The optional feature-detected WebMCP read-back remains unverified because no supported validation context was available.

No website has been published to GitHub yet. The repository and Pages settings remain under your control.
