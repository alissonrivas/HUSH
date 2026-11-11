"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const STORAGE_KEYS = {
    cart: "hush_cart_v1",
    favorites: "hush_favorites_v1",
    listings: "hush_listings_v1",
    announcement: "hush_announcement_closed_v1"
  };

  // Starter content for the front-end demonstration. Replace it with API data in production.
  const starterProducts = [
    {
      id: "hush-001", title: "Suéter de punto", price: 18, category: "mujer", brand: "Zara",
      seller: "@lily.shop", condition: "Muy buen estado", badge: "Pre-loved",
      description: "Suéter suave de punto en tono rosa empolvado. Una pieza versátil para combinar en días frescos.",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: "hush-002", title: "Top estructurado", price: 15, category: "mujer", brand: "Bershka",
      seller: "@valea22", condition: "Como nuevo", badge: "Buena elección",
      description: "Top de diseño estructurado, ideal para crear looks casuales o para una ocasión especial.",
      image: "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: "hush-003", title: "Jeans wide leg", price: 22, category: "hombre", brand: "Pull&Bear",
      seller: "@paula.style", condition: "Muy buen estado", badge: "Pre-loved",
      description: "Jeans de corte amplio y tono clásico. Revisa las medidas con el vendedor antes de comprar.",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: "hush-004", title: "Bolso mini", price: 35, category: "accesorios", brand: "H&M",
      seller: "@sofi.closet", condition: "Como nuevo", badge: "Pre-loved",
      description: "Bolso compacto para llevar lo esencial. Diseño minimalista que combina con diferentes estilos.",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: "hush-005", title: "Sneakers clásicos", price: 60, category: "calzado", brand: "Nike",
      seller: "@karen.store", condition: "Buen estado", badge: "Pre-loved",
      description: "Sneakers de estilo clásico. Consulta la talla, el estado de la suela y más fotografías al vendedor.",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: "hush-006", title: "Vestido midi", price: 26, category: "mujer", brand: "Zara",
      seller: "@marla.closet", condition: "Muy buen estado", badge: "Pre-loved",
      description: "Vestido midi de silueta fluida. Una prenda fácil de adaptar a diferentes ocasiones.",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: "hush-007", title: "Camisa blanca", price: 17, category: "hombre", brand: "H&M",
      seller: "@closet.nico", condition: "Como nuevo", badge: "Pre-loved",
      description: "Camisa blanca de estilo sencillo, ideal para un armario versátil.",
      image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: "hush-008", title: "Bolso de hombro", price: 29, category: "accesorios", brand: "Bershka",
      seller: "@sofi.closet", condition: "Buen estado", badge: "Pre-loved",
      description: "Bolso de hombro en color neutro. Consulta al vendedor cualquier detalle adicional.",
      image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85"
    },
    {
      id: "hush-009", title: "Tenis urbanos", price: 42, category: "calzado", brand: "adidas",
      seller: "@street.finds", condition: "Muy buen estado", badge: "Pre-loved",
      description: "Tenis urbanos para uso diario. Comprueba la talla y solicita imágenes actuales antes de cerrar la compra.",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=85"
    }
  ];

  const state = {
    products: [...starterProducts],
    cart: readStorage(STORAGE_KEYS.cart, {}),
    favorites: new Set(readStorage(STORAGE_KEYS.favorites, [])),
    category: "todos",
    brand: "",
    query: "",
    sort: "featured",
    toastTimer: null
  };

  const elements = {
    menuToggle: $("#menuToggle"), navLinks: $("#navLinks"), searchBtn: $("#searchBtn"),
    searchPanel: $("#searchPanel"), searchInput: $("#searchInput"), clearSearch: $("#clearSearch"),
    productGrid: $("#productGrid"), emptyState: $("#emptyState"), activeFilters: $("#activeFilters"),
    cartCount: $("#cartCount"), favoriteCount: $("#favoriteCount"), toast: $("#toast"),
    cartDialog: $("#cartDialog"), favoritesDialog: $("#favoritesDialog"), productDialog: $("#productDialog"),
    sellDialog: $("#sellDialog"), accountDialog: $("#accountDialog"), cartItems: $("#cartItems"),
    favoriteItems: $("#favoriteItems"), cartSubtotal: $("#cartSubtotal"), sortSelect: $("#sortSelect")
  };

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.warn(`No se pudo leer ${key} desde localStorage.`, error);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn(`No se pudo guardar ${key} en localStorage.`, error);
      showToast("Tu navegador no permitió guardar este cambio.");
      return false;
    }
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function safeImageURL(value) {
    try {
      const url = new URL(value);
      return url.protocol === "https:" ? url.href : "";
    } catch {
      return "";
    }
  }

  function money(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
  }

  function categoryLabel(category) {
    return ({ mujer: "Mujer", hombre: "Hombre", accesorios: "Accesorios", calzado: "Calzado" })[category] || "Moda";
  }

  function productById(id) {
    return state.products.find(product => product.id === id);
  }

  function persistCart() { writeStorage(STORAGE_KEYS.cart, state.cart); }
  function persistFavorites() { writeStorage(STORAGE_KEYS.favorites, [...state.favorites]); }

  function cartQuantity() {
    return Object.values(state.cart).reduce((sum, qty) => sum + Number(qty || 0), 0);
  }

  function updateHeaderCounts() {
    elements.cartCount.textContent = cartQuantity();
    elements.favoriteCount.textContent = state.favorites.size || "";
    elements.cartCount.setAttribute("aria-label", `${cartQuantity()} productos en el carrito`);
  }

  function getVisibleProducts() {
    let visible = [...state.products];
    if (state.category !== "todos") visible = visible.filter(product => product.category === state.category);
    if (state.brand) visible = visible.filter(product => product.brand.toLowerCase() === state.brand.toLowerCase());
    if (state.query) {
      const query = state.query.toLocaleLowerCase("es");
      visible = visible.filter(product => [product.title, product.brand, product.seller, product.category, product.condition, product.description]
        .join(" ").toLocaleLowerCase("es").includes(query));
    }
    switch (state.sort) {
      case "price-asc": visible.sort((a, b) => a.price - b.price); break;
      case "price-desc": visible.sort((a, b) => b.price - a.price); break;
      case "name": visible.sort((a, b) => a.title.localeCompare(b.title, "es")); break;
      default: visible.sort((a, b) => state.products.indexOf(a) - state.products.indexOf(b));
    }
    return visible;
  }

  function productCard(product) {
    const isFavorite = state.favorites.has(product.id);
    const image = safeImageURL(product.image) || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85";
    return `
      <article class="product-card" data-product-card="${escapeHTML(product.id)}">
        <div class="product-image-wrap">
          <img src="${escapeHTML(image)}" alt="${escapeHTML(product.title)}" loading="lazy" data-fallback-image>
          <span class="product-badge">${escapeHTML(product.badge || "Pre-loved")}</span>
          <button class="product-favorite ${isFavorite ? "is-favorite" : ""}" type="button" data-action="favorite" data-id="${escapeHTML(product.id)}" aria-label="${isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}" aria-pressed="${isFavorite}">${isFavorite ? "♥" : "♡"}</button>
          <button class="quick-view" type="button" data-action="details" data-id="${escapeHTML(product.id)}">Ver detalles</button>
        </div>
        <div class="product-info">
          <div class="product-title-row"><h3>${escapeHTML(product.title)}</h3><span class="product-price">${money(product.price)}</span></div>
          <div class="product-meta"><span>${escapeHTML(product.brand)}</span><span>${escapeHTML(product.condition)}</span></div>
          <div class="product-actions"><button class="add-cart" type="button" data-action="add-cart" data-id="${escapeHTML(product.id)}">Añadir al carrito +</button><span class="product-seller">${escapeHTML(product.seller)}</span></div>
        </div>
      </article>`;
  }

  function renderProducts() {
    const visible = getVisibleProducts();
    elements.productGrid.innerHTML = visible.map(productCard).join("");
    elements.emptyState.hidden = visible.length > 0;
    elements.productGrid.hidden = visible.length === 0;

    const filters = [];
    if (state.category !== "todos") filters.push(`Categoría: ${categoryLabel(state.category)}`);
    if (state.brand) filters.push(`Marca: ${state.brand}`);
    if (state.query) filters.push(`Búsqueda: “${state.query}”`);
    elements.activeFilters.innerHTML = filters.length
      ? `${filters.map(escapeHTML).join(" · ")} <button type="button" data-action="clear-filters">Limpiar filtros ×</button>`
      : "";

    $$(".pill").forEach(button => {
      const active = button.dataset.filter === state.category;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    $$(".brand").forEach(button => button.classList.toggle("selected", button.dataset.brand.toLowerCase() === state.brand.toLowerCase() && !!state.brand));
  }

  function addToCart(id) {
    const product = productById(id);
    if (!product) return;
    state.cart[id] = (Number(state.cart[id]) || 0) + 1;
    persistCart();
    updateHeaderCounts();
    renderCart();
    showToast(`${product.title} se agregó a tu carrito.`);
  }

  function toggleFavorite(id) {
    const product = productById(id);
    if (!product) return;
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
      showToast("Prenda eliminada de tus favoritos.");
    } else {
      state.favorites.add(id);
      showToast("Prenda guardada en tus favoritos.");
    }
    persistFavorites();
    updateHeaderCounts();
    renderProducts();
    renderFavorites();
  }

  function renderCart() {
    const entries = Object.entries(state.cart).filter(([id, qty]) => productById(id) && Number(qty) > 0);
    const totalQty = entries.reduce((sum, [, qty]) => sum + Number(qty), 0);
    const subtotal = entries.reduce((sum, [id, qty]) => sum + productById(id).price * Number(qty), 0);
    $("#cartItemLabel").textContent = `(${totalQty})`;
    elements.cartSubtotal.textContent = money(subtotal);

    if (!entries.length) {
      elements.cartItems.innerHTML = `<div class="drawer-empty"><span aria-hidden="true">♡</span><h3>Tu carrito está esperando.</h3><p>Explora HUSH y agrega las prendas que te gusten.</p></div>`;
      return;
    }

    elements.cartItems.innerHTML = entries.map(([id, qty]) => {
      const product = productById(id);
      return `<div class="drawer-row">
        <img src="${escapeHTML(safeImageURL(product.image))}" alt="${escapeHTML(product.title)}" loading="lazy" data-fallback-image>
        <div class="drawer-row-info"><strong>${escapeHTML(product.title)}</strong><small>${escapeHTML(product.seller)}</small><span class="line-price">${money(product.price * Number(qty))}</span>
          <div class="quantity-control"><button type="button" data-action="decrease" data-id="${escapeHTML(id)}" aria-label="Quitar una unidad">−</button><span>${Number(qty)}</span><button type="button" data-action="increase" data-id="${escapeHTML(id)}" aria-label="Agregar una unidad">+</button></div>
        </div>
        <button class="remove-item" type="button" data-action="remove-cart" data-id="${escapeHTML(id)}" aria-label="Eliminar ${escapeHTML(product.title)}">×</button>
      </div>`;
    }).join("");
  }

  function renderFavorites() {
    const favorites = [...state.favorites].map(productById).filter(Boolean);
    $("#favoriteItemLabel").textContent = `(${favorites.length})`;
    if (!favorites.length) {
      elements.favoriteItems.innerHTML = `<div class="drawer-empty"><span aria-hidden="true">♡</span><h3>Aún no guardas favoritos.</h3><p>Usa el corazón de una prenda para tenerla a mano.</p></div>`;
      return;
    }
    elements.favoriteItems.innerHTML = favorites.map(product => `<div class="drawer-row">
      <img src="${escapeHTML(safeImageURL(product.image))}" alt="${escapeHTML(product.title)}" loading="lazy" data-fallback-image>
      <div class="drawer-row-info"><strong>${escapeHTML(product.title)}</strong><small>${escapeHTML(product.brand)} · ${escapeHTML(product.seller)}</small><span class="line-price">${money(product.price)}</span></div>
      <button class="remove-item" type="button" data-action="favorite" data-id="${escapeHTML(product.id)}" aria-label="Quitar ${escapeHTML(product.title)} de favoritos">♥</button>
    </div>`).join("");
  }

  function showProductDetails(id) {
    const product = productById(id);
    if (!product) return;
    const image = safeImageURL(product.image) || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85";
    $("#productDetail").innerHTML = `<div class="product-detail-grid">
      <div class="product-detail-image"><img src="${escapeHTML(image)}" alt="${escapeHTML(product.title)}" data-fallback-image></div>
      <div class="product-detail-copy"><p class="eyebrow">${escapeHTML(product.brand)} · ${escapeHTML(categoryLabel(product.category))}</p><h2 id="productDialogTitle">${escapeHTML(product.title)}</h2><strong class="product-detail-price">${money(product.price)}</strong><p>${escapeHTML(product.description)}</p>
        <div class="detail-meta"><span>Vendedor: <strong>${escapeHTML(product.seller)}</strong></span><span>Estado: <strong>${escapeHTML(product.condition)}</strong></span><span>Referencia: <strong>${escapeHTML(product.id)}</strong></span></div>
        <button class="btn btn-dark" type="button" data-action="detail-add" data-id="${escapeHTML(product.id)}">Añadir al carrito <span aria-hidden="true">↗</span></button>
      </div></div>`;
    openDialog(elements.productDialog);
  }

  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.body.classList.add("dialog-open");
  }

  function closeDialog(dialog) {
    if (!dialog || !dialog.open) return;
    dialog.close();
    if (!$$("dialog[open]").length) document.body.classList.remove("dialog-open");
  }

  function closeAllDialogs() {
    $$('dialog[open]').forEach(closeDialog);
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => elements.toast.classList.remove("show"), 2800);
  }

  function clearFilters() {
    state.category = "todos";
    state.brand = "";
    state.query = "";
    elements.searchInput.value = "";
    elements.sortSelect.value = "featured";
    state.sort = "featured";
    renderProducts();
  }

  // Header interactions
  elements.menuToggle.addEventListener("click", () => {
    const open = elements.navLinks.classList.toggle("open");
    elements.menuToggle.setAttribute("aria-expanded", String(open));
    elements.menuToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });

  $$(".nav-links a").forEach(link => link.addEventListener("click", () => {
    elements.navLinks.classList.remove("open");
    elements.menuToggle.setAttribute("aria-expanded", "false");
    elements.menuToggle.setAttribute("aria-label", "Abrir menú");
  }));

  elements.searchBtn.addEventListener("click", () => {
    const opening = elements.searchPanel.hidden;
    elements.searchPanel.hidden = !opening;
    elements.searchBtn.setAttribute("aria-expanded", String(opening));
    if (opening) elements.searchInput.focus();
    else {
      state.query = "";
      elements.searchInput.value = "";
      renderProducts();
    }
  });

  elements.searchInput.addEventListener("input", () => {
    state.query = elements.searchInput.value.trim();
    renderProducts();
    if (state.query) $("#tienda").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  elements.searchInput.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      elements.searchPanel.hidden = true;
      elements.searchBtn.setAttribute("aria-expanded", "false");
      elements.searchBtn.focus();
    }
  });

  elements.clearSearch.addEventListener("click", () => {
    elements.searchInput.value = "";
    state.query = "";
    elements.searchInput.focus();
    renderProducts();
  });

  $("#closeAnnouncement").addEventListener("click", () => {
    $("#announcement").hidden = true;
    writeStorage(STORAGE_KEYS.announcement, true);
  });
  if (readStorage(STORAGE_KEYS.announcement, false)) $("#announcement").hidden = true;

  // Category, brand and sort filters
  $$(".pill").forEach(button => button.addEventListener("click", () => {
    state.category = button.dataset.filter;
    renderProducts();
  }));

  elements.sortSelect.addEventListener("change", () => {
    state.sort = elements.sortSelect.value;
    renderProducts();
  });

  $("#brandList").addEventListener("click", event => {
    const button = event.target.closest("[data-brand]");
    if (!button) return;
    const selected = button.dataset.brand;
    state.brand = state.brand.toLowerCase() === selected.toLowerCase() ? "" : selected;
    renderProducts();
    $("#tienda").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#resetFilters").addEventListener("click", clearFilters);

  // Product actions are delegated so dynamically-added listings work too.
  document.addEventListener("click", event => {
    const closeTarget = event.target.closest("[data-close-dialog]");
    if (closeTarget) {
      const dialog = closeTarget.closest("dialog");
      closeDialog(dialog);
      return;
    }

    const actionTarget = event.target.closest("[data-action]");
    if (!actionTarget) return;
    const { action, id } = actionTarget.dataset;

    switch (action) {
      case "add-cart": addToCart(id); break;
      case "favorite": toggleFavorite(id); break;
      case "details": showProductDetails(id); break;
      case "detail-add":
        addToCart(id);
        closeDialog(elements.productDialog);
        openDialog(elements.cartDialog);
        break;
      case "increase":
        if (productById(id)) state.cart[id] = (Number(state.cart[id]) || 0) + 1;
        persistCart(); updateHeaderCounts(); renderCart(); break;
      case "decrease":
        if (state.cart[id] > 1) state.cart[id] -= 1;
        else delete state.cart[id];
        persistCart(); updateHeaderCounts(); renderCart(); break;
      case "remove-cart":
        delete state.cart[id]; persistCart(); updateHeaderCounts(); renderCart(); showToast("Producto eliminado del carrito."); break;
      case "clear-filters": clearFilters(); break;
      default: break;
    }
  });

  // Cart, favorites and account
  $("#cartBtn").addEventListener("click", () => { renderCart(); openDialog(elements.cartDialog); });
  $("#favoritesBtn").addEventListener("click", () => { renderFavorites(); openDialog(elements.favoritesDialog); });
  $("#profileBtn").addEventListener("click", () => openDialog(elements.accountDialog));
  $("#checkoutBtn").addEventListener("click", () => {
    showToast("El pago no está habilitado en esta demostración. Para vender de verdad, HUSH necesita integrar pagos y gestión de pedidos.");
  });

  // New listing: saved locally and immediately added to the catalog.
  $("#sellBtn").addEventListener("click", () => {
    $("#sellForm").reset();
    $("#sellFormError").textContent = "";
    openDialog(elements.sellDialog);
  });

  $("#sellForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get("title") || "").trim();
    const price = Number(data.get("price"));
    const category = String(data.get("category") || "");
    const condition = String(data.get("condition") || "");
    const description = String(data.get("description") || "").trim();
    const seller = String(data.get("seller") || "").trim();
    const rawImage = String(data.get("image") || "").trim();
    const image = rawImage ? safeImageURL(rawImage) : "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85";

    if (!title || !Number.isFinite(price) || price <= 0 || price > 10000 || !category || !condition || !description || !seller) {
      $("#sellFormError").textContent = "Revisa los campos: completa la información y utiliza un precio válido.";
      return;
    }
    if (rawImage && !image) {
      $("#sellFormError").textContent = "El enlace de imagen debe ser una URL pública que comience con https://.";
      return;
    }

    const listing = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      title, price: Math.round(price * 100) / 100, category, brand: "Independiente", seller,
      condition, badge: "Nueva publicación", description, image
    };
    const currentListings = readStorage(STORAGE_KEYS.listings, []);
    currentListings.unshift(listing);
    const saved = writeStorage(STORAGE_KEYS.listings, currentListings);
    if (!saved) return;

    state.products.unshift(listing);
    state.category = "todos";
    state.brand = "";
    state.query = "";
    elements.searchInput.value = "";
    renderProducts();
    closeDialog(elements.sellDialog);
    showToast("Tu publicación de demostración ya aparece en el catálogo.");
    $("#tienda").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Newsletter preview: intentionally does not store or transmit the email.
  $("#newsletterForm").addEventListener("submit", event => {
    event.preventDefault();
    const emailInput = $("#emailInput");
    const message = $("#formMessage");
    if (!emailInput.checkValidity()) {
      message.textContent = "Escribe un correo electrónico válido para continuar.";
      emailInput.focus();
      return;
    }
    message.textContent = "¡Gracias por tu interés! El registro estará disponible cuando HUSH conecte su servicio de correo.";
    event.currentTarget.reset();
  });

  // Placeholder links explain that support/legal services must be configured before launch.
  $$('[data-info]').forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    $("#accountTitle").innerHTML = `${escapeHTML(link.dataset.info)} en <em>HUSH.</em>`;
    $("#accountMessage").textContent = "Esta sección está preparada en el diseño, pero su contenido y canal de atención deben configurarse antes del lanzamiento público.";
    openDialog(elements.accountDialog);
  }));

  // Dialog cleanup and keyboard behavior.
  $$('dialog').forEach(dialog => {
    dialog.addEventListener("close", () => {
      if (!$$("dialog[open]").length) document.body.classList.remove("dialog-open");
    });
    dialog.addEventListener("click", event => {
      if (event.target === dialog) closeDialog(dialog);
    });
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      const open = $$('dialog[open]');
      if (open.length) closeDialog(open[open.length - 1]);
    }
  });

  // Image fallback keeps the layout intact if an external image is unavailable.
  document.addEventListener("error", event => {
    const image = event.target;
    if (image instanceof HTMLImageElement && image.hasAttribute("data-fallback-image") && !image.dataset.fallbackApplied) {
      image.dataset.fallbackApplied = "true";
      image.src = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80";
    }
  }, true);

  // Active navigation state.
  const observedSections = $$("main section[id]");
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$(".nav-links a").forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -58% 0px", threshold: 0 });
    observedSections.forEach(section => navObserver.observe(section));
  }

  // Restore local demo listings from this browser.
  const savedListings = readStorage(STORAGE_KEYS.listings, []);
  if (Array.isArray(savedListings)) {
    savedListings.filter(item => item && typeof item.id === "string" && !state.products.some(product => product.id === item.id))
      .forEach(item => state.products.unshift(item));
  }

  // Remove stale product IDs from locally stored favorites/cart.
  state.favorites = new Set([...state.favorites].filter(id => state.products.some(product => product.id === id)));
  Object.keys(state.cart).forEach(id => { if (!productById(id)) delete state.cart[id]; });
  persistFavorites();
  persistCart();
  updateHeaderCounts();
  renderProducts();
  renderCart();
  renderFavorites();
  $("#currentYear").textContent = new Date().getFullYear();
});
