// ─── MOBILE MENU ─────────────────────────────────────
const mobileMenu  = document.querySelector('.mobile-menu');
const hamburger   = document.querySelector('.hamburger');
const mobileClose = document.querySelector('.mobile-close');

hamburger?.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});
mobileClose?.addEventListener('click', () => {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
});
mobileMenu?.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  })
);

// ─── SCROLL REVEAL ────────────────────────────────────
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ─── VARIANT SELECT ───────────────────────────────────
function selectVariant(card, name) {
  const row = card.closest('.variants-row');
  row?.querySelectorAll('.variant-img-wrap').forEach(w => {
    w.style.borderColor = '';
    w.style.borderWidth = '';
  });
  const wrap = card.querySelector('.variant-img-wrap');
  if (wrap) {
    wrap.style.borderColor = 'var(--gold-dark)';
    wrap.style.borderWidth = '2px';
  }
}

// ─── SCROLL PROGRESS BAR ──────────────────────────────
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
}

// ─── BACK TO TOP ──────────────────────────────────────
const backToTop = document.getElementById('back-to-top');
backToTop?.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })
);

// ─── FLOATING INSTAGRAM BUTTON ────────────────────────
const floatIg = document.getElementById('float-ig');
const heroEl  = document.querySelector('.hero');

// ─── SCROLL EVENTS ────────────────────────────────────
window.addEventListener('scroll', () => {
  updateProgress();
  const sy         = window.scrollY;
  const heroBottom = (heroEl?.offsetTop ?? 0) + (heroEl?.offsetHeight ?? 500);
  backToTop?.classList.toggle('visible', sy > 600);
  floatIg?.classList.toggle('visible', sy > heroBottom - 80);
}, { passive: true });

// ─── TOAST ────────────────────────────────────────────
const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  if (!toastEl) return;
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
}
document.querySelectorAll('a[href*="ig.me"]').forEach(el =>
  el.addEventListener('click', () => showToast('Öppnar Instagram DM…'))
);

// ─── LIGHTBOX ─────────────────────────────────────────
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxLabel = document.getElementById('lightbox-label');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(src, alt) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  if (lightboxLabel) lightboxLabel.textContent = alt;
  lightbox.classList.add('open');
}
function closeLightbox() {
  lightbox?.classList.remove('open');
}
lightboxClose?.addEventListener('click', e => { e.stopPropagation(); closeLightbox(); });
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

// Transparent tap button over every product image → opens design gallery
document.querySelectorAll('.variant-img-wrap').forEach(wrap => {
  const img = wrap.querySelector('img');
  if (!img) return;
  const btn = document.createElement('button');
  btn.className = 'img-tap-btn';
  btn.setAttribute('aria-label', 'Visa ' + img.alt);
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const imgSrc = img.getAttribute('src');
    const idx = GALLERY.findIndex(g => g.src === imgSrc);
    openGallery(idx >= 0 ? idx : 0);
  });
  wrap.appendChild(btn);
});

// ─── DESIGN GALLERY ───────────────────────────────────
const GALLERY = [
  { src: 'images/hoodie-navy.png?v=2',        name: 'Amorex Hoodie — Navy',        price: '599 KR' },
  { src: 'images/hoodie-black.png?v=2',       name: 'Amorex Hoodie — Svart',       price: '599 KR' },
  { src: 'images/hoodie-white.png?v=2',       name: 'Amorex Hoodie — Vit',         price: '599 KR' },
  { src: 'images/hoodie-baby-blue.png?v=2',   name: 'Amorex Hoodie — Baby Blue',   price: '599 KR' },
  { src: 'images/hoodie-light-beige.png?v=2', name: 'Amorex Hoodie — Light Beige', price: '599 KR' },
  { src: 'images/tshirt-navy.png?v=2',        name: 'Amorex T-Shirt — Navy',       price: '449 KR' },
  { src: 'images/tshirt-black.png?v=2',       name: 'Amorex T-Shirt — Svart',      price: '449 KR' },
  { src: 'images/tshirt-white.png?v=2',       name: 'Amorex T-Shirt — Vit',        price: '449 KR' },
  { src: 'images/tshirt-baby-blue.png?v=2',   name: 'Amorex T-Shirt — Baby Blue',  price: '449 KR' },
  { src: 'images/tshirt-light-beige.png?v=2', name: 'Amorex T-Shirt — Light Beige',price: '449 KR' },
  { src: 'images/cap-navy.png?v=2',           name: 'Amorex Keps — Navy',          price: '349 KR' },
  { src: 'images/cap-black.png?v=2',          name: 'Amorex Keps — Svart',         price: '349 KR' },
  { src: 'images/cap-white.png?v=2',          name: 'Amorex Keps — Vit',           price: '349 KR' },
  { src: 'images/cap-baby-blue.png?v=2',      name: 'Amorex Keps — Baby Blue',     price: '349 KR' },
  { src: 'images/cap-light-beige.png?v=2',    name: 'Amorex Keps — Light Beige',   price: '349 KR' },
];

const galleryModal   = document.getElementById('gallery-modal');
const galleryImg     = document.getElementById('gallery-img');
const galleryName    = document.getElementById('gallery-name');
const galleryPrice   = document.getElementById('gallery-price');
const galleryCounter = document.getElementById('gallery-counter');
const galleryIgBtn   = document.getElementById('gallery-ig-btn');
const galleryOpenBtn = document.getElementById('gallery-open-btn');
const galleryCloseBtn = document.getElementById('gallery-close-btn');
const galleryPrevBtn = document.getElementById('gallery-prev');
const galleryNextBtn = document.getElementById('gallery-next');

let galleryIdx = 0;

function renderGallery() {
  const item = GALLERY[galleryIdx];
  galleryImg.src      = item.src;
  galleryImg.alt      = item.name;
  galleryName.textContent    = item.name;
  galleryPrice.textContent   = item.price;
  galleryCounter.textContent = (galleryIdx + 1) + ' / ' + GALLERY.length;
  galleryIgBtn.setAttribute('aria-label', 'Beställ ' + item.name + ' via Instagram');
}

function openGallery(idx) {
  galleryIdx = idx ?? 0;
  renderGallery();
  galleryModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeGallery() {
  galleryModal.classList.remove('open');
  document.body.style.overflow = '';
}

function galleryGo(delta) {
  galleryImg.classList.add('switching');
  setTimeout(() => {
    galleryIdx = (galleryIdx + delta + GALLERY.length) % GALLERY.length;
    renderGallery();
    galleryImg.classList.remove('switching');
  }, 120);
}

galleryOpenBtn?.addEventListener('click', () => openGallery(0));
galleryCloseBtn?.addEventListener('click', closeGallery);
galleryPrevBtn?.addEventListener('click', () => galleryGo(-1));
galleryNextBtn?.addEventListener('click', () => galleryGo(1));
galleryModal?.addEventListener('click', e => { if (e.target === galleryModal) closeGallery(); });
document.addEventListener('keydown', e => {
  if (!galleryModal?.classList.contains('open')) return;
  if (e.key === 'ArrowRight') galleryGo(1);
  else if (e.key === 'ArrowLeft') galleryGo(-1);
  else if (e.key === 'Escape') closeGallery();
});

// Touch/swipe for gallery
let galTouchX = null;
galleryModal?.addEventListener('touchstart', e => { galTouchX = e.changedTouches[0].clientX; }, { passive: true });
galleryModal?.addEventListener('touchend', e => {
  if (galTouchX === null) return;
  const dx = e.changedTouches[0].clientX - galTouchX;
  if (Math.abs(dx) > 40) galleryGo(dx < 0 ? 1 : -1);
  galTouchX = null;
}, { passive: true });

// ─── ANIMATED STAT COUNTERS ───────────────────────────
function animateCounter(el) {
  const target   = parseInt(el.dataset.count, 10);
  if (isNaN(target)) return;
  const isYear   = target > 100;
  const start    = isYear ? target - 4 : 0;
  const duration = isYear ? 700 : 900;
  const t0       = performance.now();
  (function step(now) {
    const p    = Math.min((now - t0) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(start + (target - start) * ease);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  })(t0);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.6 });
document.querySelectorAll('.stat-num[data-count]').forEach(el => counterObs.observe(el));
