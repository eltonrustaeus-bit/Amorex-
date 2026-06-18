// ─── CART STATE ───────────────────────────────────────
const cart = [];
const overlay  = document.getElementById('cart-overlay');
const drawer   = document.getElementById('cart-drawer');
const cartBody = document.getElementById('cart-body');
const badge    = document.querySelector('.cart-badge');

function openCart() {
  overlay.classList.add('open');
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  overlay.classList.remove('open');
  drawer.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-cart-open]').forEach(b => b.addEventListener('click', openCart));
document.querySelectorAll('[data-cart-close]').forEach(b => b.addEventListener('click', closeCart));
overlay?.addEventListener('click', closeCart);

function updateCartUI() {
  const count = cart.length;
  badge.textContent = count;
  badge.style.display = count ? 'flex' : 'none';

  if (count === 0) {
    cartBody.innerHTML = `
      <svg class="cart-empty-icon" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      <p class="cart-empty-msg">Din kundvagn är tom</p>
      <p class="cart-empty-sub">Lägg till produkter för att börja handla</p>`;
  } else {
    cartBody.innerHTML = cart.map((item, i) => `
      <div style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--light-border);gap:12px;">
        <div>
          <p style="font-size:13px;font-weight:500;color:var(--ink);margin-bottom:3px;">${item.name}</p>
          <p style="font-size:11px;color:var(--muted);">1 st · ${item.price}</p>
        </div>
        <button onclick="removeFromCart(${i})" style="color:var(--muted);font-size:14px;padding:4px 8px;cursor:pointer;background:none;border:none;transition:color .2s;" onmouseover="this.style.color='var(--ink)'" onmouseout="this.style.color='var(--muted)'">✕</button>
      </div>`).join('');
  }
}

function addToCart(name, price = '549 KR') {
  const prices = { 'Hoodie': '549 KR', 'Tee': '349 KR', 'Cap': '389 KR', 'T-shirt': '349 KR' };
  const p = Object.entries(prices).find(([k]) => name.toLowerCase().includes(k.toLowerCase()));
  cart.push({ name, price: p ? p[1] : price });
  updateCartUI();

  // Feedback flash
  const btn = event?.target?.closest('button');
  if (btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = 'Tillagd ✓';
    btn.style.background = '#2e6b3e';
    btn.style.borderColor = '#2e6b3e';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.borderColor = '';
    }, 1800);
  }
  openCart();
}

function removeFromCart(i) {
  cart.splice(i, 1);
  updateCartUI();
}

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
  });
  const wrap = card.querySelector('.variant-img-wrap');
  if (wrap) {
    wrap.style.borderColor = 'var(--gold-dark)';
    wrap.style.borderWidth = '2px';
  }
}

// ─── CAP COLOR ITEMS - active styling ─────────────────
document.querySelectorAll('.cap-color-item').forEach(item => {
  item.addEventListener('click', function () {
    document.querySelectorAll('.cap-color-item').forEach(i => {
      i.style.borderColor = '';
    });
    this.style.borderColor = 'var(--gold-dark)';
  });
});

// ─── NEWSLETTER ───────────────────────────────────────
document.getElementById('nl-form')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const input = this.querySelector('.nl-input');
  const btn   = this.querySelector('.nl-btn');
  if (!input.value.trim()) return;
  const orig = btn.textContent;
  btn.textContent = 'Tack! ✓';
  btn.style.background = '#2e6b3e';
  btn.style.borderColor = '#2e6b3e';
  input.value = '';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    btn.style.borderColor = '';
  }, 3500);
});
