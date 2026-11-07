/* Optional cursor enhancement: a faint amber glow follows the pointer. Fine pointers only, off for reduced motion. */
(function () {
  'use strict';
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var glow = document.createElement('div');
  glow.className = 'cursor-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);

  var x = 0, y = 0, queued = false;
  window.addEventListener('pointermove', function (e) {
    x = e.clientX; y = e.clientY;
    glow.style.opacity = '1';
    if (!queued) {
      queued = true;
      requestAnimationFrame(function () {
        glow.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        queued = false;
      });
    }
  }, { passive: true });
  document.addEventListener('pointerleave', function () { glow.style.opacity = '0'; });
})();
