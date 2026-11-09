// Copertina del Reel: un fotogramma del video, pulito (senza sottotitoli e barra), con il soggetto centrato
// nella zona che resta visibile nella griglia del profilo (3:4, y 240–1680).
// Uso: node cover.js <secondo> [spostamentoY=0] [zoom=1] [out=cover.jpg]
const { chromium } = require('playwright');
(async () => {
  const [t, dy = 0, z = 1, out = 'cover.jpg'] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await p.goto('file://' + __dirname + '/engine.html');
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(([t, dy, z]) => {
    render(t);
    for (const id of ['cap', 'prog']) { const n = document.getElementById(id); if (n) n.style.visibility = 'hidden'; }
    const cam = document.getElementById('cam');
    cam.style.transform = (cam.style.transform || '') + ` translateY(${dy}px) scale(${z})`;
  }, [Number(t), Number(dy), Number(z)]);
  await p.screenshot({ path: out.startsWith('/') ? out : __dirname + '/' + out, type: 'jpeg', quality: 92 });
  // anteprima di come appare nella griglia del profilo (ritaglio 3:4 centrale)
  await b.close();
})();
