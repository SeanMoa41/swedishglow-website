(function () {
  // Pages that have an English (-en.html) equivalent
  var BILINGUAL = [
    'index', 'supplementen', 'shop', 'start-hier', 'over-ons', 'faq',
    'stories', 'reseller-programma', 'levering',
    'marine-collageen-13000-kuur', 'nordsilk', 'hermade', 'freja'
  ];

  var file = window.location.pathname.split('/').pop() || 'index.html';
  var isEnPage   = file.endsWith('-en.html');
  var baseName   = file.replace('-en.html', '').replace('.html', '');
  var nlFile     = baseName + '.html';
  var enFile     = baseName + '-en.html';
  var isBilingual = BILINGUAL.indexOf(baseName) !== -1;

  function currentLang() { return isEnPage ? 'en' : 'nl'; }

  function redirectTo(lang) {
    if (!isBilingual) return;
    var target = lang === 'en' ? enFile : nlFile;
    if (target !== file) window.location.replace(target);
  }

  // Wire NL/EN toggle in nav — runs after DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.lang-switch').forEach(function (sw) {
      var links = sw.querySelectorAll('a');
      if (links.length < 2) return;
      var nlLink = links[0];
      var enLink = links[1];

      nlLink.href = nlFile;
      enLink.href = isBilingual ? enFile : file;

      nlLink.classList.toggle('active', !isEnPage);
      enLink.classList.toggle('active', isEnPage);

      nlLink.addEventListener('click', function () { localStorage.setItem('tsg-lang', 'nl'); });
      enLink.addEventListener('click', function () { localStorage.setItem('tsg-lang', 'en'); });
    });
  });

  // 1. Manual preference wins
  var pref = localStorage.getItem('tsg-lang');
  if (pref) {
    if (pref !== currentLang()) redirectTo(pref);
    return;
  }

  // 2. Cached geo result from this session
  var cached = sessionStorage.getItem('tsg-country');
  if (cached) {
    var lang = cached === 'NL' ? 'nl' : 'en';
    if (lang !== currentLang()) redirectTo(lang);
    return;
  }

  // 3. Geo-detect (ipapi.co — free, no key needed up to 1k/day)
  fetch('https://ipapi.co/country/', { cache: 'no-store' })
    .then(function (r) { return r.text(); })
    .then(function (country) {
      country = (country || '').trim().toUpperCase();
      if (country.length !== 2) throw new Error('bad');
      sessionStorage.setItem('tsg-country', country);
      var detectedLang = country === 'NL' ? 'nl' : 'en';
      if (detectedLang !== currentLang()) redirectTo(detectedLang);
    })
    .catch(function () {
      // Fallback: browser language preference
      var bl = (navigator.language || navigator.userLanguage || '').toLowerCase();
      var detectedLang = bl.startsWith('nl') ? 'nl' : 'en';
      if (detectedLang !== currentLang()) redirectTo(detectedLang);
    });
})();
