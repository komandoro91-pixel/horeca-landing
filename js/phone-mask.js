'use strict';

(function () {
  function initPhoneMask(input) {
    if (!input) return;

    input.addEventListener('input', function (e) {
      var val = e.target.value.replace(/\D/g, '');

      if (val.startsWith('380')) {
        // fine
      } else if (val.startsWith('38')) {
        // fine
      } else if (val.startsWith('0')) {
        val = '38' + val;
      } else if (val.length > 0 && !val.startsWith('3')) {
        val = '38' + val;
      }

      if (val.length > 12) val = val.slice(0, 12);

      var formatted = '';
      if (val.length > 0) formatted += '+';
      if (val.length >= 1) formatted += val.slice(0, 2);
      if (val.length >= 3) formatted += ' (' + val.slice(2, 5);
      if (val.length >= 5) formatted += ') ' + val.slice(5, 8);
      if (val.length >= 8) formatted += '-' + val.slice(8, 10);
      if (val.length >= 10) formatted += '-' + val.slice(10, 12);

      e.target.value = formatted;
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' && input.value === '+38') {
        e.preventDefault();
        input.value = '';
      }
    });

    input.addEventListener('focus', function () {
      if (!input.value) input.value = '+38 (0';
    });

    input.addEventListener('blur', function () {
      if (input.value === '+38 (0') input.value = '';
    });
  }

  function init() {
    initPhoneMask(document.getElementById('phone'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.initPhoneMask = initPhoneMask;
})();
