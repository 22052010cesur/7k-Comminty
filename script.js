document.addEventListener('DOMContentLoaded', () => {
  const welcomeScreen = document.getElementById('welcome-screen');

  document.body.classList.add('welcome-open');

  welcomeScreen?.addEventListener('click', () => {
    welcomeScreen.classList.add('is-hidden');
    document.body.classList.remove('welcome-open');
  });

  const yearNode = document.getElementById('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  const onlineCountNode = document.getElementById('discord-online-count');
  const memberCountNode = document.getElementById('discord-member-count');
  const liveUpdatedNode = document.getElementById('discord-live-updated');
  const discordInviteEndpoint = 'https://discord.com/api/v10/invites/lucia7k?with_counts=true';

  const updateDiscordPresence = async () => {
    if (!onlineCountNode || !memberCountNode || !liveUpdatedNode) return;

    try {
      const response = await fetch(discordInviteEndpoint, { cache: 'no-store' });
      if (!response.ok) throw new Error('Discord məlumatı alınmadı');

      const invite = await response.json();
      const onlineCount = Number(invite.approximate_presence_count);
      if (!Number.isFinite(onlineCount)) throw new Error('Online sayı tapılmadı');

      onlineCountNode.textContent = onlineCount.toLocaleString('az-AZ');
      memberCountNode.textContent = '878';
      liveUpdatedNode.textContent = 'İndi canlıdır';
    } catch {
      onlineCountNode.textContent = 'Məlumat yoxdur';
      memberCountNode.textContent = 'Məlumat yoxdur';
      liveUpdatedNode.textContent = 'Discord məlumatı hazırda əlçatan deyil';
    }
  };

  updateDiscordPresence();
  window.setInterval(updateDiscordPresence, 60000);

  const musicToggle = document.getElementById('music-toggle');
  const backgroundMusic = document.getElementById('background-music');

  musicToggle?.addEventListener('click', async () => {
    if (backgroundMusic.paused) {
      musicToggle.textContent = 'Musiqi: Yanır';
      musicToggle.classList.add('is-on');
      musicToggle.setAttribute('aria-pressed', 'true');

      try {
        backgroundMusic.load();
        await backgroundMusic.play();
      } catch {
        musicToggle.textContent = 'Musiqi açıla bilmədi';
        musicToggle.classList.remove('is-on');
        musicToggle.setAttribute('aria-pressed', 'false');
      }
      return;
    }

    backgroundMusic.pause();
    musicToggle.textContent = 'Musiqi: Söndürülüb';
    musicToggle.classList.remove('is-on');
    musicToggle.setAttribute('aria-pressed', 'false');
  });

  document.querySelectorAll('.application-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const statusNode = form.querySelector('.application-status');
      statusNode.textContent = 'Form hazırlandı. Müraciəti tamamlamaq üçün Discord-da lucia7k hesabı ilə əlaqə saxla.';
      form.reset();
    });
  });

  const detailsLink = document.querySelector('a[href="#details"]');
  const detailsSection = document.getElementById('details');
  const detailsClose = document.getElementById('details-close');
  const detailsBody = document.getElementById('details-body');

  const closeDetails = () => {
    detailsSection.classList.remove('is-open');
    document.body.classList.remove('welcome-open');
  };

  detailsLink?.addEventListener('click', (event) => {
    event.preventDefault();
    detailsSection.classList.add('is-open');
    detailsBody.hidden = false;
    document.body.classList.add('welcome-open');
    detailsClose.focus();
  });

  detailsClose?.addEventListener('click', closeDetails);

  const cartCount = document.getElementById('cart-count');
  const cartTopCount = document.getElementById('cart-top-count');
  const cartStatus = document.getElementById('cart-status');
  const cartButton = document.querySelector('.cart-button');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutStatus = document.getElementById('checkout-status');
  const cartItemsNode = document.getElementById('cart-items');
  const cartTotalNode = document.getElementById('cart-total');
  const cartPageItemsNode = document.getElementById('cart-page-items');
  const cartPageTotalNode = document.getElementById('cart-page-total');
  const cartPageCheckout = document.getElementById('cart-page-checkout');
  const cartItems = [];

  const renderCart = () => {
    const renderItems = (container) => {
      container.replaceChildren();

      if (cartItems.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-cart';
        emptyMessage.textContent = 'Səbət hələ boşdur.';
        container.append(emptyMessage);
        return;
      }

      cartItems.forEach(({ name, price }, index) => {
        const item = document.createElement('div');
        item.className = 'cart-item';
        const nameNode = document.createElement('span');
        nameNode.textContent = name;
        const priceNode = document.createElement('strong');
        priceNode.textContent = `${price} AZN`;
        const removeButton = document.createElement('button');
        removeButton.className = 'cart-remove';
        removeButton.type = 'button';
        removeButton.textContent = 'Sil';
        removeButton.setAttribute('aria-label', `${name} məhsulunu sil`);
        removeButton.addEventListener('click', () => {
          cartItems.splice(index, 1);
          cartCount.textContent = cartItems.length;
          cartTopCount.textContent = cartItems.length;
          cartButton.setAttribute('aria-label', `Səbət, ${cartItems.length} məhsul`);
          renderCart();
        });
        item.append(nameNode, priceNode, removeButton);
        container.append(item);
      });
    };

    renderItems(cartItemsNode);
    renderItems(cartPageItemsNode);

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    cartTotalNode.textContent = `${total} AZN`;
    cartPageTotalNode.textContent = `${total} AZN`;
    cartPageCheckout.disabled = cartItems.length === 0;
  };

  cartButton?.addEventListener('click', () => {
    checkoutModal.hidden = false;
    document.body.classList.add('welcome-open');
    checkoutForm.querySelector('input[name="customer"]').focus();
  });

  checkoutModal?.querySelectorAll('[data-close-checkout]').forEach((closeButton) => {
    closeButton.addEventListener('click', () => {
      checkoutModal.hidden = true;
      document.body.classList.remove('welcome-open');
    });
  });

  checkoutForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    checkoutStatus.textContent = 'Məlumatlar qəbul edildi. Real ödəniş sistemi qoşulmadığı üçün sifariş demo olaraq tamamlandı.';
    checkoutForm.reset();
  });

  cartPageCheckout?.addEventListener('click', () => {
    checkoutModal.hidden = false;
    document.body.classList.add('welcome-open');
    checkoutForm.querySelector('input[name="customer"]').focus();
  });

  document.querySelectorAll('.add-to-cart').forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product;
      const productCard = button.closest('.shop-card, .product-card');
      const priceText = productCard?.querySelector('.shop-price, strong')?.textContent ?? '0 AZN';
      const price = Number.parseInt(priceText, 10) || 0;
      cartItems.push({ name: productName, price });
      cartCount.textContent = cartItems.length;
      cartTopCount.textContent = cartItems.length;
      cartButton.setAttribute('aria-label', `Səbət, ${cartItems.length} məhsul`);
      cartStatus.textContent = `${productName} səbətə əlavə edildi.`;
      renderCart();
    });
  });

  renderCart();
});
