// Nusantara in Numbers — data layer.
// Demo dataset modelled on BPS (Statistics Indonesia) magnitudes, 2015-2025.
// Figures are rounded estimates for illustration; see About / Method for notes.

const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

const NATIONAL = {
  // population in millions, mid-year
  population: [255.6, 258.7, 261.9, 265.0, 268.1, 271.1, 274.2, 277.2, 280.0, 281.2, 282.5],
  // nominal GDP, trillion IDR
  gdp: [11540, 12498, 13589, 14838, 15834, 15434, 16976, 19589, 20892, 22428, 23900],
  // real GDP growth, % year on year
  growth: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03, 5.10],
  // consumer price inflation, % year on year
  inflation: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57, 2.40],
  // exports and imports, billion USD
  exports: [150.4, 145.2, 168.8, 180.2, 167.7, 163.2, 231.6, 291.9, 258.8, 264.7, 278.0],
  imports: [142.7, 135.7, 156.9, 188.7, 171.3, 141.6, 196.2, 237.4, 221.9, 233.7, 245.0],
  // open unemployment rate, %
  unemployment: [6.18, 5.61, 5.50, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91, 4.76],
  // poverty rate, % of population
  poverty: [11.13, 10.86, 10.64, 9.82, 9.22, 10.19, 10.14, 9.57, 9.36, 9.03, 8.47],
  // Gini ratio
  gini: [0.402, 0.394, 0.391, 0.384, 0.380, 0.385, 0.384, 0.381, 0.379, 0.381, 0.375],
  // Human Development Index (0-100)
  hdi: [69.55, 70.18, 70.81, 71.39, 71.92, 71.94, 72.29, 73.86, 74.39, 75.02, 75.45],
  // life expectancy at birth, years
  lifeExpectancy: [70.5, 70.8, 71.0, 71.2, 71.4, 71.3, 71.5, 72.4, 73.4, 74.0, 74.3],
  // mean years of schooling, years
  schooling: [8.3, 8.4, 8.5, 8.6, 8.7, 8.7, 8.8, 8.9, 9.0, 9.0, 9.1],
  // stunting prevalence among children under five, %
  stunting: [37.2, 35.4, 33.6, 30.8, 27.7, 26.9, 24.4, 21.6, 21.5, 19.8, 19.0],
  // internet users, % of population
  internet: [34.9, 41.5, 47.2, 52.8, 56.4, 59.7, 64.9, 70.4, 73.7, 77.0, 79.5]
};

// GDP by industry, share of GDP in 2025, % (sums to 100)
const SECTORS = [
  { name: 'Manufacturing', share: 18.9 },
  { name: 'Wholesale & retail trade', share: 13.0 },
  { name: 'Agriculture, forestry & fishing', share: 12.5 },
  { name: 'Construction', share: 9.9 },
  { name: 'Mining & quarrying', share: 8.0 },
  { name: 'Transportation & storage', share: 5.3 },
  { name: 'Public administration', share: 4.5 },
  { name: 'Finance & insurance', share: 4.4 },
  { name: 'Information & communication', share: 4.3 },
  { name: 'Education', share: 3.2 },
  { name: 'Real estate', share: 2.7 },
  { name: 'Accommodation & food service', share: 2.7 },
  { name: 'Health & social work', share: 1.6 },
  { name: 'Other services', share: 9.0 }
];

// All 38 provinces. Population in thousands (2024 mid-year estimates, summing
// to about 280.9 million against the national 2025 figure of 282.5 million).
// Area in km2; density is computed from population / area. GRDP per capita in
// million IDR per year. HDI 0-100, poverty and unemployment in %.
const PROVINCES = [
  { name: 'Aceh', slug: 'aceh', capital: 'Banda Aceh', island: 'Sumatra', pop: 5450, area: 57956, grdp: 45, hdi: 73.9, poverty: 13.5, unemp: 5.6 },
  { name: 'North Sumatra', slug: 'north-sumatra', capital: 'Medan', island: 'Sumatra', pop: 15590, area: 72981, grdp: 62, hdi: 74.5, poverty: 8.2, unemp: 5.4 },
  { name: 'West Sumatra', slug: 'west-sumatra', capital: 'Padang', island: 'Sumatra', pop: 5760, area: 42013, grdp: 56, hdi: 74.6, poverty: 5.9, unemp: 5.7 },
  { name: 'Riau', slug: 'riau', capital: 'Pekanbaru', island: 'Sumatra', pop: 6640, area: 87024, grdp: 138, hdi: 74.8, poverty: 6.7, unemp: 4.5 },
  { name: 'Jambi', slug: 'jambi', capital: 'Jambi City', island: 'Sumatra', pop: 3640, area: 50058, grdp: 66, hdi: 73.5, poverty: 7.3, unemp: 4.2 },
  { name: 'South Sumatra', slug: 'south-sumatra', capital: 'Palembang', island: 'Sumatra', pop: 8840, area: 91592, grdp: 63, hdi: 72.5, poverty: 11.6, unemp: 4.4 },
  { name: 'Bengkulu', slug: 'bengkulu', capital: 'Bengkulu City', island: 'Sumatra', pop: 2070, area: 19919, grdp: 43, hdi: 72.1, poverty: 14.4, unemp: 3.9 },
  { name: 'Lampung', slug: 'lampung', capital: 'Bandar Lampung', island: 'Sumatra', pop: 9300, area: 34624, grdp: 48, hdi: 71.7, poverty: 11.3, unemp: 4.1 },
  { name: 'Bangka Belitung', slug: 'bangka-belitung', capital: 'Pangkal Pinang', island: 'Sumatra', pop: 1500, area: 16424, grdp: 62, hdi: 72.8, poverty: 4.5, unemp: 4.7 },
  { name: 'Riau Islands', slug: 'riau-islands', capital: 'Tanjung Pinang', island: 'Sumatra', pop: 2190, area: 8202, grdp: 141, hdi: 77.0, poverty: 5.4, unemp: 6.0 },
  { name: 'Jakarta', slug: 'jakarta', capital: 'Jakarta', island: 'Java', pop: 10560, area: 664, grdp: 322, hdi: 82.6, poverty: 4.3, unemp: 5.9 },
  { name: 'West Java', slug: 'west-java', capital: 'Bandung', island: 'Java', pop: 50350, area: 35378, grdp: 58, hdi: 74.9, poverty: 7.5, unemp: 6.2 },
  { name: 'Central Java', slug: 'central-java', capital: 'Semarang', island: 'Java', pop: 37890, area: 32801, grdp: 52, hdi: 73.9, poverty: 10.5, unemp: 5.2 },
  { name: 'Yogyakarta', slug: 'yogyakarta', capital: 'Yogyakarta', island: 'Java', pop: 3790, area: 3133, grdp: 49, hdi: 81.8, poverty: 11.5, unemp: 4.0 },
  { name: 'East Java', slug: 'east-java', capital: 'Surabaya', island: 'Java', pop: 41810, area: 47803, grdp: 68, hdi: 75.4, poverty: 9.8, unemp: 4.3 },
  { name: 'Banten', slug: 'banten', capital: 'Serang', island: 'Java', pop: 12430, area: 9663, grdp: 67, hdi: 75.1, poverty: 5.6, unemp: 6.8 },
  { name: 'Bali', slug: 'bali', capital: 'Denpasar', island: 'Bali & Nusa Tenggara', pop: 4360, area: 5780, grdp: 60, hdi: 78.0, poverty: 3.7, unemp: 2.6 },
  { name: 'West Nusa Tenggara', slug: 'west-nusa-tenggara', capital: 'Mataram', island: 'Bali & Nusa Tenggara', pop: 5660, area: 18572, grdp: 34, hdi: 71.5, poverty: 13.2, unemp: 3.2 },
  { name: 'East Nusa Tenggara', slug: 'east-nusa-tenggara', capital: 'Kupang', island: 'Bali & Nusa Tenggara', pop: 5620, area: 47931, grdp: 27, hdi: 68.3, poverty: 18.0, unemp: 3.0 },
  { name: 'West Kalimantan', slug: 'west-kalimantan', capital: 'Pontianak', island: 'Kalimantan', pop: 5850, area: 147307, grdp: 49, hdi: 71.0, poverty: 7.3, unemp: 4.6 },
  { name: 'Central Kalimantan', slug: 'central-kalimantan', capital: 'Palangka Raya', island: 'Kalimantan', pop: 2820, area: 153564, grdp: 68, hdi: 73.3, poverty: 5.3, unemp: 3.8 },
  { name: 'South Kalimantan', slug: 'south-kalimantan', capital: 'Banjarmasin', island: 'Kalimantan', pop: 4280, area: 38744, grdp: 63, hdi: 73.6, poverty: 4.3, unemp: 4.3 },
  { name: 'East Kalimantan', slug: 'east-kalimantan', capital: 'Samarinda', island: 'Kalimantan', pop: 3880, area: 127347, grdp: 232, hdi: 79.2, poverty: 6.0, unemp: 5.2 },
  { name: 'North Kalimantan', slug: 'north-kalimantan', capital: 'Tanjung Selor', island: 'Kalimantan', pop: 730, area: 75467, grdp: 138, hdi: 73.7, poverty: 6.8, unemp: 4.4 },
  { name: 'North Sulawesi', slug: 'north-sulawesi', capital: 'Manado', island: 'Sulawesi', pop: 2730, area: 13892, grdp: 59, hdi: 74.7, poverty: 7.1, unemp: 5.9 },
  { name: 'Central Sulawesi', slug: 'central-sulawesi', capital: 'Palu', island: 'Sulawesi', pop: 3110, area: 61841, grdp: 71, hdi: 71.2, poverty: 12.9, unemp: 3.1 },
  { name: 'South Sulawesi', slug: 'south-sulawesi', capital: 'Makassar', island: 'Sulawesi', pop: 9420, area: 46717, grdp: 60, hdi: 74.5, poverty: 8.3, unemp: 4.8 },
  { name: 'Southeast Sulawesi', slug: 'southeast-sulawesi', capital: 'Kendari', island: 'Sulawesi', pop: 2790, area: 38068, grdp: 72, hdi: 73.4, poverty: 10.7, unemp: 3.6 },
  { name: 'Gorontalo', slug: 'gorontalo', capital: 'Gorontalo City', island: 'Sulawesi', pop: 1250, area: 11257, grdp: 40, hdi: 71.2, poverty: 14.3, unemp: 3.9 },
  { name: 'West Sulawesi', slug: 'west-sulawesi', capital: 'Mamuju', island: 'Sulawesi', pop: 1560, area: 16787, grdp: 40, hdi: 68.9, poverty: 12.4, unemp: 3.2 },
  { name: 'Maluku', slug: 'maluku', capital: 'Ambon', island: 'Maluku', pop: 1980, area: 46158, grdp: 34, hdi: 72.4, poverty: 16.6, unemp: 6.1 },
  { name: 'North Maluku', slug: 'north-maluku', capital: 'Sofifi', island: 'Maluku', pop: 1410, area: 31983, grdp: 50, hdi: 71.7, poverty: 11.8, unemp: 4.9 },
  { name: 'West Papua', slug: 'west-papua', capital: 'Manokwari', island: 'Papua', pop: 560, area: 64516, grdp: 92, hdi: 73.1, poverty: 20.2, unemp: 6.4 },
  { name: 'Southwest Papua', slug: 'southwest-papua', capital: 'Sorong', island: 'Papua', pop: 620, area: 39123, grdp: 85, hdi: 72.8, poverty: 19.1, unemp: 7.0 },
  { name: 'Papua', slug: 'papua', capital: 'Jayapura', island: 'Papua', pop: 1100, area: 82680, grdp: 68, hdi: 71.2, poverty: 20.8, unemp: 4.2 },
  { name: 'South Papua', slug: 'south-papua', capital: 'Merauke', island: 'Papua', pop: 530, area: 131215, grdp: 55, hdi: 69.5, poverty: 21.4, unemp: 3.5 },
  { name: 'Central Papua', slug: 'central-papua', capital: 'Nabire', island: 'Papua', pop: 1360, area: 61073, grdp: 45, hdi: 68.4, poverty: 28.9, unemp: 3.3 },
  { name: 'Highland Papua', slug: 'highland-papua', capital: 'Wamena', island: 'Papua', pop: 1480, area: 51213, grdp: 28, hdi: 62.5, poverty: 31.5, unemp: 3.8 }
];

const ISLANDS = ['All islands', 'Sumatra', 'Java', 'Bali & Nusa Tenggara', 'Kalimantan', 'Sulawesi', 'Maluku', 'Papua'];

const NATIONAL_2025 = {
  population: 282.5, gdp: 23900, growth: 5.10, inflation: 2.40,
  unemployment: 4.76, poverty: 8.47, gini: 0.375, hdi: 75.45
};
