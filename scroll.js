/* Scroll reveals via IntersectionObserver. Content stays readable without JS. */
(function () {
  'use strict';
  var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (!items.length || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('js-ready');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
