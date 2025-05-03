document.addEventListener('DOMContentLoaded', () => {
    const fromDate = document.getElementById('from_date');
    const toDate = document.getElementById('to_date');
    const quantity = document.getElementById('quantity');
    const totalPrice = document.getElementById('total-price');
    const totalDays = document.getElementById('total-days');
    const selectedQuantity = document.getElementById('selected-quantity');
    const pricePerDay = parseFloat(document.getElementById('order-summary').getAttribute('data-price')) || 0;

    const addAddressBtn = document.getElementById('add-address-btn');
    const editAddressBtn = document.getElementById('edit-address-btn');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const popup = document.getElementById('address-popup');
    const addressForm = document.getElementById('address-form');
    const addressBox = document.getElementById('address-box');

    // ✅ Address input fields
    const fullnameInput = document.getElementById('fullname');
    const phoneInput = document.getElementById('phone');
    const streetInput = document.getElementById('street');
    const cityInput = document.getElementById('city');
    const stateInput = document.getElementById('state');
    const postalCodeInput = document.getElementById('postal_code');
    const equipmentId = document.querySelector('input[name="equipment_id"]');

    // ✅ Restrict past dates for 'from_date' and 'to_date'
    const twoDaysLater = new Date();
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);
    const minDate = twoDaysLater.toISOString().split('T')[0];
    fromDate.setAttribute('min', minDate);
    toDate.setAttribute('min', minDate);

    // ✅ Open popup for adding address
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', () => {
            clearAddressForm();
            popup.style.display = 'flex';
        });
    }

    // ✅ Open popup for editing address (with existing values)
    if (editAddressBtn) {
        editAddressBtn.addEventListener('click', () => {
            fullnameInput.value = editAddressBtn.getAttribute('data-fullname') || '';
            phoneInput.value = editAddressBtn.getAttribute('data-phone') || '';
            streetInput.value = editAddressBtn.getAttribute('data-street') || '';
            cityInput.value = editAddressBtn.getAttribute('data-city') || '';
            stateInput.value = editAddressBtn.getAttribute('data-state') || '';
            postalCodeInput.value = editAddressBtn.getAttribute('data-postal-code') || '';

            popup.style.display = 'flex';
        });
    }

    // ✅ Close popup
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }

    // ✅ Quantity validation and calculation
    quantity.addEventListener('input', () => {
        const maxQuantity = parseInt(quantity.getAttribute('max'));
        if (quantity.value < 1) {
            quantity.value = 1;
        } else if (quantity.value > maxQuantity) {
            quantity.value = maxQuantity;
        }
        calculateTotal();
    });

    // ✅ Date validation and calculation
    fromDate.addEventListener('change', () => {
        toDate.setAttribute('min', fromDate.value);
        calculateTotal();
    });

    toDate.addEventListener('change', calculateTotal);

    // ✅ Calculate total price based on duration and quantity
    function calculateTotal() {
        if (fromDate.value && toDate.value && quantity.value) {
            const startDate = new Date(fromDate.value);
            const endDate = new Date(toDate.value);
            const qty = parseInt(quantity.value);

            if (endDate > startDate && qty > 0) {
                const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
                if (days > 0) {
                    const total = days * pricePerDay * qty;

                    // ✅ Update summary
                    totalDays.innerText = days;
                    selectedQuantity.innerText = qty;
                    totalPrice.innerText = total.toFixed(2);
                }
            } else {
                totalDays.innerText = 0;
                totalPrice.innerText = '0.00';
                selectedQuantity.innerText = quantity.value;
            }
        }
    }

    // ✅ Handle add/update address submission
    addressForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const fullname = fullnameInput.value.trim();
        const phone = phoneInput.value.trim();
        const street = streetInput.value.trim();
        const city = cityInput.value.trim();
        const state = stateInput.value.trim();
        const postalCode = postalCodeInput.value.trim();

        if (!fullname || !phone || !street || !city || !state || !postalCode) {
            alert('Please fill all address fields!');
            return;
        }

        try {
            const response = await fetch('/order/add_address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fullname,
                    phone,
                    street,
                    city,
                    state,
                    postalCode,
                    equipment_id: equipmentId.value
                })
            });

            if (response.ok) {
                const updatedAddress = await response.json();

                // ✅ Update address display after saving
                addressBox.innerHTML = `
                    <h4>Delivery Address</h4>
                    <p><strong>Address:</strong> ${updatedAddress.street}, ${updatedAddress.city}, ${updatedAddress.state} - ${updatedAddress.postal_code}</p>
                    <p><strong>Phone No:</strong> ${updatedAddress.phone}</p>
                    <button id="edit-address-btn" class="edit-btn"
                        data-fullname="${updatedAddress.full_name}"
                        data-phone="${updatedAddress.phone}"
                        data-street="${updatedAddress.street}"
                        data-city="${updatedAddress.city}"
                        data-state="${updatedAddress.state}"
                        data-postal-code="${updatedAddress.postal_code}">
                        Edit Address
                    </button>
                `;

                // ✅ Re-attach edit listener
                document.getElementById('edit-address-btn').addEventListener('click', () => {
                    fullnameInput.value = updatedAddress.full_name;
                    phoneInput.value = updatedAddress.phone;
                    streetInput.value = updatedAddress.street;
                    cityInput.value = updatedAddress.city;
                    stateInput.value = updatedAddress.state;
                    postalCodeInput.value = updatedAddress.postal_code;
                    popup.style.display = 'flex';
                });

                popup.style.display = 'none';
                alert('Address updated successfully!');
            } else {
                alert('Failed to save address. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to connect to the server.');
        }
    });

    // ✅ Clear form values
    function clearAddressForm() {
        fullnameInput.value = '';
        phoneInput.value = '';
        streetInput.value = '';
        cityInput.value = '';
        stateInput.value = '';
        postalCodeInput.value = '';
    }

    // ✅ Trigger initial calculation
    calculateTotal();
});
