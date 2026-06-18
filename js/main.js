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
