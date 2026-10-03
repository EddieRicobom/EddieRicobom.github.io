(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const mk = (tag, id) => document.body.appendChild(Object.assign(document.createElement(tag), { id }));
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const pal = ['#a855f7', '#ffe600', '#00e5ff', '#ff3d9a'], m = { x: -999, y: -999 };

  // barra de progresso do scroll
  const bar = mk('div', 'progress');
  addEventListener('scroll', () => { const h = document.documentElement; bar.style.transform = `scaleX(${scrollY / ((h.scrollHeight - innerHeight) || 1)})`; }, { passive: true });

  // holofote que segue o mouse
  const spot = fine && !calm ? mk('div', 'spot') : null;
  addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; m.x = e.clientX; m.y = e.clientY; if (spot) { spot.style.setProperty('--sx', m.x + 'px'); spot.style.setProperty('--sy', m.y + 'px'); } }, { passive: true });

  // constelação de partículas (fundo) + faíscas ao clicar (frente)
  const cv = mk('canvas', 'fx'), c = cv.getContext('2d'), cv2 = mk('canvas', 'fx2'), c2 = cv2.getContext('2d');
  let W, H, P = [], B = [];
  const size = () => { W = cv.width = cv2.width = innerWidth; H = cv.height = cv2.height = innerHeight;
    P = Array.from({ length: calm ? 0 : Math.min(80, W * H / 18000 | 0) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: Math.random() - .5, vy: Math.random() - .5 })); };
  size(); addEventListener('resize', size);
  window.burst = (x, y) => { if (calm) return; for (let i = 0; i < 28; i++) { const a = Math.random() * 6.283, v = 2 + Math.random() * 5; B.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, c: pal[i % 4] }); } };
  (function draw() {
    requestAnimationFrame(draw); if (document.hidden) return;
    c.clearRect(0, 0, W, H); c2.clearRect(0, 0, W, H);
    for (const p of P) {
      p.x += p.vx * .5; p.y += p.vy * .5; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = p.x - m.x, dy = p.y - m.y, d = Math.hypot(dx, dy); if (d < 140) { p.x += dx / d * 1.2; p.y += dy / d * 1.2; }
      c.fillStyle = 'rgba(200,170,255,.8)'; c.fillRect(p.x, p.y, 2, 2);
    }
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
      const d = Math.hypot(P[i].x - P[j].x, P[i].y - P[j].y);
      if (d < 110) { c.strokeStyle = `rgba(168,85,247,${.35 * (1 - d / 110)})`; c.beginPath(); c.moveTo(P[i].x, P[i].y); c.lineTo(P[j].x, P[j].y); c.stroke(); }
    }
    B = B.filter(b => b.l > 0);
    for (const b of B) { b.x += b.vx; b.y += b.vy; b.vy += .12; b.vx *= .98; b.l -= .025; c2.globalAlpha = Math.max(b.l, 0); c2.fillStyle = b.c; c2.shadowColor = b.c; c2.shadowBlur = 12; c2.fillRect(b.x, b.y, 3, 3); }
  })();

  // cards: revelar ao rolar, inclinar com o mouse, virar ao clicar
  const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('vis', e.isIntersecting)), { threshold: .15 });
  $$('.col').forEach((col, i) => {
    const ct = $('.container', col), props = ['--rx', '--ry', '--mx', '--my'];
    col.style.transitionDelay = (i % 6) * 70 + 'ms'; col.tabIndex = 0; col.setAttribute('role', 'button'); io.observe(col);
    col.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || calm) return;
      const r = ct.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      ct.style.setProperty('--ry', ((x - .5) * 18).toFixed(1)); ct.style.setProperty('--rx', ((.5 - y) * 18).toFixed(1));
      ct.style.setProperty('--mx', x * 100 + '%'); ct.style.setProperty('--my', y * 100 + '%');
    });
    col.addEventListener('pointerleave', () => props.forEach(k => ct.style.removeProperty(k)));
    const flip = e => { col.classList.toggle('flipped'); const r = col.getBoundingClientRect(); burst(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2); };
    col.addEventListener('click', flip);
    col.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(e); } });
  });

  // botões magnéticos
  $$('.contact-details').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      b.style.setProperty('--bx', x + 'px'); b.style.setProperty('--by', y + 'px');
      b.style.setProperty('--tx', (x - r.width / 2) * .18 + 'px'); b.style.setProperty('--ty', (y - r.height / 2) * .3 - 4 + 'px'); });
    b.addEventListener('pointerleave', () => { b.style.removeProperty('--tx'); b.style.removeProperty('--ty'); });
  });
})();
