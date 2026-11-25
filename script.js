/* ============================================================
   SIMÕES AI DESIGN — Comportamento do site
   Conteúdo editável fica no localStorage (sem servidor).
   ============================================================ */

/* ================= DADOS PADRÃO ================= */
const DEFAULTS = {
  settings: {
    brand: 'Simões',
    sub: 'AI DESIGN',
    heroSub: 'Desenvolvimento Web & Design com IA',
    heroT: 'SIMÕES.AI',
    city: 'Santo Antônio de Jesus BA',
    foot: 'Tecnologia que transforma negócios. Design, código e estratégia sob medida.',
    i1: 'NÃO CRIAMOS APENAS SITES.',
    i2: 'CRIAMOS PRESENÇA DIGITAL.',
    ip: 'Da primeira conversa até o site no ar, cada etapa existe para a sua marca ser vista, entendida e escolhida.',
    ft: 'TRÊS FORÇAS QUE TRABALHAM JUNTAS — PORQUE DESIGN SEM ESTRATÉGIA É ENFEITE, E CÓDIGO SEM DESIGN É SÓ TEXTO NA TELA.',
    pt: 'DO ZERO AO DIGITAL.',
    prjT: 'FEITO PELA SIMÕES.',
    rt: 'QUATRO MOTIVOS PARA ESCOLHER.',
    ct: 'VAMOS CRIAR ALGO?',
    cp: 'Seu próximo projeto pode começar aqui. Conta o que você tem em mente — a gente responde com um caminho, não com um orçamento genérico.',
    wa: '5571997210529',
    email: 'Vitor75simoes@gmail.com',
    ig: '@simoes.ai'
  },
  cards: [
    { n: '01', t: 'DESIGN', d: 'Interfaces pensadas para comunicar, envolver e converter. Direção de arte, identidade aplicada à tela e hierarquia visual que conduz o olhar até a ação.', k: ['UI/UX', 'DESIGN SYSTEM', 'DIREÇÃO DE ARTE', 'MOTION'] },
    { n: '02', t: 'DESENVOLVIMENTO', d: 'Código moderno para experiências rápidas, responsivas e eficientes. Next.js, animações performáticas e uma base limpa que aguenta crescer junto com o negócio.', k: ['NEXT.JS', 'REACT', 'PERFORMANCE', 'SEO TÉCNICO'] },
    { n: '03', t: 'ESTRATÉGIA', d: 'Cada detalhe pensado para aproximar sua marca dos seus clientes. Antes do primeiro pixel: quem é o público, o que precisa acontecer e como medir os acertos.', k: ['ARQUITETURA', 'MÉTRICAS', 'COPY & NARRATIVA', 'CONVERSÃO'] }
  ],
  process: [
    { n: '01', t: 'CONVERSA', d: 'Entendemos seu negócio, seus objetivos e o que precisa acontecer no site.' },
    { n: '02', t: 'ESTRATÉGIA', d: 'Definimos arquitetura, público, mensagem e jornada de conversão.' },
    { n: '03', t: 'DESIGN', d: 'Criamos a direção visual, protótipo e sistema de componentes.' },
    { n: '04', t: 'DESENVOLVIMENTO', d: 'Codificamos com foco em performance, SEO e experiência.' },
    { n: '05', t: 'LANÇAMENTO', d: 'Testamos, otimizamos e publicamos o projeto no domínio oficial.' },
    { n: '06', t: 'NO AR', d: 'Acompanhamento contínuo, ajustes e evolução do site.' }
  ],
  projects: [
    { nome: 'Vila Bohêmia', cat: 'SITE · 2024', desc: 'Reserva de mesa, cardápio, galeria e agenda de eventos — com a rota do Google logo na entrada.', tags: ['RESERVAS', 'CARDÁPIO', 'EVENTOS'], foto: 'assets/vila-bohemia.webp', link: '' },
    { nome: 'Pink Store', cat: 'E-COMMERCE · 2024', desc: 'Loja de moda feminina vendendo para o Brasil inteiro. Vitrine, tabela de tamanhos e carrinho direto no WhatsApp.', tags: ['VITRINE', 'CATÁLOGO', 'CONVERSÃO'], foto: 'assets/pink-store.webp', link: '' },
    { nome: 'EdyBikes', cat: 'SITE · 2024', desc: 'Oficina de bikes e e-bikes em Novaes: serviços, vitrine de produtos e prova social com a nota 5.0 do Google.', tags: ['OFICINA', 'E-BIKES', 'GOOGLE'], foto: 'assets/edybikes.webp', link: '' },
    { nome: 'Mari Sanches Beauty', cat: 'EDITORIAL · 2024', desc: 'Cabelo e maquiagem num site em formato de editorial, com o agendamento a um toque de qualquer seção.', tags: ['EDITORIAL', 'PORTFÓLIO', 'AGENDAMENTO'], foto: 'assets/mari-sanches.webp', link: '' },
    { nome: 'Marlon Inkk', cat: 'Studio de tatuagem · 2026', desc: 'Projeto feito sob medida para o cliente.', tags: ['TATUAGEM', 'STUDIO'], foto: 'assets/marlon-inkk.jpg', link: 'http://marlon-innk-portfolio.netlify.app/' }
  ],
  reasons: [
    { n: '01', t: 'MODERNO.', d: 'Visual, texto e visual construídos em cima do seu negócio — não de um modelo pronto.' },
    { n: '02', t: 'RÁPIDO.', d: 'Performance não é detalhe técnico: site lento perde cliente antes de mostrar o preço.' },
    { n: '03', t: 'PERSONALIZADO.', d: 'Nada de template. Cada projeto nasce com a cara da sua marca.' },
    { n: '04', t: 'ESTRATÉGICO.', d: 'Design é o meio. O site existe pra tocar contato, venda ou agendamento.' }
  ]
};

const STORE_KEY = 'simoes-ai-design:content:v1';
const PASS_KEY = 'simoes-ai-design:password:v1';
const DEFAULT_PASS = 'simoes2026';

let S, CARDS, PROCESS, PROJS, REASONS;
let ADMIN_PASS = null;
let apiOnline = false;
let io = null;
let revealsOn = false;

const clone = obj => JSON.parse(JSON.stringify(obj));
const $ = id => document.getElementById(id);

function useContent(d) {
  S = { ...clone(DEFAULTS.settings), ...(d?.settings || {}) };
  CARDS = d?.cards || clone(DEFAULTS.cards);
  PROCESS = d?.process || clone(DEFAULTS.process);
  PROJS = d?.projects || clone(DEFAULTS.projects);
  REASONS = d?.reasons || clone(DEFAULTS.reasons);
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}
function getPass() {
  try { return localStorage.getItem(PASS_KEY) || DEFAULT_PASS; }
  catch (e) { return DEFAULT_PASS; }
}
async function load() {
  if (!/^https?:$/.test(location.protocol)) {
    apiOnline = false;
    return readStored();
  }
  try {
    const r = await fetch('/api/content', { cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    const data = await r.json();
    apiOnline = true;
    return data?.content || null;
  } catch (e) {
    // Sem backend (file:// ou hospedagem estática): usa o modo local.
    apiOnline = false;
    return readStored();
  }
}
const contentReady = load();

/* ================= HELPERS ================= */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const safeUrl = u => {
  const s = String(u || '').trim();
  return /^(javascript:|data:|vbscript:)/i.test(s) ? '' : s;
};
const img = u => safeUrl(u);
function hl(text, re) {
  return esc(text).replace(re, m => '<span class="blue">' + m + '</span>');
}

async function api(method, url, body, password = ADMIN_PASS) {
  const r = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': password || ''
    },
    body: body ? JSON.stringify(body) : undefined
  });
  let data = {};
  try { data = await r.json(); } catch (e) { /* resposta sem JSON */ }
  if (!r.ok) {
    const err = new Error(data.error || 'Erro ' + r.status);
    err.status = r.status;
    throw err;
  }
  return data;
}

/* ================= RENDER ================= */
function apply() {
  $('brandName').textContent = S.brand;
  $('footBrand').textContent = S.brand;
  $('brandSub').textContent = S.sub;
  $('footSub').textContent = S.sub;
  $('heroSub').textContent = S.heroSub;
  $('heroTitle').innerHTML = esc(S.heroT).replace(/\.(ai)/i, '<span class="dot">.</span>$1');
  $('tagLoc').textContent = S.city.toUpperCase();
  $('footDesc').textContent = S.foot;
  $('impactH1').innerHTML = esc(S.i1) + '<br><span class="blue">' + esc(S.i2) + '</span>';
  $('impactP').textContent = S.ip;
  $('forcesTitle').innerHTML = hl(S.ft, /PORQUE.*/i);
  $('processTitle').innerHTML = hl(S.pt, /DIGITAL\.?/i);
  $('projTitle').innerHTML = hl(S.prjT, /SIMÕES\.?/i);
  $('reasonsTitle').innerHTML = hl(S.rt, /PARA ESCOLHER\.?|ESCOLHER\.?/i);
  $('ctaTitle').innerHTML = hl(S.ct, /ALGO\??/i);
  $('ctaP').textContent = S.cp;
  $('fCity').textContent = S.city;

  const wa = String(S.wa || '').replace(/\D/g, '');
  const waFmt = wa.replace(/^(\d{2})(\d{2})(\d{4,5})(\d{4})$/, '+$1 ($2) $3-$4');
  $('fWa').textContent = 'WhatsApp: ' + (waFmt || '—');
  $('fWa').href = 'https://wa.me/' + wa;

  $('fEmail').textContent = S.email;
  $('fEmail').href = 'mailto:' + S.email;

  const ig = String(S.ig || '').replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/\/$/, '');
  $('fIg').textContent = S.ig;
  $('fIg').href = 'https://instagram.com/' + encodeURIComponent(ig);

  $('btnWa').href = 'https://wa.me/' + wa + '?text=' + encodeURIComponent('Olá, ' + S.brand + '! Quero começar um projeto.');
  $('btnIg').href = 'https://instagram.com/' + encodeURIComponent(ig);
}

function renderCards() {
  $('cardsGrid').innerHTML = CARDS.map((c, ci) => {
    const k = c.k || [];
    return `
    <div class="card reveal" data-card="${ci}">
      <div class="num">${esc(c.n)}</div>
      <h3>${esc(c.t)}</h3>
      <p>${esc(c.d)}</p>
      <div class="visual" aria-hidden="true">
        <div class="orbitScene">
          <div class="orbitGlow"></div>
          <div class="orbitRing"></div>
          <div class="orbitRing two"></div>
          <div class="orbitCore"></div>
          ${k.map(x => `<div class="satellite"><span class="satDot"></span><span class="satLabel">${esc(x)}</span></div>`).join('')}
        </div>
      </div>
    </div>`;
  }).join('');
}

/* Órbitas com profundidade: escala, opacidade e ordem mudam conforme a posição */
let orbitRAF = null;
let orbits = [];
let orbitsVisible = true;

function setupOrbits() {
  if (orbitRAF) cancelAnimationFrame(orbitRAF);
  orbits = [...document.querySelectorAll('#cardsGrid .card')].map((card, ci) => {
    const visual = card.querySelector('.visual');
    return {
      sats: [...card.querySelectorAll('.satellite')],
      speed: 0.00024 + ci * 0.000045,
      phase: ci * 1.15,
      dir: ci === 1 ? -1 : 1,
      rx: Math.max(80, Math.min(124, visual.clientWidth * 0.36)),
      ry: 33
    };
  });

  if (reduceMotion) {
    drawOrbits(0, true);
    return;
  }
  const loop = t => {
    if (orbitsVisible) drawOrbits(t, false);
    orbitRAF = requestAnimationFrame(loop);
  };
  orbitRAF = requestAnimationFrame(loop);
}

function drawOrbits(t, staticMode) {
  orbits.forEach(o => {
    const n = o.sats.length || 1;
    o.sats.forEach((s, i) => {
      const a = staticMode
        ? (i / n) * Math.PI * 2 + o.phase
        : t * o.speed * o.dir + o.phase + (i / n) * Math.PI * 2;
      const x = Math.cos(a) * o.rx;
      const y = Math.sin(a) * o.ry;
      const depth = (Math.sin(a) + 1) / 2; // 0 = atrás, 1 = na frente
      const scale = 0.72 + depth * 0.38;
      const opacity = 0.32 + depth * 0.68;
      s.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      s.style.opacity = opacity.toFixed(3);
      s.style.zIndex = String(Math.round(depth * 10) + 1);
    });
  });
}

new IntersectionObserver(entries => {
  orbitsVisible = entries[0].isIntersecting;
}, { threshold: 0 }).observe($('cardsGrid'));

function renderProcess() {
  $('processTrack').innerHTML = PROCESS.map(p => `
    <div class="step reveal">
      <div class="n">${esc(p.n)}</div>
      <h4>${esc(p.t)}</h4>
      <p>${esc(p.d)}</p>
    </div>`).join('');
}

function renderProjs() {
  $('projGrid').innerHTML = PROJS.map(p => {
    const src = img(p.foto);
    const link = safeUrl(p.link);
    return `
    <article class="proj reveal">
      <div class="thumb">
        ${src ? `<img src="${esc(src)}" alt="${esc(p.nome)}" loading="lazy" onerror="this.style.display='none'">` : ''}
        <span class="cat">${esc(p.cat)}</span>
      </div>
      <div class="body">
        <h3>${esc(p.nome)}</h3>
        <p class="desc">${esc(p.desc)}</p>
        <div class="tags">${(p.tags || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>
        ${link ? `<a class="link" href="${esc(link)}" target="_blank" rel="noopener">ABRIR SITE →</a>`
               : `<a class="link" href="#contato">QUERO UM ASSIM →</a>`}
      </div>
    </article>`;
  }).join('');
}

function renderReasons() {
  $('reasonsGrid').innerHTML = REASONS.map(r => `
    <div class="reason reveal">
      <div class="n">${esc(r.n)}</div>
      <h3>${esc(r.t)}</h3>
      <p>${esc(r.d)}</p>
    </div>`).join('');
}

function renderAll() {
  apply();
  renderCards();
  setupOrbits();
  renderProcess();
  renderProjs();
  renderReasons();
  observeReveals();
}

/* ================= PRELOADER ================= */
const canvas = $('pCanvas');
const ctx = canvas.getContext('2d');

// nós da logo "S" em rede (mesmo desenho do site original)
const LOGO_P = [
  [927, 429], [1172, 453], [1047, 532], [760, 508], [861, 561], [724, 636], [988, 654], [768, 736],
  [1044, 764], [1177, 768], [948, 842], [1056, 897], [1196, 901], [1125, 982], [748, 1006], [980, 1021],
  [970, 582], [909, 723], [1126, 724], [945, 888]
];
const LOGO_NODES = 16;
const LOGO_E = [
  [0, 1], [0, 3], [0, 4], [0, 2], [4, 1], [1, 2], [2, 16], [3, 4], [3, 5], [3, 7], [4, 5], [4, 6], [4, 17], [17, 10],
  [5, 7], [5, 10], [7, 17], [17, 8], [6, 17], [6, 8], [6, 18], [18, 9], [18, 8], [8, 9], [8, 10], [8, 11], [10, 11], [7, 10],
  [9, 11], [9, 12], [9, 13], [11, 12], [11, 13], [12, 13], [11, 15], [11, 14], [14, 19], [14, 15], [15, 13]
].map(([a, b]) => ({ a, b, my: (LOGO_P[a][1] + LOGO_P[b][1]) / 2 }));
LOGO_E.slice().sort((x, y) => x.my - y.my).forEach((e, i) => e.ord = i);
const NP = LOGO_P.map(([x, y]) => [(x - 960) / 592, (y - 725) / 592]);

const T_FLY = 1700, T_LINES = 1350, T_TEXT = 2250, T_MIN_TOTAL = 3900;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let W = 0, H = 0, LS = 0, LX = 0, LY = 0, parts = [], ambient = [], pulses = [], lastPulse = 0;
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeBack = t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

function layout() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth;
  H = innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const textH = $('pText').offsetHeight || 150;
  const gap = Math.max(18, H * .035);
  LS = Math.min(H * .42, (W * .62) / .8, 420);
  if (LS + gap + textH > H * .9) LS = Math.max(140, H * .9 - gap - textH);
  const top = (H - (LS + gap + textH)) / 2;
  LX = W / 2;
  LY = top + LS / 2;
  $('pText').style.top = (top + LS + gap) + 'px';
}
const sx = n => LX + n * LS;
const sy = n => LY + n * LS;

function buildParticles() {
  parts = [];
  LOGO_E.forEach((e, k) => {
    const [ax, ay] = NP[e.a], [bx, by] = NP[e.b];
    const n = Math.max(3, Math.round(Math.hypot(bx - ax, by - ay) * LS / 7));
    for (let i = 0; i <= n; i++) parts.push({ e: k, u: i / n, node: -1 });
  });
  for (let i = 0; i < LOGO_NODES; i++) {
    for (let j = 0; j < 7; j++) parts.push({ e: -1, node: i, jx: rnd(-.05, .05), jy: rnd(-.05, .05) });
  }
  parts.forEach(p => {
    p.sx = rnd(-.15, 1.15);
    p.sy = rnd(-.15, 1.15);
    p.delay = rnd(0, 450);
    p.dur = rnd(900, T_FLY - p.delay - 80);
    p.swirl = rnd(-.45, .45);
    p.r = rnd(.8, 1.8);
    p.blue = Math.random() < .55;
  });
  ambient = Array.from({ length: Math.round(Math.min(90, W * H / 14000)) }, () => ({
    x: Math.random(), y: Math.random(), vx: rnd(-.00004, .00004), vy: rnd(-.00004, .00004), r: rnd(.4, 1.3), a: rnd(.15, .45)
  }));
}

const edgeProgress = (e, t) => clamp01((t - T_LINES - e.ord * (650 / LOGO_E.length)) / 380);
const nodeProgress = (i, t) => clamp01((t - 1250 - (NP[i][1] + .5) * 500) / 500);

let pStart = 0, pDone = false, textShown = false;
function hidePreloader() {
  $('preloader').classList.add('hide');
  revealsOn = true;
  observeReveals();
  setTimeout(() => { pDone = true; $('preloader')?.remove(); }, 900);
}

function drawP(now) {
  if (pDone) return;
  if (!pStart) pStart = now - (reduceMotion ? T_TEXT : 0);
  const t = now - pStart;
  ctx.clearRect(0, 0, W, H);

  ambient.forEach(d => {
    d.x = (d.x + d.vx * 16 + 1) % 1;
    d.y = (d.y + d.vy * 16 + 1) % 1;
    ctx.fillStyle = `rgba(154,164,178,${d.a})`;
    ctx.fillRect(d.x * W, d.y * H, d.r, d.r);
  });

  ctx.lineCap = 'round';
  const lw = Math.max(1, LS / 360);
  LOGO_E.forEach(e => {
    const pr = edgeProgress(e, t);
    if (!pr) return;
    const ax = sx(NP[e.a][0]), ay = sy(NP[e.a][1]);
    const bx = sx(NP[e.b][0]), by = sy(NP[e.b][1]);
    const k = easeIO(pr);
    ctx.strokeStyle = `rgba(47,107,255,${.85 * k})`;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax + (bx - ax) * k, ay + (by - ay) * k);
    ctx.stroke();
  });

  parts.forEach(p => {
    let tx, ty, fade = 1;
    if (p.e >= 0) {
      const e = LOGO_E[p.e], [ax, ay] = NP[e.a], [bx, by] = NP[e.b];
      tx = sx(ax + (bx - ax) * p.u);
      ty = sy(ay + (by - ay) * p.u);
      fade = 1 - edgeProgress(e, t) * .8;
    } else {
      const c = 1 - easeIO(nodeProgress(p.node, t));
      tx = sx(NP[p.node][0] + p.jx * c);
      ty = sy(NP[p.node][1] + p.jy * c);
      fade = c;
    }
    const ox = p.sx * W, oy = p.sy * H;
    const k = easeIO(clamp01((t - p.delay) / p.dur));
    const dx = tx - ox, dy = ty - oy, arc = Math.sin(Math.PI * k) * p.swirl;
    const x = ox + dx * k - dy * arc;
    const y = oy + dy * k + dx * arc;
    const a = Math.min(1, t / 350) * (k < 1 ? .55 + .45 * k : 1) * fade;
    if (a < .02) return;
    ctx.fillStyle = p.blue ? `rgba(77,130,255,${a})` : `rgba(205,211,220,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, p.r * (k < 1 ? 1 : .85), 0, 6.283);
    ctx.fill();
  });

  if (t > T_TEXT && !reduceMotion && now - lastPulse > 140) {
    lastPulse = now;
    const e = LOGO_E[(Math.random() * LOGO_E.length) | 0];
    pulses.push(Math.random() < .5 ? { a: e.a, b: e.b, s: now } : { a: e.b, b: e.a, s: now });
  }
  pulses = pulses.filter(q => now - q.s < 650);
  pulses.forEach(q => {
    const k = (now - q.s) / 650;
    const x = sx(NP[q.a][0] + (NP[q.b][0] - NP[q.a][0]) * k);
    const y = sy(NP[q.a][1] + (NP[q.b][1] - NP[q.a][1]) * k);
    const g = ctx.createRadialGradient(x, y, 0, x, y, lw * 7);
    g.addColorStop(0, `rgba(140,175,255,${.9 * Math.sin(Math.PI * k)})`);
    g.addColorStop(1, 'rgba(47,107,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, lw * 7, 0, 6.283);
    ctx.fill();
  });

  const R = Math.max(3.2, LS * .0165);
  for (let i = 0; i < LOGO_NODES; i++) {
    const pr = nodeProgress(i, t);
    if (!pr) continue;
    const x = sx(NP[i][0]), y = sy(NP[i][1]);
    const breathe = t > T_TEXT ? 1 + .06 * Math.sin((t - T_TEXT) / 420 + i) : 1;
    const r = R * easeBack(pr) * breathe;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3.2);
    g.addColorStop(0, `rgba(77,130,255,${.35 * pr})`);
    g.addColorStop(1, 'rgba(77,130,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 3.2, 0, 6.283);
    ctx.fill();
    ctx.fillStyle = `rgba(196,201,209,${pr})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 6.283);
    ctx.fill();
  }

  if (t >= T_TEXT && !textShown) {
    textShown = true;
    $('pText').classList.add('show');
    Promise.all([contentReady, new Promise(r => setTimeout(r, Math.max(1200, T_MIN_TOTAL - t)))])
      .then(hidePreloader);
  }
  requestAnimationFrame(drawP);
}

layout();
buildParticles();
addEventListener('resize', () => { if (!pDone) layout(); });
if (reduceMotion) {
  $('pText').classList.add('show');
  hidePreloader();
} else {
  requestAnimationFrame(drawP);
}

/* ================= REVEAL ================= */
function observeReveals() {
  if (!revealsOn) return;
  io = io || new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }), { threshold: 0 });
  document.querySelectorAll('.reveal:not(.in)').forEach(el => io.observe(el));
}

// Garante que nada fique invisível se a pessoa rolar a página muito rápido.
let scrollTick = false;
addEventListener('scroll', () => {
  if (!revealsOn || scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(() => {
    document.querySelectorAll('.reveal:not(.in)').forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight * .95) {
        el.classList.add('in');
        io?.unobserve(el);
      }
    });
    scrollTick = false;
  });
}, { passive: true });

/* ================= NAVEGAÇÃO ================= */
function toggleMenu() {
  const open = $('menu').classList.toggle('open');
  document.querySelector('.burger').setAttribute('aria-expanded', String(open));
}
document.querySelectorAll('#menu a').forEach(a => a.addEventListener('click', () => {
  $('menu').classList.remove('open');
  document.querySelector('.burger').setAttribute('aria-expanded', 'false');
}));

/* ================= ADMIN ================= */
function openAdmin() {
  $('adminModal').classList.add('show');
  $('adminMode').textContent = apiOnline
    ? 'As alterações ficam visíveis para todos os visitantes do site.'
    : 'Modo local: as alterações ficam salvas apenas neste navegador.';
  if (ADMIN_PASS) {
    $('adminLogin').style.display = 'none';
    $('adminBody').style.display = 'block';
    renderAdmin();
    return;
  }
  $('adminLogin').style.display = 'block';
  $('adminBody').style.display = 'none';
  setTimeout(() => $('adminPass').focus(), 50);
}
function closeAdmin() { $('adminModal').classList.remove('show'); }
addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeAdmin();
    $('menu').classList.remove('open');
  }
});
$('adminModal').addEventListener('click', e => { if (e.target.id === 'adminModal') closeAdmin(); });

async function tryAdmin() {
  const pass = $('adminPass').value;
  if (!pass) { toast('⚠️ Digite a senha'); return; }
  const b = $('btnLogin');
  b.disabled = true;
  try {
    if (apiOnline) {
      await api('POST', '/api/admin/login', null, pass);
    } else if (pass !== getPass()) {
      const err = new Error('Senha incorreta');
      err.status = 401;
      throw err;
    }
    ADMIN_PASS = pass;
    $('adminPass').value = '';
    $('adminLogin').style.display = 'none';
    $('adminBody').style.display = 'block';
    renderAdmin();
  } catch (e) {
    ADMIN_PASS = null;
    toast(e.status === 401 ? '❌ Senha incorreta' : '⚠️ Não foi possível conectar');
  } finally {
    b.disabled = false;
  }
}
function tab(id, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  el.classList.add('on');
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
  $(id).classList.add('on');
}

function renderAdmin() {
  const set = (id, v) => { $(id).value = v ?? ''; };
  set('sBrand', S.brand); set('sSub', S.sub); set('sHeroSub', S.heroSub); set('sHeroT', S.heroT);
  set('sCity', S.city); set('sFoot', S.foot);
  set('sI1', S.i1); set('sI2', S.i2); set('sIP', S.ip); set('sFT', S.ft);
  set('sPT', S.pt); set('sPrjT', S.prjT); set('sRT', S.rt); set('sCT', S.ct); set('sCP', S.cp);
  set('sWa', S.wa); set('sEmail', S.email); set('sIg', S.ig); set('sPass', '');

  $('cardsAdmin').innerHTML = CARDS.map((c, i) => `
    <div class="arow" data-i="${i}">
      <input class="cT" value="${esc(c.t)}" placeholder="Título">
      <input class="cD" value="${esc(c.d)}" placeholder="Descrição">
      <input class="cK" value="${esc((c.k || []).join(', '))}" placeholder="Palavras-chave">
      <button class="del" title="Remover" onclick="delCard(${i})">✕</button>
    </div>`).join('');

  $('processAdmin').innerHTML = PROCESS.map((p, i) => `
    <div class="arow" data-i="${i}">
      <input class="pT" value="${esc(p.t)}" placeholder="Título">
      <input class="pD" value="${esc(p.d)}" placeholder="Descrição">
      <input class="pN" value="${esc(p.n)}" placeholder="Número">
      <button class="del" title="Remover" onclick="delProc(${i})">✕</button>
    </div>`).join('');

  $('projAdmin').innerHTML = PROJS.map((p, i) => `
    <div class="projRow" data-i="${i}">
      <div class="arow">
        <input class="prN" value="${esc(p.nome)}" placeholder="Nome">
        <input class="prC" value="${esc(p.cat)}" placeholder="Categoria">
        <button class="del" title="Remover" onclick="delProj(${i})">✕</button>
      </div>
      <div class="arow four">
        <input class="prD" value="${esc(p.desc)}" placeholder="Descrição">
        <input class="prT" value="${esc((p.tags || []).join(', '))}" placeholder="Tags">
        <input class="prF" value="${esc(p.foto)}" placeholder="Imagem">
        <input class="prL" value="${esc(p.link || '')}" placeholder="Link (opcional)">
      </div>
    </div>`).join('');
}

function collectRows() {
  document.querySelectorAll('#cardsAdmin .arow').forEach((r, i) => {
    if (!CARDS[i]) return;
    CARDS[i].t = r.querySelector('.cT').value;
    CARDS[i].d = r.querySelector('.cD').value;
    CARDS[i].k = r.querySelector('.cK').value.split(',').map(x => x.trim()).filter(Boolean);
  });
  document.querySelectorAll('#processAdmin .arow').forEach((r, i) => {
    if (!PROCESS[i]) return;
    PROCESS[i].t = r.querySelector('.pT').value;
    PROCESS[i].d = r.querySelector('.pD').value;
    PROCESS[i].n = r.querySelector('.pN').value;
  });
  document.querySelectorAll('#projAdmin .projRow').forEach((r, i) => {
    if (!PROJS[i]) return;
    PROJS[i].nome = r.querySelector('.prN').value;
    PROJS[i].cat = r.querySelector('.prC').value;
    PROJS[i].desc = r.querySelector('.prD').value;
    PROJS[i].tags = r.querySelector('.prT').value.split(',').map(t => t.trim()).filter(Boolean);
    PROJS[i].foto = r.querySelector('.prF').value;
    PROJS[i].link = r.querySelector('.prL').value;
  });
}
function collectSettings() {
  S.brand = $('sBrand').value;
  S.sub = $('sSub').value;
  S.heroSub = $('sHeroSub').value;
  S.heroT = $('sHeroT').value;
  S.city = $('sCity').value;
  S.foot = $('sFoot').value;
  S.i1 = $('sI1').value;
  S.i2 = $('sI2').value;
  S.ip = $('sIP').value;
  S.ft = $('sFT').value;
  S.pt = $('sPT').value;
  S.prjT = $('sPrjT').value;
  S.rt = $('sRT').value;
  S.ct = $('sCT').value;
  S.cp = $('sCP').value;
  S.wa = $('sWa').value.replace(/\D/g, '') || S.wa;
  S.email = $('sEmail').value;
  S.ig = $('sIg').value;
}
function rerenderAdmin() { collectSettings(); collectRows(); renderAdmin(); }

function delCard(i) { collectRows(); CARDS.splice(i, 1); rerenderAdmin(); }
function delProc(i) { collectRows(); PROCESS.splice(i, 1); rerenderAdmin(); }
function delProj(i) { collectRows(); PROJS.splice(i, 1); rerenderAdmin(); }

function addProj() {
  const nome = $('nPNome').value.trim();
  if (!nome) { toast('⚠️ Nome obrigatório'); return; }
  collectRows();
  collectSettings();
  PROJS.push({
    nome,
    cat: $('nPCat').value || 'SITE · ' + new Date().getFullYear(),
    desc: $('nPDesc').value || '',
    tags: $('nPTags').value.split(',').map(t => t.trim()).filter(Boolean),
    foto: $('nPFoto').value.trim(),
    link: $('nPLink').value.trim()
  });
  ['nPNome', 'nPCat', 'nPDesc', 'nPTags', 'nPFoto', 'nPLink'].forEach(i => $(i).value = '');
  renderAdmin();
  toast('✅ Projeto adicionado — lembre de salvar');
}

async function saveAdmin() {
  collectSettings();
  collectRows();
  const newPassword = $('sPass').value;
  if (newPassword && newPassword.length < 6) {
    toast('⚠️ A nova senha precisa ter ao menos 6 caracteres');
    return;
  }
  const b = $('btnSaveAll');
  b.disabled = true;
  const content = { settings: S, cards: CARDS, process: PROCESS, projects: PROJS, reasons: REASONS };
  try {
    if (apiOnline) {
      await api('PUT', '/api/content', { content, newPassword: newPassword || undefined });
      if (newPassword) ADMIN_PASS = newPassword;
    } else {
      localStorage.setItem(STORE_KEY, JSON.stringify(content));
      if (newPassword) {
        localStorage.setItem(PASS_KEY, newPassword);
        ADMIN_PASS = newPassword;
      }
    }
    renderAll();
    renderAdmin();
    toast(newPassword ? '💾 Alterações e nova senha salvas!' : '💾 Alterações salvas!');
    closeAdmin();
  } catch (e) {
    if (e.status === 401) {
      ADMIN_PASS = null;
      toast('❌ Sessão expirada — entre novamente');
      openAdmin();
    } else {
      toast('⚠️ ' + e.message);
    }
  } finally {
    b.disabled = false;
  }
}

async function resetSite() {
  if (!confirm('Restaurar todo o conteúdo do site para o padrão? A senha não será alterada.')) return;
  try {
    if (apiOnline) {
      await api('DELETE', '/api/content');
    } else {
      localStorage.removeItem(STORE_KEY);
    }
    useContent(null);
    renderAll();
    renderAdmin();
    toast('♻️ Site restaurado ao padrão');
  } catch (e) {
    if (e.status === 401) {
      ADMIN_PASS = null;
      toast('❌ Sessão expirada — entre novamente');
      openAdmin();
    } else {
      toast('⚠️ ' + e.message);
    }
  }
}

/* ================= TOAST ================= */
let tt;
function toast(m) {
  const t = $('toast');
  t.textContent = m;
  t.classList.add('show');
  clearTimeout(tt);
  tt = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ================= INIT ================= */
$('yr').textContent = new Date().getFullYear();
useContent(null);
renderAll();
contentReady.then(d => { if (d) { useContent(d); renderAll(); } });
