// Nusantara in Numbers — chart library.
// Hand-rolled SVG charts: line, bar, donut, sparkline, comparison bars.
// No libraries, no network. All functions return SVG/HTML strings.

const CHART = {
  ink: '#e2e8f0', muted: '#94a3b8', grid: '#26334a',
  accent: '#38bdf8', accent2: '#f59e0b', accent3: '#34d399',
  accent4: '#f472b6', accent5: '#a78bfa', bad: '#f87171', good: '#34d399'
};

function niceNum(v) {
  if (v === 0) return '0';
  const a = Math.abs(v);
  if (a >= 1000) return (v / 1000).toFixed(a >= 10000 ? 0 : 1) + 'k';
  if (a >= 100) return v.toFixed(0);
  if (a >= 10) return v.toFixed(1);
  return v.toFixed(2);
}

function fmtNum(v, decimals) {
  return v.toLocaleString('en-US', {
    minimumFractionDigits: decimals === undefined ? 0 : decimals,
    maximumFractionDigits: decimals === undefined ? 2 : decimals
  });
}

function axisLabels(min, max, ticks) {
  const out = [];
  for (let i = 0; i <= ticks; i++) out.push(min + (max - min) * i / ticks);
  return out;
}

// Line chart. series: [{label, values, color}]. years: number[].
function lineChart(series, years, opts) {
  opts = opts || {};
  const w = opts.width || 760, h = opts.height || 300;
  const padL = 52, padR = 14, padT = 14, padB = 30;
  const iw = w - padL - padR, ih = h - padT - padB;
  let min = Infinity, max = -Infinity;
  series.forEach(function (s) {
    s.values.forEach(function (v) { if (v < min) min = v; if (v > max) max = v; });
  });
  if (min === max) { min -= 1; max += 1; }
  const span = max - min, pad = span * 0.08;
  min -= pad; max += pad;
  const x = function (i) { return padL + iw * i / (years.length - 1); };
  const y = function (v) { return padT + ih * (1 - (v - min) / (max - min)); };
  let s = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Line chart" class="chart-svg">';
  axisLabels(min, max, 4).forEach(function (t) {
    s += '<line x1="' + padL + '" y1="' + y(t).toFixed(1) + '" x2="' + (w - padR) + '" y2="' + y(t).toFixed(1) + '" stroke="' + CHART.grid + '" stroke-width="1"/>';
    s += '<text x="' + (padL - 8) + '" y="' + (y(t) + 4).toFixed(1) + '" text-anchor="end" class="axis-label">' + niceNum(t) + '</text>';
  });
  years.forEach(function (yr, i) {
    if (i % 2 === 0 || years.length <= 6) {
      s += '<text x="' + x(i).toFixed(1) + '" y="' + (h - 8) + '" text-anchor="middle" class="axis-label">' + yr + '</text>';
    }
  });
  series.forEach(function (sr) {
    const pts = sr.values.map(function (v, i) { return x(i).toFixed(1) + ',' + y(v).toFixed(1); }).join(' ');
    s += '<polyline points="' + pts + '" fill="none" stroke="' + sr.color + '" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
    sr.values.forEach(function (v, i) {
      s += '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(v).toFixed(1) + '" r="3.2" fill="' + sr.color + '"><title>' + years[i] + ': ' + fmtNum(v, 2) + '</title></circle>';
    });
  });
  s += '</svg>';
  if (series.length > 1) {
    s += '<div class="legend">' + series.map(function (sr) {
      return '<span class="legend-item"><span class="legend-dot" style="background:' + sr.color + '"></span>' + sr.label + '</span>';
    }).join('') + '</div>';
  }
  return s;
}

// Vertical bar chart. items: [{label, value, color?}].
function barChart(items, opts) {
  opts = opts || {};
  const w = opts.width || 760, h = opts.height || 300;
  const padL = 52, padR = 10, padT = 14, padB = 30;
  const iw = w - padL - padR, ih = h - padT - padB;
  let max = 0;
  items.forEach(function (it) { if (it.value > max) max = it.value; });
  max *= 1.08;
  const bw = iw / items.length;
  let s = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Bar chart" class="chart-svg">';
  axisLabels(0, max, 4).forEach(function (t) {
    const yy = padT + ih * (1 - t / max);
    s += '<line x1="' + padL + '" y1="' + yy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + yy.toFixed(1) + '" stroke="' + CHART.grid + '" stroke-width="1"/>';
    s += '<text x="' + (padL - 8) + '" y="' + (yy + 4).toFixed(1) + '" text-anchor="end" class="axis-label">' + niceNum(t) + '</text>';
  });
  items.forEach(function (it, i) {
    const bh = ih * it.value / max;
    const bx = padL + i * bw + bw * 0.14;
    const bw2 = bw * 0.72;
    const color = it.color || CHART.accent;
    s += '<rect x="' + bx.toFixed(1) + '" y="' + (padT + ih - bh).toFixed(1) + '" width="' + bw2.toFixed(1) + '" height="' + bh.toFixed(1) + '" rx="3" fill="' + color + '"><title>' + it.label + ': ' + fmtNum(it.value, 1) + '</title></rect>';
    s += '<text x="' + (padL + i * bw + bw / 2).toFixed(1) + '" y="' + (h - 8) + '" text-anchor="middle" class="axis-label">' + it.label + '</text>';
    if (opts.showValues) {
      s += '<text x="' + (padL + i * bw + bw / 2).toFixed(1) + '" y="' + (padT + ih - bh - 6).toFixed(1) + '" text-anchor="middle" class="axis-value">' + fmtNum(it.value, 0) + '</text>';
    }
  });
  s += '</svg>';
  return s;
}

// Donut chart. items: [{name, share}].
function donutChart(items, opts) {
  opts = opts || {};
  const size = opts.size || 300;
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r * 0.62;
  const palette = [CHART.accent, CHART.accent2, CHART.accent3, CHART.accent4, CHART.accent5, '#22d3ee', '#fb923c', '#4ade80', '#facc15', '#e879f9', '#60a5fa', '#2dd4bf', '#fda4af', '#c084fc'];
  let total = 0;
  items.forEach(function (it) { total += it.share; });
  let s = '<svg viewBox="0 0 ' + size + ' ' + size + '" role="img" aria-label="Donut chart" class="chart-svg donut-svg">';
  let angle = -Math.PI / 2;
  items.forEach(function (it, i) {
    const frac = it.share / total;
    const a2 = angle + frac * Math.PI * 2;
    const large = frac > 0.5 ? 1 : 0;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const xi1 = cx + inner * Math.cos(a2), yi1 = cy + inner * Math.sin(a2);
    const xi2 = cx + inner * Math.cos(angle), yi2 = cy + inner * Math.sin(angle);
    s += '<path d="M ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + ' L ' + xi1.toFixed(1) + ' ' + yi1.toFixed(1) + ' A ' + inner + ' ' + inner + ' 0 ' + large + ' 0 ' + xi2.toFixed(1) + ' ' + yi2.toFixed(1) + ' Z" fill="' + palette[i % palette.length] + '"><title>' + it.name + ': ' + it.share + '%</title></path>';
    angle = a2;
  });
  s += '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" class="donut-center-big">' + opts.centerLabel + '</text>';
  s += '<text x="' + cx + '" y="' + (cy + 18) + '" text-anchor="middle" class="donut-center-small">' + opts.centerSub + '</text>';
  s += '</svg>';
  s += '<div class="legend donut-legend">' + items.map(function (it, i) {
    return '<span class="legend-item"><span class="legend-dot" style="background:' + palette[i % palette.length] + '"></span>' + it.name + ' <b>' + it.share + '%</b></span>';
  }).join('') + '</div>';
  return s;
}

// Sparkline: small line chart, no axes.
function sparkline(values, opts) {
  opts = opts || {};
  const w = opts.width || 140, h = opts.height || 40;
  const color = opts.color || CHART.accent;
  let min = Math.min.apply(null, values), max = Math.max.apply(null, values);
  if (min === max) { min -= 1; max += 1; }
  const x = function (i) { return 2 + (w - 4) * i / (values.length - 1); };
  const y = function (v) { return 3 + (h - 6) * (1 - (v - min) / (max - min)); };
  const pts = values.map(function (v, i) { return x(i).toFixed(1) + ',' + y(v).toFixed(1); }).join(' ');
  const last = values[values.length - 1];
  return '<svg viewBox="0 0 ' + w + ' ' + h + '" class="spark" aria-hidden="true"><polyline points="' + pts + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linejoin="round"/><circle cx="' + x(values.length - 1).toFixed(1) + '" cy="' + y(last).toFixed(1) + '" r="3" fill="' + color + '"/></svg>';
}

// Horizontal comparison bars: [{label, value, max, color, note}].
function comparisonBars(rows) {
  let s = '<div class="compare-bars">';
  rows.forEach(function (row) {
    const pct = Math.max(0, Math.min(100, row.value / row.max * 100));
    s += '<div class="compare-row"><div class="compare-label">' + row.label + '</div>' +
      '<div class="compare-track"><div class="compare-fill" style="width:' + pct.toFixed(1) + '%;background:' + row.color + '"></div></div>' +
      '<div class="compare-value">' + row.note + '</div></div>';
  });
  return s + '</div>';
}
