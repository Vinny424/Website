// Reveal on scroll: fade and rise 8px once as each block enters the viewport.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduce) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Synthwave backdrop: sky, striped sun, perspective grid.
//  - Scrolling sets the sun: it sinks into the horizon as you read down the page.
//  - Clicking or tapping anywhere that isn't a link sends a shooting star from
//    that spot and a neon pulse rolling down the grid.
// Still frame under reduced motion.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.createElement('canvas');
  canvas.className = 'synth-bg';
  canvas.setAttribute('aria-hidden', 'true');
  var veil = document.createElement('div');
  veil.className = 'synth-veil';
  veil.setAttribute('aria-hidden', 'true');
  document.body.prepend(veil);
  document.body.prepend(canvas);

  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, dpr = 1, colors = {}, stars = [];
  var sunP = 0, sunTarget = 0;          // 0 = risen, 1 = set
  var meteors = [], pulses = [];
  var t0 = performance.now(), raf = 0;

  function readColors() {
    var cs = getComputedStyle(document.documentElement);
    ['sky-top', 'sky-mid', 'sky-low', 'sun-top', 'sun-low', 'grid', 'floor', 'glow', 'star', 'meteor']
      .forEach(function (k) { colors[k] = cs.getPropertyValue('--' + k).trim() || '#000'; });
    colors.stars = parseFloat(cs.getPropertyValue('--star-alpha')) || 0;
  }

  function readScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    sunTarget = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    if (reduce) { sunP = sunTarget; draw(0); }
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = [];
    var n = Math.round(W * H / 9000);
    for (var i = 0; i < n; i++) {
      stars.push({ x: Math.random(), y: Math.random() * 0.6, r: Math.random() * 1.2 + 0.3, p: Math.random() * 6.28 });
    }
    readColors();
    readScroll();
    if (reduce) draw(0);
  }

  // Grid row position for a given depth z (0 = at the viewer, 18 = horizon)
  function rowY(hz, depth, z) {
    return hz + depth / (z * 0.55 + 0.45) - depth / (18 * 0.55 + 0.45);
  }

  function draw(time) {
    var hz = H * 0.58;
    var vx = W / 2;
    var sec = time / 1000;
    var depth = H - hz;

    // Sky
    var sky = ctx.createLinearGradient(0, 0, 0, hz);
    sky.addColorStop(0, colors['sky-top']);
    sky.addColorStop(0.6, colors['sky-mid']);
    sky.addColorStop(1, colors['sky-low']);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, hz + 1);

    // Stars come out as the sun sets
    var sa = colors.stars * (0.55 + 0.45 * sunP);
    if (sa > 0) {
      ctx.fillStyle = colors.star;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var tw = reduce ? 1 : 0.6 + 0.4 * Math.sin(sec * 1.3 + s.p);
        ctx.globalAlpha = sa * tw;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Sun, clipped at the horizon, with widening slits toward the bottom
    var R = Math.min(W, H) * 0.2;
    var sx = vx, sy = hz - R * 0.45 + sunP * R * 1.25;
    var sun = ctx.createLinearGradient(0, sy - R, 0, sy + R);
    sun.addColorStop(0, colors['sun-top']);
    sun.addColorStop(1, colors['sun-low']);
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, W, hz); ctx.clip();
    ctx.fillStyle = sun;
    ctx.beginPath(); ctx.arc(sx, sy, R, 0, 6.283); ctx.fill();
    ctx.fillStyle = sky;
    for (var k = 0; k < 7; k++) {
      var f = k / 7;
      ctx.fillRect(sx - R - 2, sy + R * (0.05 + f * 0.9), R * 2 + 4, 1.5 + f * R * 0.07);
    }

    // Shooting stars
    for (var m = meteors.length - 1; m >= 0; m--) {
      var mt = (time - meteors[m].t) / 1000;
      if (mt > 1) { meteors.splice(m, 1); continue; }
      var hx = meteors[m].x + meteors[m].dx * mt * 700;
      var hy = meteors[m].y + meteors[m].dy * mt * 700;
      var len = 140 * (1 - mt * 0.5);
      var tail = ctx.createLinearGradient(hx, hy, hx - meteors[m].dx * len, hy - meteors[m].dy * len);
      tail.addColorStop(0, colors.meteor);
      tail.addColorStop(1, 'transparent');
      ctx.globalAlpha = 1 - mt;
      ctx.strokeStyle = tail;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - meteors[m].dx * len, hy - meteors[m].dy * len); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.restore();

    // Horizon glow
    var g = ctx.createLinearGradient(0, hz - 40, 0, hz + 30);
    g.addColorStop(0, 'transparent');
    g.addColorStop(0.55, colors.glow);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, hz - 40, W, 70);

    // Floor
    ctx.fillStyle = colors.floor;
    ctx.fillRect(0, hz, W, H - hz);

    // Grid
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    var drift = reduce ? 0 : (sec * 0.35) % 1;
    for (var j = 0; j < 18; j++) {
      var py = rowY(hz, depth, j + 1 - drift);
      if (py < hz || py > H) continue;
      ctx.globalAlpha = Math.min(1, (py - hz) / depth * 1.6 + 0.08);
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(W, py); ctx.stroke();
    }
    ctx.globalAlpha = 0.85;
    var spread = W * 2.2;
    for (var c = -16; c <= 16; c++) {
      var bx = vx + (c / 16) * spread;
      ctx.beginPath(); ctx.moveTo(vx + (bx - vx) * 0.02, hz); ctx.lineTo(bx, H); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Neon pulses rolling from the horizon toward the viewer
    for (var p = pulses.length - 1; p >= 0; p--) {
      var pt = (time - pulses[p]) / 1300;
      if (pt > 1) { pulses.splice(p, 1); continue; }
      var z = 18 * (1 - pt * pt);                // accelerates as it nears
      var ly = rowY(hz, depth, Math.max(z, 0.02));
      if (ly < hz || ly > H) continue;
      ctx.save();
      ctx.strokeStyle = colors.meteor;
      ctx.shadowColor = colors.grid;
      ctx.shadowBlur = 14;
      ctx.lineWidth = 1.5 + pt * 3;
      ctx.globalAlpha = 1 - pt * 0.6;
      ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(W, ly); ctx.stroke();
      ctx.restore();
    }
  }

  function loop(now) {
    sunP += (sunTarget - sunP) * 0.08;
    draw(now - t0);
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  window.addEventListener('scroll', readScroll, { passive: true });

  if (!reduce) {
    document.addEventListener('click', function (e) {
      if (e.target.closest('a, button, input, select, textarea, label, summary')) return;
      var sel = window.getSelection && window.getSelection();
      if (sel && String(sel).length) return;     // they were selecting text
      var now = performance.now() - t0;
      var ang = Math.PI * (0.78 + Math.random() * 0.1);  // heading down and to the left
      meteors.push({ x: e.clientX, y: Math.min(e.clientY, H * 0.5), dx: Math.cos(ang), dy: Math.sin(ang), t: now });
      pulses.push(now);
      if (pulses.length > 4) pulses.shift();
    });
    document.addEventListener('visibilitychange', function () {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    });
  }

  // Follow theme changes (system setting or an explicit data-theme toggle)
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  var onTheme = function () { readColors(); if (reduce) draw(0); };
  if (mq.addEventListener) mq.addEventListener('change', onTheme);
  new MutationObserver(onTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  resize();
  if (!reduce) raf = requestAnimationFrame(loop);
})();
