# [website](https://github.com/viduxsh/website)

[![LICENSE](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://github.com/viduxsh/website/blob/main/LICENSE)

This is my GitHub website.

## [Website](https://viduxsh.github.io/website/)

## Publishing

The site is deployed to GitHub Pages with the workflow in
`.github/workflows/pages.yml`. It fetches the all-time pageview total from
GoatCounter on each deployment and every six hours.

To enable deployment:

1. Create a GoatCounter API key and add it to the repository as the Actions
   secret `GOATCOUNTER_API_KEY` (Settings → Secrets and variables → Actions).
2. Set the repository's Pages build and deployment source to **GitHub Actions**
   (Settings → Pages).