'use strict';

(function () {
  function setError(inputId, errorId, show) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);
    if (!input || !error) return;
    input.classList.toggle('error', show);
    error.classList.toggle('visible', show);
  }

  function validatePhone(val) {
    var digits = val.replace(/\D/g, '');
    return digits.startsWith('380') && digits.length === 12;
  }

  function getLang() {
    return (window.HORECA_I18N && window.HORECA_I18N.getLang()) || 'uk';
  }

  function t(key) {
    var lang = getLang();
    var translations = window.TRANSLATIONS && window.TRANSLATIONS[lang];
    if (!translations) return '';
    var parts = key.split('.');
    var val = translations;
    for (var i = 0; i < parts.length; i++) {
      if (val == null) return '';
      val = val[parts[i]];
    }
    return val || '';
  }

  function init() {
    var form = document.getElementById('contactForm');
    var formSuccess = document.getElementById('formSuccess');
    if (!form || !formSuccess) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var equipment = document.getElementById('equipment').value;
      var comment = document.getElementById('comment') ? document.getElementById('comment').value.trim() : '';

      var valid = true;

      if (name.length < 2) {
        setError('name', 'nameError', true);
        valid = false;
      } else {
        setError('name', 'nameError', false);
      }

      if (!validatePhone(phone)) {
        setError('phone', 'phoneError', true);
        valid = false;
      } else {
        setError('phone', 'phoneError', false);
      }

      if (!equipment) {
        setError('equipment', 'equipmentError', true);
        valid = false;
      } else {
        setError('equipment', 'equipmentError', false);
      }

      if (!valid) return;

      var submitBtn = form.querySelector('[type=submit]');
      submitBtn.disabled = true;
      submitBtn.textContent = t('form.submitting') || 'Надсилаємо...';

      var data = { name: name, phone: phone, equipment: equipment, comment: comment, lang: getLang() };

      // TODO: підключити n8n webhook або HugeProfit API
      // if (window.HORECA_CONFIG.api.webhookUrl) {
      //   fetch(window.HORECA_CONFIG.api.webhookUrl, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify(data)
      //   });
      // }

      console.log('Form submitted:', data);

      if (window.HORECA_ANALYTICS) {
        window.HORECA_ANALYTICS.trackEvent('form_submit', { equipment: equipment });
      }

      setTimeout(function () {
        form.style.display = 'none';
        formSuccess.classList.add('visible');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 800);
    });

    ['name', 'phone', 'equipment'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', function () {
        el.classList.remove('error');
        var errEl = document.getElementById(id + 'Error');
        if (errEl) errEl.classList.remove('visible');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
