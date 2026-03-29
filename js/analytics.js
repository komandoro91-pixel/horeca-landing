'use strict';

(function () {
  var config = (window.HORECA_CONFIG && window.HORECA_CONFIG.analytics) || {};

  function initGA4(id) {
    if (!id) return;
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id);
  }

  function initFBPixel(id) {
    if (!id) return;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', id);
    window.fbq('track', 'PageView');
  }

  function trackEvent(name, params) {
    if (window.gtag) {
      window.gtag('event', name, params || {});
    }
    if (window.fbq) {
      window.fbq('track', name, params || {});
    }
  }

  initGA4(config.ga4Id);
  initFBPixel(config.fbPixelId);

  window.HORECA_ANALYTICS = { trackEvent: trackEvent };
})();
