document.addEventListener('DOMContentLoaded', () => {
  const card = document.getElementById('reflexcard'); if (!card) return;
  ['rc-foil', 'rc-glare'].forEach(c => card.appendChild(Object.assign(document.createElement('div'), { className: c })));
  const root = document.documentElement, clamp = (v, a) => Math.max(-a, Math.min(a, v)) / a;
  let tx = 0, ty = 0, x = 0, y = 0, last = 0, gyro = false;
  const aim = (nx, ny) => { tx = nx; ty = ny; last = performance.now(); };

  addEventListener('mousemove', e => aim(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1));
  const onOri = e => { if (e.gamma == null) return; gyro = true; aim(clamp(e.gamma, 40), clamp((e.beta || 0) - 45, 40)); };

  if (window.DeviceOrientationEvent) {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {   // iOS exige permissão
      const b = Object.assign(document.createElement('button'), { className: 'gyro-btn', textContent: '✦ Ativar giroscópio' });
      b.onclick = () => DeviceOrientationEvent.requestPermission().then(r => { if (r === 'granted') { addEventListener('deviceorientation', onOri); b.remove(); } }).catch(() => {});
      document.getElementById('welcome-section').appendChild(b);
    } else addEventListener('deviceorientation', onOri);
  }

  (function loop(t) {
    if (performance.now() - last > 2500) { tx = Math.sin(t / 1800) * .5; ty = Math.cos(t / 2300) * .35; }  // flutua sozinho
    x += (tx - x) * .08; y += (ty - y) * .08;
    const s = card.style;
    s.setProperty('--rx', (-y * 14).toFixed(2)); s.setProperty('--ry', (x * 18).toFixed(2));
    s.setProperty('--mx', (50 + x * 50).toFixed(1) + '%'); s.setProperty('--my', (50 + y * 50).toFixed(1) + '%');
    if (gyro) { root.style.setProperty('--gx', (50 + x * 50).toFixed(1) + '%'); root.style.setProperty('--gy', (50 + y * 50).toFixed(1) + '%'); }
    requestAnimationFrame(loop);
  })(0);
});
