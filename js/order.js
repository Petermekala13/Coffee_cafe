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

// Stripe integration (placeholder, requires backend)
document.getElementById('order-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const stripe = Stripe('YOUR_PUBLISHABLE_KEY'); // Replace with your Stripe Publishable Key
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100; // Convert to cents
  fetch('/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart, total })
  })
    .then(response => response.json())
    .then(session => stripe.redirectToCheckout({ sessionId: session.id }))
    .catch(error => console.error('Error:', error));
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