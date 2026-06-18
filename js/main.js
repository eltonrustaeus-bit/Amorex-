// ─── NAV SCROLL ──────────────────────────────────────
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// ─── MOBILE MENU ─────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu-close');

hamburger?.addEventListener('click', () => {
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
});

mobileMenuClose?.addEventListener('click', closeMenu);
mobileMenu?.addEventListener('click', (e) => {
  if (e.target === mobileMenu) closeMenu();
});

function closeMenu() {
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// ─── CART SIDEBAR ─────────────────────────────────────
const cartOverlay = document.querySelector('.cart-overlay');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartBtns = document.querySelectorAll('[data-cart-open]');
const cartClose = document.querySelector('[data-cart-close]');

function openCart() {
  cartOverlay.classList.add('open');
  cartSidebar.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay.classList.remove('open');
  cartSidebar.classList.remove('open');
  document.body.style.overflow = '';
}

cartBtns.forEach(btn => btn.addEventListener('click', openCart));
cartOverlay?.addEventListener('click', closeCart);
cartClose?.addEventListener('click', closeCart);

// ─── PRODUCT TABS ─────────────────────────────────────
const tabs = document.querySelectorAll('.category-tab');
const allCards = document.querySelectorAll('.product-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;
    allCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? 'block' : 'none';
    });
  });
});

// ─── SCROLL REVEAL ────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

reveals.forEach(el => revealObserver.observe(el));

// ─── NEWSLETTER ───────────────────────────────────────
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = newsletterForm.querySelector('.newsletter-input');
  const btn = newsletterForm.querySelector('.newsletter-btn');
  if (!input.value.trim()) return;

  const orig = btn.textContent;
  btn.textContent = 'Tack!';
  btn.style.background = '#5a8a5a';
  btn.style.borderColor = '#5a8a5a';
  input.value = '';

  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    btn.style.borderColor = '';
  }, 3000);
});

// ─── COLOR DOTS ───────────────────────────────────────
document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', (e) => {
    e.stopPropagation();
    const parent = dot.closest('.product-colors');
    parent.querySelectorAll('.color-dot').forEach(d => d.style.boxShadow = '');
    dot.style.boxShadow = `0 0 0 2px var(--gold), 0 0 0 4px rgba(201,169,110,0.2)`;
  });
});

// ─── ADD TO CART ──────────────────────────────────────
let cartCount = 0;
const cartCountEl = document.querySelector('.cart-count');

document.querySelectorAll('.product-add').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    cartCount++;
    if (cartCountEl) {
      cartCountEl.textContent = cartCount;
      cartCountEl.style.display = 'flex';
    }
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`;
    btn.style.background = 'var(--gold)';
    btn.style.borderColor = 'var(--gold)';
    btn.style.color = 'var(--black)';
    setTimeout(() => {
      btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
      btn.style.background = '';
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 1500);
  });
});

// ─── SMOOTH PRODUCT CARD CLICK ────────────────────────
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('click', () => {
    card.style.transform = 'scale(0.98)';
    setTimeout(() => card.style.transform = '', 150);
  });
});
