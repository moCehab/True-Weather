# True Weather

**What the weather actually means for your day.**

True Weather turns forecasts into practical answers: what to wear, what to bring, when conditions may change, and when to head outside.

Instead of making people interpret a screen full of numbers, it puts useful advice first and keeps the hourly forecast one step away.

## Features

- **Today and tomorrow:** concise forecasts focused on daily decisions.
- **Rain timing:** guidance on when precipitation becomes more likely or may ease.
- **Clothing advice:** suggestions based on how the temperature will feel.
- **Outdoor windows:** relatively dry, comfortable daylight periods for walks and errands.
- **Worldwide city search:** search for a city or use device location with permission.
- **Weather-aware backgrounds:** appearance changes with forecast conditions and day or night.
- **Hourly details:** temperature, feels-like temperature, precipitation probability, and wind.
- **Responsive layout:** designed for desktop and mobile, with JetBrains Mono typography.

## How it works

Forecast and location data come from [Open-Meteo](https://open-meteo.com/). A rule-based interpretation layer converts hourly weather data into plain-language guidance.

Advice considers precipitation probability, precipitation amounts, weather codes, apparent temperature, and wind. Outdoor recommendations look for consecutive daylight hours with suitable conditions. Forecast times follow the selected location’s timezone.

Forecasts refresh approximately every 15 minutes while the page is active. Older data is labeled when an update fails. Weather predictions remain estimates; the advice does not replace official weather warnings.

## Getting started

Requires Node.js 22.13 or later and npm.

```sh
git clone https://github.com/moCehab/True-Weather.git
cd True-Weather
npm ci
npm run dev
```

Open the local address printed in the terminal.

## Build and deploy

### GitHub Pages

```sh
npm run build:pages
```

The static website is generated in `dist/pages`. This build requests weather data directly from Open-Meteo and does not require a separate application server.

The included GitHub Actions workflow handles deployment:

1. In the repository, open **Settings → Pages** and select **GitHub Actions** as the source.
2. Push changes to `main`, or run **Deploy True Weather to GitHub Pages** from the **Actions** tab.
3. Find the published URL in **Settings → Pages** after deployment succeeds.

The workflow configures the base path for the repository automatically. For a local build targeting a repository path:

```sh
PAGES_BASE_PATH=/True-Weather npm run build:pages
PAGES_BASE_PATH=/True-Weather node scripts/check-pages.mjs
```

### Server-backed build

```sh
npm run build
```

The server-backed version uses Vinext and Cloudflare Workers-compatible output, with forecast and city-search API routes.

## Development checks

```sh
npx tsc --noEmit
node --experimental-strip-types --test tests/*.test.mjs
npm run build:pages
node scripts/check-pages.mjs
```

Tests cover forecast interpretation, elapsed hours, nighttime conditions, direct API requests, caching, and failed or incomplete responses. The static-output check verifies asset paths and direct weather-provider integration.

## Project structure

```text
app/          Weather interface and server API routes
components/   Reusable interface components
lib/          Forecast interpretation and data access
pages/        Static website entry point
public/       Background image and favicon
scripts/      GitHub Pages build and output checks
tests/        Forecast and data-access tests
.github/      Deployment workflow
```

## Data and privacy

Location access is optional and requires browser permission. Coordinates are sent to the weather provider to retrieve the local forecast. No account is required, and the application does not persist location preferences.

Weather data is attributed to Open-Meteo. Review the provider’s current [usage terms](https://open-meteo.com/en/terms) before commercial deployment.
