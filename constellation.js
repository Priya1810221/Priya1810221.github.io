/* Hero constellation: pure canvas 2D. Dots drift, nearby dots connect, the pointer draws lines to close dots. */
(function () {
  'use strict';
  var canvas = document.getElementById('constellation');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var css = getComputedStyle(document.documentElement);
  function token(name, fallback) { return (css.getPropertyValue(name) || fallback).trim(); }
  var STAR = token('--starlight', '#e8e4d9');
  var LINK = token('--comet', '#8fa8c8');
  var NOVA = token('--nova', '#d4956a');

  var w = 0, h = 0, dpr = 1, pts = [], raf = 0, onScreen = true, tabVisible = true;
  var mouse = { x: -9999, y: -9999 };
  var LINK_DIST = 125, MOUSE_DIST = 170;

  function build() {
    var r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.round(Math.min(110, Math.max(26, (w * h) / 14000)));
    pts = [];
    for (var i = 0; i < n; i++) {
      pts.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.3 + 0.4, tw: Math.random() * 6.28
      });
    }
    draw(0);
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    var still = motion.matches, i, j, p, q, dx, dy, d;

    for (i = 0; i < pts.length; i++) {
      p = pts[i];
      if (!still) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;
      }
    }

    ctx.lineWidth = 0.6;
    for (i = 0; i < pts.length; i++) {
      p = pts[i];
      for (j = i + 1; j < pts.length; j++) {
        q = pts[j]; dx = p.x - q.x; dy = p.y - q.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST) {
          ctx.globalAlpha = (1 - d / LINK_DIST) * 0.32;
          ctx.strokeStyle = LINK;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      dx = p.x - mouse.x; dy = p.y - mouse.y; d = Math.sqrt(dx * dx + dy * dy);
      if (d < MOUSE_DIST) {
        ctx.globalAlpha = (1 - d / MOUSE_DIST) * 0.65;
        ctx.strokeStyle = NOVA;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }

    ctx.fillStyle = STAR;
    for (i = 0; i < pts.length; i++) {
      p = pts[i];
      ctx.globalAlpha = 0.45 + 0.4 * Math.sin(t / 1400 + p.tw);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function loop(t) {
    draw(t);
    raf = requestAnimationFrame(loop);
  }
  function sync() {
    var run = onScreen && tabVisible && !motion.matches;
    if (run && !raf) raf = requestAnimationFrame(loop);
    if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
    if (!run) draw(0);
  }

  var hero = canvas.parentElement;
  hero.addEventListener('pointermove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { build(); sync(); }, 150);
  });
  document.addEventListener('visibilitychange', function () { tabVisible = !document.hidden; sync(); });
  if (motion.addEventListener) motion.addEventListener('change', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { onScreen = entries[0].isIntersecting; sync(); }).observe(canvas);
  }

  build();
  sync();
})();
