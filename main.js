/* Entry point: hero parallax, skill orbit rings, copy-email */
(function () {
  'use strict';
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  /* hero parallax: scroll and pointer nudge the orbit rings */
  var orbits = document.querySelector('.orbits');
  if (orbits && !still) {
    var sy = 0, mx = 0, my = 0, ticking = false;
    var apply = function () {
      orbits.style.setProperty('--px', mx.toFixed(1) + 'px');
      orbits.style.setProperty('--py', (sy * 0.12 + my).toFixed(1) + 'px');
      ticking = false;
    };
    var queue = function () { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
    window.addEventListener('scroll', function () { sy = Math.min(window.scrollY, 900); queue(); }, { passive: true });
    var hero = document.getElementById('top');
    if (hero) hero.addEventListener('pointermove', function (e) {
      mx = (e.clientX / window.innerWidth - 0.5) * -24;
      my = (e.clientY / window.innerHeight - 0.5) * -18;
      queue();
    });
  }

  /* skills: draw an orbit ring per category, one dot per skill */
  function el(name, attrs) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-orbit]'), function (card) {
    var svg = card.querySelector('svg.ring');
    var items = card.querySelectorAll('.skill-list li');
    if (!svg || !items.length) return;
    svg.appendChild(el('circle', { 'class': 'track', cx: 60, cy: 60, r: 50 }));
    var inner = items.length > 5;
    if (inner) svg.appendChild(el('circle', { 'class': 'track', cx: 60, cy: 60, r: 30 }));
    svg.appendChild(el('circle', { 'class': 'core', cx: 60, cy: 60, r: 4 }));
    var spin = el('g', { 'class': 'spin' });
    svg.appendChild(spin);
    var outerCount = inner ? Math.ceil(items.length / 2) : items.length;
    var dots = [];
    Array.prototype.forEach.call(items, function (li, i) {
      var onInner = inner && i >= outerCount;
      var count = onInner ? items.length - outerCount : outerCount;
      var idx = onInner ? i - outerCount : i;
      var a = (idx / count) * Math.PI * 2 - Math.PI / 2 + (onInner ? 0.5 : 0);
      var r = onInner ? 30 : 50;
      var dot = el('circle', { 'class': 'dot', cx: (60 + r * Math.cos(a)).toFixed(2), cy: (60 + r * Math.sin(a)).toFixed(2), r: 3 });
      spin.appendChild(dot);
      dots.push(dot);
      li.addEventListener('mouseenter', function () { dot.classList.add('on'); dot.setAttribute('r', 5); });
      li.addEventListener('mouseleave', function () { dot.classList.remove('on'); dot.setAttribute('r', 3); });
    });
  });

  /* contact: copy email with a text fallback */
  var btn = document.getElementById('copy-email');
  var addr = document.getElementById('email-addr');
  if (btn && addr) {
    var label = btn.textContent;
    btn.addEventListener('click', function () {
      var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = label; }, 1800); };
      var fallback = function () {
        var r = document.createRange(); r.selectNodeContents(addr);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        btn.textContent = 'Press Ctrl+C';
      };
      try { navigator.clipboard.writeText(addr.textContent).then(done, fallback); } catch (e) { fallback(); }
    });
  }

  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
