'use strict';

(function () {
  var STORAGE_KEY = 'horeca-lang';
  var DEFAULT_LANG = 'uk';

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function saveLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function getTranslation(t, path) {
    var parts = path.split('.');
    var val = t;
    for (var i = 0; i < parts.length; i++) {
      if (val == null) return null;
      val = val[parts[i]];
    }
    return val != null ? val : null;
  }

  function applyTranslations(lang) {
    var t = window.TRANSLATIONS && window.TRANSLATIONS[lang];
    if (!t) return;

    // data-i18n — innerHTML
    var els = document.querySelectorAll('[data-i18n]');
    els.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = getTranslation(t, key);
      if (val !== null) el.innerHTML = val;
    });

    // data-i18n-text — textContent (safe, no HTML)
    var textEls = document.querySelectorAll('[data-i18n-text]');
    textEls.forEach(function (el) {
      var key = el.getAttribute('data-i18n-text');
      var val = getTranslation(t, key);
      if (val !== null) el.textContent = val;
    });

    // data-i18n-placeholder
    var phEls = document.querySelectorAll('[data-i18n-placeholder]');
    phEls.forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var val = getTranslation(t, key);
      if (val !== null) el.placeholder = val;
    });

    // data-i18n-aria
    var ariaEls = document.querySelectorAll('[data-i18n-aria]');
    ariaEls.forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      var val = getTranslation(t, key);
      if (val !== null) el.setAttribute('aria-label', val);
    });

    // Update <html lang>
    document.documentElement.lang = lang;

    // Update active lang button
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
  }

  function setLanguage(lang) {
    if (!window.TRANSLATIONS || !window.TRANSLATIONS[lang]) return;
    saveLang(lang);
    applyTranslations(lang);
  }

  function init() {
    var lang = getLang();
    applyTranslations(lang);

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLanguage(btn.getAttribute('data-lang'));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.HORECA_I18N = { setLanguage: setLanguage, getLang: getLang };
})();
