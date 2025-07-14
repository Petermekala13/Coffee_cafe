document.addEventListener('DOMContentLoaded', () => {
  const cartItems = [];
  const cartTable = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  const orderForm = document.getElementById('order-form');
  const deliverySelect = document.getElementById('delivery');
  const addressLabel = document.getElementById('address-label');
  const addressInput = document.getElementById('address');

  // Update cart display
  function updateCart() {
    cartTable.innerHTML = '';
    let total = 0;

    cartItems.forEach((item, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td><button class="remove-item" data-index="${index}">Remove</button></td>
      `;
      cartTable.appendChild(row);
      total += item.price * item.quantity;
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', () => {
        const index = button.getAttribute('data-index');
        cartItems.splice(index, 1);
        updateCart();
      });
    });
  }

  // Add to cart
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      const name = item.getAttribute('data-name');
      const price = parseFloat(item.getAttribute('data-price'));

      const existingItem = cartItems.find(cartItem => cartItem.name === name);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({ name, price, quantity: 1 });
      }

      updateCart();
    });
  });

  // Show/hide address field based on delivery option
  deliverySelect.addEventListener('change', () => {
    if (deliverySelect.value === 'delivery') {
      addressLabel.style.display = 'block';
      addressInput.style.display = 'block';
      addressInput.setAttribute('required', 'true');
    } else {
      addressLabel.style.display = 'none';
      addressInput.style.display = 'none';
      addressInput.removeAttribute('required');
    }
  });

  // Handle order submission
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const delivery = deliverySelect.value;
    const address = delivery === 'delivery' ? document.getElementById('address').value.trim() : '';

    if (name && email && (delivery === 'pickup' || (delivery === 'delivery' && address)) && cartItems.length > 0) {
      const orderSummary = cartItems.map(item => `${item.name} (x${item.quantity})`).join(', ');
      alert(`Order placed!\nName: ${name}\nEmail: ${email}\nDelivery: ${delivery}${delivery === 'delivery' ? `\nAddress: ${address}` : ''}\nItems: ${orderSummary}\nTotal: ${cartTotal.textContent}`);
      cartItems.length = 0; // Clear cart
      orderForm.reset();
      updateCart();
      addressLabel.style.display = 'none';
      addressInput.style.display = 'none';
      addressInput.removeAttribute('required');
    } else {
      alert('Please fill out all required fields and add items to your cart.');
    }
  });
});
// Cart functionality
let cart = [];

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const name = item.getAttribute('data-name');
    const price = parseFloat(item.getAttribute('data-price'));
    cart.push({ name, price, quantity: 1 });
    updateCart();
  });
});

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    cartItems.innerHTML += `<tr><td>${item.name}</td><td>${item.quantity}</td><td>$${item.price.toFixed(2)}</td><td><button class="remove-item">Remove</button></td></tr>`;
  });
  cartTotal.textContent = `$${total.toFixed(2)}`;
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => {
      const name = button.parentElement.previousElementSibling.previousElementSibling.textContent;
      cart = cart.filter(item => item.name !== name);
      updateCart();
    });
  });
}

// Stripe integration (placeholder with success message)
document.getElementById('order-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const stripe = Stripe('YOUR_PUBLISHABLE_KEY'); // Replace with your Stripe Publishable Key
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100; // Convert to cents
  const messageElement = document.getElementById('order-message');
  if (cart.length > 0) {
    messageElement.textContent = 'Order placed successfully! Thank you for your purchase.';
    messageElement.style.display = 'block';
    this.reset(); // Clear the form
    cart = []; // Clear the cart
    updateCart(); // Update the cart display
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, 5000); // Hide message after 5 seconds
  } else {
    messageElement.textContent = 'Please add items to your cart before placing an order.';
    messageElement.style.display = 'block';
    messageElement.style.color = 'red';
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, 5000);
  }
});

// Show/hide address field based on delivery option
document.getElementById('delivery').addEventListener('change', function() {
  const addressLabel = document.getElementById('address-label');
  const addressField = document.getElementById('address');
  if (this.value === 'delivery') {
    addressLabel.style.display = 'block';
    addressField.style.display = 'block';
    addressField.setAttribute('required', '');
  } else {
    addressLabel.style.display = 'none';
    addressField.style.display = 'none';
    addressField.removeAttribute('required');
  }
});