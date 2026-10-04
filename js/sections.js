(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const CAT = { dados: ['ANÁLISE', 'FABRIC', 'POWER BI'], auto: ['POWER APPS', 'POWER AUTOMATE', 'MICROSOFT OFFICE'],
    web: ['HTML5', 'CSS3', 'JAVASCRIPT', 'JQUERY', 'WORDPRESS'], back: ['PHP', 'LARAVEL', 'PYTHON', 'ADVPL', 'XAMPP', 'MYSQL', 'ORACLE', 'UNITY'],
    gestao: ['GIT', 'STASH-GIT', 'JIRA', 'SCRUM', 'GERENCIAMENTO', 'SUPORTE'] };
  const NAMES = { all: 'Todos', dados: 'Dados & BI', auto: 'Automação', web: 'Front-end', back: 'Back-end & Bancos', gestao: 'Gestão' };
  const cols = $$('.col'), label = c => $('.front p', c).textContent.trim().toUpperCase();
  cols.forEach(c => { c.dataset.cat = Object.keys(CAT).find(k => CAT[k].includes(label(c))) || ''; });

  // marquee com as skills
  const mq = Object.assign(document.createElement('div'), { className: 'marquee' }), txt = cols.map(label).join('  ✦  ') + '  ✦  ';
  mq.innerHTML = `<div class="track">${txt}${txt}</div>`; $('#welcome-section').after(mq);

  // órbita 3D de ícones ao redor do cartão
  const card = $('#reflexcard');
  if (card) { const o = document.createElement('div'); o.className = 'orbit';
    o.innerHTML = '<div class="ring">' + ['html', 'css', 'javascript', 'jquery', 'php', 'laravel', 'python', 'mysql', 'powerbi', 'powerapps', 'wordpress', 'git'].map((n, i) => `<img src="resources/cards/${n}.png" alt="" style="--i:${i}">`).join('') + '</div>';
    $('.scene').appendChild(o); }

  // filtros por categoria
  const bar = Object.assign(document.createElement('div'), { className: 'chips' });
  Object.keys(NAMES).forEach((k, i) => { const b = Object.assign(document.createElement('button'), { className: 'chip' + (i ? '' : ' on'), textContent: NAMES[k] });
    b.onclick = () => { $$('.chip', bar).forEach(x => x.classList.toggle('on', x === b)); cols.forEach(c => c.classList.toggle('off', k !== 'all' && c.dataset.cat !== k)); }; bar.appendChild(b); });
  $('.projects-section .title').after(bar);

  // reveal + scramble + contador
  const chars = '▓▒░#@$%&*+<>/?', scramble = el => { const t = el.dataset.t || (el.dataset.t = el.textContent); let f = 0;
    const id = setInterval(() => { el.textContent = [...t].map((ch, i) => ch === ' ' || i < f / 2 ? ch : chars[Math.random() * chars.length | 0]).join(''); if (++f > t.length * 2) { clearInterval(id); el.textContent = t; } }, 30); };
  const countUp = el => { const n = cols.filter(c => c.dataset.cat === el.dataset.cat).length; let v = 0; const id = setInterval(() => { el.textContent = ++v; if (v >= n) clearInterval(id); }, 120); };
  const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting || e.target.classList.contains('vis')) return; const t = e.target; t.classList.add('vis');
    if (t.classList.contains('scr')) scramble(t); const n = $('.count', t); if (n) countUp(n); }), { threshold: .3 });
  $$('.rv').forEach(el => io.observe(el));

  // inclinação 3D dos painéis
  $$('.panel').forEach(p => { p.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = p.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    p.style.setProperty('--ry', ((x - .5) * 22).toFixed(1)); p.style.setProperty('--rx', ((.5 - y) * 22).toFixed(1)); p.style.setProperty('--mx', x * 100 + '%'); p.style.setProperty('--my', y * 100 + '%'); });
    p.addEventListener('pointerleave', () => ['--rx', '--ry'].forEach(k => p.style.removeProperty(k))); });

  // cursor em anel
  if (fine) { const c = Object.assign(document.createElement('div'), { id: 'cur' }); document.body.appendChild(c); let x = 0, y = 0, tx = 0, ty = 0;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; c.classList.toggle('big', !!e.target.closest('a,button,.col,.panel')); });
    (function f() { x += (tx - x) * .18; y += (ty - y) * .18; c.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(f); })(); }

  // parallax do hero ao rolar
  const scene = $('.scene'), wrap = document.createElement('div'); scene.before(wrap); wrap.appendChild(scene);
  addEventListener('scroll', () => { const y = Math.min(scrollY, innerHeight); scene.style.transform = `translateY(${y * .35}px) scale(${1 - y / 2200})`; wrap.style.opacity = 1 - y / (innerHeight * 1.1); }, { passive: true });

  // fundo de dados (canvas): grade, barras, linhas, rosca e tabela, tudo em movimento lento
  const cv = $('#tunnel'), g = cv.getContext('2d'), calm = matchMedia('(prefers-reduced-motion: reduce)').matches; let w, h, run = false; const m = { x: 0, y: 0, sx: 0, sy: 0 };
  const rs = () => { w = cv.width = cv.clientWidth; h = cv.height = cv.clientHeight; }; rs(); addEventListener('resize', rs);
  new IntersectionObserver(e => run = e[0].isIntersecting).observe(cv.parentNode);
  addEventListener('pointermove', e => { m.x = e.clientX / innerWidth - .5; m.y = e.clientY / innerHeight - .5; });
  const cells = Array.from({ length: 24 }, () => ({ v: Math.random() * 9999 | 0, a: .1 })); setInterval(() => { const c = cells[Math.random() * 24 | 0]; c.v = Math.random() * 9999 | 0; c.a = 0; }, 700);
  const yAt = (r, p, x, t) => h * r + Math.sin(x * .004 + t * .0003 + p) * h * .07 + Math.sin(x * .012 - t * .0002) * h * .025;
  (function f(now) { requestAnimationFrame(f); if (!run) return; const t = calm ? 0 : now, small = w < 700;
    m.sx += (m.x - m.sx) * .03; m.sy += (m.y - m.sy) * .03; g.clearRect(0, 0, w, h);
    g.strokeStyle = 'rgba(168,85,247,.07)'; g.lineWidth = 1; g.beginPath();                       // grade
    for (let x = (m.sx * 30) % 60; x < w; x += 60) { g.moveTo(x, 0); g.lineTo(x, h); } for (let y = (m.sy * 20) % 60; y < h; y += 60) { g.moveTo(0, y); g.lineTo(w, y); } g.stroke();
    const n = small ? 8 : 16, step = w / n, base = h * .94;                                        // barras
    for (let i = 0; i < n; i++) { const bh = h * (.1 + .22 * (.5 + .5 * Math.sin(t * .0005 + i * .7))), x = i * step + step * .22 + m.sx * 20, top = base - bh, gr = g.createLinearGradient(0, top, 0, base);
      gr.addColorStop(0, 'rgba(168,85,247,.35)'); gr.addColorStop(1, 'rgba(168,85,247,0)'); g.fillStyle = gr; g.fillRect(x, top, step * .56, bh);
      g.fillStyle = 'rgba(255,230,0,.5)'; g.fillRect(x, top, step * .56, 2); }
    [[.38, '168,85,247', 0], [.5, '255,230,0', 2]].forEach(([r, c, p], k) => {                    // linhas
      g.beginPath(); for (let x = 0; x <= w + 12; x += 12) x ? g.lineTo(x, yAt(r, p, x, t)) : g.moveTo(x, yAt(r, p, x, t));
      g.strokeStyle = `rgba(${c},.55)`; g.lineWidth = 2; g.stroke();
      for (let x = 48; x < w; x += 96) { g.beginPath(); g.arc(x, yAt(r, p, x, t), 3, 0, 6.283); g.fillStyle = `rgba(${c},.8)`; g.fill(); }
      const mx = ((t * .00006) + k * .5) % 1 * w; g.beginPath(); g.arc(mx, yAt(r, p, mx, t), 6, 0, 6.283); g.shadowColor = `rgb(${c})`; g.shadowBlur = 14; g.fillStyle = `rgb(${c})`; g.fill(); g.shadowBlur = 0; });
    if (small) return;
    const cx = w * .86, cy = h * .2, R = Math.min(w, h) * .09; let a = t * .00005;                 // rosca
    [[.4, '168,85,247'], [.3, '255,230,0'], [.2, '0,229,255'], [.1, '255,61,154']].forEach(([v, c]) => { g.beginPath(); g.arc(cx, cy, R, a, a + v * 6.283 - .06); g.strokeStyle = `rgba(${c},.35)`; g.lineWidth = R * .35; g.stroke(); a += v * 6.283; });
    const x0 = w * .05, y0 = h * .12, cw = 92, rh = 28; g.font = '12px monospace';                  // tabela
    for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) { const x = x0 + c * cw, y = y0 + r * rh + m.sy * 10, cell = cells[r * 4 + c]; cell.a += (.35 - cell.a) * .05;
      g.strokeStyle = 'rgba(255,255,255,.08)'; g.strokeRect(x, y, cw, rh); if (!r) { g.fillStyle = 'rgba(168,85,247,.15)'; g.fillRect(x, y, cw, rh); }
      g.fillStyle = `rgba(255,255,255,${r ? cell.a : .35})`; g.fillText(r ? cell.v : 'COL ' + (c + 1), x + 10, y + 18); } })();
})();
