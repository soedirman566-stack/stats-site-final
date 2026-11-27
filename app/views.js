// Nusantara in Numbers — views.
// Each render function returns HTML for #view and wires its own controls.

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function yoy(values, unit) {
  const n = values.length;
  const d = values[n - 1] - values[n - 2];
  const pct = values[n - 2] !== 0 ? d / Math.abs(values[n - 2]) * 100 : 0;
  const sign = d >= 0 ? '+' : '';
  const cls = d >= 0 ? 'delta-up' : 'delta-down';
  return '<span class="' + cls + '">' + sign + fmtNum(d, 2) + ' ' + unit + ' (' + sign + pct.toFixed(1) + '%)</span>';
}

function kpiCard(title, value, unit, values, unitDelta, color) {
  return '<article class="kpi-card"><div class="kpi-title">' + title + '</div>' +
    '<div class="kpi-value">' + value + ' <span class="kpi-unit">' + unit + '</span></div>' +
    '<div class="kpi-foot">' + sparkline(values, { color: color }) +
    '<div class="kpi-delta">vs 2024 · ' + yoy(values, unitDelta) + '</div></div></article>';
}

function section(title, sub, inner, id) {
  return '<section class="panel" id="' + (id || '') + '"><h2>' + title + '</h2>' +
    (sub ? '<p class="panel-sub">' + sub + '</p>' : '') + inner + '</section>';
}

function sliderRow(id, label, min, max, value) {
  return '<div class="slider-row"><label for="' + id + '">' + label + '</label>' +
    '<input type="range" id="' + id + '" min="' + min + '" max="' + max + '" step="1" value="' + value + '">' +
    '<span class="slider-value" id="' + id + '-val">' + value + '</span></div>';
}

function sliceFrom(values, years, startYear) {
  const i = years.indexOf(startYear);
  return { years: years.slice(i), values: values.slice(i) };
}

function renderDashboard() {
  const n = NATIONAL_2025;
  const cards = [
    kpiCard('Population', '282.5', 'million', NATIONAL.population, 'm', CHART.accent),
    kpiCard('GDP (nominal)', 'IDR 23,900', 'trillion', NATIONAL.gdp, 'tn IDR', CHART.accent2),
    kpiCard('Economic growth', '5.10', '% YoY', NATIONAL.growth, 'pp', CHART.accent3),
    kpiCard('Inflation', '2.40', '% YoY', NATIONAL.inflation, 'pp', CHART.accent4),
    kpiCard('Unemployment', '4.76', '%', NATIONAL.unemployment, 'pp', CHART.accent5),
    kpiCard('Poverty rate', '8.47', '%', NATIONAL.poverty, 'pp', CHART.bad)
  ].join('');
  const popGdp = '<div id="chart-popgdp">' + popGdpChart(2015) + '</div>' +
    sliderRow('slider-popgdp', 'Start year', 2015, 2021, 2015);
  const growth = '<div id="chart-growth">' + growthChart(2015) + '</div>' +
    sliderRow('slider-growth', 'Start year', 2015, 2021, 2015);
  const html =
    '<header class="page-head"><h1>Indonesia at a glance</h1>' +
    '<p class="lede">The headline numbers for the world&rsquo;s fourth most populous country — population, economy, prices, jobs and poverty, 2015&ndash;2025.</p>' +
    '<p class="updated">Latest year: 2025 · Source: demo dataset modelled on BPS magnitudes</p></header>' +
    '<div class="kpi-grid">' + cards + '</div>' +
    '<div class="grid-2">' +
    section('Population &amp; GDP', 'How the country grew — people and output, together.', popGdp) +
    section('Economic growth', 'Real GDP growth, % year on year. The 2020 dip is the pandemic recession.', growth) +
    '</div>' +
    '<div class="grid-2">' +
    section('What Indonesia makes', 'Share of GDP by industry, 2025.', '<div class="donut-wrap">' + donutChart(SECTORS, { size: 260, centerLabel: 'IDR 23,900 tn', centerSub: 'GDP 2025' }) + '</div>') +
    section('Trade &amp; prices', 'Exports and imports, billion USD, 2015&ndash;2025.', lineChart([
      { label: 'Exports', values: NATIONAL.exports, color: CHART.accent3 },
      { label: 'Imports', values: NATIONAL.imports, color: CHART.accent4 }
    ], YEARS, { height: 260 })) +
    '</div>' +
    '<p class="cta-row">Explore more: <a href="#/economy">Economy in depth</a> · <a href="#/provinces">All 38 provinces</a> · <a href="#/wellbeing">Wellbeing</a></p>';
  return html;
}

function popGdpChart(startYear) {
  const s = sliceFrom(NATIONAL.population, YEARS, startYear);
  const g = sliceFrom(NATIONAL.gdp, YEARS, startYear);
  return lineChart([
    { label: 'Population (million)', values: s.values, color: CHART.accent },
    { label: 'GDP (IDR trillion)', values: g.values, color: CHART.accent2 }
  ], s.years, { height: 280 });
}

function growthChart(startYear) {
  const s = sliceFrom(NATIONAL.growth, YEARS, startYear);
  return lineChart([
    { label: 'Growth %', values: s.values, color: CHART.accent3 }
  ], s.years, { height: 280 });
}

function wireDashboard() {
  const sp = document.getElementById('slider-popgdp');
  if (sp) sp.addEventListener('input', function () {
    document.getElementById('slider-popgdp-val').textContent = sp.value;
    document.getElementById('chart-popgdp').innerHTML = popGdpChart(Number(sp.value));
  });
  const sg = document.getElementById('slider-growth');
  if (sg) sg.addEventListener('input', function () {
    document.getElementById('slider-growth-val').textContent = sg.value;
    document.getElementById('chart-growth').innerHTML = growthChart(Number(sg.value));
  });
}

function renderEconomy() {
  const topGrdp = PROVINCES.slice().sort(function (a, b) { return b.grdp - a.grdp; }).slice(0, 8);
  const grdpBars = barChart(topGrdp.map(function (p) {
    return { label: p.name.replace(' ', ' '), value: p.grdp };
  }), { height: 300, showValues: true });
  const html =
    '<header class="page-head"><h1>The economy</h1>' +
    '<p class="lede">Growth, output, trade and prices — the full economic picture, 2015&ndash;2025.</p></header>' +
    '<div class="grid-2">' +
    section('GDP, nominal', 'Trillion IDR. Nominal GDP more than doubled across the decade.', lineChart([
      { label: 'GDP (IDR tn)', values: NATIONAL.gdp, color: CHART.accent2 }
    ], YEARS, { height: 280 })) +
    section('Real growth', 'Percent year on year. 2020 is the only contraction in the series.', lineChart([
      { label: 'Growth %', values: NATIONAL.growth, color: CHART.accent3 }
    ], YEARS, { height: 280 })) +
    '</div>' +
    '<div class="grid-2">' +
    section('GDP by industry', 'Share of GDP, 2025. Manufacturing is the largest single sector.', '<div class="donut-wrap">' + donutChart(SECTORS, { size: 260, centerLabel: '100%', centerSub: 'of GDP' }) + '</div>') +
    section('Trade balance', 'Exports vs imports, billion USD. Indonesia has run a goods surplus since 2020.', lineChart([
      { label: 'Exports', values: NATIONAL.exports, color: CHART.accent3 },
      { label: 'Imports', values: NATIONAL.imports, color: CHART.accent4 }
    ], YEARS, { height: 280 })) +
    '</div>' +
    '<div class="grid-2">' +
    section('Inflation', 'Consumer prices, % year on year. The 2022 spike followed the fuel-subsidy adjustment.', lineChart([
      { label: 'Inflation %', values: NATIONAL.inflation, color: CHART.accent4 }
    ], YEARS, { height: 280 })) +
    section('Richest provinces by output per person', 'GRDP per capita, million IDR per year, 2024. National average: IDR 84.6 million.', grdpBars) +
    '</div>' +
    '<p class="note">Figures: demo dataset modelled on BPS magnitudes. See <a href="#/about">About &amp; method</a>.</p>';
  return html;
}

const explorerState = { q: '', island: 'All islands', sortKey: 'pop', sortDir: -1 };

function provinceDensity(p) { return p.pop * 1000 / p.area; }

function sortValue(p, key) {
  if (key === 'density') return provinceDensity(p);
  return p[key];
}

function filteredProvinces() {
  let list = PROVINCES.filter(function (p) {
    const okIsland = explorerState.island === 'All islands' || p.island === explorerState.island;
    const q = explorerState.q.trim().toLowerCase();
    const okQ = !q || p.name.toLowerCase().indexOf(q) !== -1 || p.capital.toLowerCase().indexOf(q) !== -1;
    return okIsland && okQ;
  });
  const key = explorerState.sortKey, dir = explorerState.sortDir;
  list.sort(function (a, b) {
    const va = sortValue(a, key), vb = sortValue(b, key);
    if (typeof va === 'string') return dir * va.localeCompare(vb);
    return dir * (va - vb);
  });
  return list;
}

function renderProvinces() {
  const list = filteredProvinces();
  const totalPop = list.reduce(function (t, p) { return t + p.pop; }, 0);
  const cols = [
    { key: 'name', label: 'Province' }, { key: 'capital', label: 'Capital' },
    { key: 'island', label: 'Island' }, { key: 'pop', label: 'Population' },
    { key: 'density', label: 'Density /km²' }, { key: 'grdp', label: 'GRDP / capita' },
    { key: 'hdi', label: 'HDI' }, { key: 'poverty', label: 'Poverty %' },
    { key: 'unemp', label: 'Unemployment %' }
  ];
  let thead = '<tr>' + cols.map(function (c) {
    const arrow = explorerState.sortKey === c.key ? (explorerState.sortDir === 1 ? ' ▲' : ' ▼') : '';
    return '<th data-sort="' + c.key + '" tabindex="0">' + c.label + arrow + '</th>';
  }).join('') + '</tr>';
  let rows = list.map(function (p) {
    return '<tr data-slug="' + p.slug + '" tabindex="0"><td><a href="#/province/' + p.slug + '">' + p.name + '</a></td>' +
      '<td>' + p.capital + '</td><td>' + p.island + '</td>' +
      '<td class="num">' + fmtNum(p.pop / 1000, 2) + ' m</td>' +
      '<td class="num">' + fmtNum(provinceDensity(p), 0) + '</td>' +
      '<td class="num">IDR ' + p.grdp + ' m</td>' +
      '<td class="num">' + p.hdi.toFixed(1) + '</td>' +
      '<td class="num">' + p.poverty.toFixed(1) + '</td>' +
      '<td class="num">' + p.unemp.toFixed(1) + '</td></tr>';
  }).join('');
  if (!list.length) rows = '<tr><td colspan="9" class="empty">No province matches that search.</td></tr>';
  const html =
    '<header class="page-head"><h1>Provinces</h1>' +
    '<p class="lede">All 38 provinces of Indonesia. Search, filter by island, sort any column, and click a row for the province&rsquo;s full profile.</p></header>' +
    '<div class="controls"><input type="search" id="prov-search" placeholder="Search province or capital…" value="' + esc(explorerState.q) + '" aria-label="Search provinces">' +
    '<select id="prov-island" aria-label="Filter by island">' +
    ISLANDS.map(function (is) {
      return '<option' + (explorerState.island === is ? ' selected' : '') + '>' + is + '</option>';
    }).join('') + '</select>' +
    '<span class="count" id="prov-count">' + list.length + ' of 38 provinces · ' + fmtNum(totalPop / 1000, 1) + ' million people</span></div>' +
    '<div class="table-wrap"><table class="prov-table"><thead>' + thead + '</thead><tbody>' + rows + '</tbody></table></div>' +
    '<p class="note">Population: 2024 mid-year estimates (sum ≈ 280.9 million). GRDP per capita, HDI, poverty and unemployment: 2024. Click a province name for its detail page.</p>';
  return html;
}

function rerenderProvinces() {
  const view = document.getElementById('view');
  view.innerHTML = renderProvinces();
  wireProvinces();
  const input = document.getElementById('prov-search');
  if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
}

function wireProvinces() {
  const input = document.getElementById('prov-search');
  if (input) input.addEventListener('input', function () {
    explorerState.q = input.value;
    const view = document.getElementById('view');
    view.innerHTML = renderProvinces();
    wireProvinces();
    const back = document.getElementById('prov-search');
    back.focus(); back.setSelectionRange(back.value.length, back.value.length);
  });
  const sel = document.getElementById('prov-island');
  if (sel) sel.addEventListener('change', function () {
    explorerState.island = sel.value;
    rerenderProvinces();
  });
  document.querySelectorAll('th[data-sort]').forEach(function (th) {
    const go = function () {
      const key = th.getAttribute('data-sort');
      if (explorerState.sortKey === key) explorerState.sortDir *= -1;
      else { explorerState.sortKey = key; explorerState.sortDir = key === 'name' || key === 'capital' || key === 'island' ? 1 : -1; }
      rerenderProvinces();
    };
    th.addEventListener('click', go);
    th.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
  });
  document.querySelectorAll('tr[data-slug]').forEach(function (tr) {
    tr.addEventListener('click', function (e) {
      if (e.target.tagName !== 'A') location.hash = '#/province/' + tr.getAttribute('data-slug');
    });
    tr.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') location.hash = '#/province/' + tr.getAttribute('data-slug');
    });
  });
}

function renderProvinceDetail(slug) {
  const p = PROVINCES.find(function (x) { return x.slug === slug; });
  if (!p) return '<header class="page-head"><h1>Province not found</h1><p class="lede">No province with that address. <a href="#/provinces">Back to all provinces</a>.</p></header>';
  const natGrdp = 84.6, natDensity = 148;
  const bars = comparisonBars([
    { label: 'HDI (0–100)', value: p.hdi, max: 100, color: CHART.accent, note: p.hdi.toFixed(1) + ' vs nation 75.5' },
    { label: 'GRDP per capita', value: p.grdp, max: 350, color: CHART.accent2, note: 'IDR ' + p.grdp + ' m vs nation 84.6 m' },
    { label: 'Poverty rate', value: p.poverty, max: 35, color: CHART.accent4, note: p.poverty.toFixed(1) + '% vs nation 8.5%' },
    { label: 'Unemployment', value: p.unemp, max: 8, color: CHART.accent5, note: p.unemp.toFixed(1) + '% vs nation 4.8%' },
    { label: 'Density', value: provinceDensity(p), max: 16000, color: CHART.accent3, note: fmtNum(provinceDensity(p), 0) + ' vs nation ' + natDensity + ' /km²' }
  ]);
  const rankPop = PROVINCES.slice().sort(function (a, b) { return b.pop - a.pop; }).findIndex(function (x) { return x.slug === slug; }) + 1;
  const rankHdi = PROVINCES.slice().sort(function (a, b) { return b.hdi - a.hdi; }).findIndex(function (x) { return x.slug === slug; }) + 1;
  const rankGrdp = PROVINCES.slice().sort(function (a, b) { return b.grdp - a.grdp; }).findIndex(function (x) { return x.slug === slug; }) + 1;
  const html =
    '<p class="crumb"><a href="#/provinces">← All provinces</a> · ' + p.island + '</p>' +
    '<header class="page-head"><h1>' + p.name + '</h1>' +
    '<p class="lede">Capital: ' + p.capital + ' · Island: ' + p.island + ' · Area: ' + fmtNum(p.area, 0) + ' km²</p></header>' +
    '<div class="kpi-grid">' +
    '<article class="kpi-card"><div class="kpi-title">Population (2024)</div><div class="kpi-value">' + fmtNum(p.pop / 1000, 2) + ' <span class="kpi-unit">million</span></div><div class="kpi-delta">Rank #' + rankPop + ' of 38 by population</div></article>' +
    '<article class="kpi-card"><div class="kpi-title">GRDP per capita</div><div class="kpi-value">IDR ' + p.grdp + ' <span class="kpi-unit">million / year</span></div><div class="kpi-delta">Rank #' + rankGrdp + ' of 38 · nation IDR 84.6 m</div></article>' +
    '<article class="kpi-card"><div class="kpi-title">HDI</div><div class="kpi-value">' + p.hdi.toFixed(1) + ' <span class="kpi-unit">of 100</span></div><div class="kpi-delta">Rank #' + rankHdi + ' of 38 · nation 75.5</div></article>' +
    '<article class="kpi-card"><div class="kpi-title">Poverty rate</div><div class="kpi-value">' + p.poverty.toFixed(1) + ' <span class="kpi-unit">%</span></div><div class="kpi-delta">Nation 8.5% · ' + (p.poverty > 8.47 ? 'above' : 'below') + ' the national rate</div></article>' +
    '<article class="kpi-card"><div class="kpi-title">Unemployment</div><div class="kpi-value">' + p.unemp.toFixed(1) + ' <span class="kpi-unit">%</span></div><div class="kpi-delta">Nation 4.8%</div></article>' +
    '<article class="kpi-card"><div class="kpi-title">Density</div><div class="kpi-value">' + fmtNum(provinceDensity(p), 0) + ' <span class="kpi-unit">people / km²</span></div><div class="kpi-delta">Nation 148 /km²</div></article>' +
    '</div>' +
    section(p.name + ' vs the nation', 'Each bar compares this province with the national figure for 2024–2025.', bars) +
    '<p class="note">Figures: demo dataset modelled on BPS magnitudes. See <a href="#/about">About &amp; method</a>.</p>';
  return html;
}

function renderWellbeing() {
  const html =
    '<header class="page-head"><h1>Wellbeing</h1>' +
    '<p class="lede">How Indonesians live: health, education and connectivity, 2015&ndash;2025.</p></header>' +
    '<div class="grid-2">' +
    section('Human Development Index', 'HDI, 0–100. Indonesia crossed 75 in 2024 — the UN&rsquo;s high human development band.', lineChart([
      { label: 'HDI', values: NATIONAL.hdi, color: CHART.accent }
    ], YEARS, { height: 280 })) +
    section('Life expectancy &amp; schooling', 'Years: life expectancy at birth and mean years of schooling.', lineChart([
      { label: 'Life expectancy', values: NATIONAL.lifeExpectancy, color: CHART.accent3 },
      { label: 'Schooling years', values: NATIONAL.schooling, color: CHART.accent2 }
    ], YEARS, { height: 280 })) +
    '</div>' +
    '<div class="grid-2">' +
    section('Stunting is falling', 'Share of children under five who are stunted, %. Down from 37.2% in 2015 to 19.0% in 2025.', lineChart([
      { label: 'Stunting %', values: NATIONAL.stunting, color: CHART.accent4 }
    ], YEARS, { height: 280 })) +
    section('Getting connected', 'Internet users as a share of the population, %. Nearly four in five Indonesians are online.', lineChart([
      { label: 'Internet %', values: NATIONAL.internet, color: CHART.accent5 }
    ], YEARS, { height: 280 })) +
    '</div>' +
    '<div class="grid-2">' +
    section('Poverty &amp; inequality', 'Poverty rate and Gini ratio, 2015–2025.', lineChart([
      { label: 'Poverty %', values: NATIONAL.poverty, color: CHART.bad },
      { label: 'Gini × 100', values: NATIONAL.gini.map(function (g) { return g * 100; }), color: CHART.accent2 }
    ], YEARS, { height: 280 })) +
    section('Unemployment', 'Open unemployment rate, %. The 2020 spike is the pandemic; the rate has fallen every year since.', lineChart([
      { label: 'Unemployment %', values: NATIONAL.unemployment, color: CHART.accent5 }
    ], YEARS, { height: 280 })) +
    '</div>';
  return html;
}

function renderAbout() {
  const glossary = [
    ['GDP', 'Gross domestic product — the total value of goods and services produced in a year. Nominal GDP is in current prices; real growth strips out price changes.'],
    ['GRDP', 'Gross regional domestic product — GDP measured for one province. GRDP per capita divides it by the province’s population.'],
    ['HDI', 'Human Development Index — a 0–100 composite of health, education and income. Above 70 is high, above 80 very high.'],
    ['Gini ratio', 'A 0–1 measure of income inequality: 0 means everyone earns the same, 1 means one person earns everything.'],
    ['Poverty rate', 'Share of people living below the national poverty line, set from the cost of a basic basket of food and non-food needs.'],
    ['Stunting', 'Children under five whose height is far below their age — a marker of chronic undernutrition in early childhood.'],
    ['YoY', 'Year on year — a change measured against the same period a year earlier.'],
    ['BPS', 'Badan Pusat Statistik — Statistics Indonesia, the government agency that publishes the country’s official statistics.']
  ];
  const html =
    '<header class="page-head"><h1>About &amp; method</h1>' +
    '<p class="lede">What this site is, where its numbers come from, and what its words mean.</p></header>' +
    section('About this site', 'Nusantara in Numbers is an explorer for Indonesia’s national statistics — the headline economy, all 38 provinces, and the wellbeing of its people. It is a fully offline site: every figure, chart and page is a static file in this package, and it makes no network request.', '') +
    section('Method &amp; sources', 'National series run 2015–2025; province figures are 2024 mid-year estimates. The figures are a demo dataset modelled on BPS (Statistics Indonesia) magnitudes — rounded, internally consistent (province populations sum to about 280.9 million against the national 282.5 million), and labelled as such wherever they appear. They are not the official release: for decisions, check the current BPS publication. Density is computed from population and area; YoY deltas compare each latest value with the year before.', '') +
    section('Glossary', '', '<dl class="glossary">' + glossary.map(function (g) {
      return '<dt>' + g[0] + '</dt><dd>' + g[1] + '</dd>';
    }).join('') + '</dl>') +
    section('How to use this site', 'Dashboard gives the headlines. Economy goes deeper on output, trade and prices. Provinces lists all 38 — search, filter by island, sort any column, click a row for the province’s profile and its comparison with the nation. Wellbeing tracks health, education and connectivity.', '');
  return html;
}
