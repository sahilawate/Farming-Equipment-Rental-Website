let cart = [];
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const rentalDurationEl = document.getElementById('rentalDuration');

// Function to add the selected equipment from a dropdown to the cart
function addSelectedEquipment(dropdownId) {
  const selectElem = document.getElementById(dropdownId);
  const selectedOption = selectElem.options[selectElem.selectedIndex];
  const itemName = selectedOption.getAttribute('data-name');
  const price = Number(selectedOption.getAttribute('data-price'));
  addToCart(itemName, price);
}

// Add equipment to the cart or update quantity if it already exists
function addToCart(item, pricePerDay) {
  const existingItem = cart.find(i => i.item === item);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ item, pricePerDay, quantity: 1 });
  }
  updateCartDisplay();
}

// Update the cart display
function updateCartDisplay() {
  cartItemsEl.innerHTML = '';
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<li>No items added yet.</li>';
  } else {
    cart.forEach((cartItem, index) => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      li.innerHTML = `
        <div class="item-details">
          <strong>${cartItem.item}</strong> - ₹${cartItem.pricePerDay}/day
        </div>
        <div class="quantity-controls">
          <button onclick="decrementQuantity(${index})"><i class="fas fa-minus"></i></button>
          <span>${cartItem.quantity}</span>
          <button onclick="incrementQuantity(${index})"><i class="fas fa-plus"></i></button>
        </div>
      `;
      cartItemsEl.appendChild(li);
    });
  }
  updateCartTotal();
}

// Increment the quantity of a cart item
function incrementQuantity(index) {
  cart[index].quantity++;
  updateCartDisplay();
}

// Decrement the quantity of a cart item and remove it if quantity reaches 0
function decrementQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    cart.splice(index, 1);
  }
  updateCartDisplay();
}

// Calculate and update the total price in the cart based on rental duration
function updateCartTotal() {
  let duration = Number(rentalDurationEl.value) || 1;
  const total = cart.reduce((sum, i) => sum + (i.pricePerDay * i.quantity * duration), 0);
  cartTotalEl.textContent = 'Total: ₹' + total;
}

rentalDurationEl.addEventListener('input', updateCartTotal);