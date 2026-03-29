'use strict';

(function () {
  function init() {
    // ---- Reduced motion support ----
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.fade-in, .reveal, .reveal-left, .reveal-right').forEach(function (el) {
        el.style.transition = 'none';
        el.classList.add('visible');
      });
    }

    // ---- Sticky header ----
    var header = document.getElementById('header');
    if (header) {
      window.addEventListener('scroll', function () {
        header.classList.toggle('scrolled', window.scrollY > 60);
      }, { passive: true });
    }

    // ---- Mobile menu ----
    var burger = document.getElementById('burger');
    var mobileMenu = document.getElementById('mobileMenu');

    if (burger && mobileMenu) {
      burger.addEventListener('click', function () {
        var isOpen = burger.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        burger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          burger.classList.remove('open');
          mobileMenu.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });
    }

    // ---- Scroll to top ----
    var scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
      window.addEventListener('scroll', function () {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
      }, { passive: true });

      scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // ---- IntersectionObserver for animations ----
    var animEls = document.querySelectorAll('.fade-in, .reveal, .reveal-left, .reveal-right');
    if (animEls.length && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      animEls.forEach(function (el) { observer.observe(el); });
    } else {
      // Fallback: show all immediately
      animEls.forEach(function (el) { el.classList.add('visible'); });
    }

    // ---- Animated counters ----
    function animateCount(el, target, duration) {
      var start = performance.now();
      function update(now) {
        var elapsed = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - elapsed, 3);
        el.textContent = Math.round(eased * target) + '+';
        if (elapsed < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }

    var counterEls = document.querySelectorAll('[data-count]');
    if (counterEls.length && 'IntersectionObserver' in window) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var target = parseInt(el.dataset.count, 10);
            animateCount(el, target, 1600);
            counterObserver.unobserve(el);
          }
        });
      }, { threshold: 0.5 });

      counterEls.forEach(function (el) { counterObserver.observe(el); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
