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
    o.innerHTML = '<div class="ring">' + ['html', 'css', 'javascript', 'php', 'python', 'mysql', 'powerbi', 'git'].map((n, i) => `<img src="resources/cards/${n}.png" alt="" style="--i:${i}">`).join('') + '</div>';
    card.appendChild(o); }

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
  const scene = $('.scene');
  addEventListener('scroll', () => { const y = Math.min(scrollY, innerHeight); scene.style.transform = `translateY(${y * .35}px) scale(${1 - y / 2200})`; scene.style.opacity = 1 - y / (innerHeight * 1.1); }, { passive: true });

  // túnel 3D (canvas)
  const cv = $('#tunnel'), g = cv.getContext('2d'); let w, h, T = 0, run = false, ly = scrollY, v = 0; const m = { x: 0, y: 0 };
  const rs = () => { w = cv.width = cv.clientWidth; h = cv.height = cv.clientHeight; }; rs(); addEventListener('resize', rs);
  new IntersectionObserver(e => run = e[0].isIntersecting).observe(cv.parentNode);
  addEventListener('pointermove', e => { m.x = e.clientX / innerWidth - .5; m.y = e.clientY / innerHeight - .5; });
  const N = 26, S = 6, hex = (z, cx, cy) => { const r = Math.pow(z, 2.6) * Math.max(w, h) * 1.1 + 4, a0 = z * 3 + T * 4, k = 1 - z;
    const ox = cx + Math.sin(T * 6 + z * 4) * 70 * k, oy = cy + Math.cos(T * 5 + z * 3) * 40 * k;
    return Array.from({ length: S }, (_, i) => [ox + Math.cos(a0 + i * 6.283 / S) * r, oy + Math.sin(a0 + i * 6.283 / S) * r]); };
  (function f() { requestAnimationFrame(f); if (!run) return; const d = Math.abs(scrollY - ly); ly = scrollY; v += (d - v) * .1; T += .004 + v * .0009;
    g.fillStyle = 'rgba(7,5,13,.28)'; g.fillRect(0, 0, w, h);
    const cx = w / 2 + m.x * 120, cy = h / 2 + m.y * 80, zs = Array.from({ length: N }, (_, i) => ((i / N) + T) % 1).sort((a, b) => a - b); let prev = null;
    for (const z of zs) { const p = hex(z, cx, cy); g.strokeStyle = `hsla(${250 + z * 120},95%,${55 + z * 15}%,${z})`; g.lineWidth = 1 + z * 3;
      g.beginPath(); p.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); g.stroke();
      if (prev) { g.beginPath(); p.forEach((q, i) => { g.moveTo(prev[i][0], prev[i][1]); g.lineTo(q[0], q[1]); }); g.globalAlpha = .5; g.stroke(); g.globalAlpha = 1; } prev = p; } })();
})();
