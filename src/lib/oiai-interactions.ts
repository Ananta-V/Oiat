// @ts-nocheck
import OIAI_IMAGES from "../data/oiai-images.json";

let initialized = false;

export function initializeOiAI() {
  if (initialized) return;
  initialized = true;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);

  // The data-oiai-image attributes are a photo registry: assign local image paths before rendering.
  document.querySelectorAll('img[data-oiai-image]').forEach(img => {
    const key = img.getAttribute('data-oiai-image');
    const photo = OIAI_IMAGES[key];
    if (photo) {
      img.src = photo;
      img.removeAttribute('data-oiai-image');
      img.decoding = 'async';
    }
  });

  const freeDeliveryAt = 799;
  const fallbackPhoto = OIAI_IMAGES.dark;

  let PRODUCTS = [
    { id: 1, name: 'Secret Crush', price: 349, weight: 'Box of 6 pieces (120g)', personality: 'Shy, romantic, full of surprises', tagline: 'A little nut. A lot of feelings.', ingredients: 'Dark chocolate shell with a roasted almond in the centre', filter: 'Filled Centres', kind: 'DARK CHOCOLATE', badge: 'A NUTTY LITTLE SECRET', desc: 'A dark chocolate shell with a roasted almond waiting in the middle.', notes: 'Dark chocolate · almond centre', image: OIAI_IMAGES.milkPralines, tint: '#a56842' },
    { id: 2, name: 'Bad Habit', price: 349, weight: 'Box of 6 pieces (120g)', personality: 'Bold, addictive, impossible to resist', tagline: 'You said just one. We both know.', ingredients: 'Dark chocolate with a cocoa-coated cashew in the centre', filter: 'Filled Centres', kind: 'DARK CHOCOLATE', badge: 'COCOA MEETS CRUNCH', desc: 'Deep chocolate wrapped around a cocoa cashew centre.', notes: 'Dark chocolate · cocoa cashew centre', image: OIAI_IMAGES.cocoaShards, tint: '#5a2918' },
    { id: 3, name: 'Sweet Surrender', price: 379, weight: 'Box of 6 pieces (125g)', personality: 'Soft-hearted, indulgent, dangerously smooth', tagline: 'Resistance was never an option.', ingredients: 'Dark chocolate shell with a Nutella centre', filter: 'Filled Centres', kind: 'DARK CHOCOLATE', badge: 'THE SOFT MIDDLE', desc: 'A dark chocolate outside with a Nutella-soft middle.', notes: 'Dark chocolate · Nutella centre', image: OIAI_IMAGES.ganacheTruffles, tint: '#6c351f' },
    { id: 4, name: 'Sugar Rush', price: 399, weight: 'Box of 8 pieces (140g)', personality: 'Chaotic, bubbly, the life of the party', tagline: 'Soft on the inside. Chaos on the outside.', ingredients: 'Marshmallows and Silk chocolate-chip crisps covered in chocolate', filter: 'Crunch & Crisps', kind: 'CRUNCH & CRISPS', badge: 'THE HAPPY CRUNCH', desc: 'Marshmallows and silk-chip crisps tucked under a chocolate coat.', notes: 'Marshmallows · silk-chip crisps · chocolate', image: OIAI_IMAGES.truffles, tint: '#b77f57' },
    { id: 5, name: 'Mixed Signals', price: 369, weight: 'Box of 6 pieces (120g)', personality: 'Unpredictable, playful, two-sided', tagline: "Can't choose? Neither could we.", ingredients: 'Marbled white and dark chocolate', filter: 'Milk & Marble', kind: 'MILK & MARBLE', badge: 'TWO TONES, ONE BITE', desc: 'White and dark chocolate meet in a marbled little swirl.', notes: 'White chocolate · dark chocolate', image: OIAI_IMAGES.pralines, tint: '#c4936b' },
    { id: 6, name: 'First Love', price: 329, weight: 'Box of 6 pieces (120g)', personality: 'Nostalgic, innocent, comforting', tagline: 'Some things never lose their magic.', ingredients: 'Plain milk chocolate', filter: 'Milk & Marble', kind: 'MILK CHOCOLATE', badge: 'THE OLD FAVOURITE', desc: 'Creamy, familiar milk chocolate. Nothing to prove.', notes: 'Plain milk chocolate', image: OIAI_IMAGES.milkPralines, tint: '#d0a06e' },
    { id: 7, name: 'Dark Affair', price: 349, weight: 'Box of 6 pieces (120g)', personality: 'Mysterious, confident, a little dangerous', tagline: 'A little bitter. Entirely irresistible.', ingredients: 'Plain dark chocolate (70% cocoa)', filter: 'Plain Dark', kind: 'DARK CHOCOLATE', badge: 'DARK AND SIMPLE', desc: 'A classic cocoa-rich bite for the purists.', notes: 'Plain dark chocolate', image: OIAI_IMAGES.dark, tint: '#4a2114' },
    { id: 8, name: 'Pocket Mischief', price: 299, weight: 'Pouch of 100g', personality: 'Cute, adventurous, always up to something', tagline: 'Tiny treats. Big trouble.', ingredients: 'Roasted almonds coated in chocolate, sold in small packs', filter: 'Nutty Packs', kind: 'NUTTY PACKS', badge: 'POCKET-SIZED JOY', desc: 'Roasted almonds coated in chocolate, packed for a small treat.', notes: 'Roasted almonds · chocolate coating · small pack', image: OIAI_IMAGES.giftDetail, tint: '#a9764a' },
    { id: 9, name: 'Caught Snacking', price: 299, weight: 'Pouch of 100g', personality: 'Funny, cheeky, guilty but unapologetic', tagline: "We won't tell if you don't.", ingredients: 'Cashews coated in chocolate, sold in small packs', filter: 'Nutty Packs', kind: 'NUTTY PACKS', badge: 'A LITTLE HANDFUL', desc: 'Cashews covered in chocolate for a pocket-sized indulgence.', notes: 'Cashews · chocolate coating · small pack', image: OIAI_IMAGES.gift, tint: '#8f6244' }
  ];

  const state = {
    filter: 'All', sort: 'featured',
    cart: loadCart(), loved: new Set(), activeProduct: null
  };

  function loadCart() {
    try {
      const value = JSON.parse(localStorage.getItem('oiai-cart') || '[]');
      if (!Array.isArray(value)) return [];
      return value.filter(item => PRODUCTS.some(p => p.id === Number(item.id)) && Number(item.qty) > 0)
        .map(item => ({ id: Number(item.id), qty: Math.min(99, Math.floor(Number(item.qty))) }));
    } catch (_) { return []; }
  }
  function saveCart() {
    try { localStorage.setItem('oiai-cart', JSON.stringify(state.cart)); } catch (_) { /* Storage is optional for the demo. */ }
  }
  function getVisibleProducts() {
    return PRODUCTS.filter(product => state.filter === 'All' || product.filter === state.filter);
  }
  function productCard(product, index) {
    return `<button type="button" class="product-card hanging-product" data-product-name="${escapeHTML(product.name)}" data-product-id="${product.id}" data-feedback-open="${escapeHTML(product.name)}" aria-label="Leave a taste note for ${escapeHTML(product.name)}" style="--hang-angle:${index % 2 ? '1.15deg' : '-1.05deg'};--hang-drop:${[0, 8, 3, 11, 2, 7, 1, 9, 4][index] || 0}px;animation-delay:${Math.min(index, 8) * 45}ms">
    <span class="product-card-kicker"><span>${String(product.id).padStart(2, '0')} / 09</span><span>${product.badge}</span></span>
    <span class="product-photo-frame"><img src="${product.image}" alt="${escapeHTML(product.name)}" loading="eager" onerror="this.onerror=null;this.src='${fallbackPhoto}'" /></span>
    <span class="product-info">
      <span class="product-meta"><span>${product.kind}</span><span>SMALL BATCH</span></span>
      <span class="product-title-row">
        <span class="product-title">${escapeHTML(product.name)}</span>
        <span class="product-card-price">${money(product.price)}</span>
      </span>
      <span class="product-personality">${escapeHTML(product.personality)}</span>
      <span class="product-tagline">“${escapeHTML(product.tagline)}”</span>
      <span class="product-desc">${escapeHTML(product.desc)}</span>
      <span class="product-ingredients"><b>INGREDIENTS</b> ${escapeHTML(product.ingredients)}</span>
      <span class="product-card-bottom">
        <span class="product-price-pill">${money(product.price)} · ${escapeHTML(product.weight || 'Box of 6')}</span>
        <span class="batch-mark">Leave a little love ↗</span>
      </span>
    </span>
  </button>`;
  }
  function getProductColumns() {
    if (window.matchMedia('(max-width: 700px)').matches) return 1;
    if (window.matchMedia('(max-width: 1100px)').matches) return 2;
    return 3;
  }
  function renderProducts() {
    const products = getVisibleProducts();
    const columns = getProductColumns();
    const rows = [];
    for (let i = 0; i < products.length; i += columns) {
      const row = products.slice(i, i + columns);
      rows.push(`<div class="product-rope-row" style="--row-cols:${row.length}">${row.map((product, j) => productCard(product, i + j)).join('')}</div>`);
    }
    $('#product-grid').innerHTML = rows.join('');
    $('#showing-count').textContent = products.length;
    $('#empty-state').hidden = products.length !== 0;
    $('#active-filter-note').textContent = state.filter === 'All' ? 'Nine little favourites, each with its own story.' : `Showing ${products.length} ${products.length === 1 ? 'bite' : 'bites'} in ${state.filter}.`;
    $$('.filter-chip').forEach(button => {
      const active = button.dataset.filter === state.filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const allChip = $('[data-filter="All"]');
    if (allChip) allChip.innerHTML = `All nine bites <span>${PRODUCTS.length}</span>`;
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  function getCartTotals() {
    return state.cart.reduce((sum, item) => {
      const p = PRODUCTS.find(product => product.id === item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  }
  function renderCart() {
    const items = state.cart.map(item => ({ ...item, product: PRODUCTS.find(p => p.id === item.id) })).filter(item => item.product);
    const quantity = items.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = getCartTotals();
    $('#cart-count').textContent = quantity;
    $('#mobile-cart-count').textContent = quantity;
    $('#cart-subtotal').textContent = money(subtotal);
    $('#cart-items').innerHTML = items.map(({ id, qty, product }) => `<article class="cart-item">
      <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='${fallbackPhoto}'" />
      <div class="cart-item-info"><span class="cart-item-meta">${product.kind} · ${product.weight}</span><h3>${product.name}</h3><span class="cart-item-price">${money(product.price * qty)}</span>
        <div class="cart-item-controls"><div class="qty-control"><button type="button" data-qty="${id}" data-change="-1" aria-label="Reduce ${product.name} quantity">−</button><span>${qty}</span><button type="button" data-qty="${id}" data-change="1" aria-label="Increase ${product.name} quantity">+</button></div><button class="remove-item" type="button" data-remove="${id}">Remove</button></div>
      </div>
    </article>`).join('');
    const remaining = Math.max(0, freeDeliveryAt - subtotal);
    $('#shipping-amount').textContent = remaining === 0 ? 'UNLOCKED ♥' : `${money(remaining)} to go`;
    $('#shipping-message').textContent = remaining === 0 ? 'Lovely. Your delivery is on us.' : `Add ${money(remaining)} more for free delivery.`;
    $('#shipping-progress').style.width = `${Math.min(100, subtotal / freeDeliveryAt * 100)}%`;
    $('#cart-drawer').classList.toggle('is-empty', items.length === 0);
    $('#checkout-button').disabled = items.length === 0;
    saveCart();
  }
  function showToast(message, canView = true) {
    $('#toast-message').textContent = message;
    $('#toast-view').style.display = canView ? '' : 'none';
    $('#toast').classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => $('#toast').classList.remove('show'), 3000);
  }
  function showAnnouncement(message) {
    $('#announcement-toast').textContent = message;
    $('#announcement-toast').classList.add('show');
    clearTimeout(showAnnouncement.timer);
    showAnnouncement.timer = setTimeout(() => $('#announcement-toast').classList.remove('show'), 2800);
  }
  function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === Number(id));
    if (!product) return;
    const item = state.cart.find(row => row.id === product.id);
    if (item) item.qty = Math.min(99, item.qty + 1);
    else state.cart.push({ id: product.id, qty: 1 });
    renderCart();
    showToast(`${product.name} is in your bag ♥`);
    const addButton = $(`[data-add="${product.id}"]`);
    if (addButton) {
      const original = addButton.innerHTML;
      addButton.classList.add('is-added');
      addButton.innerHTML = 'ADDED <span>✓</span>';
      setTimeout(() => { if (addButton.isConnected) { addButton.classList.remove('is-added'); addButton.innerHTML = original; } }, 1000);
    }
  }
  function openCart() {
    closeMobileNav();
    $('#cart-drawer').classList.add('open');
    $('#drawer-backdrop').classList.add('open');
    $('#cart-drawer').setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    $('#cart-close').focus();
  }
  function closeCart() {
    $('#cart-drawer').classList.remove('open');
    $('#drawer-backdrop').classList.remove('open');
    $('#cart-drawer').setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }
  // Product Detail + UPI Checkout Modal
  let qvActiveProduct = null;
  let qvQty = 1;

  function openQuickView(id: any) {
    const p = PRODUCTS.find(product => String(product.id) === String(id) || product.id === Number(id));
    if (!p) return;
    // Card interaction: redirect directly to the taste note feedback form for this chocolate!
    openFeedback(p.name, p.name, String(p.id));
    return;

    // Preserved payment / checkout window logic below
    state.activeProduct = p.id;
    qvActiveProduct = p;
    qvQty = 1;
    renderProductDetail(p);
    const modal = $('#quick-view-modal');
    const backdrop = $('#modal-backdrop');
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }
    if (backdrop) {
      backdrop.classList.add('open');
    }
    document.body.classList.add('no-scroll');
    const closeBtn = $('#modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function renderProductDetail(p: any) {
    const upiId = '8125107227@upi';
    const whatsappNum = '918125107227';
    let screenshotBase64 = '';

    $('#quick-view-content').innerHTML = `
      <div class="qv-scroll-wrap">
        <!-- STEP 1: Product Detail -->
        <div class="qv-step is-active" id="qv-step-1">
          <div class="qv-layout-grid">
            <div class="qv-left-column">
              <div class="qv-photo-stage">
                <span class="qv-photo-tape" aria-hidden="true"></span>
                <div class="qv-photo-window">
                  <img class="qv-main-photo" src="${p.image}" alt="${escapeHTML(p.name)}"
                    onerror="this.onerror=null;this.src='${fallbackPhoto}'" />
                </div>
                <div class="qv-photo-caption">
                  <div><small>FROM OUR CHOCOLATE KITCHEN</small><br><strong>One more bite?</strong></div>
                  <em>go on, then ♥</em>
                </div>
              </div>
              <div class="qv-gallery-stamp" aria-hidden="true">
                <b>OiAI</b>
                <small>MADE WITH A LITTLE LOVE</small>
              </div>
            </div>

            <div class="qv-right-column">
              <div class="qv-eyebrow">${escapeHTML(p.category || 'THE CHOCOLATE SHELF')}</div>
              <h2 class="qv-product-name">${escapeHTML(p.name)}</h2>
              ${p.tagline ? `<p class="qv-tagline-quote">&ldquo;${escapeHTML(p.tagline)}&rdquo;</p>` : ''}

              <div class="qv-micro-tags">
                <span class="qv-micro-tag">${escapeHTML(p.kind || 'HOMEMADE')}</span>
                <span class="qv-micro-tag">${escapeHTML(p.badge || 'SMALL BATCH')}</span>
                <span class="qv-micro-tag">FRESH BATCH</span>
              </div>

              <div class="qv-price-highlight-card">
                <div class="qv-price-bold">${money(p.price)}</div>
                <div class="qv-price-unit">${escapeHTML(p.weight || 'Box of 6 pieces (120g)')}</div>
              </div>

              <p class="qv-description-body">${escapeHTML(p.desc || p.description || '')}</p>

              <div class="qv-detail-list">
                ${p.ingredients ? `<div class="qv-detail-item"><span class="qv-detail-label">What's inside</span><span class="qv-detail-val">${escapeHTML(p.ingredients)}</span></div>` : ''}
                ${p.personality ? `<div class="qv-detail-item"><span class="qv-detail-label">Personality</span><span class="qv-detail-val">${escapeHTML(p.personality)}</span></div>` : ''}
                ${p.notes ? `<div class="qv-detail-item"><span class="qv-detail-label">Tasting notes</span><span class="qv-detail-val">${escapeHTML(p.notes)}</span></div>` : ''}
                <div class="qv-detail-item"><span class="qv-detail-label">From</span><span class="qv-detail-val">OiAI · Hyderabad, India</span></div>
              </div>

              <div class="qv-quantity-bar">
                <span class="qv-qty-label">Quantity</span>
                <div class="qv-qty-controls">
                  <button class="qv-qty-btn" id="qv-qty-minus" type="button" aria-label="Decrease quantity">&minus;</button>
                  <span class="qv-qty-display" id="qv-qty-display">1</span>
                  <button class="qv-qty-btn" id="qv-qty-plus" type="button" aria-label="Increase quantity">+</button>
                </div>
                <span class="qv-qty-total" id="qv-qty-total">${money(p.price)}</span>
              </div>

              <button class="qv-order-primary-btn" id="qv-get-order-btn" type="button">
                ADD A LITTLE BITE (Press this to order) ↗
              </button>

              <div class="qv-feedback-link-row">
                <button class="qv-text-link" type="button" data-feedback-open="${escapeHTML(p.kind || 'Chocolate')}" data-product-id="${p.id}" data-product-name="${escapeHTML(p.name)}">
                  Leave a taste note &#x2665;
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- STEP 2: Customer Details + UPI Payment -->
        <div class="qv-step" id="qv-step-2" hidden>
          <button class="qv-back-btn" id="qv-back-to-detail" type="button">&larr; Back to chocolate details</button>
          <h3 class="qv-checkout-title">Complete Your Chocolate Order</h3>

          <div class="qv-checkout-grid">
            <div class="qv-customer-form-wrap">
              <p class="qv-section-label">1. DELIVERY DETAILS</p>
              <input class="qv-input" id="qv-cust-name" type="text" placeholder="Full name *" required autocomplete="name" />
              <input class="qv-input" id="qv-cust-phone" type="tel" placeholder="Phone number (WhatsApp) *" required autocomplete="tel" />
              <input class="qv-input" id="qv-cust-email" type="email" placeholder="Email (for order confirmation receipt)" autocomplete="email" />
              <textarea class="qv-input qv-textarea" id="qv-cust-address" placeholder="Full delivery address with pincode *" rows="3" required></textarea>
              <p class="qv-order-summary-line" id="qv-order-summary"></p>
            </div>

            <div class="qv-payment-card">
              <p class="qv-section-label">2. SCAN &amp; PAY VIA UPI</p>
              <div class="qv-qr-wrapper">
                <img class="qv-qr-img" src="https://api.qrserver.com/v1/create-qr-code/?data=upi%3A%2F%2Fpay%3Fpa%3D${encodeURIComponent(upiId)}%26pn%3DOiAI%26am%3D${p.price}%26cu%3DINR&size=180x180" alt="UPI QR Code" id="qv-qr-img" />
              </div>
              <p class="qv-upi-id-row">UPI ID: <strong id="qv-upi-id-text">${upiId}</strong> <button class="qv-copy-btn" id="qv-copy-upi" type="button" title="Copy UPI ID">Copy</button></p>

              <p class="qv-utr-label">Enter the UTR / UPI Transaction ID.</p>
              <input class="qv-input" id="qv-utr" type="text" placeholder="Enter the UTR / UPI Transaction ID." />

              <label class="qv-upload-label" for="qv-screenshot">
                <span>&#x1F4CE; Attach Payment Screenshot</span>
                <input type="file" id="qv-screenshot" accept="image/*" style="display:none" />
              </label>
              <img id="qv-screenshot-preview" class="qv-screenshot-preview" style="display:none;" alt="Payment Proof" />
              <p class="qv-screenshot-name" id="qv-screenshot-name" hidden></p>

              <button class="qv-confirm-btn" id="qv-confirm-order" type="button">Confirm Order &#x2713;</button>

              <button class="qv-whatsapp-trouble-btn" id="qv-trouble-btn" type="button">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.549 4.116 1.513 5.849L0 24l6.363-1.487A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.947 0-3.775-.5-5.373-1.373L2 22l1.394-4.487A9.967 9.967 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path></svg>
                Trouble paying? Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>

        <!-- STEP 3: Success -->
        <div class="qv-step" id="qv-step-3" hidden>
          <div class="qv-success-card">
            <div class="qv-success-icon">&#x1F36B;</div>
            <h2 class="qv-success-title">Order Received!</h2>
            <p class="qv-success-msg" id="qv-success-msg">Thank you! We will confirm your order shortly.</p>
            <p class="qv-order-id-line" id="qv-order-id-line"></p>
            <p class="qv-receipt-note">A copy of all the details and payment verification will be sent to your email. Thank you!</p>
            <button class="qv-download-receipt-btn" id="qv-download-receipt" type="button">&#x1F4E5; Download Receipt</button>
            <a class="qv-whatsapp-chat-btn" id="qv-wa-btn" href="#" target="_blank" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.549 4.116 1.513 5.849L0 24l6.363-1.487A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.947 0-3.775-.5-5.373-1.373L2 22l1.394-4.487A9.967 9.967 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path></svg>
              Send order details on WhatsApp
            </a>
            <button class="qv-done-btn" id="qv-done-btn" type="button">Continue Shopping</button>
          </div>
        </div>
      </div>
    `;

    // Wire up quantity buttons
    const qtyDisplay = $('#qv-qty-display');
    const qtyTotal = $('#qv-qty-total');

    function updateQty() {
      if (qtyDisplay) qtyDisplay.textContent = String(qvQty);
      if (qtyTotal) qtyTotal.textContent = money(p.price * qvQty);
    }

    const minusBtn = $('#qv-qty-minus');
    const plusBtn = $('#qv-qty-plus');
    if (minusBtn) minusBtn.addEventListener('click', () => { if (qvQty > 1) { qvQty--; updateQty(); } });
    if (plusBtn) plusBtn.addEventListener('click', () => { if (qvQty < 20) { qvQty++; updateQty(); } });

    // Switch from Step 1 to Step 2
    const getOrderBtn = $('#qv-get-order-btn');
    if (getOrderBtn) getOrderBtn.addEventListener('click', () => {
      const summary = $('#qv-order-summary');
      if (summary) summary.textContent = qvQty + ' x ' + p.name + ' = ' + money(p.price * qvQty);
      const qrImgEl = $('#qv-qr-img');
      if (qrImgEl) {
        qrImgEl.src = 'https://api.qrserver.com/v1/create-qr-code/?data=' + encodeURIComponent('upi://pay?pa=' + upiId + '&pn=OiAI&am=' + (p.price * qvQty) + '&cu=INR') + '&size=180x180';
      }
      const s1 = $('#qv-step-1');
      const s2 = $('#qv-step-2');
      if (s1) { s1.classList.remove('is-active'); s1.hidden = true; }
      if (s2) { s2.classList.add('is-active'); s2.hidden = false; }
    });

    // Back from Step 2 to Step 1
    const backBtn = $('#qv-back-to-detail');
    if (backBtn) backBtn.addEventListener('click', () => {
      const s1 = $('#qv-step-1');
      const s2 = $('#qv-step-2');
      if (s2) { s2.classList.remove('is-active'); s2.hidden = true; }
      if (s1) { s1.classList.add('is-active'); s1.hidden = false; }
    });

    // Copy UPI ID
    const copyUpiBtn = $('#qv-copy-upi');
    if (copyUpiBtn) copyUpiBtn.addEventListener('click', () => {
      if (navigator.clipboard) navigator.clipboard.writeText(upiId).catch(function() {});
      copyUpiBtn.textContent = 'Copied!';
      window.setTimeout(function() { copyUpiBtn.textContent = 'Copy'; }, 2000);
    });

    // Screenshot file reader
    const screenshotInput = $('#qv-screenshot') as HTMLInputElement | null;
    const screenshotName = $('#qv-screenshot-name');
    const screenshotPreview = $('#qv-screenshot-preview') as HTMLImageElement | null;
    const uploadLabel = $('#quick-view-content .qv-upload-label');
    if (uploadLabel && screenshotInput) {
      uploadLabel.addEventListener('click', function() { screenshotInput.click(); });
    }
    if (screenshotInput) {
      screenshotInput.addEventListener('change', function() {
        const file = screenshotInput.files && screenshotInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            screenshotBase64 = String(e.target?.result || '');
            if (screenshotPreview) {
              screenshotPreview.src = screenshotBase64;
              screenshotPreview.style.display = 'block';
            }
            if (screenshotName) {
              screenshotName.textContent = 'Attached: ' + file.name;
              screenshotName.hidden = false;
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Trouble paying WhatsApp
    const troubleBtn = $('#qv-trouble-btn');
    if (troubleBtn) troubleBtn.addEventListener('click', function() {
      const cName = ($('#qv-cust-name') && ($('#qv-cust-name') as HTMLInputElement).value || '').trim();
      const msg = encodeURIComponent('Hi OiAI! I am having trouble paying for my order.\nItem: ' + p.name + ' x ' + qvQty + '\nTotal: ' + money(p.price * qvQty) + (cName ? '\nName: ' + cName : ''));
      window.open('https://wa.me/' + whatsappNum + '?text=' + msg, '_blank', 'noopener');
    });

    // Confirm Order
    const confirmBtn = $('#qv-confirm-order') as HTMLButtonElement | null;
    if (confirmBtn) confirmBtn.addEventListener('click', async function() {
      const custName = ($('#qv-cust-name') && ($('#qv-cust-name') as HTMLInputElement).value || '').trim();
      const custPhone = ($('#qv-cust-phone') && ($('#qv-cust-phone') as HTMLInputElement).value || '').trim();
      const custEmail = ($('#qv-cust-email') && ($('#qv-cust-email') as HTMLInputElement).value || '').trim();
      const custAddress = ($('#qv-cust-address') && ($('#qv-cust-address') as HTMLTextAreaElement).value || '').trim();
      const utr = ($('#qv-utr') && ($('#qv-utr') as HTMLInputElement).value || '').trim();

      if (!custName) { if ($('#qv-cust-name')) ($('#qv-cust-name') as HTMLInputElement).focus(); showToast('Please enter your name', true); return; }
      if (!custPhone) { if ($('#qv-cust-phone')) ($('#qv-cust-phone') as HTMLInputElement).focus(); showToast('Please enter your phone number', true); return; }
      if (!custAddress) { if ($('#qv-cust-address')) ($('#qv-cust-address') as HTMLTextAreaElement).focus(); showToast('Please enter your delivery address', true); return; }

      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Placing order...';

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: String(p.id),
            productName: p.name,
            quantity: qvQty,
            totalPrice: p.price * qvQty,
            customerName: custName,
            customerPhone: custPhone,
            customerEmail: custEmail,
            customerAddress: custAddress,
            utrId: utr,
            screenshotUrl: screenshotBase64 || null,
            paymentMethod: 'upi'
          })
        });
        const result = await res.json();
        const orderId = result.orderId || result.id || '';

        const waMsg = encodeURIComponent('Hi OiAI! I have placed an order!\n\nOrder: ' + p.name + ' x ' + qvQty + '\nTotal: ' + money(p.price * qvQty) + (utr ? '\nUTR/Transaction ID: ' + utr : '') + '\nName: ' + custName + '\nPhone: ' + custPhone + '\nAddress: ' + custAddress + (orderId ? '\nOrder ID: ' + orderId : ''));

        const s2 = $('#qv-step-2');
        const s3 = $('#qv-step-3');
        if (s2) { s2.classList.remove('is-active'); s2.hidden = true; }
        if (s3) { s3.classList.add('is-active'); s3.hidden = false; }

        const successMsg = $('#qv-success-msg');
        if (successMsg) successMsg.textContent = 'Thank you, ' + custName + '! Your order for ' + p.name + ' x ' + qvQty + ' has been received. We will confirm via WhatsApp shortly.';

        const orderIdLine = $('#qv-order-id-line');
        if (orderIdLine && orderId) orderIdLine.textContent = 'Order ID: ' + orderId;

        const waBtn = $('#qv-wa-btn') as HTMLAnchorElement | null;
        if (waBtn) waBtn.href = 'https://wa.me/' + whatsappNum + '?text=' + waMsg;

        // Wire receipt download
        const dlBtn = $('#qv-download-receipt');
        if (dlBtn) {
          dlBtn.addEventListener('click', function() {
            generateReceiptImage({
              orderId: orderId,
              productName: p.name,
              quantity: qvQty,
              totalPrice: p.price * qvQty,
              custName: custName,
              custPhone: custPhone,
              custEmail: custEmail,
              custAddress: custAddress,
              utr: utr
            });
          });
        }

      } catch (err) {
        showToast('Could not place order. Please try WhatsApp directly.', true);
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Order';
      }
    });

    // Done / Continue Shopping
    const doneBtn = $('#qv-done-btn');
    if (doneBtn) doneBtn.addEventListener('click', closeQuickView);

    // Feedback links inside QV
    $$('#quick-view-content [data-feedback-open]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const ctx = btn.dataset.feedbackOpen || 'Chocolate I tried';
        closeQuickView();
        openFeedback(ctx, btn.dataset.productName || '', btn.dataset.productId || '');
      });
    });
  }

  function closeQuickView() {
    const modal = $('#quick-view-modal');
    const backdrop = $('#modal-backdrop');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    }
    if (backdrop) {
      backdrop.classList.remove('open');
    }
    document.body.classList.remove('no-scroll');
    state.activeProduct = null;
    qvActiveProduct = null;
    qvQty = 1;
  }

  // Preserve quick-view & payment buying logic accessible on window
  try {
    (window as any).openQuickView = openQuickView;
    (window as any).closeQuickView = closeQuickView;
    // Expose openFeedback so React ProductCard components can call it
    (window as any).openFeedback = openFeedback;
  } catch (_) {}

  function generateReceiptImage(details: {
    orderId: string; productName: string; quantity: number; totalPrice: number;
    custName: string; custPhone: string; custEmail: string; custAddress: string; utr: string;
  }) {
    const canvas = document.createElement('canvas');
    const W = 600, H = 820;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background — warm cream
    ctx.fillStyle = '#fdf6ee';
    ctx.fillRect(0, 0, W, H);

    // Outer border
    ctx.strokeStyle = '#8c4c2b';
    ctx.lineWidth = 6;
    ctx.strokeRect(14, 14, W - 28, H - 28);

    // Inner border
    ctx.strokeStyle = '#d4a96a';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(22, 22, W - 44, H - 44);

    // Header block
    ctx.fillStyle = '#3b1a0a';
    ctx.fillRect(0, 40, W, 90);

    // Brand name
    ctx.fillStyle = '#f5e6d0';
    ctx.font = 'bold 28px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('OIAT | THE GOOD STUFF', W / 2, 82);

    ctx.font = '13px Georgia, serif';
    ctx.fillStyle = '#d4a96a';
    ctx.fillText('Oops! I Ate It — Homemade Chocolates', W / 2, 108);

    // ORDER RECEIPT title
    ctx.fillStyle = '#8c4c2b';
    ctx.font = 'bold 16px Georgia, serif';
    ctx.fillText('✦ ORDER RECEIPT ✦', W / 2, 158);

    // Decorative line
    ctx.strokeStyle = '#d4a96a';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(50, 168); ctx.lineTo(W - 50, 168); ctx.stroke();

    // Details
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    ctx.textAlign = 'left';
    ctx.font = '13px Georgia, serif';
    ctx.fillStyle = '#5a3118';

    const rows: Array<[string, string]> = [
      ['Order ID', details.orderId || 'Pending'],
      ['Date & Time', dateStr + '  ' + timeStr],
      ['', ''],
      ['Item', details.productName],
      ['Quantity', String(details.quantity)],
      ['Total Amount', '\u20B9' + details.totalPrice.toFixed(2)],
      ['', ''],
      ['Customer Name', details.custName],
      ['Phone', details.custPhone],
      ['Email', details.custEmail || '—'],
      ['Delivery Address', details.custAddress],
      ['', ''],
      ['Transaction / UTR ID', details.utr || 'Not provided'],
      ['Payment Method', 'UPI — 8125107227@upi'],
      ['Payment Status', 'Verification Pending'],
    ];

    let y = 195;
    for (const [label, value] of rows) {
      if (!label && !value) { y += 8; continue; }
      ctx.fillStyle = '#a0693a';
      ctx.font = 'bold 12px Georgia, serif';
      ctx.fillText(label + (label ? ':' : ''), 55, y);
      ctx.fillStyle = '#3b1a0a';
      ctx.font = '12px Georgia, serif';
      // Wrap long values
      const maxW = 320;
      const words = value.split(' ');
      let line = ''; const lx = 270; let ly = y;
      for (const word of words) {
        const test = line + (line ? ' ' : '') + word;
        if (ctx.measureText(test).width > maxW && line) {
          ctx.fillText(line, lx, ly); ly += 16; line = word;
        } else { line = test; }
      }
      if (line) ctx.fillText(line, lx, ly);
      y = Math.max(y, ly) + 20;
    }

    // Divider
    ctx.strokeStyle = '#d4a96a';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(50, y + 4); ctx.lineTo(W - 50, y + 4); ctx.stroke();
    y += 22;

    // Thank you note
    ctx.textAlign = 'center';
    ctx.font = 'italic 12px Georgia, serif';
    ctx.fillStyle = '#8c4c2b';
    ctx.fillText('A copy of all the details and payment verification', W / 2, y);
    ctx.fillText('will be sent to your email. Thank you! 🍫', W / 2, y + 18);

    // Footer
    ctx.font = '11px Georgia, serif';
    ctx.fillStyle = '#a0693a';
    ctx.fillText('OIAT — Made with love, delivered with care.', W / 2, H - 38);

    // Download
    const link = document.createElement('a');
    link.download = 'OIAT-Receipt-' + (details.orderId || 'order') + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
  function setFilter(filter) {
    state.filter = filter;
    renderProducts();
  }
  function toggleLove(id) {
    if (state.loved.has(id)) state.loved.delete(id); else state.loved.add(id);
    renderProducts();
    const product = PRODUCTS.find(p => p.id === id);
    showToast(state.loved.has(id) ? `${product.name} saved for later ♥` : `${product.name} removed from favourites`, false);
  }
  function closeMobileNav() {
    $('#sidebar').classList.remove('mobile-open');
    $('#mobile-backdrop').classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  // Story-led feedback: the form writes to Supabase; catalogue products remain local.
  let activeFeedbackProduct = { id: '', name: '' };
  let currentFeedbackMode: 'taste_note' | 'memory' = 'taste_note';

  function openFeedback(context = 'Your OiAI story', productName = '', productId = '') {
    closeQuickView();
    // Reset the form to blank state every time it opens
    const form = $('#feedback-form');
    if (form) {
      form.reset();
      form.hidden = false;
    }
    $('#feedback-thanks').hidden = true;
    $('#feedback-error').hidden = true;
    activeFeedbackProduct = { id: String(productId || ''), name: String(productName || '') };

    // Context-aware mode: Chocolate Review (taste note) vs Moment/Memory Sharing
    const isMemoryMode = !productName && (
      context === 'Your OiAI story' ||
      context.toLowerCase().includes('memory') ||
      context.toLowerCase().includes('story') ||
      context.toLowerCase().includes('family') ||
      context.toLowerCase().includes('special') ||
      context.toLowerCase().includes('table') ||
      context.toLowerCase().includes('crew') ||
      context.toLowerCase().includes('moment')
    );
    currentFeedbackMode = isMemoryMode ? 'memory' : 'taste_note';

    // 1. Eyebrow
    const eyebrowEl = $('#feedback-eyebrow');
    if (eyebrowEl) {
      eyebrowEl.textContent = isMemoryMode ? 'A SWEET MOMENT · SHARED WITH LOVE' : 'A LITTLE NOTE MEANS A LOT';
    }

    // 2. Title
    const titleEl = $('#feedback-title');
    if (titleEl) {
      if (isMemoryMode) {
        titleEl.innerHTML = 'Tell us your <em>chocolate story.</em>';
      } else {
        titleEl.innerHTML = productName
          ? `Taste note for <em>${escapeHTML(productName)}</em>`
          : 'Help us make <em>more memories.</em>';
      }
    }

    // 3. Intro
    const introEl = $('#feedback-intro');
    if (introEl) {
      if (isMemoryMode) {
        introEl.innerHTML = 'Some memories happen around a Sunday table, some in a late-night text, and some with the last chocolate split in half. Tell us about a moment made sweeter with chocolate.';
      } else if (productName) {
        introEl.innerHTML = `Tell us what you noticed in your sample of <strong>${escapeHTML(productName)}</strong> — the first taste, the texture, and the feeling it left behind.`;
      } else {
        introEl.innerHTML = 'Tell us what you noticed in your sample — the first taste, the texture, and the feeling it left behind. Your honest little note helps our tiny kitchen make every bite better.';
      }
    }

    // 4. Dropdown Label & Context Options
    const ctxTitle = $('#feedback-context-title');
    const ctxEl = $('#feedback-context') as HTMLSelectElement | null;
    if (ctxTitle) {
      ctxTitle.textContent = isMemoryMode ? 'WHAT WAS THIS MOMENT ABOUT?' : 'WHICH SAMPLE DID YOU TRY?';
    }

    if (ctxEl) {
      if (isMemoryMode) {
        const memoryOptions = [
          'Family table & Sunday memories',
          'A gift for someone special',
          'Late-night laughs with friends',
          'A small win for myself',
          'Our OiAI chocolate story',
          'Just because / Sweet craving',
        ];
        ctxEl.innerHTML = '';
        memoryOptions.forEach(opt => {
          const optEl = document.createElement('option');
          optEl.value = opt;
          optEl.textContent = opt;
          ctxEl.appendChild(optEl);
        });
        const target = (context || '').toLowerCase().trim();
        for (let i = 0; i < ctxEl.options.length; i++) {
          if (ctxEl.options[i].value.toLowerCase().includes(target) || (target && target.includes(ctxEl.options[i].value.toLowerCase()))) {
            ctxEl.selectedIndex = i;
            break;
          }
        }
      } else {
        // Fetch or ensure chocolate options
        fetch('/api/site-settings')
          .then(r => r.json())
          .then(data => {
            if (data && Array.isArray(data.sampleOptions) && data.sampleOptions.length > 0) {
              ctxEl.innerHTML = '';
              data.sampleOptions.forEach((opt: string) => {
                const optEl = document.createElement('option');
                optEl.value = opt;
                optEl.textContent = opt;
                ctxEl.appendChild(optEl);
              });
              const target = (productName || context || '').toLowerCase().trim();
              for (let i = 0; i < ctxEl.options.length; i++) {
                const val = ctxEl.options[i].value.toLowerCase().trim();
                const text = ctxEl.options[i].text.toLowerCase().trim();
                if (val === target || text.includes(target) || (target && target.includes(val))) {
                  ctxEl.selectedIndex = i;
                  return;
                }
              }
              if (productName) {
                const newOpt = document.createElement('option');
                newOpt.value = productName;
                newOpt.textContent = productName;
                ctxEl.appendChild(newOpt);
                ctxEl.selectedIndex = ctxEl.options.length - 1;
              }
            }
          })
          .catch(() => {});

        const target = (productName || context || '').toLowerCase().trim();
        let matched = false;
        for (let i = 0; i < ctxEl.options.length; i++) {
          const val = ctxEl.options[i].value.toLowerCase().trim();
          const text = ctxEl.options[i].text.toLowerCase().trim();
          if (val === target || text.includes(target) || (target && target.includes(val))) {
            ctxEl.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched && productName) {
          const newOpt = document.createElement('option');
          newOpt.value = productName;
          newOpt.textContent = productName;
          ctxEl.appendChild(newOpt);
          ctxEl.selectedIndex = ctxEl.options.length - 1;
        }
      }
    }

    // 5. Rating Legend
    const ratingLegend = $('#feedback-rating-legend');
    if (ratingLegend) {
      ratingLegend.innerHTML = isMemoryMode
        ? 'HOW SPECIAL WAS THAT MOMENT? <span>Pick one</span>'
        : 'HOW WAS THAT FIRST BITE? <span>Pick one</span>';
    }

    // 6. Feelings Legend
    const feelingsLegend = $('#feedback-feelings-legend');
    if (feelingsLegend) {
      feelingsLegend.innerHTML = isMemoryMode
        ? 'WHAT DID IT LEAVE YOU FEELING? <span>Choose any</span>'
        : 'WHAT DID IT MAKE YOU FEEL? <span>Choose any</span>';
    }

    // 7. Story Title & Placeholder
    const storyTitle = $('#feedback-story-title');
    if (storyTitle) {
      storyTitle.textContent = isMemoryMode ? 'YOUR STORY OR MEMORY' : 'YOUR LITTLE TASTE NOTE';
    }
    const msgEl = $('#feedback-message') as HTMLTextAreaElement | null;
    if (msgEl) {
      if (isMemoryMode) {
        msgEl.placeholder = 'Tell us who you shared it with, the occasion, or what made that moment unforgettable…';
      } else if (productName) {
        msgEl.placeholder = `Tell us what you think of ${productName} — the taste, the texture, or what you felt…`;
      } else {
        msgEl.placeholder = 'Describe the taste, the texture, the moment — or what you’d make even better…';
      }
    }

    // 8. Submit Button Text
    const submitText = $('#feedback-submit-text');
    if (submitText) {
      submitText.textContent = isMemoryMode ? 'Share my story' : 'Send my little note';
    }

    $('#feedback-backdrop').classList.add('open');
    $('#feedback-modal').classList.add('open');
    $('#feedback-modal').setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    const nameInput = $('#feedback-name') as HTMLInputElement | null;
    if (nameInput) setTimeout(() => nameInput.focus(), 150);
  }
  function closeFeedback() {
    $('#feedback-backdrop').classList.remove('open');
    $('#feedback-modal').classList.remove('open');
    $('#feedback-modal').setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    // Reset form so next open is fresh
    const form = $('#feedback-form');
    if (form) {
      form.reset();
      form.hidden = false;
    }
    $('#feedback-thanks').hidden = true;
    $('#feedback-error').hidden = true;
  }
  // Memory cards for "For the people who feel like home" are now display-only (no feedback modal on click)
  $$('[data-feedback-open]').forEach(button => button.addEventListener('click', () => openFeedback(button.dataset.feedbackOpen || 'Your OiAI story', button.dataset.productName || '', button.dataset.productId || '')));
  $('#feedback-close').addEventListener('click', closeFeedback);
  $('#feedback-backdrop').addEventListener('click', closeFeedback);
  const fbResetBtn = $('#feedback-reset-btn'); if (fbResetBtn) fbResetBtn.addEventListener('click', () => { const form = $('#feedback-form'); if (form) { form.reset(); form.hidden = false; } if ($('#feedback-thanks')) $('#feedback-thanks').hidden = true; if ($('#feedback-error')) $('#feedback-error').hidden = true; });

  // Wire up the success overlay close button
  const successCloseBtn = $('#success-close-btn');
  function closeSuccessOverlay() {
    const overlay = $('#feedback-success-overlay') as HTMLElement | null;
    if (overlay) { overlay.style.display = 'none'; overlay.setAttribute('aria-hidden', 'true'); }
    document.body.classList.remove('no-scroll');
  }
  if (successCloseBtn) successCloseBtn.addEventListener('click', closeSuccessOverlay);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeSuccessOverlay(); } });
  $('#feedback-form').addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const submit = form.querySelector('button[type="submit"]');
    const name = $('#feedback-name').value.trim();
    const rating = Number(form.querySelector('input[name="sample_rating"]:checked')?.value || 0);
    const feelings = [...form.querySelectorAll('input[name="feeling"]:checked')].map(input => input.value);
    const payload = {
      name,
      email: $('#feedback-email').value.trim(),
      context: $('#feedback-context').value,
      rating,
      feelings,
      message: $('#feedback-message').value.trim(),
      productId: activeFeedbackProduct.id,
      productName: activeFeedbackProduct.name,
      pageUrl: window.location.pathname
    };

    const originalLabel = submit.innerHTML;
    submit.disabled = true;
    submit.innerHTML = '<span>Sending your note…</span>';
    $('#feedback-error').hidden = true;

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Your feedback could not be saved. Please try again.');

      const feelingLine = feelings.length ? ` It left you feeling ${feelings.join(', ').toLowerCase()}.` : '';
      // Close the feedback modal and show the separate success overlay
      closeFeedback();
      const overlay = $('#feedback-success-overlay') as HTMLElement | null;
      const heading = $('#success-heading');
      const msg = $('#success-message');
      if (currentFeedbackMode === 'memory') {
        if (heading) heading.textContent = 'That story made our day.';
        if (msg) msg.textContent = `Thank you, ${name}. Your story has been saved to our little memory album.${feelingLine} Stories like yours are why our tiny kitchen loves what we do.`;
      } else {
        if (heading) heading.textContent = 'That was sweeter than chocolate.';
        if (msg) msg.textContent = `Thank you, ${name}. Your ${rating}/5 sample rating is part of our little story.${feelingLine} Your note means a lot to our tiny kitchen.`;
      }
      if (overlay) {
        overlay.style.display = 'flex';
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
        const closeBtn = $('#success-close-btn');
        if (closeBtn) closeBtn.focus();
      }
    } catch (error) {
      $('#feedback-error').textContent = error.message || 'Your feedback could not be saved. Please try again.';
      $('#feedback-error').hidden = false;
    } finally {
      submit.disabled = false;
      submit.innerHTML = originalLabel;
    }
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeFeedback(); });

  // Product shelf interactions.
  $('#filter-list').addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (button) setFilter(button.dataset.filter);
  });
  $('#category-grid').addEventListener('click', event => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    setFilter(button.dataset.category);
    $('#shop').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
  $('#product-grid').addEventListener('click', event => {
    const card = event.target.closest('.product-card[data-product-id]');
    if (card) {
      const prodName = card.dataset.productName || '';
      const prodId = card.dataset.productId || '';
      openFeedback(prodName, prodName, prodId);
    }
  });
  $('#quick-view-content').addEventListener('click', event => {
    const feedback = event.target.closest('[data-feedback-open]');
    if (feedback) { const context = feedback.dataset.feedbackOpen || 'Chocolate I tried'; closeQuickView(); openFeedback(context, feedback.dataset.productName || '', feedback.dataset.productId || ''); }
  });
  $('#cart-items').addEventListener('click', event => {
    const qty = event.target.closest('[data-qty]');
    const remove = event.target.closest('[data-remove]');
    if (qty) {
      const id = Number(qty.dataset.qty), change = Number(qty.dataset.change);
      const item = state.cart.find(row => row.id === id);
      if (item) { item.qty += change; if (item.qty <= 0) state.cart = state.cart.filter(row => row.id !== id); }
      renderCart();
    }
    if (remove) { state.cart = state.cart.filter(row => row.id !== Number(remove.dataset.remove)); renderCart(); }
  });
  $('#cart-open').addEventListener('click', openCart);
  $('#mobile-cart-open').addEventListener('click', openCart);
  $('#cart-close').addEventListener('click', closeCart);
  $('#drawer-backdrop').addEventListener('click', closeCart);
  $('#keep-shopping').addEventListener('click', () => { closeCart(); $('#shop').scrollIntoView({ behavior: 'smooth' }); });
  $('#continue-shopping').addEventListener('click', () => { closeCart(); $('#shop').scrollIntoView({ behavior: 'smooth' }); });
  $('#toast-view').addEventListener('click', () => { $('#toast').classList.remove('show'); openCart(); });
  $('#modal-close').addEventListener('click', closeQuickView);
  $('#modal-backdrop').addEventListener('click', closeQuickView);



  $('#reset-filters').addEventListener('click', () => { state.filter = 'All'; renderProducts(); });
  $('#back-to-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  $$('[data-category-jump]').forEach(button => button.addEventListener('click', () => {
    const requested = button.dataset.categoryJump;
    // Gifts is an editorial destination, not a product filter; show every giftable item.
    setFilter(requested === 'Gifts' ? 'All' : requested);
    if (requested === 'Gifts') $('#active-filter-note').textContent = 'Every bite is a little gift. Pick the one that feels like them.';
    $('#shop').scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }));
  $('#checkout-button').addEventListener('click', () => { if (!state.cart.length) return; showAnnouncement('OiAI is a little kitchen made for moments worth sharing ♥'); });
  $('#newsletter-form').addEventListener('submit', async event => {
    event.preventDefault();
    const input = $('#newsletter-email');
    if (!input.checkValidity()) { input.reportValidity(); return; }
    const emailVal = input.value.trim();
    $('#newsletter-message').textContent = 'Subscribing…';
    $('#newsletter-message').style.color = '#79512d';

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailVal })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Could not subscribe right now.');
      $('#newsletter-message').textContent = 'You’re on the list. Something sweet is coming your way ♥';
      $('#newsletter-message').style.color = '#79512d';
      input.value = '';
      showAnnouncement('You’re on the list. Welcome to the sweet side ♥');
    } catch (err) {
      $('#newsletter-message').textContent = err.message || 'Something went wrong. Please try again.';
      $('#newsletter-message').style.color = '#b0352b';
    }
  });
  $('#mobile-menu').addEventListener('click', () => {
    $('#sidebar').classList.add('mobile-open');
    $('#mobile-backdrop').classList.add('open');
    document.body.classList.add('no-scroll');
    $('#sidebar-close').focus();
  });
  $('#sidebar-close').addEventListener('click', closeMobileNav);
  $('#mobile-backdrop').addEventListener('click', closeMobileNav);
  $$('.nav-link').forEach(link => link.addEventListener('click', () => {
    closeMobileNav();
    $$('.nav-link').forEach(item => item.classList.toggle('is-active', item === link));
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeCart(); closeQuickView(); closeMobileNav(); $('#toast').classList.remove('show'); }
  });

  // Keep the active sidebar item in sync with the section in view.
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        const link = $(`[data-nav="${entry.target.id}"]`);
        if (link) $$('.nav-link').forEach(item => item.classList.toggle('is-active', item === link));
      }
    }), { rootMargin: '-28% 0px -58% 0px', threshold: 0 });
    ['collections', 'shop', 'our-story', 'moments', 'gifting'].forEach(id => { const el = document.getElementById(id); if (el) sectionObserver.observe(el); });
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); }
    }), { threshold: .12 });
    $$('.reveal').forEach(el => revealObserver.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in-view'));
  }

  // Small, slow cocoa flecks; disabled for users who request reduced motion.
  (function startCocoaDust() {
    const canvas = $('#cocoa-dust');
    const ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let width = 0, height = 0, particles = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    function resize() {
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: Math.min(28, Math.floor(width / 38)) }, () => ({ x: Math.random() * width, y: Math.random() * height, r: Math.random() * 1.4 + .35, s: Math.random() * .22 + .07, a: Math.random() * .18 + .04, phase: Math.random() * Math.PI * 2 }));
    }
    function frame(t) {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.y -= p.s; p.x += Math.sin(t * .0003 + p.phase) * .1; if (p.y < -4) { p.y = height + 4; p.x = Math.random() * width; } ctx.beginPath(); ctx.fillStyle = `rgba(112,57,27,${p.a})`; ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); });
      requestAnimationFrame(frame);
    }
    resize(); window.addEventListener('resize', resize, { passive: true }); requestAnimationFrame(frame);
  })();


  // One continuous SVG sheet: irregular, rounded drops stretch at different rates under gravity.
  (function animateChocolateSheet() {
    const surface = document.getElementById('melt-path');
    const edge = document.getElementById('melt-edge-path');
    if (!surface || !edge) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Positions, widths and depths are deliberately uneven; the SVG viewBox has room for the longest drop.
    const drips = [
      { x: 79, w: 49, len: 92, p: .3 },
      { x: 236, w: 26, len: 44, p: 2.1 },
      { x: 411, w: 73, len: 145, p: 4.7 },
      { x: 624, w: 34, len: 60, p: 1.3 },
      { x: 806, w: 96, len: 189, p: 5.5 },
      { x: 1034, w: 41, len: 82, p: 3.2 },
      { x: 1199, w: 68, len: 132, p: .8 },
      { x: 1401, w: 78, len: 174, p: 4.0 }
    ];
    const base = (x, phase) => 77
      + Math.sin(x * .0045 + phase) * 7.2
      + Math.sin(x * .0127 - phase * 2) * 4.3
      + Math.sin(x * .025 + phase * 3) * 1.7;

    function draw(phase) {
      const startY = base(0, phase);
      let boundary = `M0 ${startY.toFixed(2)}`;
      let cursor = 0;

      for (const drip of drips) {
        const center = drip.x + Math.sin(phase + drip.p) * 2.8;
        const width = drip.w * (1 + Math.sin(phase * 2 + drip.p) * .018);
        const left = center - width * (.43 + .035 * Math.sin(drip.p));
        const right = center + width * (.51 + .045 * Math.cos(drip.p));
        const yL = base(left, phase);
        const yR = base(right, phase);
        const length = drip.len + (reduceMotion ? 0 : Math.sin(phase + drip.p) * 10 + Math.sin(phase * 2 + drip.p * 1.4) * 4.5);
        const gap = Math.max(3, left - cursor);

        // Ease into each drip from a living, slightly wobbly sheet edge.
        boundary += ` C${(cursor + gap * .36).toFixed(2)} ${(base(cursor, phase) + 2.5).toFixed(2)}, ${(left - gap * .13).toFixed(2)} ${(yL - 5.2).toFixed(2)}, ${left.toFixed(2)} ${yL.toFixed(2)}`;
        // Left shoulder narrows into a long, rounded tongue.
        boundary += ` C${(left + width * .025).toFixed(2)} ${(yL + length * .24).toFixed(2)}, ${(center - width * .48).toFixed(2)} ${(yL + length * .74).toFixed(2)}, ${(center - width * .12).toFixed(2)} ${(yL + length * .92).toFixed(2)}`;
        // A bulb-like tip keeps the bottom soft instead of pointed or cut off.
        boundary += ` C${(center - width * .015).toFixed(2)} ${(yL + length * 1.12).toFixed(2)}, ${(center + width * .31).toFixed(2)} ${(yL + length * 1.08).toFixed(2)}, ${(center + width * .34).toFixed(2)} ${(yL + length * .81).toFixed(2)}`;
        // Uneven right shoulder returns to the flowing edge.
        boundary += ` C${(center + width * .39).toFixed(2)} ${(yL + length * .50).toFixed(2)}, ${(right - 1.5).toFixed(2)} ${(yR + 4.5).toFixed(2)}, ${right.toFixed(2)} ${yR.toFixed(2)}`;
        cursor = right;
      }

      const tail = 1440 - cursor;
      boundary += ` C${(cursor + tail * .30).toFixed(2)} ${(base(cursor, phase) + 4).toFixed(2)}, ${(1440 - tail * .18).toFixed(2)} ${(base(1440, phase) + 3).toFixed(2)}, 1440 ${base(1440, phase).toFixed(2)}`;
      const fillPath = `M0 0 L0 ${startY.toFixed(2)} ${boundary.slice(boundary.indexOf(' C'))} L1440 0 Z`;
      surface.setAttribute('d', fillPath);
      edge.setAttribute('d', boundary);
    }

    draw(0);
    if (reduceMotion) return;
    let currentPhase = 0;
    let nativeFrameId = 0;
    let gsapStarted = false;
    const startGsapMotion = () => {
      if (!window.gsap || typeof window.gsap.timeline !== 'function' || gsapStarted) return;
      gsapStarted = true;
      if (nativeFrameId) cancelAnimationFrame(nativeFrameId);
      const motion = { phase: currentPhase };
      gsap.timeline({ repeat: -1, defaults: { ease: 'none' } })
        .to(motion, { phase: currentPhase + Math.PI * 2, duration: 18, onUpdate: () => { currentPhase = motion.phase; draw(motion.phase); } });
    };
    if (window.gsap && typeof window.gsap.timeline === 'function') {
      startGsapMotion();
    } else {
      const frame = time => {
        if (gsapStarted) return;
        currentPhase = time * .00034;
        draw(currentPhase);
        nativeFrameId = requestAnimationFrame(frame);
      };
      nativeFrameId = requestAnimationFrame(frame);
      window.addEventListener('oiai-gsap-loaded', startGsapMotion, { once: true });
    }
  })();

  // Buttons get one connected wave of chocolate with a stretched tail, never a shower of separate pebbles.
  (function addLiquidButtonMotion() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    document.addEventListener('click', event => {
      const target = event.target.closest('.button, .button-ink, .button-paper, .text-arrow, .nav-link, .filter-chip, .round-action, #copy-coupon');
      if (!target || target.disabled || target.classList.contains('mobile-close')) return;
      if (target.querySelector('.button-liquid-shell')) return;
      target.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          const label = document.createElement('span');
          label.className = 'button-label-layer';
          label.textContent = node.textContent;
          node.replaceWith(label);
        }
      });
      const shell = document.createElement('span');
      shell.className = 'button-liquid-shell';
      shell.setAttribute('aria-hidden', 'true');
      const wave = document.createElement('span'); wave.className = 'button-liquid-wave';
      const drop = document.createElement('span'); drop.className = 'button-liquid-drop';
      drop.style.setProperty('--drop-x', `${48 + Math.random() * 44}%`);
      shell.append(wave, drop);
      target.prepend(shell);
      // Three connected, stretched drips run over the lower edge like thick melted chocolate.
      const tails = [];
      const positions = [14 + Math.random() * 12, 45 + Math.random() * 10, 76 + Math.random() * 11];
      positions.forEach((pos, index) => {
        const tail = document.createElement('span');
        tail.className = 'button-liquid-tail';
        tail.setAttribute('aria-hidden', 'true');
        tail.style.setProperty('--tail-x', `${pos}%`);
        tail.style.setProperty('--tail-top', `${68 + Math.random() * 19}%`);
        tail.style.setProperty('--tail-width', `${8 + Math.random() * 7}px`);
        tail.style.setProperty('--tail-height', `${17 + Math.random() * 21}px`);
        tail.style.animationDelay = `${index * 45}ms`;
        target.append(tail);
        tails.push(tail);
      });
      requestAnimationFrame(() => {
        shell.classList.add('is-flowing');
        tails.forEach(tail => tail.classList.add('is-running'));
      });
      const cleanup = () => { if (shell.isConnected) shell.remove(); tails.forEach(tail => tail.remove()); };
      window.setTimeout(cleanup, 1250);
    }, { passive: true });
  })();

  $('#year').textContent = new Date().getFullYear();
  renderProducts();
  renderCart();

  // Load live products from Supabase database
  if (typeof fetch === 'function') {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data?.products) && data.products.length > 0) {
          PRODUCTS = data.products.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price) || 349,
            weight: p.weight || 'Box of 6 pieces (120g)',
            personality: p.personality || '',
            tagline: p.tagline || '',
            ingredients: p.ingredients || '',
            filter: p.category || 'Filled Centres',
            category: p.category || 'Filled Centres',
            kind: p.kind || 'DARK CHOCOLATE',
            badge: p.badge || 'SMALL BATCH',
            desc: p.description || '',
            description: p.description || '',
            notes: p.notes || '',
            image: p.image || fallbackPhoto,
            tint: '#a56842'
          }));
          renderProducts();
        }
      })
      .catch(() => {});
  }

  /* Analogue album effects: uses the existing nine chocolate photos and respects reduced-motion. */
  (function initOiAIPhotoAlbum() {
    const art = document.querySelector('.hero-art');
    const mainPhoto = document.querySelector('.hero-photo');
    if (!art || !mainPhoto || !Array.isArray(PRODUCTS) || PRODUCTS.length === 0) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frame = document.querySelector('.hero-photo-frame');
    const caption = frame && frame.querySelector('.photo-caption b');
    const snapshots = [document.querySelector('.snapshot-image-a'), document.querySelector('.snapshot-image-b')].filter(Boolean);
    let index = -1;
    let resizeColumns = getProductColumns();

    // Put real catalogue photos in the little instant prints before the first animation.
    if (snapshots[0]) snapshots[0].src = PRODUCTS[3]?.image || PRODUCTS[0].image;
    if (snapshots[1]) snapshots[1].src = PRODUCTS[7]?.image || PRODUCTS[1].image;
    snapshots.forEach((img, i) => { img.decoding = 'async'; img.loading = 'lazy'; img.dataset.roll = String(i); });

    const develop = () => {
      if (document.visibilityState === 'hidden') return;
      index = (index + 1) % PRODUCTS.length;
      const product = PRODUCTS[index];
      mainPhoto.classList.add('is-developing');
      art.classList.remove('flash-fired');
      // Force a new CSS animation cycle so the flash is short, not a permanent overlay.
      void art.offsetWidth;
      window.setTimeout(() => {
        mainPhoto.src = product.image;
        mainPhoto.alt = product.name;
        if (caption) caption.textContent = product.badge.toLowerCase().replace(/\b\w/g, ch => ch.toUpperCase());
        mainPhoto.classList.remove('is-developing');
        art.classList.add('flash-fired');
        window.setTimeout(() => art.classList.remove('flash-fired'), 700);
      }, 220);
      if (snapshots.length) {
        const shot = snapshots[index % snapshots.length];
        shot.style.opacity = '.15';
        window.setTimeout(() => { shot.src = product.image; shot.style.opacity = '1'; }, 300);
        shot.closest('.camera-snapshot')?.classList.toggle('snapshot-new');
      }
    };

    if (!reduced) window.setInterval(develop, 4600);
    // If the viewport crosses a breakpoint, rebuild rows so each card still has a rope above it.
    window.addEventListener('resize', () => {
      const nextColumns = getProductColumns();
      if (nextColumns !== resizeColumns) { resizeColumns = nextColumns; renderProducts(); }
    }, { passive: true });
  })();

  /* OiAI intro finish: cocoa, caramel and cream flecks burst out instead of cutting to black. */
  (function runOiAIIntro() {
    const intro = document.getElementById('oiai-intro');
    const canvas = document.getElementById('oiai-intro-particles');
    if (!intro || !canvas) return;
    const ctx = canvas.getContext && canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let particles = [];
    const palette = ['#4b1e0d', '#6e321a', '#98542e', '#c38a50', '#e2bd83', '#f6e8ca', '#fffaf0', '#b67a45'];

    function burst() {
      if (intro.dataset.burstStarted === 'true') return;
      intro.dataset.burstStarted = 'true';
      if (ctx && !reduced) {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        const cx = width * .5;
        const cy = height * .49;
        const count = Math.min(width < 600 ? 112 : 174, Math.max(76, Math.floor(width * .22)));
        particles = Array.from({ length: count }, (_, i) => {
          const angle = (Math.PI * 2 * i / count) + (Math.random() - .5) * .23;
          const speed = 2.1 + Math.random() * 7.2;
          return {
            x: cx + (Math.random() - .5) * 20,
            y: cy + (Math.random() - .5) * 20,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: 1.6 + Math.random() * 4.8,
            rotation: Math.random() * Math.PI,
            spin: (Math.random() - .5) * .22,
            life: .72 + Math.random() * .38,
            decay: .010 + Math.random() * .008,
            color: palette[Math.floor(Math.random() * palette.length)],
            shape: Math.random() > .58 ? 'square' : 'dot'
          };
        });
        const draw = () => {
          ctx.clearRect(0, 0, width, height);
          let alive = 0;
          for (const p of particles) {
            if (p.life <= 0) continue;
            alive++;
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= .986;
            p.vy = p.vy * .986 + .025;
            p.rotation += p.spin;
            p.life -= p.decay;
            ctx.save();
            ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            if (p.shape === 'square') {
              ctx.fillRect(-p.size * .7, -p.size * .7, p.size * 1.4, p.size * 1.4);
            } else {
              ctx.beginPath();
              ctx.ellipse(0, 0, p.size, p.size * .72, 0, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          }
          if (alive > 0 && intro.isConnected) frame = window.requestAnimationFrame(draw);
          else ctx.clearRect(0, 0, width, height);
        };
        frame = window.requestAnimationFrame(draw);
      }
      intro.classList.add('is-bursting');
      window.setTimeout(() => {
        if (frame) window.cancelAnimationFrame(frame);
        intro.remove();
        canvas.remove();
        document.body.classList.remove('intro-active');
      }, reduced ? 260 : 1100);
    }

    window.setTimeout(burst, reduced ? 900 : 3800);
  })();
}
