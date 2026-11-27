// Nusantara in Numbers — hash router.
// Routes: #/ dashboard, #/economy, #/provinces, #/province/<slug>,
// #/wellbeing, #/about. Renders into #view and marks the active nav link.

(function () {
  var NAV_FOR_ROUTE = {
    '': 'dashboard', 'economy': 'economy', 'provinces': 'provinces',
    'province': 'provinces', 'wellbeing': 'wellbeing', 'about': 'about'
  };

  function render() {
    var hash = location.hash.replace(/^#\/?/, '');
    var parts = hash.split('/');
    var route = parts[0] || '';
    var view = document.getElementById('view');
    var html;
    if (route === '') { html = renderDashboard(); }
    else if (route === 'economy') { html = renderEconomy(); }
    else if (route === 'provinces') { html = renderProvinces(); }
    else if (route === 'province') { html = renderProvinceDetail(parts[1] || ''); }
    else if (route === 'wellbeing') { html = renderWellbeing(); }
    else if (route === 'about') { html = renderAbout(); }
    else { html = renderDashboard(); }
    view.innerHTML = html;
    if (route === '') wireDashboard();
    if (route === 'provinces') wireProvinces();
    document.querySelectorAll('.site-nav a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-nav') === NAV_FOR_ROUTE[route]);
    });
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);
  document.addEventListener('DOMContentLoaded', render);
  if (document.readyState !== 'loading') render();
})();
