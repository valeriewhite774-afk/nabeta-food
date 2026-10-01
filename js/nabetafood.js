/* ================================================================
   NABETAFOOD — SHARED JAVASCRIPT
   nabetafood.com
   ================================================================ */

'use strict';

// ── Config ────────────────────────────────────────────────────
const NBF = {
  SUPABASE_URL:     'https://ldckmvocwddkmfpwhjny.supabase.co',
  SUPABASE_KEY:     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkY2ttdm9jd2Rka21mcHdoam55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjY5OTMsImV4cCI6MjA2MjA0Mjk5M30.L8kd9j0EaKirAQCrDMkFl0LFmSGJqRF7kJNqMiN2Yrw',
  PAYSTACK_KEY:     'pk_live_6e1ebe89000fb16bd513f9d8188f52710851ac52',
  WHATSAPP:         'https://wa.me/2348104063360?text=Hello%20NabetaFood!%20I%20would%20like%20to%20place%20an%20order.',
  DELIVERY_FEE:     500,
  POINTS_PER_1000:  10,
  ORDER_URL:        '/order.html',
};

// ── Soup Data ─────────────────────────────────────────────────
const SOUPS = [
  {
    slug: 'banga-soup', name: 'Banga Soup', short: 'Banga',
    price: 4999, badge: 'Delta Classic',
    notes: 'Palm Fruit · Aromatic · Delta Spices',
    rating: 4.9, reviews: 312,
    img: 'https://res.cloudinary.com/dfrvptn1p/image/upload/v1790866559/banga_soup_dish_1780300824477_oujy5y.jpg',
    defaults: { proteins: [{ n: 'Beef', qty: 2 }, { n: 'River Fish', qty: 1 }], swallow: 'Starch', swallowQty: 2 },
    proteins: [
      { n: 'River Fish', p: 800 }, { n: 'Beef', p: 600 },
      { n: 'Periwinkle', p: 500 }, { n: 'Boiled Egg', p: 300 }
    ],
    desc: 'Taste our Banga Soup and feel the difference with your first swallow. Rich, tasty, and garnished with bush meat, fish, periwinkle, and African traditional spices.',
    bullets: [
      { b: 'Vitamins in every swallow:', s: 'real palm fruit, real Vitamin A and E.' },
      { b: 'Serious protein:', s: 'bush meat, fish, and periwinkle in one bowl.' },
      { b: 'Rich, deep, and full:', s: 'the taste that stays with you after the last swallow.' }
    ],
    review: { quote: 'Delicious, tasty and very fast in delivery. I love NabetaFood and will keep on enjoying their foods.', name: 'Felix Birinumugha', location: 'Warri' },
    faqs: [
      { q: "What is NabetaFood's Banga Soup made of?", a: "Our Banga Soup is slow-cooked using 100% natural palm fruit concentrate, infused with traditional Delta spices like Beletete leaves and Oburunbebe stick, loaded with fresh river fish, beef, and periwinkles." },
      { q: "What is the best swallow for Banga Soup?", a: "Traditional Delta yellow starch is the absolute best companion. The velvety sweetness of starch balances the rich, robust flavour of the palm oil soup perfectly. We also offer Eba and Fufu." },
      { q: "Is your palm fruit fresh or canned?", a: "We use only freshly extracted palm fruit concentrate prepared from local Delta groves daily, ensuring you get the authentic home taste with zero artificial preservatives." }
    ]
  },
  {
    slug: 'fisherman-soup', name: 'Fisherman Soup', short: 'Fisherman',
    price: 5500, badge: 'Premium Catch',
    notes: 'Prawns · Crab · Coastal Delta',
    rating: 4.8, reviews: 184,
    img: 'https://res.cloudinary.com/dfrvptn1p/image/upload/v1790866576/fisherman_soup_1780300845776_htbhmw.jpg',
    defaults: { proteins: [{ n: 'Jumbo Prawn', qty: 2 }, { n: 'Crab Claw', qty: 1 }], swallow: 'Eba', swallowQty: 2 },
    proteins: [
      { n: 'Jumbo Prawn', p: 1200 }, { n: 'Crab Claw', p: 1000 },
      { n: 'Snapper Filet', p: 900 }, { n: 'Periwinkle', p: 500 }
    ],
    desc: 'A premium Delta dish celebrating the fresh seafood bounty of coastal Warri waters, loaded with succulent king prawns, fresh crab claws, and seasoned with local Uziza herbs.',
    bullets: [
      { b: 'Fresh oceanic harvest:', s: 'straight from delta waters into your bowl.' },
      { b: 'Antioxidant rich:', s: 'cooked with genuine Uziza seeds and sweet scent leaves.' },
      { b: 'Satisfying depth:', s: 'local spices that evoke the true coastal fisherman legacy.' }
    ],
    review: { quote: 'Simply exceptional seafood density! The broth tastes like pure liquid gold. 10/10 will order again.', name: 'Amaju Pinnick', location: 'Effurun, Warri' },
    faqs: [
      { q: "Is your Fisherman Soup made with real fresh seafood?", a: "Yes. Our Fisherman Soup uses premium king prawns, whole crab claws, and fresh red snapper, carefully cleaned and cooked in a spicy light herb broth with Uziza and scent leaves." },
      { q: "What swallow goes best with Fisherman Soup?", a: "We recommend Eba as the default. The firm texture of Eba pairs beautifully with the broth-based nature of the soup." },
      { q: "How spicy is Fisherman Soup?", a: "Medium heat. The pepper is balanced by the sweetness of the seafood and the fresh herbal notes from the scent leaves." }
    ]
  },
  {
    slug: 'owo-soup', name: 'Owo Soup', short: 'Owo',
    price: 5999, badge: "Delta's Secret",
    notes: 'Thick · Premium · Rare',
    rating: 4.9, reviews: 224,
    img: 'https://res.cloudinary.com/dfrvptn1p/image/upload/v1790866597/owo_soup_1780302250456_rfpibo.jpg',
    defaults: { proteins: [{ n: 'Beef', qty: 2 }, { n: 'River Fish', qty: 1 }], swallow: 'Starch', swallowQty: 2 },
    proteins: [
      { n: 'Bush Fish', p: 800 }, { n: 'Shaki (Tripe)', p: 700 },
      { n: 'Cow Foot', p: 600 }, { n: 'Kpomo', p: 450 }
    ],
    desc: "The soup most Nigerians have heard of but never tasted. Thick, premium, and quietly satisfying in a way that is hard to explain until your first swallow. Delta's best kept secret, now one order away.",
    bullets: [
      { b: 'Traditional recipe:', s: 'made without pepper or tomatoes, relying purely on palm oil depth.' },
      { b: 'Rich in minerals:', s: 'native unle minerals prepared to perfection.' },
      { b: 'Starch companion:', s: 'the ultimate pairing for yellow Delta starch.' }
    ],
    review: { quote: 'Nice meal from NabetaFood. Very nourishable and satisfying.', name: 'Emmanuel Dere', location: 'Warri' },
    faqs: [
      { q: "What makes Owo Soup different from other Nigerian soups?", a: "Owo Soup is uniquely Urhobo. Unlike most Nigerian soups, it contains no tomatoes or peppers. It is made with pure palm oil and native potash (unle), giving it a distinct golden-yellow colour and a rich, mineral-deep taste." },
      { q: "Why is Owo Soup considered rare?", a: "Very few restaurants know how to make Owo Soup correctly. The preparation requires specific Delta ingredients and careful technique. Chef Mercy Mone has mastered the recipe over 40 years." },
      { q: "What do I eat Owo Soup with?", a: "Owo Soup is traditionally served with yellow Delta starch. This pairing is essential to the authentic Owo experience." }
    ]
  },
  {
    slug: 'egusi-soup', name: 'Egusi Soup', short: 'Egusi',
    price: 2999, badge: 'Most Popular',
    notes: 'Rich · Hearty · Classic',
    rating: 4.8, reviews: 445,
    img: 'https://res.cloudinary.com/dfrvptn1p/image/upload/v1790866616/egusi_soup_1780302266589_ageete.jpg',
    defaults: { proteins: [{ n: 'Beef', qty: 2 }, { n: 'River Fish', qty: 1 }], swallow: 'Eba', swallowQty: 2 },
    proteins: [
      { n: 'River Fish', p: 800 }, { n: 'Beef', p: 600 },
      { n: 'Periwinkle', p: 500 }, { n: 'Boiled Egg', p: 300 }
    ],
    desc: 'You have eaten Egusi before. But not like this. The difference is in the care, the quality, and the patience it takes to cook it the right way. One bowl and you will taste exactly what we mean.',
    bullets: [
      { b: 'Cooked with patience:', s: 'the kind of Egusi that cannot be rushed.' },
      { b: 'Loaded and generous:', s: 'meat, fish, and vegetables in every serving.' },
      { b: 'Familiar but better:', s: 'the Egusi you already love, done the way it deserves.' }
    ],
    review: { quote: 'Delicious food and a swift delivery. The egusi and Semo was worth it. Bravo.', name: 'Ezebunwa Izuwa', location: 'Warri' },
    faqs: [
      { q: "What type of Egusi do you use?", a: "We use freshly ground Egusi (melon seeds) sourced locally in Delta State. The seeds are fried in palm oil before the soup is built, giving our Egusi its distinct rich, nutty depth." },
      { q: "Is your Egusi Soup spicy?", a: "Medium heat. The pepper is carefully balanced so the melon seed flavour comes through without being overwhelmed by spice." },
      { q: "What swallow is best with Egusi Soup?", a: "Eba is our default. The firm texture holds up well against the rich, thick consistency of the soup. Fufu and Starch also work beautifully." }
    ]
  },
  {
    slug: 'okro-soup', name: 'Okro Soup', short: 'Okro',
    price: 4999, badge: 'Customer Favourite',
    notes: 'Silky · Draw · Fresh',
    rating: 4.9, reviews: 267,
    img: 'https://res.cloudinary.com/dfrvptn1p/image/upload/v1790866625/okro_soup_1780302285781_wt5skn.jpg',
    defaults: { proteins: [{ n: 'Beef', qty: 2 }, { n: 'River Fish', qty: 1 }], swallow: 'Eba', swallowQty: 2 },
    proteins: [
      { n: 'River Fish', p: 800 }, { n: 'Beef', p: 600 },
      { n: 'Periwinkle', p: 500 }, { n: 'Boiled Egg', p: 300 }
    ],
    desc: "The draw soup most restaurants get wrong. Ours is different. Every swallow is calm, every dip tingles the tastebuds, and the taste lingers just long enough to pull you back for another.",
    bullets: [
      { b: 'The draw that keeps you going:', s: 'silky, slippery, and impossible to stop at one swallow.' },
      { b: 'Loaded with protein:', s: 'bush meat, fish, and periwinkle in every bowl.' },
      { b: 'Clean, lingering taste:', s: 'no heaviness, just pure satisfaction from first dip to last.' }
    ],
    review: { quote: 'Super tasty and delicious. I have made NabetaFood my sure plug already and I promise to visit more often.', name: 'Ofegor Uruwarie', location: 'Warri' },
    faqs: [
      { q: "How do you achieve the perfect draw in your Okro Soup?", a: "Fresh, finely cut okro cooked at the right temperature for just the right amount of time. We never over-cook our okro. The result is a perfectly silky draw that clings to every swallow without being slimy." },
      { q: "Does your Okro Soup contain ogiri?", a: "Yes. We use a small amount of traditional ogiri (fermented locust beans) to deepen the umami flavour of the soup." },
      { q: "What is the best swallow for Okro Soup?", a: "Eba is our default and top recommendation. The firmness of Eba is perfect for drawing through the silky Okro Soup." }
    ]
  },
  {
    slug: 'vegetable-soup', name: 'Vegetable Soup', short: 'Vegetable',
    price: 4700, badge: 'Freshly Picked',
    notes: 'Greens · Nutritious · Aromatic',
    rating: 4.8, reviews: 142,
    img: 'https://res.cloudinary.com/dfrvptn1p/image/upload/v1790866632/vegetable_soup_1780302300775_ixsdvd.jpg',
    defaults: { proteins: [{ n: 'Goat Meat', qty: 1 }, { n: 'Dried Shrimp', qty: 1 }], swallow: 'Fufu', swallowQty: 2 },
    proteins: [
      { n: 'Goat Meat', p: 800 }, { n: 'Dried Shrimp', p: 600 },
      { n: 'Snail Chunks', p: 1200 }, { n: 'Smoked Fish', p: 700 }
    ],
    desc: 'Premium leafy greens sauteed in smoked shrimp paste, palm oil, and native peppers with rich, tender proteins. The freshest bowl on our menu, packed with vitamins.',
    bullets: [
      { b: 'Vitamins packed:', s: '100% freshly hand-plucked green leaves, never frozen.' },
      { b: 'Traditional base:', s: 'fried thoroughly in rich, native palm oil and red tatashe.' },
      { b: 'Crunchy proteins:', s: 'high in snails and smoked prawns for depth and texture.' }
    ],
    review: { quote: 'The crunchiness of the greens is preserved so well. Smells heavenly with the dried shrimp paste flavour!', name: 'Preye Alapa', location: 'Udu Road, Warri' },
    faqs: [
      { q: "What type of vegetables do you use?", a: "We use a blend of fresh Efo Riro leaves, Ugu (pumpkin leaves), and seasonal local greens, all hand-plucked and prepared fresh on the day of cooking." },
      { q: "Is the Vegetable Soup suitable for lighter eaters?", a: "Yes. It is one of our lighter options nutritionally, packed with vitamins and natural fibre. Ideal if you want a flavourful but less heavy meal." },
      { q: "What swallow goes with Vegetable Soup?", a: "We recommend Fufu as the default. The soft, smooth consistency complements the textured, leafy nature of the soup perfectly." }
    ]
  }
];

const SWALLOWS = ['Starch', 'Eba', 'Fufu'];
const REVIEWS  = [
  { quote: 'Delicious food and a swift delivery. The egusi and Semo was worth it. Bravo.', name: 'Ezebunwa Izuwa', loc: 'Warri', rating: 5, init: 'EI' },
  { quote: 'Delicious, tasty and very fast in delivery. I love NabetaFood and will keep on enjoying their foods.', name: 'Felix Birinumugha', loc: 'Warri', rating: 5, init: 'FB' },
  { quote: 'Super tasty and delicious, the type of well prepared meal I have been craving for. I have made NabetaFood my sure plug already.', name: 'Ofegor Uruwarie', loc: 'Warri', rating: 5, init: 'OU' },
  { quote: 'Nice meal from NabetaFood. Very nourishable and satisfying.', name: 'Emmanuel Dere', loc: 'Warri', rating: 5, init: 'ED' },
  { quote: 'The food taste good, I really enjoyed it and I\'m definitely going back there for more orders.', name: 'Irhivwoba E. Jerome', loc: 'Warri', rating: 4, init: 'IJ' },
];

// ── Helpers ───────────────────────────────────────────────────
const fmt = n => '₦' + Number(n).toLocaleString('en-NG');

function getSoupBySlug(slug) {
  return SOUPS.find(s => s.slug === slug) || null;
}

function starsHTML(n) {
  const full = Math.floor(n);
  return '★'.repeat(full) + (n % 1 >= 0.5 ? '☆' : '');
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// ── Supabase ──────────────────────────────────────────────────
async function supabasePost(table, data) {
  const res = await fetch(`${NBF.SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': NBF.SUPABASE_KEY,
      'Authorization': `Bearer ${NBF.SUPABASE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err.message || err.error || 'Unknown error') + ' | Code: ' + (err.code || res.status));
  }
  return true;
}

async function supabaseGet(table, params = '') {
  const res = await fetch(`${NBF.SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: {
      'apikey': NBF.SUPABASE_KEY,
      'Authorization': `Bearer ${NBF.SUPABASE_KEY}`
    }
  });
  if (!res.ok) throw new Error('Failed to fetch ' + table);
  return res.json();
}

async function supabasePatch(table, data, filter) {
  const res = await fetch(`${NBF.SUPABASE_URL}/rest/v1/${table}?${filter}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': NBF.SUPABASE_KEY,
      'Authorization': `Bearer ${NBF.SUPABASE_KEY}`,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(data)
  });
  return res.ok;
}

// ── Nav Component ─────────────────────────────────────────────
function buildNav(activePage) {
  const links = [
    { href: '/', label: 'Home', key: 'home' },
    { href: '/menu.html', label: 'Menu', key: 'menu' },
    { href: '/about.html', label: 'About', key: 'about' },
    { href: '/chef.html', label: 'Our Chef', key: 'chef' },
    { href: '/rewards.html', label: 'Rewards', key: 'rewards' },
  ];

  const navLinksHTML = links.map(l =>
    `<a href="${l.href}" class="${l.key === activePage ? 'active' : ''}">${l.label}</a>`
  ).join('');

  const mobileLinksHTML = links.map(l =>
    `<a href="${l.href}">${l.label}</a>`
  ).join('');

  return `
    <nav id="nbf-nav">
      <div class="nav-inner">
        <button class="hamburger-btn" id="ham-btn" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
        <a href="/" class="nav-logo">
          NabetaFood<span class="dot">.</span>
        </a>
        <div class="nav-links">${navLinksHTML}</div>
        <div class="nav-actions">
          <a href="${NBF.WHATSAPP}" target="_blank" rel="noopener noreferrer" class="nav-icon-btn" aria-label="WhatsApp">
            <i class="ti ti-brand-whatsapp"></i>
          </a>
          <a href="/order.html" class="nav-icon-btn" aria-label="Cart" id="nav-cart-btn">
            <i class="ti ti-shopping-bag"></i>
            <span class="badge" id="nav-cart-badge"></span>
          </a>
          <a href="/menu.html" class="btn btn-gold nav-cta">Order Now</a>
        </div>
      </div>
    </nav>
    <div id="mobile-nav">${mobileLinksHTML}</div>`;
}

function buildFooter() {
  const soups = SOUPS.map(s =>
    `<a href="/${s.slug}.html" class="footer-link">${s.name}</a>`
  ).join('');

  return `
    <footer id="nbf-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div style="font-family:'Playfair Display',serif;font-size:20px;color:var(--text);margin-bottom:8px;">
              NabetaFood<span style="color:var(--gold);">.</span>
            </div>
            <p style="font-size:13px;color:var(--text-l);line-height:1.65;max-width:220px;margin-bottom:16px;">
              Hot food, fast delivery, no wahala. Delta soups cooked fresh per order in Warri.
            </p>
            <a href="${NBF.WHATSAPP}" target="_blank" rel="noopener noreferrer"
              class="btn btn-whatsapp btn-sm" style="display:inline-flex;">
              <i class="ti ti-brand-whatsapp" style="font-size:15px;"></i> WhatsApp Us
            </a>
          </div>
          <div>
            <div class="footer-col-title">Soups</div>
            ${soups}
          </div>
          <div>
            <div class="footer-col-title">Explore</div>
            <a href="/" class="footer-link">Home</a>
            <a href="/menu.html" class="footer-link">Full Menu</a>
            <a href="/about.html" class="footer-link">About Us</a>
            <a href="/chef.html" class="footer-link">Our Chef</a>
            <a href="/rewards.html" class="footer-link">Rewards</a>
            <a href="/track.html" class="footer-link">Track Order</a>
          </div>
          <div>
            <div class="footer-col-title">Policies</div>
            <a href="/about.html#delivery" class="footer-link">Delivery Policy</a>
            <a href="/about.html#returns" class="footer-link">Return Policy</a>
            <div class="footer-col-title" style="margin-top:20px;">Contact</div>
            <span class="footer-link">orders@nabetafood.com</span>
            <span class="footer-link">Warri, Delta State</span>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 NabetaFood. All rights reserved.</span>
          <span>nabetafood.com</span>
        </div>
      </div>
    </footer>`;
}

// ── Soup Card ─────────────────────────────────────────────────
function soupCardHTML(s, cta = 'Order Now') {
  return `
    <div class="card soup-card" onclick="window.location.href='/${s.slug}.html'">
      <div class="soup-card-img-wrap">
        <img class="soup-card-img" src="${s.img}" alt="${s.name} delivery Warri - NabetaFood" loading="lazy"
          onerror="this.parentElement.style.background='var(--surface-2)'" />
      </div>
      <div class="soup-card-body">
        <span class="soup-card-badge">${s.badge}</span>
        <div>
          <h3 style="font-size:17px;font-weight:600;margin:0 0 4px;color:var(--text);">${s.name}</h3>
          <div class="soup-card-rating">
            <span class="stars">${'★'.repeat(Math.floor(s.rating))}</span>
            <span style="font-size:11px;color:var(--text-l);">${s.rating} (${s.reviews})</span>
          </div>
        </div>
        <p style="font-size:12px;color:var(--text-l);margin:0;line-height:1.5;flex:1;">${s.notes}</p>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:4px;">
          <span class="price">${fmt(s.price)}</span>
          <a href="/${s.slug}.html" class="btn btn-gold btn-sm"
            onclick="event.stopPropagation();">${cta}</a>
        </div>
      </div>
    </div>`;
}

// ── Review Card ───────────────────────────────────────────────
function reviewCardHTML(r) {
  const stars = '★'.repeat(r.rating) + (r.rating < 5 ? '☆'.repeat(5 - r.rating) : '');
  return `
    <div class="review-card">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
        <span class="stars" style="font-size:13px;">${stars}</span>
        <span style="font-size:9px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:1px;">Google Review</span>
      </div>
      <p style="font-size:13px;color:var(--text);margin:0 0 14px;line-height:1.65;font-style:italic;">"${r.quote}"</p>
      <div style="display:flex;align-items:center;gap:10px;">
        <div class="reviewer-avatar">${r.init}</div>
        <div>
          <p style="font-size:12px;font-weight:600;color:var(--text);margin:0;">${r.name}</p>
          <p style="font-size:11px;color:var(--text-l);margin:0;">${r.loc}</p>
        </div>
      </div>
    </div>`;
}

// ── Init Nav & Footer ─────────────────────────────────────────
function initPage(activePage) {
  // Nav
  const navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) navPlaceholder.innerHTML = buildNav(activePage);

  // Footer
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) footerPlaceholder.innerHTML = buildFooter();

  // Nav scroll
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nbf-nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Hamburger
  document.addEventListener('click', e => {
    const hamBtn = document.getElementById('ham-btn');
    const mobileNav = document.getElementById('mobile-nav');
    if (hamBtn && hamBtn.contains(e.target)) {
      mobileNav && mobileNav.classList.toggle('open');
    } else if (mobileNav && !mobileNav.contains(e.target)) {
      mobileNav && mobileNav.classList.remove('open');
    }
  });

  // Cart badge
  updateCartBadge();

  // Scroll reveal
  initReveal();

  // Body top padding for fixed nav
  document.body.style.paddingTop = '64px';
}

// ── Cart Badge ────────────────────────────────────────────────
function getCart() {
  try { return JSON.parse(localStorage.getItem('nbf_cart') || '[]'); }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem('nbf_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((s, i) => s + (i.qty || 1), 0);
  const badge = document.getElementById('nav-cart-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// ── Scroll Reveal ─────────────────────────────────────────────
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        e.target.classList.remove('will-reveal');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06 });
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.add('will-reveal');
    obs.observe(el);
  });
}

// ── FAQ Toggle ────────────────────────────────────────────────
function initFAQs() {
  document.querySelectorAll('.faq-q').forEach((q, i) => {
    q.addEventListener('click', () => {
      const a = q.nextElementSibling;
      const icon = q.querySelector('.faq-icon');
      const open = a.style.display === 'block';
      document.querySelectorAll('.faq-a').forEach(el => { el.style.display = 'none'; });
      document.querySelectorAll('.faq-icon').forEach(el => { el.style.transform = ''; });
      if (!open) {
        a.style.display = 'block';
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
}

// ── Loyalty ───────────────────────────────────────────────────
async function getLoyaltyBalance(phone) {
  try {
    const data = await supabaseGet('loyalty', `phone=eq.${encodeURIComponent(phone)}&select=*`);
    return data[0] || null;
  } catch { return null; }
}

async function addLoyaltyPoints(phone, name, amountSpent) {
  const pointsEarned = Math.floor(amountSpent / 1000) * NBF.POINTS_PER_1000;
  if (pointsEarned <= 0) return 0;
  try {
    const existing = await getLoyaltyBalance(phone);
    if (existing) {
      await supabasePatch('loyalty',
        { points: existing.points + pointsEarned, total_spent: existing.total_spent + amountSpent, updated_at: new Date().toISOString() },
        `phone=eq.${encodeURIComponent(phone)}`
      );
    } else {
      await supabasePost('loyalty', { phone, name, points: pointsEarned, total_spent: amountSpent });
    }
    return pointsEarned;
  } catch (e) { console.error('Loyalty error:', e); return 0; }
}

// ── Order Tracking ────────────────────────────────────────────
async function trackOrder(orderId) {
  try {
    const clean = orderId.replace(/^NBF-/i, '').toLowerCase();
    const data = await supabaseGet('orders', `id=ilike.${clean}%&select=*&limit=1`);
    return data[0] || null;
  } catch { return null; }
}

// Expose globally
window.NBF_LIB = {
  SOUPS, SWALLOWS, REVIEWS, NBF, fmt, getSoupBySlug, starsHTML, generateUUID,
  supabasePost, supabaseGet, supabasePatch,
  buildNav, buildFooter, soupCardHTML, reviewCardHTML,
  initPage, getCart, saveCart, updateCartBadge,
  getLoyaltyBalance, addLoyaltyPoints, trackOrder, initFAQs,
};
