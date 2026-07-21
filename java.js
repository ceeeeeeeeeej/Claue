/* ─── java.js ─── */

// ════════════════════════════════════════════
//  DIGITAL FLOWER CANVAS
// ════════════════════════════════════════════

const flowerCanvas = document.getElementById('flower-canvas');
const fctx = flowerCanvas.getContext('2d');
let FW, FH, FCX, FCY;

function resizeFlower() {
  FW = flowerCanvas.width  = window.innerWidth;
  FH = flowerCanvas.height = window.innerHeight;
  FCX = FW / 2;
  FCY = FH / 2;
}
resizeFlower();
window.addEventListener('resize', resizeFlower);

// ── Helper: hex + alpha ──
function hexA(hex, a) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}

// ── Floating sparkles ──
const sparkles = [];
for (let i = 0; i < 140; i++) {
  sparkles.push({
    angle: Math.random() * Math.PI * 2,
    dist:  Math.random() * Math.min(FW, FH) * 0.52,
    r:     Math.random() * 2.2 + 0.4,
    speed: (Math.random() * 0.4 + 0.08) * (Math.random() > 0.5 ? 1 : -1),
    drift: Math.random() * 0.008 + 0.001,
    opacity: Math.random() * 0.7 + 0.2,
    twinkleSpeed: Math.random() * 0.06 + 0.02,
    twinkleOffset: Math.random() * Math.PI * 2,
    color: ['#f9a8d4','#c084fc','#818cf8','#fde68a','#e879f9','#a78bfa'][Math.floor(Math.random() * 6)]
  });
}

function drawSparkles(t) {
  sparkles.forEach(s => {
    s.angle += s.drift;
    const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset);
    const alpha = s.opacity * (0.4 + 0.6 * twinkle);
    const x = FCX + Math.cos(s.angle) * s.dist;
    const y = FCY + Math.sin(s.angle) * s.dist;

    fctx.beginPath();
    fctx.arc(x, y, s.r * twinkle, 0, Math.PI * 2);
    fctx.fillStyle = hexA(s.color, alpha);
    fctx.fill();
  });
}

// ── Draw one petal ──
function drawPetal(x, y, len, wid, angle, c1, c2, alpha) {
  fctx.save();
  fctx.translate(x, y);
  fctx.rotate(angle);

  const grad = fctx.createLinearGradient(0, 0, 0, len);
  grad.addColorStop(0,   hexA(c1, alpha));
  grad.addColorStop(0.6, hexA(c1, alpha * 0.6));
  grad.addColorStop(1,   hexA(c2, 0));

  fctx.beginPath();
  fctx.moveTo(0, 0);
  fctx.bezierCurveTo( wid,        len * 0.22,  wid * 1.15, len * 0.65, 0, len);
  fctx.bezierCurveTo(-wid * 1.15, len * 0.65, -wid,        len * 0.22, 0, 0);
  fctx.closePath();
  fctx.fillStyle = grad;
  fctx.fill();

  // centre shimmer vein
  fctx.beginPath();
  fctx.moveTo(0, len * 0.05);
  fctx.quadraticCurveTo(wid * 0.12, len * 0.5, 0, len * 0.92);
  fctx.strokeStyle = hexA('#ffffff', alpha * 0.22);
  fctx.lineWidth   = 0.9;
  fctx.stroke();

  fctx.restore();
}

// ── Draw a leaf ──
function drawLeaf(x, y, len, wid, angle, alpha) {
  fctx.save();
  fctx.translate(x, y);
  fctx.rotate(angle);

  const grad = fctx.createLinearGradient(0, 0, 0, len);
  grad.addColorStop(0,   `rgba(110,231,183,${alpha})`);
  grad.addColorStop(0.5, `rgba(52,211,153,${alpha * 0.75})`);
  grad.addColorStop(1,   `rgba(16,185,129,0)`);

  fctx.beginPath();
  fctx.moveTo(0, 0);
  fctx.bezierCurveTo( wid, len * 0.28,  wid * 0.75, len * 0.72, 0, len);
  fctx.bezierCurveTo(-wid * 0.75, len * 0.72, -wid, len * 0.28, 0, 0);
  fctx.closePath();
  fctx.fillStyle = grad;
  fctx.fill();

  // leaf vein
  fctx.beginPath();
  fctx.moveTo(0, 0);
  fctx.quadraticCurveTo(0, len * 0.5, 0, len * 0.9);
  fctx.strokeStyle = `rgba(167,243,208,${alpha * 0.35})`;
  fctx.lineWidth = 0.8;
  fctx.stroke();

  fctx.restore();
}

// ── Draw stem ──
function drawStem(alpha) {
  const stemLen = 170;
  const grad = fctx.createLinearGradient(FCX, FCY + 10, FCX, FCY + stemLen);
  grad.addColorStop(0,   `rgba(52,211,153,${alpha})`);
  grad.addColorStop(0.6, `rgba(16,185,129,${alpha * 0.7})`);
  grad.addColorStop(1,   `rgba(5,150,105,${alpha * 0.3})`);

  fctx.beginPath();
  fctx.moveTo(FCX, FCY + 10);
  fctx.bezierCurveTo(FCX - 20, FCY + 70, FCX - 12, FCY + 120, FCX - 6, FCY + stemLen);
  fctx.strokeStyle = grad;
  fctx.lineWidth   = 4.5 * alpha;
  fctx.lineCap     = 'round';
  fctx.stroke();
}

// ── Petal layers ──
const LAYERS = [
  // [count, baseLen, width, c1,        c2,        rotOffset]
  [9,  160, 42, '#e879f9', '#c084fc', 0],
  [8,  130, 34, '#c084fc', '#818cf8', Math.PI / 9],
  [7,  100, 26, '#f9a8d4', '#e879f9', Math.PI / 6],
  [6,   68, 18, '#fde68a', '#f9a8d4', 0],
  [5,   42, 11, '#ffffff', '#fde68a', Math.PI / 10],
];

// ── Bloom progress / time ──
let flowerT = 0;
const BLOOM_FRAMES = 260; // frames until fully open

function easeInOut(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

function drawFlower() {
  const rawP  = Math.min(flowerT / BLOOM_FRAMES, 1);
  const p     = easeInOut(rawP);

  // stem
  drawStem(p);

  // leaves
  if (p > 0.28) {
    const la = easeInOut((p - 0.28) / 0.72);
    drawLeaf(FCX - 4, FCY + 90,  64 * la, 20 * la,  0.38, la);
    drawLeaf(FCX - 4, FCY + 118, 48 * la, 15 * la, -0.5,  la);
  }

  if (p < 0.12) return;
  const fp = easeInOut((p - 0.12) / 0.88);

  LAYERS.forEach(([count, baseLen, wid, c1, c2, offset], li) => {
    const delay    = li * 0.15;
    const rawLayer = Math.max(0, Math.min(1, (fp - delay) / (1 - delay)));
    const lp       = easeInOut(rawLayer);
    if (lp <= 0) return;

    const rot = flowerT * 0.003 * (li % 2 === 0 ? 1 : -1);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + offset + rot;
      drawPetal(FCX, FCY, baseLen * lp, wid * lp, angle, c1, c2, lp * 0.94);
    }
  });

  // ── Centre glow ──
  if (fp > 0.25) {
    const ga    = easeInOut((fp - 0.25) / 0.75);
    const pulse = 1 + Math.sin(flowerT * 0.055) * 0.07;
    const R     = 34 * ga * pulse;

    const rg = fctx.createRadialGradient(FCX, FCY, 0, FCX, FCY, R);
    rg.addColorStop(0,    `rgba(255,255,230,${ga})`);
    rg.addColorStop(0.35, `rgba(253,230,138,${ga * 0.88})`);
    rg.addColorStop(0.7,  `rgba(249,168,212,${ga * 0.45})`);
    rg.addColorStop(1,    'rgba(249,168,212,0)');

    fctx.beginPath();
    fctx.arc(FCX, FCY, R, 0, Math.PI * 2);
    fctx.fillStyle = rg;
    fctx.fill();

    // Stamen dots
    const stamens = 10;
    for (let i = 0; i < stamens; i++) {
      const a  = (i / stamens) * Math.PI * 2 + flowerT * 0.04;
      const sr = 14 * ga * pulse;
      fctx.beginPath();
      fctx.arc(FCX + Math.cos(a) * sr, FCY + Math.sin(a) * sr, 2.2 * ga, 0, Math.PI * 2);
      fctx.fillStyle = `rgba(255,245,180,${ga * 0.95})`;
      fctx.fill();
    }
  }
}

// ── Aura rings ──
function drawAura(p) {
  if (p < 0.25) return;
  const a = easeInOut((p - 0.25) / 0.75);
  for (let i = 0; i < 4; i++) {
    const phase = flowerT * 0.013 + i * (Math.PI * 2 / 4);
    const r     = 110 + i * 28 + Math.sin(phase) * 7;
    fctx.beginPath();
    fctx.arc(FCX, FCY, r * Math.min(a * 1.8, 1), 0, Math.PI * 2);
    fctx.strokeStyle = i < 2
      ? `rgba(232,121,249,${0.055 * a})`
      : `rgba(192,132,252,${0.04 * a})`;
    fctx.lineWidth = i === 0 ? 1.5 : 0.8;
    fctx.stroke();
  }
}

// ── Background ──
function drawBG() {
  fctx.fillStyle = '#07040f';
  fctx.fillRect(0, 0, FW, FH);

  const rg = fctx.createRadialGradient(FCX, FCY, 0, FCX, FCY, Math.min(FW, FH) * 0.55);
  rg.addColorStop(0,   'rgba(100,40,160,0.22)');
  rg.addColorStop(0.4, 'rgba(60,10,100,0.10)');
  rg.addColorStop(1,   'rgba(0,0,0,0)');
  fctx.fillStyle = rg;
  fctx.fillRect(0, 0, FW, FH);
}

// ── Main canvas loop ──
function flowerLoop() {
  flowerT++;
  drawBG();
  drawSparkles(flowerT);

  const p = Math.min(flowerT / BLOOM_FRAMES, 1);
  drawAura(p);
  drawFlower();

  requestAnimationFrame(flowerLoop);
}
flowerLoop();


// ════════════════════════════════════════════
//  SLIDE SYSTEM
// ════════════════════════════════════════════

let slides = [];       // each: { text, photoSrc }
let currentIndex = 0;
// 0 = cover, 1 = flower, 2..n+1 = content slides, n+2 = add panel

function totalSlides() {
  return 2 + slides.length + 1; // cover + flower + content slides + add
}

// ── DOM refs ──
const slidesContainer = document.getElementById('slides-container');
const slide0          = document.getElementById('slide-0');
const slideFlower     = document.getElementById('slide-flower');
const slideAdd        = document.getElementById('slide-add');
const prevBtn         = document.getElementById('prev-btn');
const nextBtn         = document.getElementById('next-btn');
const dotsContainer   = document.getElementById('slide-dots');

const slideTextarea   = document.getElementById('slide-text');
const slidePhotoInput = document.getElementById('slide-photo');
const photoPreviewWrap= document.getElementById('photo-preview-wrap');
const photoPreview    = document.getElementById('photo-preview');
const removePhotoBtn  = document.getElementById('remove-photo-btn');
const addSlideBtn     = document.getElementById('add-slide-btn');
const photoLabel      = document.getElementById('photo-label');
const photoText       = document.getElementById('photo-text');
const photoIcon       = document.getElementById('photo-icon');

let pendingPhotoSrc = null;

// ── Render dots ──
function renderDots() {
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalSlides(); i++) {
    const d = document.createElement('span');
    d.className = 'dot' + (i === currentIndex ? ' dot-active' : '');
    d.setAttribute('aria-label', `Go to slide ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(d);
  }
}

// ── Build content slide ──
function buildContentSlide(data, index) {
  const div  = document.createElement('div');
  div.className = 'slide';
  div.id = `slide-content-${index}`;

  const card = document.createElement('div');
  card.className = 'content-card';

  const pn = document.createElement('p');
  pn.className = 'page-number';
  pn.textContent = `page ${index + 1}`;
  card.appendChild(pn);

  const hasText  = data.text && data.text.trim();
  const hasPhoto = data.photoSrc;

  if (!hasText && !hasPhoto) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = '<span class="empty-icon">🌸</span><p style="color:var(--text-muted)">nothing added yet</p>';
    card.appendChild(empty);
  } else {
    if (hasPhoto) {
      const img = document.createElement('img');
      img.className = 'content-photo';
      img.src = data.photoSrc;
      img.alt = 'photo';
      card.appendChild(img);
    }
    if (hasText) {
      const p = document.createElement('p');
      p.className = 'content-text';
      p.textContent = data.text.trim();
      card.appendChild(p);
    }
  }

  div.appendChild(card);
  return div;
}

// ── Re-render all content slides ──
function renderContentSlides() {
  slidesContainer.innerHTML = '';
  slides.forEach((data, i) => {
    slidesContainer.appendChild(buildContentSlide(data, i));
  });
}

// ── Get slide element by logical index ──
function getSlideEl(index) {
  if (index === 0) return slide0;
  if (index === 1) return slideFlower;
  if (index === totalSlides() - 1) return slideAdd;
  return document.getElementById(`slide-content-${index - 2}`);
}

// ── Navigate ──
function goTo(targetIndex) {
  if (targetIndex === currentIndex) return;
  if (targetIndex < 0 || targetIndex >= totalSlides()) return;

  const currentEl = getSlideEl(currentIndex);
  const targetEl  = getSlideEl(targetIndex);
  if (!currentEl || !targetEl) return;

  const goingForward = targetIndex > currentIndex;

  currentEl.classList.add('exiting');
  currentEl.classList.remove('active');

  targetEl.style.transform    = goingForward ? 'translateX(60px)' : 'translateX(-60px)';
  targetEl.style.opacity      = '0';
  targetEl.style.pointerEvents = 'none';

  void targetEl.offsetWidth; // reflow

  targetEl.style.transform = '';
  targetEl.style.opacity   = '';

  setTimeout(() => {
    currentEl.classList.remove('exiting');
    currentEl.style.transform = '';
    currentEl.style.opacity   = '';
    targetEl.classList.add('active');
    targetEl.style.pointerEvents = '';
  }, 450);

  currentIndex = targetIndex;
  renderDots();
  updateNavBtns();
}

function updateNavBtns() {
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === totalSlides() - 1;
}

// ── Nav buttons ──
prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

// ── Photo upload ──
slidePhotoInput.addEventListener('change', () => {
  const file = slidePhotoInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    pendingPhotoSrc         = e.target.result;
    photoPreview.src        = pendingPhotoSrc;
    photoPreviewWrap.style.display = 'inline-block';
    photoText.textContent   = file.name.length > 24 ? file.name.slice(0,24) + '…' : file.name;
    photoIcon.textContent   = '✓';
    photoLabel.style.borderColor = 'var(--accent1)';
    photoLabel.style.color       = 'var(--accent1)';
  };
  reader.readAsDataURL(file);
});

removePhotoBtn.addEventListener('click', () => {
  pendingPhotoSrc = null;
  slidePhotoInput.value = '';
  photoPreview.src = '';
  photoPreviewWrap.style.display = 'none';
  photoText.textContent = 'choose a photo';
  photoIcon.textContent = '📷';
  photoLabel.style.borderColor = '';
  photoLabel.style.color       = '';
});

// ── Add slide ──
addSlideBtn.addEventListener('click', () => {
  const text     = slideTextarea.value;
  const photoSrc = pendingPhotoSrc;

  if (!text.trim() && !photoSrc) {
    showToast('add some text or a photo first ♡');
    return;
  }

  slides.push({ text, photoSrc });
  renderContentSlides();
  renderDots();
  updateNavBtns();

  // Reset form
  slideTextarea.value = '';
  pendingPhotoSrc     = null;
  slidePhotoInput.value = '';
  photoPreview.src    = '';
  photoPreviewWrap.style.display = 'none';
  photoText.textContent = 'choose a photo';
  photoIcon.textContent = '📷';
  photoLabel.style.borderColor = '';
  photoLabel.style.color       = '';

  // Go to the new content slide: index = 2 + (slides.length - 1)
  goTo(1 + slides.length);
  showToast('page added ♡');
});

// ── Toast ──
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

// ── Keyboard ──
document.addEventListener('keydown', (e) => {
  const tag = document.activeElement.tagName;
  if (tag === 'TEXTAREA' || tag === 'INPUT') return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(currentIndex + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(currentIndex - 1);
});

// ── Touch / swipe ──
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
document.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) goTo(currentIndex + 1);
    else          goTo(currentIndex - 1);
  }
}, { passive: true });

// ── Init ──
renderDots();
updateNavBtns();
