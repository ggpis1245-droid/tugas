/**
 * Seblak Warmen - Main Application Logic
 * Mobile-first E-Menu Interaktif: Tabs, Customizer, Cart Drawer, Checkout & WhatsApp Redirect
 */

(function () {
  'use strict';

  // --- State Application ---
  const state = {
    activeCategory: 'seblak',
    searchQuery: '',
    cart: [], // Array of item objects
    currentCustomizingItem: null,
    customizingQty: 1
  };

  // LocalStorage Key
  const STORAGE_KEY = 'seblak_warmen_cart_v1';

  // --- DOM Elements ---
  const elements = {
    menuGrid: document.getElementById('menuGrid'),
    categoryTabs: document.querySelectorAll('.cat-tab'),
    categoryTitle: document.getElementById('currentCategoryTitle'),
    categoryDesc: document.getElementById('currentCategoryDesc'),
    emptyState: document.getElementById('emptyState'),
    resetFilterBtn: document.getElementById('resetFilterBtn'),
    searchInput: document.getElementById('menuSearchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),

    // Floating Cart Bar
    floatingCartBar: document.getElementById('floatingCartBar'),
    floatingCartCount: document.getElementById('floatingCartCount'),
    floatingCartSummary: document.getElementById('floatingCartSummary'),
    floatingCartTotal: document.getElementById('floatingCartTotal'),
    openCartBtn: document.getElementById('openCartBtn'),

    // Customization Modal
    customModalBackdrop: document.getElementById('customModalBackdrop'),
    closeCustomModalBtn: document.getElementById('closeCustomModalBtn'),
    customItemName: document.getElementById('customItemName'),
    customItemImg: document.getElementById('customItemImg'),
    customItemDesc: document.getElementById('customItemDesc'),
    customItemBasePrice: document.getElementById('customItemBasePrice'),
    spicyLevelOptions: document.getElementById('spicyLevelOptions'),
    customItemNotes: document.getElementById('customItemNotes'),
    customQtyDisplay: document.getElementById('customQtyDisplay'),
    customQtyMinus: document.getElementById('customQtyMinus'),
    customQtyPlus: document.getElementById('customQtyPlus'),
    customModalTotalPrice: document.getElementById('customModalTotalPrice'),
    addCustomizedToCartBtn: document.getElementById('addCustomizedToCartBtn'),

    // Cart Drawer
    cartDrawerBackdrop: document.getElementById('cartDrawerBackdrop'),
    closeCartDrawerBtn: document.getElementById('closeCartDrawerBtn'),
    clearCartBtn: document.getElementById('clearCartBtn'),
    cartHeaderCount: document.getElementById('cartHeaderCount'),
    cartItemsList: document.getElementById('cartItemsList'),
    summarySubtotal: document.getElementById('summarySubtotal'),
    summaryGrandTotal: document.getElementById('summaryGrandTotal'),

    // Form Checkout
    checkoutForm: document.getElementById('checkoutForm'),
    tableNumberInput: document.getElementById('tableNumberInput'),
    tableNumberError: document.getElementById('tableNumberError'),
    tableChips: document.querySelectorAll('.table-chip'),
    customerNameInput: document.getElementById('customerNameInput'),
    orderTypeSelect: document.getElementById('orderTypeSelect'),
    paymentMethodSelect: document.getElementById('paymentMethodSelect'),
    paymentInstructionBox: document.getElementById('paymentInstructionBox'),
    paymentInstIcon: document.getElementById('paymentInstIcon'),
    paymentInstTitle: document.getElementById('paymentInstTitle'),
    paymentInstDesc: document.getElementById('paymentInstDesc'),
    showQrisMockupBtn: document.getElementById('showQrisMockupBtn'),
    generalOrderNotes: document.getElementById('generalOrderNotes'),
    submitOrderBtn: document.getElementById('submitOrderBtn'),
    copyOrderTextBtn: document.getElementById('copyOrderTextBtn'),

    // QRIS Modal
    qrisModalBackdrop: document.getElementById('qrisModalBackdrop'),
    closeQrisModalBtn: document.getElementById('closeQrisModalBtn'),

    // Toast
    toastNotification: document.getElementById('toastNotification'),
    toastIcon: document.getElementById('toastIcon'),
    toastMessage: document.getElementById('toastMessage')
  };

  // --- Helper Functions ---

  /** Format number to Indonesian Rupiah */
  function formatRupiah(amount) {
    return 'Rp ' + Number(amount).toLocaleString('id-ID');
  }

  /** Show toast alert */
  let toastTimeout;
  function showToast(message, icon = '🍜') {
    if (!elements.toastNotification) return;
    elements.toastIcon.textContent = icon;
    elements.toastMessage.textContent = message;
    elements.toastNotification.style.display = 'flex';

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      elements.toastNotification.style.display = 'none';
    }, 2400);
  }

  /** Save cart to LocalStorage */
  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  /** Load cart from LocalStorage */
  function loadCart() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        state.cart = JSON.parse(data);
      }
    } catch (e) {
      state.cart = [];
    }
  }

  // --- Category Tabs & Filtering ---

  function updateCategoryTabsUI() {
    elements.categoryTabs.forEach(tab => {
      const cat = tab.getAttribute('data-category');
      const isActive = cat === state.activeCategory;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    const categoryMeta = MENU_DATA.categories.find(c => c.id === state.activeCategory);
    if (categoryMeta) {
      elements.categoryTitle.textContent = `Menu ${categoryMeta.name}`;
      elements.categoryDesc.textContent = categoryMeta.desc;
    }
  }

  function renderMenuItems() {
    const query = state.searchQuery.trim().toLowerCase();
    
    // Filter items
    const filteredItems = MENU_DATA.items.filter(item => {
      const matchesCategory = query ? true : item.category === state.activeCategory;
      const matchesSearch = query
        ? (item.name.toLowerCase().includes(query) ||
           item.description.toLowerCase().includes(query) ||
           item.category.toLowerCase().includes(query))
        : true;
      return matchesCategory && matchesSearch;
    });

    elements.menuGrid.innerHTML = '';

    if (filteredItems.length === 0) {
      elements.emptyState.style.display = 'block';
      return;
    } else {
      elements.emptyState.style.display = 'none';
    }

    filteredItems.forEach(item => {
      const card = document.createElement('article');
      card.className = 'menu-card';
      card.setAttribute('data-id', item.id);

      const isSeblak = item.isCustomizable;
      const buttonText = isSeblak ? '🌶️ Kustomisasi' : '+ Tambah';
      const buttonClass = isSeblak ? 'btn-add-item' : 'btn-add-item btn-quick-add';

      card.innerHTML = `
        <div class="menu-card-img-wrap">
          <img src="${item.image}" alt="${item.name}" class="menu-img" loading="lazy">
          <span class="menu-badge ${item.badgeType || 'fire'}">${item.badge}</span>
        </div>
        <div class="menu-card-body">
          <div class="menu-header-row">
            <h3 class="menu-name">${item.name}</h3>
            <span class="menu-price">${formatRupiah(item.price)}</span>
          </div>
          <p class="menu-desc">${item.description}</p>
          <div class="menu-card-footer">
            ${isSeblak 
              ? `<span class="customizable-tag">🔥 Bisa Pilih Level 1-5</span>` 
              : `<span class="customizable-tag">⚡ Siap Saji</span>`}
            <button type="button" class="${buttonClass}" data-item-id="${item.id}">
              <span>${buttonText}</span>
            </button>
          </div>
        </div>
      `;

      // Event listener for adding or customizing
      const actionBtn = card.querySelector(`[data-item-id="${item.id}"]`);
      actionBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isSeblak) {
          openCustomizationModal(item);
        } else {
          addQuickItemToCart(item);
        }
      });

      // Clicking card directly
      card.addEventListener('click', () => {
        if (isSeblak) {
          openCustomizationModal(item);
        } else {
          addQuickItemToCart(item);
        }
      });

      elements.menuGrid.appendChild(card);
    });
  }

  // --- Customization Modal Logic (Seblak Level & Toppings) ---

  function openCustomizationModal(item) {
    state.currentCustomizingItem = item;
    state.customizingQty = 1;

    elements.customItemName.textContent = item.name;
    elements.customItemImg.src = item.image;
    elements.customItemDesc.textContent = item.description;
    elements.customItemBasePrice.textContent = formatRupiah(item.price);
    elements.customItemNotes.value = '';
    elements.customQtyDisplay.textContent = '1';

    // Reset radio to Level 3 (Favorit)
    const level3Radio = document.querySelector('input[name="spicyLevel"][value="3"]');
    if (level3Radio) level3Radio.checked = true;

    // Reset topping checkboxes
    const toppingCheckboxes = document.querySelectorAll('input[name="seblakTopping"]');
    toppingCheckboxes.forEach(cb => cb.checked = false);

    updateCustomModalTotalPrice();

    // Show modal
    elements.customModalBackdrop.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeCustomizationModal() {
    elements.customModalBackdrop.style.display = 'none';
    document.body.style.overflow = '';
    state.currentCustomizingItem = null;
  }

  function calculateCustomItemUnitTotal() {
    if (!state.currentCustomizingItem) return 0;
    let unitTotal = state.currentCustomizingItem.price;

    const checkedToppings = document.querySelectorAll('input[name="seblakTopping"]:checked');
    checkedToppings.forEach(cb => {
      const price = parseInt(cb.getAttribute('data-price') || '0', 10);
      unitTotal += price;
    });

    return unitTotal;
  }

  function updateCustomModalTotalPrice() {
    const unitTotal = calculateCustomItemUnitTotal();
    const grandTotal = unitTotal * state.customizingQty;
    elements.customModalTotalPrice.textContent = formatRupiah(grandTotal);
  }

  function handleAddCustomizedToCart() {
    if (!state.currentCustomizingItem) return;

    const item = state.currentCustomizingItem;
    const selectedLevelInput = document.querySelector('input[name="spicyLevel"]:checked');
    const levelNum = selectedLevelInput ? parseInt(selectedLevelInput.value, 10) : 3;
    const levelObj = MENU_DATA.spicyLevels.find(l => l.level === levelNum) || {
      level: levelNum,
      label: `Level ${levelNum}`,
      emoji: '🌶️'
    };

    // Toppings
    const selectedToppings = [];
    let toppingsExtraPrice = 0;
    const checkedToppings = document.querySelectorAll('input[name="seblakTopping"]:checked');
    checkedToppings.forEach(cb => {
      const toppingPrice = parseInt(cb.getAttribute('data-price') || '0', 10);
      toppingsExtraPrice += toppingPrice;
      selectedToppings.push({
        name: cb.value,
        price: toppingPrice
      });
    });

    const itemNotes = elements.customItemNotes.value.trim();
    const unitPrice = item.price + toppingsExtraPrice;

    // Build Cart Item Object
    const cartItem = {
      cartItemId: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      id: item.id,
      name: item.name,
      basePrice: item.price,
      unitPrice: unitPrice,
      quantity: state.customizingQty,
      isCustomizable: true,
      spicyLevel: {
        level: levelObj.level,
        label: levelObj.label,
        emoji: levelObj.emoji
      },
      toppings: selectedToppings,
      notes: itemNotes
    };

    state.cart.push(cartItem);
    saveCart();
    updateCartUI();
    closeCustomizationModal();

    showToast(`${item.name} (Lvl ${levelNum}) masuk keranjang!`, '🔥');
  }

  // --- Quick Add for Snacks & Drinks ---

  function addQuickItemToCart(item) {
    // Check if item without customization already in cart
    const existingIndex = state.cart.findIndex(c => c.id === item.id && !c.isCustomizable);

    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += 1;
    } else {
      const cartItem = {
        cartItemId: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        id: item.id,
        name: item.name,
        basePrice: item.price,
        unitPrice: item.price,
        quantity: 1,
        isCustomizable: false,
        spicyLevel: null,
        toppings: [],
        notes: ''
      };
      state.cart.push(cartItem);
    }

    saveCart();
    updateCartUI();
    showToast(`${item.name} berhasil ditambahkan!`, '✨');
  }

  // --- Cart Calculations & UI Updates ---

  function getCartSummary() {
    let totalItems = 0;
    let totalPrice = 0;

    state.cart.forEach(item => {
      totalItems += item.quantity;
      totalPrice += item.unitPrice * item.quantity;
    });

    return { totalItems, totalPrice };
  }

  function updateCartUI() {
    const { totalItems, totalPrice } = getCartSummary();

    // Floating Cart Bar
    if (totalItems > 0) {
      elements.floatingCartBar.style.display = 'flex';
      elements.floatingCartCount.textContent = totalItems;
      elements.floatingCartSummary.textContent = `${totalItems} menu pilihan`;
      elements.floatingCartTotal.textContent = formatRupiah(totalPrice);
    } else {
      elements.floatingCartBar.style.display = 'none';
    }

    // Cart Drawer Header & Summary
    elements.cartHeaderCount.textContent = `${totalItems} item di keranjang`;
    elements.summarySubtotal.textContent = formatRupiah(totalPrice);
    elements.summaryGrandTotal.textContent = formatRupiah(totalPrice);

    renderCartItemsList();
  }

  function renderCartItemsList() {
    elements.cartItemsList.innerHTML = '';

    if (state.cart.length === 0) {
      elements.cartItemsList.innerHTML = `
        <div class="cart-empty-banner">
          <span>🍜</span>
          <p><strong>Keranjangmu masih kosong nih</strong></p>
          <p style="font-size: 0.74rem;">Yuk pilih Seblak pedas atau jajanan gurih favoritmu!</p>
        </div>
      `;
      return;
    }

    state.cart.forEach((item, index) => {
      const itemRow = document.createElement('div');
      itemRow.className = 'cart-item-row';

      // Meta details (Level, Toppings, Notes)
      let metaHtml = '';
      if (item.isCustomizable) {
        metaHtml += `<div class="cart-item-meta">`;
        if (item.spicyLevel) {
          metaHtml += `<span class="cart-meta-pill">🌶️ Level ${item.spicyLevel.level}: ${item.spicyLevel.label} (${item.spicyLevel.emoji})</span>`;
        }
        if (item.toppings && item.toppings.length > 0) {
          const toppingNames = item.toppings.map(t => t.name).join(', ');
          metaHtml += `<span class="cart-meta-topping">Topping: +${toppingNames}</span>`;
        }
        if (item.notes) {
          metaHtml += `<span class="cart-meta-notes">"${item.notes}"</span>`;
        }
        metaHtml += `</div>`;
      }

      const rowTotal = item.unitPrice * item.quantity;

      itemRow.innerHTML = `
        <div class="cart-item-details">
          <h5 class="cart-item-title">${item.name}</h5>
          ${metaHtml}
          <div class="cart-item-price-calc">${formatRupiah(rowTotal)} <span style="font-size: 0.72rem; color: #a8a29e; font-weight: 500;">(${formatRupiah(item.unitPrice)}/porsi)</span></div>
        </div>
        <div class="cart-item-actions">
          <button type="button" class="btn-remove-item" data-index="${index}" title="Hapus item">✕ Hapus</button>
          <div class="qty-stepper">
            <button type="button" class="stepper-btn" data-action="minus" data-index="${index}">−</button>
            <span class="stepper-val">${item.quantity}</span>
            <button type="button" class="stepper-btn" data-action="plus" data-index="${index}">+</button>
          </div>
        </div>
      `;

      // Event handlers for quantity stepper and removal
      const minusBtn = itemRow.querySelector('[data-action="minus"]');
      const plusBtn = itemRow.querySelector('[data-action="plus"]');
      const removeBtn = itemRow.querySelector('.btn-remove-item');

      minusBtn.addEventListener('click', () => {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // Remove if 1
          state.cart.splice(index, 1);
        }
        saveCart();
        updateCartUI();
      });

      plusBtn.addEventListener('click', () => {
        item.quantity += 1;
        saveCart();
        updateCartUI();
      });

      removeBtn.addEventListener('click', () => {
        state.cart.splice(index, 1);
        saveCart();
        updateCartUI();
        showToast('Menu dihapus dari keranjang', '🗑️');
      });

      elements.cartItemsList.appendChild(itemRow);
    });
  }

  // --- Cart Drawer Opening / Closing ---

  function openCartDrawer() {
    updateCartUI();
    elements.cartDrawerBackdrop.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    elements.cartDrawerBackdrop.style.display = 'none';
    document.body.style.overflow = '';
  }

  function clearCart() {
    if (state.cart.length === 0) return;
    if (confirm('Yakin ingin mengosongkan semua pesanan di keranjang?')) {
      state.cart = [];
      saveCart();
      updateCartUI();
      showToast('Keranjang telah dikosongkan', '🧹');
    }
  }

  // --- Payment Method Change Handler ---

  function handlePaymentMethodChange() {
    const selected = elements.paymentMethodSelect.value;
    if (selected === 'Cash') {
      elements.paymentInstructionBox.className = 'payment-instruction-box cash-mode';
      elements.paymentInstIcon.textContent = '💵';
      elements.paymentInstTitle.textContent = 'Instruksi Pembayaran Cash';
      elements.paymentInstDesc.textContent = 'Siapkan uang pas ya kak 😊 Silakan bayar langsung di kasir.';
      elements.showQrisMockupBtn.style.display = 'none';
    } else {
      // QRIS
      elements.paymentInstructionBox.className = 'payment-instruction-box';
      elements.paymentInstIcon.textContent = '📲';
      elements.paymentInstTitle.textContent = 'Instruksi Pembayaran QRIS';
      elements.paymentInstDesc.textContent = 'Tolong kirimkan bukti QRIS setelah menyelesaikan pesanan ya kak.';
      elements.showQrisMockupBtn.style.display = 'inline-block';
    }
  }

  // --- WhatsApp Order Message Builder & Checkout ---

  function buildWhatsAppOrderMessage() {
    const tableNumber = elements.tableNumberInput.value.trim();
    const customerName = elements.customerNameInput.value.trim();
    const orderType = elements.orderTypeSelect.value;
    const paymentMethod = elements.paymentMethodSelect.value;
    const generalNotes = elements.generalOrderNotes.value.trim();
    const { totalPrice } = getCartSummary();

    // Specific Payment Instruction Text as required
    let paymentInstructionText = '';
    if (paymentMethod === 'Cash') {
      paymentInstructionText = 'Siapkan uang pas ya kak 😊';
    } else {
      paymentInstructionText = 'Tolong kirimkan bukti QRIS ya kak 📲';
    }

    let text = `🔥 *PESANAN SEBLAK WARMEN* 🔥\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📍 *Nomor Meja:* ${tableNumber}\n`;
    if (customerName) {
      text += `👤 *Nama Pemesan:* ${customerName}\n`;
    }
    text += `🏷️ *Tipe Pesanan:* ${orderType}\n`;
    text += `💳 *Metode Pembayaran:* ${paymentMethod}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    text += `📝 *Rincian Pesanan:*\n`;

    state.cart.forEach((item, idx) => {
      const itemSubtotal = item.unitPrice * item.quantity;
      text += `${idx + 1}. *${item.name}* (x${item.quantity}) - ${formatRupiah(itemSubtotal)}\n`;
      
      if (item.isCustomizable) {
        if (item.spicyLevel) {
          text += `   • Level Pedas: Level ${item.spicyLevel.level} (${item.spicyLevel.label} ${item.spicyLevel.emoji})\n`;
        }
        if (item.toppings && item.toppings.length > 0) {
          const toppingList = item.toppings.map(t => `${t.name} (+${formatRupiah(t.price)})`).join(', ');
          text += `   • Topping Tambahan: ${toppingList}\n`;
        }
        if (item.notes) {
          text += `   • Catatan Porsi: "${item.notes}"\n`;
        }
      }
      text += `\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 *TOTAL PEMBAYARAN:* *${formatRupiah(totalPrice)}*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;

    if (generalNotes) {
      text += `📌 *Catatan Pesanan:* ${generalNotes}\n`;
    }

    text += `⚠️ *Instruksi:* ${paymentInstructionText}\n\n`;
    text += `Terima kasih sudah jajan di Seblak Warmen! 🌶️✨`;

    return text;
  }

  function handleCheckoutSubmit() {
    // 1. Validasi keranjang
    if (state.cart.length === 0) {
      alert('Keranjang pesanan masih kosong! Silakan pilih menu terlebih dahulu.');
      return;
    }

    // 2. Validasi Nomor Meja (Wajib)
    const tableNumber = elements.tableNumberInput.value.trim();
    if (!tableNumber) {
      elements.tableNumberError.style.display = 'block';
      elements.tableNumberInput.focus();
      elements.tableNumberInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    } else {
      elements.tableNumberError.style.display = 'none';
    }

    // 3. Build text
    const message = buildWhatsAppOrderMessage();
    const waNumber = MENU_DATA.store.whatsappNumber;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    // 4. Redirect ke wa.me
    window.open(waUrl, '_blank');

    showToast('Membuka WhatsApp...', '🚀');
  }

  function handleCopyOrderText() {
    if (state.cart.length === 0) {
      alert('Keranjang pesanan masih kosong!');
      return;
    }

    const tableNumber = elements.tableNumberInput.value.trim();
    if (!tableNumber) {
      elements.tableNumberError.style.display = 'block';
      elements.tableNumberInput.focus();
      return;
    } else {
      elements.tableNumberError.style.display = 'none';
    }

    const message = buildWhatsAppOrderMessage();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message)
        .then(() => {
          showToast('Teks pesanan berhasil disalin!', '📋');
        })
        .catch(() => {
          fallbackCopyText(message);
        });
    } else {
      fallbackCopyText(message);
    }
  }

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('Teks pesanan berhasil disalin!', '📋');
    } catch (err) {
      prompt('Salin teks pesanan di bawah ini:', text);
    }
    document.body.removeChild(textarea);
  }

  // --- Attach Event Listeners ---

  function initEventListeners() {
    // Category Tabs
    elements.categoryTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        state.activeCategory = tab.getAttribute('data-category');
        state.searchQuery = '';
        if (elements.searchInput) elements.searchInput.value = '';
        elements.clearSearchBtn.style.display = 'none';
        updateCategoryTabsUI();
        renderMenuItems();
      });
    });

    // Search Input
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      elements.clearSearchBtn.style.display = state.searchQuery ? 'flex' : 'none';
      renderMenuItems();
    });

    elements.clearSearchBtn.addEventListener('click', () => {
      state.searchQuery = '';
      elements.searchInput.value = '';
      elements.clearSearchBtn.style.display = 'none';
      renderMenuItems();
    });

    elements.resetFilterBtn.addEventListener('click', () => {
      state.searchQuery = '';
      elements.searchInput.value = '';
      elements.clearSearchBtn.style.display = 'none';
      state.activeCategory = 'seblak';
      updateCategoryTabsUI();
      renderMenuItems();
    });

    // Customizer Modal Quantity Controls
    elements.customQtyMinus.addEventListener('click', () => {
      if (state.customizingQty > 1) {
        state.customizingQty -= 1;
        elements.customQtyDisplay.textContent = state.customizingQty;
        updateCustomModalTotalPrice();
      }
    });

    elements.customQtyPlus.addEventListener('click', () => {
      state.customizingQty += 1;
      elements.customQtyDisplay.textContent = state.customizingQty;
      updateCustomModalTotalPrice();
    });

    // Radio Spicy Level Change
    document.querySelectorAll('input[name="spicyLevel"]').forEach(radio => {
      radio.addEventListener('change', updateCustomModalTotalPrice);
    });

    // Topping Checkboxes Change
    document.querySelectorAll('input[name="seblakTopping"]').forEach(cb => {
      cb.addEventListener('change', updateCustomModalTotalPrice);
    });

    // Add Customized to Cart Button
    elements.addCustomizedToCartBtn.addEventListener('click', handleAddCustomizedToCart);
    elements.closeCustomModalBtn.addEventListener('click', closeCustomizationModal);
    elements.customModalBackdrop.addEventListener('click', (e) => {
      if (e.target === elements.customModalBackdrop) closeCustomizationModal();
    });

    // Cart Bar Open Drawer
    elements.openCartBtn.addEventListener('click', openCartDrawer);
    elements.closeCartDrawerBtn.addEventListener('click', closeCartDrawer);
    elements.clearCartBtn.addEventListener('click', clearCart);
    elements.cartDrawerBackdrop.addEventListener('click', (e) => {
      if (e.target === elements.cartDrawerBackdrop) closeCartDrawer();
    });

    // Quick Table Chips
    elements.tableChips.forEach(chip => {
      chip.addEventListener('click', () => {
        elements.tableNumberInput.value = chip.getAttribute('data-val');
        elements.tableNumberError.style.display = 'none';
        elements.tableChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    elements.tableNumberInput.addEventListener('input', () => {
      if (elements.tableNumberInput.value.trim()) {
        elements.tableNumberError.style.display = 'none';
      }
    });

    // Payment Method Change
    elements.paymentMethodSelect.addEventListener('change', handlePaymentMethodChange);

    // QRIS Mockup Modal
    elements.showQrisMockupBtn.addEventListener('click', () => {
      elements.qrisModalBackdrop.style.display = 'flex';
    });
    elements.closeQrisModalBtn.addEventListener('click', () => {
      elements.qrisModalBackdrop.style.display = 'none';
    });
    elements.qrisModalBackdrop.addEventListener('click', (e) => {
      if (e.target === elements.qrisModalBackdrop) {
        elements.qrisModalBackdrop.style.display = 'none';
      }
    });

    // Submit Order to WhatsApp
    elements.submitOrderBtn.addEventListener('click', handleCheckoutSubmit);

    // Copy Order Text
    elements.copyOrderTextBtn.addEventListener('click', handleCopyOrderText);
  }

  // --- Initial Boot ---
  function init() {
    loadCart();
    updateCategoryTabsUI();
    renderMenuItems();
    updateCartUI();
    handlePaymentMethodChange();
    initEventListeners();
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
