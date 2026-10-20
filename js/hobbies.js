(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  /* ===== EDITE AQUI ===== */
  // Pokémon: números da Pokédex (os dados vêm da PokéAPI)
  const POKEMON = [25, 6, 94, 149, 448, 150, 133, 143];
  /* ======================= */
  const COR = { fire: '#f97316', water: '#3b82f6', grass: '#22c55e', electric: '#facc15', psychic: '#ec4899', ice: '#67e8f9', dragon: '#6366f1', dark: '#6b7280', fairy: '#f9a8d4', fighting: '#ef4444', poison: '#a855f7', ground: '#d4a24c', flying: '#93c5fd', bug: '#84cc16', rock: '#a8a29e', ghost: '#7c3aed', steel: '#94a3b8', normal: '#d1d5db' };
  const SIGLA = { hp: 'HP', attack: 'ATK', defense: 'DEF', 'special-attack': 'SP.ATK', 'special-defense': 'SP.DEF', speed: 'SPD' };
  $('#mechs').innerHTML = `<div class="mech-display"><div class="city-frame"><div class="city-label"><span>SIMULAÇÃO URBANA</span><span>ARENA 01 · AO VIVO</span></div><div class="city-viewport" id="mech-scene" role="img" aria-label="Cidade 3D com dois robôs mech batalhando"></div><div class="scene-caption"><span><i class="signal-dot"></i> CONFRONTO EM ANDAMENTO</span><span>USE OS JOYSTICKS PARA CONTROLAR</span></div></div><div class="joysticks"><div class="joystick-control" data-robot="0"><span class="joystick-name">MECH AZUL</span><div class="joystick" role="group" aria-label="Controle do mech azul. Use as setas para mover." tabindex="0"><span class="joy-base"><span class="joy-knob"></span></span></div><span class="joy-value visually-hidden" aria-live="polite">Controle 1 centralizado</span><small>movimento</small></div><div class="joystick-control" data-robot="1"><span class="joystick-name">MECH LARANJA</span><div class="joystick" role="group" aria-label="Controle do mech laranja. Use as setas para mover." tabindex="0"><span class="joy-base"><span class="joy-knob"></span></span></div><span class="joy-value visually-hidden" aria-live="polite">Controle 2 centralizado</span><small>movimento</small></div></div></div>`;
  $('#pk').innerHTML = POKEMON.map(id => `<div class="pk" data-id="${id}" tabindex="0" role="button"><div class="pi"><div class="pf"><img loading="lazy" alt="" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png"><b>#${String(id).padStart(3, '0')}</b></div><div class="pb">carregando…</div></div></div>`).join('');


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

  $$('.tab').forEach(b => b.onclick = () => { $$('.tab').forEach(x => { const active=x===b; x.classList.toggle('on',active); x.setAttribute('aria-selected',String(active)); }); $$('.tp').forEach(p => p.classList.toggle('on', p.id === b.dataset.t)); if (b.dataset.t === 'mechs') startMechScene(); syncMechRendering(); });
  $$('.tab').forEach((tab,index,tabs)=>tab.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length;tabs[next].focus();tabs[next].click();}));

  let loaded = false; const sec = $('#secret'), hob = $('#hob');
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let sceneStarted=false,sceneVisible=false,frameHandle=null,renderScene=()=>{};
  function syncMechRendering(){const canRender=sceneStarted&&sceneVisible&&hob.classList.contains('open')&&$('#mechs')?.classList.contains('on')&&!document.hidden;if(canRender&&reducedMotion){renderScene();return;}if(canRender&&frameHandle===null)frameHandle=requestAnimationFrame(animateScene);else if(!canRender&&frameHandle!==null){cancelAnimationFrame(frameHandle);frameHandle=null;}}
  function animateScene(){frameHandle=null;if(!sceneStarted||!sceneVisible||!hob.classList.contains('open')||!$('#mechs')?.classList.contains('on')||document.hidden)return;renderScene();frameHandle=requestAnimationFrame(animateScene);}
  document.addEventListener('visibilitychange',syncMechRendering);
  sec.onclick = e => { const open = hob.classList.toggle('open'); sec.setAttribute('aria-expanded', open); sec.lastChild.textContent = open ? ' fechar a bancada' : ' psiu… tem mais coisa escondida aqui';
    if (open) { if (!loaded) { loaded = true; load(); } startMechScene(); if (window.burst) burst(e.clientX, e.clientY); setTimeout(() => sec.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250); } else syncMechRendering(); };

  async function startMechScene() {
    if (sceneStarted || !$('#mech-scene') || !hob.classList.contains('open')) return;
    sceneStarted = true;
    try {
      const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
      const host = $('#mech-scene'), scene = new THREE.Scene(); scene.background = new THREE.Color('#111a28'); scene.fog = new THREE.Fog('#111a28', 18, 48);
      const camera = new THREE.PerspectiveCamera(34, 1, .1, 100); camera.position.set(10, 11, 15); camera.lookAt(0, 1.2, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15; host.appendChild(renderer.domElement);
      scene.add(new THREE.HemisphereLight('#cdeaff', '#263244', 2)); const sun = new THREE.DirectionalLight('#fff0d2', 3.2); sun.position.set(-7, 14, 8); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); scene.add(sun);
      const mat = (color, roughness = .8, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(38, 38), mat('#303b46')); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
      const grid = new THREE.GridHelper(38, 38, '#637483', '#465563'); grid.position.y = .015; grid.material.transparent = true; grid.material.opacity = .38; scene.add(grid);
      const box = (w,h,d,material,x,y,z,parent=scene) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material); m.position.set(x,y,z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };
      const colors = ['#435362','#58616c','#394b59','#665d55','#4a5b68'], windows=[];
      for (let x=-14; x<=14; x+=3.5) for (let z=-13; z<=13; z+=3.5) { if (Math.abs(x)<5 && Math.abs(z)<5) continue; const h=2+Math.random()*5.5, w=1.8+Math.random()*1.2, d=1.8+Math.random()*1.2; box(w,h,d,mat(colors[Math.floor(Math.random()*colors.length)]),x,h/2,z); for(let yy=1;yy<h-.4;yy+=1.5) for(let xx=-w/2+.4;xx<w/2-.2;xx+=.8) windows.push([x+xx,yy,z+d/2+.025]); }
      const windowMesh=new THREE.InstancedMesh(new THREE.BoxGeometry(.25,.38,.035),mat('#d6c99d',.35,.15),windows.length), windowTransform=new THREE.Object3D(); windows.forEach(([x,y,z],i)=>{windowTransform.position.set(x,y,z);windowTransform.updateMatrix();windowMesh.setMatrixAt(i,windowTransform.matrix);}); windowMesh.instanceMatrix.needsUpdate=true; scene.add(windowMesh);
      // Central avenue and painted lane marks.
      box(7,.035,30,mat('#202a33'),0,.035,0); for(let z=-13;z<14;z+=2.4) box(.12,.045,1,mat('#e8c879'),0,.06,z);
      function buildMech(primary, accent) { const root=new THREE.Group(); scene.add(root); const armor=mat(primary,.4,.42), trim=mat(accent,.35,.35), dark=mat('#18232c',.45,.35), glass=mat('#b8f5ff',.22,.65);
        const torso=new THREE.Group(); torso.position.y=1.55; root.add(torso); box(.92,.95,.52,armor,0,0,0,torso); box(.58,.32,.57,trim,0,.1,.03,torso); box(.38,.14,.06,glass,0,.1,.33,torso); box(.34,.32,.38,dark,0,.68,0,torso); box(.48,.22,.34,armor,0,.86,0,torso);
        for(const side of [-1,1]) { const arm=new THREE.Group(); arm.position.set(side*.68,.28,0); torso.add(arm); box(.3,.68,.34,armor,0,-.22,0,arm); box(.34,.2,.38,trim,0,-.05,0,arm); box(.28,.32,.3,dark,0,-.67,.06,arm); const leg=new THREE.Group(); leg.position.set(side*.27,.92,0); root.add(leg); box(.38,.7,.42,armor,0,-.32,0,leg); box(.48,.22,.62,dark,0,-.72,.12,leg); leg.userData.side=side; root.userData.legs ||= []; root.userData.legs.push(leg); arm.userData.side=side; root.userData.arms ||= []; root.userData.arms.push(arm); }
        box(.12,.48,.12,trim,.52,1.6,.05,torso); box(.16,.16,.16,trim,.52,1.91,.05,torso); root.userData.torso=torso; root.userData.primary=primary; return root; }
      const bots=[buildMech('#2c9fc5','#91efff'),buildMech('#d46e35','#ffd28a')]; bots[0].position.set(-2,0,0); bots[0].rotation.y=.55; bots[1].position.set(2,0,-1); bots[1].rotation.y=-2.35;
      const controls=[{x:0,y:0},{x:0,y:0}], joysticks=$$('.joystick');
      joysticks.forEach((joy,i)=>{const knob=$('.joy-knob',joy),value=$('.joy-value',joy),set=(x,y)=>{const lim=joy.clientWidth*.26,len=Math.min(lim,Math.hypot(x,y)),a=Math.atan2(y,x),px=Math.cos(a)*len,py=Math.sin(a)*len;knob.style.transform=`translate(${px}px,${py}px)`;controls[i].x=px/lim;controls[i].y=py/lim;value.textContent=`Controle ${i+1}: ${controls[i].x>.25?'direita':controls[i].x<-.25?'esquerda':''}${Math.abs(controls[i].x)>.25&&Math.abs(controls[i].y)>.25?' e ':''}${controls[i].y>.25?'para baixo':controls[i].y<-.25?'para cima':''}`;syncMechRendering();};joy.addEventListener('pointerdown',e=>{joy.setPointerCapture(e.pointerId);const r=joy.getBoundingClientRect();set(e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2)});joy.addEventListener('pointermove',e=>{if(joy.hasPointerCapture(e.pointerId)){const r=joy.getBoundingClientRect();set(e.clientX-r.left-r.width/2,e.clientY-r.top-r.height/2)}});const reset=()=>set(0,0);joy.addEventListener('pointerup',reset);joy.addEventListener('pointercancel',reset);joy.addEventListener('keydown',e=>{const step=e.shiftKey ? 1 : 0.38,lim=joy.clientWidth*.26;let x=0,y=0;if(e.key==='ArrowLeft')x=-step;else if(e.key==='ArrowRight')x=step;else if(e.key==='ArrowUp')y=-step;else if(e.key==='ArrowDown')y=step;else if(e.key===' '||e.key==='Escape'){}else return;e.preventDefault();set(x*lim,y*lim);});joy.addEventListener('keyup',e=>{if(e.key.startsWith('Arrow')){e.preventDefault();reset();}}); });
      const clock=new THREE.Clock();
      function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();syncMechRendering();} new ResizeObserver(resize).observe(host); resize();
      renderScene=()=>{const t=reducedMotion?0:clock.getElapsedTime();bots.forEach((bot,i)=>{const c=controls[i];bot.position.x+=c.x*.018;bot.position.z+=c.y*.018;bot.position.x=THREE.MathUtils.clamp(bot.position.x,-4,4);bot.position.z=THREE.MathUtils.clamp(bot.position.z,-3,4);if(Math.hypot(c.x,c.y)>.08)bot.rotation.y=Math.atan2(c.x,c.y)+(i?Math.PI:0);bot.position.y=reducedMotion?0:Math.abs(Math.sin(t*4+i))*.045;bot.userData.legs.forEach((leg,j)=>leg.rotation.x=reducedMotion?0:Math.sin(t*4+i+j*Math.PI)*.12);bot.userData.arms.forEach((arm,j)=>arm.rotation.x=reducedMotion?0:Math.sin(t*3+i+j)*.12+(j===i?-.55:.12));bot.userData.torso.rotation.z=reducedMotion?0:Math.sin(t*2+i)*.025;});renderer.render(scene,camera);};
      const visibilityObserver=new IntersectionObserver(entries=>{sceneVisible=entries[0].isIntersecting;syncMechRendering();},{threshold:.05});visibilityObserver.observe(host);sceneVisible=host.getBoundingClientRect().bottom>0&&host.getBoundingClientRect().top<innerHeight;syncMechRendering();
    } catch (err) { const host=$('#mech-scene'); if(host)host.innerHTML='<p class="scene-error">Não foi possível carregar a cena 3D. Verifique a conexão e tente novamente.</p>'; sceneStarted=false; }
  }
})();
