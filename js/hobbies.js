(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  /* ===== EDITE AQUI ===== */
  // Mechs: coloque as fotos em resources/hobbies/ e preencha "foto" (ex.: 'resources/hobbies/gundam.jpg')
  const MECHS = [{ nome: 'Mech #1', info: 'foto em breve', foto: '' }, { nome: 'Mech #2', info: 'foto em breve', foto: '' }, { nome: 'Mech #3', info: 'foto em breve', foto: '' }];
  // Pokémon: números da Pokédex (os dados vêm da PokéAPI)
  const POKEMON = [25, 6, 94, 149, 448, 150, 133, 143];
  /* ======================= */
  const COR = { fire: '#f97316', water: '#3b82f6', grass: '#22c55e', electric: '#facc15', psychic: '#ec4899', ice: '#67e8f9', dragon: '#6366f1', dark: '#6b7280', fairy: '#f9a8d4', fighting: '#ef4444', poison: '#a855f7', ground: '#d4a24c', flying: '#93c5fd', bug: '#84cc16', rock: '#a8a29e', ghost: '#7c3aed', steel: '#94a3b8', normal: '#d1d5db' };
  const SIGLA = { hp: 'HP', attack: 'ATK', defense: 'DEF', 'special-attack': 'SP.ATK', 'special-defense': 'SP.DEF', speed: 'SPD' };
  const mech = `<svg viewBox="0 0 120 150"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M48 10h24l6 14H42z"/><path d="M52 16h16"/><path d="M38 28h44l8 40H30z"/><path d="M30 34l-14 8v36h12l8-26"/><path d="M90 34l14 8v36H92l-8-26"/><path d="M42 68h36l-4 14H46z"/><path d="M44 82l-4 52h18l2-52"/><path d="M76 82l4 52H62l-2-52"/></g></svg>`;
  $('#mechs').innerHTML = MECHS.map(m => `<div class="kit">${m.foto ? `<img loading="lazy" src="${m.foto}" alt="${m.nome}">` : mech}<b>${m.nome}</b><small>${m.info || ''}</small></div>`).join('');
  $('#pk').innerHTML = POKEMON.map(id => `<div class="pk" data-id="${id}" tabindex="0" role="button"><div class="pi"><div class="pf"><img loading="lazy" alt="" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png"><b>#${String(id).padStart(3, '0')}</b></div><div class="pb">carregando…</div></div></div>`).join('');

  // Gatos e Games: preencha "foto" com um caminho (ex.: 'resources/hobbies/mingau.jpg')
  const GATOS = [{ nome: 'Gato #1', info: 'foto em breve', foto: '' }, { nome: 'Gato #2', info: 'foto em breve', foto: '' }];
  const GAMES = [{ nome: 'Game #1', info: 'plataforma · capa em breve', foto: '' }, { nome: 'Game #2', info: 'plataforma · capa em breve', foto: '' }, { nome: 'Game #3', info: 'plataforma · capa em breve', foto: '' }];
  const gato = `<svg viewBox="0 0 120 130"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><path d="M30 70L34 28 52 46M90 70L86 28 68 46"/><path d="M30 70C30 108 90 108 90 70 90 52 76 44 60 44S30 52 30 70z"/><circle cx="48" cy="72" r="3"/><circle cx="72" cy="72" r="3"/><path d="M56 82h8l-4 5zM60 87v5M52 94c4 3 12 3 16 0"/><path d="M22 80l16 4M22 90l16-4M98 80L82 84M98 90L82 86"/></g></svg>`;
  const pad = `<svg viewBox="0 0 120 130"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><path d="M30 40h60c16 0 24 28 20 44-3 10-12 10-18 2L82 72H38L28 86c-6 8-15 8-18-2-4-16 4-44 20-44z"/><path d="M42 54v14M35 61h14"/><circle cx="82" cy="56" r="3.5"/><circle cx="92" cy="65" r="3.5"/></g></svg>`;
  const card = (m, ico, cls) => `<div class="kit ${cls}">${m.foto ? `<img loading="lazy" src="${m.foto}" alt="${m.nome}">` : ico}<b>${m.nome}</b><small>${m.info || ''}</small></div>`;
  $('#cats').innerHTML = '<button class="tab cat-btn">🐱 Trazer gatinho aleatório</button>' + GATOS.map(m => card(m, gato, 'ct')).join('');
  $('#games').innerHTML = GAMES.map(m => card(m, pad, 'gm')).join('');

  const tilt = el => { el.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--ry', ((x - .5) * 20).toFixed(1)); el.style.setProperty('--rx', ((.5 - y) * 20).toFixed(1)); });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', 0); el.style.setProperty('--ry', 0); }); };
  $$('.kit,.pk').forEach(tilt);

  const load = () => $$('.pk').forEach(c => fetch('https://pokeapi.co/api/v2/pokemon/' + c.dataset.id).then(r => r.json()).then(d => {
    const tipos = d.types.map(t => t.type.name); c.style.setProperty('--c', COR[tipos[0]] || '#a855f7');
    $('.pf b', c).textContent = d.name + ' · #' + String(d.id).padStart(3, '0');
    $('.pb', c).innerHTML = `<h4>${d.name}</h4>` + tipos.map(t => `<span class="ty" style="--c:${COR[t] || '#888'}">${t}</span>`).join('') +
      d.stats.map(s => `<div class="st"><span>${SIGLA[s.stat.name] || s.stat.name}</span><i style="--v:${Math.min(100, s.base_stat / 1.6)}"></i></div>`).join('');
  }).catch(() => { $('.pb', c).textContent = 'Não consegui carregar os dados agora.'; }));
  $$('.pk').forEach(c => { const f = e => { c.classList.toggle('flipped'); if (window.burst) { const r = c.getBoundingClientRect(); burst(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2); } };
    c.addEventListener('click', f); c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); f(e); } }); });

  $('.cat-btn').onclick = () => { const d = document.createElement('div'); d.className = 'kit ct';
    d.innerHTML = `<img src="https://cataas.com/cat?width=400&height=300&t=${Date.now()}" alt="gato aleatório"><b>Gatinho aleatório</b><small>via cataas.com</small>`;
    $('img', d).onerror = () => d.remove(); tilt(d); $('#cats').appendChild(d); $$('.kit.ct', $('#cats')).slice(GATOS.length + 12).forEach(x => x.remove());
    if (window.burst) { const r = $('.cat-btn').getBoundingClientRect(); burst(r.left + r.width / 2, r.top); } };
  $$('.tab:not(.cat-btn)').forEach(b => b.onclick = () => { $$('.tab:not(.cat-btn)').forEach(x => x.classList.toggle('on', x === b)); $$('.tp').forEach(p => p.classList.toggle('on', p.id === b.dataset.t)); });

  let loaded = false; const sec = $('#secret'), hob = $('#hob');
  sec.onclick = e => { const open = hob.classList.toggle('open'); sec.setAttribute('aria-expanded', open); sec.lastChild.textContent = open ? ' fechar a bancada' : ' psiu… tem mais coisa escondida aqui';
    if (open) { if (!loaded) { loaded = true; load(); } if (window.burst) burst(e.clientX, e.clientY); setTimeout(() => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250); } };
})();
