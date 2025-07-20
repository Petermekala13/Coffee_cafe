// Manual script load check
console.log('order.js script is being executed');

// Wait for DOM to load (single event listener)
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded, initializing order.js');

  // Initialize EmailJS with your User ID
  (function() {
    const userId = '3htydY1_79tDzIQDP'; // Your EmailJS User ID
    console.log('Attempting to initialize EmailJS with User ID:', userId);
    if (typeof emailjs === 'undefined') {
      console.warn('EmailJS not loaded. Form submission will proceed without email.');
    } else {
      emailjs.init(userId);
      console.log('EmailJS initialized successfully');
    }
  })();

  // Cart management
  let cart = [];

  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  console.log('Found', addToCartButtons.length, 'add-to-cart buttons');
  if (addToCartButtons.length === 0) {
    console.error('No add-to-cart buttons found. Check class names in order.html');
  } else {
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function() {
        console.log('Add to Cart button clicked');
        const item = this.parentElement;
        const name = item.getAttribute('data-name');
        const price = parseFloat(item.getAttribute('data-price'));
        console.log('Item details:', { name, price });

        if (!name || isNaN(price)) {
          console.error('Invalid item data:', { name, price });
          return;
        }

        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
          existingItem.quantity++;
        } else {
          cart.push({ name, price, quantity: 1 });
        }

        updateCart();
      });
    });
  }

  function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    console.log('Updating cart, items count:', cart.length);

    if (!cartItems || !cartTotal) {
      console.error('Cart elements not found:', { cartItems, cartTotal });
      return;
    }

    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${itemTotal.toFixed(2)}</td>
        <td><button class="remove-item" data-name="${item.name}">Remove</button></td>
      `;
      cartItems.appendChild(row);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;

    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function() {
        console.log('Remove item clicked:', this.getAttribute('data-name'));
        const name = this.getAttribute('data-name');
        cart = cart.filter(item => item.name !== name);
        updateCart();
      });
    });
  }

  // Delivery option toggle
  const deliverySelect = document.getElementById('delivery');
  console.log('Delivery select element:', deliverySelect);
  if (deliverySelect) {
    deliverySelect.addEventListener('change', function() {
      console.log('Delivery option changed to:', this.value);
      const addressLabel = document.getElementById('address-label');
      const addressField = document.getElementById('address');
      if (!addressLabel || !addressField) {
        console.error('Address elements not found');
        return;
      }

      if (this.value === 'delivery') {
        addressLabel.style.display = 'block';
        addressField.style.display = 'block';
        addressField.setAttribute('required', 'required');
      } else {
        addressLabel.style.display = 'none';
        addressField.style.display = 'none';
        addressField.removeAttribute('required');
      }
    });
  } else {
    console.error('Delivery select not found');
  }

  // Form submission with EmailJS
  const orderForm = document.getElementById('order-form');
  const messageElement = document.getElementById('order-message');
  console.log('Order form element:', orderForm, 'Message element:', messageElement);

  if (orderForm && messageElement) {
    orderForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent page reload and scrolling
      console.log('Order form submitted, default prevented');

      const form = this;
      // Ensure cart data is up-to-date
      const orderItems = cart.length > 0 ? cart.map(item => `${item.name} x${item.quantity}`).join(', ') : 'No items';
      const total = cart.length > 0 ? `$${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}` : '$0.00';
      console.log('Sending order items:', orderItems, 'Sending total:', total);

      // Update or create hidden inputs
      let cartInput = form.querySelector('[name="order_items"]');
      if (!cartInput) {
        cartInput = document.createElement('input');
        cartInput.type = 'hidden';
        cartInput.name = 'order_items';
        form.appendChild(cartInput);
      }
      cartInput.value = orderItems;

      let totalInput = form.querySelector('[name="total"]');
      if (!totalInput) {
        totalInput = document.createElement('input');
        totalInput.type = 'hidden';
        totalInput.name = 'total';
        form.appendChild(totalInput);
      }
      totalInput.value = total;

      // Immediate feedback
      messageElement.textContent = 'Processing your order...';
      messageElement.style.display = 'block';
      messageElement.style.color = 'blue';

      if (typeof emailjs !== 'undefined') {
        emailjs.sendForm('service_bwxnszk', 'template_5uhz2hq', form)
          .then(function(response) {
            console.log('Email sent successfully:', response);
            messageElement.textContent = 'Order placed successfully! We’ll notify you soon.';
            messageElement.style.color = 'green';
            form.reset();
            cart = [];
            updateCart();
            setTimeout(() => {
              messageElement.style.display = 'none';
            }, 5000);
          }, function(error) {
            console.error('Email failed:', error);
            messageElement.textContent = 'Failed to place order. Please try again.';
            messageElement.style.color = 'red';
            setTimeout(() => {
              messageElement.style.display = 'none';
            }, 5000);
          })
          .finally(() => {
            if (cartInput.parentElement) form.removeChild(cartInput);
            if (totalInput.parentElement) form.removeChild(totalInput);
          });
      } else {
        console.warn('EmailJS not available, showing fallback');
        messageElement.textContent = 'Order submitted (email unavailable). Contact us manually.';
        messageElement.style.color = 'orange';
        form.reset();
        cart = [];
        updateCart();
        setTimeout(() => {
          messageElement.style.display = 'none';
        }, 5000);
      }
    });
  } else {
    console.error('Order form or message element not found:', { orderForm, messageElement });
  }
});