[![make.fun bounty](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=badge)
[![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/soedirman566-stack/stats-site-final/rank.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=badge)
[![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/soedirman566-stack/stats-site-final/reward.svg)](https://make.fun/bounty/best-national-statistics-site-20261126-0539?utm_source=github&utm_medium=readme&utm_campaign=badge)

# Nusantara in Numbers

An offline explorer for Indonesia's national statistics — population, economy, all 38 provinces, and wellbeing, 2015–2025. Built for the make.fun bounty [best-national-statistics-site-20261126-0539](https://make.fun/c/best-national-statistics-site-20261126-0539).

## What it is

- **Dashboard** — six headline KPI cards with sparklines and year-on-year deltas, plus population & GDP and growth charts with start-year sliders, a GDP-by-industry donut, and trade charts.
- **Economy** — GDP, real growth, sector shares, trade balance, inflation, and GRDP per capita by province.
- **Provinces** — all 38 provinces with live search, island filter, click-to-sort columns, and a detail page per province comparing it with the nation.
- **Wellbeing** — HDI, life expectancy, schooling, stunting, internet use, poverty and unemployment trends.
- **About** — method, sources, and a glossary of statistical terms.

Everything is hand-rolled: plain static files, hand-drawn SVG charts, no libraries, no network requests. Figures are a demo dataset modelled on BPS (Statistics Indonesia) magnitudes.

## How to run

```sh
node serve.ts
```

Then open <http://localhost:8080>. Or serve `app/` with any static server — `app/index.html` is the entry point.

## Structure

```text
app/
  index.html   shell, navigation, footer
  data.js      national series 2015–2025 + all 38 provinces
  charts.js    hand-rolled SVG charts (line, bar, donut, sparkline, comparison)
  views.js     dashboard, economy, provinces, province detail, wellbeing, about
  main.js      hash router
  style.css    dark slate theme, responsive
main.ts        hands the entry in: copies app/ + screenshots/ to /output and writes dossier.json
screenshots/  renders of the site in a browser
vendor/        makefun-frontend.ts (kit library, unchanged)
```

## License

MIT — see [LICENSE](LICENSE).
