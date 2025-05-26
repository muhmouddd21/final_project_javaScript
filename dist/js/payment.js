// DOM Elements
const shippingForm = document.getElementById("shipping-form");
const paymentOptions = document.querySelectorAll(".payment-option");
const stripeDetails = document.getElementById("stripe-details");
const placeOrderBtn = document.getElementById("place-order-btn");
const paymentForm = document.getElementById("payment-form");
const orderSuccess = document.getElementById("order-success");

// Form Validation Function
function validateForm() {
  let isValid = true;
  const requiredFields = shippingForm.querySelectorAll("[required]");

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.classList.add("is-invalid");
      isValid = false;
    } else {
      field.classList.remove("is-invalid");
    }
  });

  // Validate email format
  const emailField = document.getElementById("email");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailField.value && !emailRegex.test(emailField.value)) {
    emailField.classList.add("is-invalid");
    isValid = false;
  }

  // Validate phone format
  const phoneField = document.getElementById("phone");
  const phoneRegex = /^[0-9]{11}$/;
  if (phoneField.value && !phoneRegex.test(phoneField.value)) {
    phoneField.classList.add("is-invalid");
    isValid = false;
  }

  return isValid;
}

// Payment Option Selection
paymentOptions.forEach((option) => {
  option.addEventListener("click", function () {
    // Remove selected class from all options
    paymentOptions.forEach((opt) => opt.classList.remove("selected"));

    // Add selected class to the clicked option
    this.classList.add("selected");

    // Check the radio button
    const radio = this.querySelector('input[type="radio"]');
    radio.checked = true;
  });
});

// Input field validation on blur
const inputFields = document.querySelectorAll(".form-control, .form-select");
inputFields.forEach((field) => {
  field.addEventListener("blur", function () {
    if (this.hasAttribute("required") && !this.value.trim()) {
      this.classList.add("is-invalid");
    } else {
      this.classList.remove("is-invalid");
    }

    // Special validation for email
    if (this.id === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.value && !emailRegex.test(this.value)) {
        this.classList.add("is-invalid");
      }
    }

    // Special validation for phone
    if (this.id === "phone") {
      const phoneRegex = /^[0-9]{11}$/;
      if (this.value && !phoneRegex.test(this.value)) {
        this.classList.add("is-invalid");
      }
    }
  });
});

// Place Order Button Click
placeOrderBtn.addEventListener("click", function () {
  if (validateForm()) {
    // Show loading state
    this.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2" role="status" "></span> Processing...';
    this.disabled = true;
    const selectedPayment = document.querySelector(
      'input[name="payment"]:checked'
    ).value;

    if (selectedPayment === "strip2") {
      stripeBackend(5000);
    } else if (selectedPayment === "cod") {
      // Simulate processing delay for non-Stripe payments
      setTimeout(() => {
        simulateOrderCompletion();
      }, 2000);
    }
  }
});

// Simulate order completion
function simulateOrderCompletion() {
  // Hide payment form and show success message
  paymentForm.style.display = "none";
  orderSuccess.style.display = "block";
  // Generate random order number
  const orderNumber = "FAS-" + Math.floor(10000 + Math.random() * 90000);
  document.getElementById("order-number").textContent = orderNumber;

  // Calculate delivery date (7-10 days from today)
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + Math.floor(7 + Math.random() * 3));

  const options = { year: "numeric", month: "long", day: "numeric" };
  document.getElementById("delivery-date").textContent =
    deliveryDate.toLocaleDateString("en-US", options);
}
/*https://adel.dev/scripts/stripe.php*/
async function stripeBackend(price) {
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const response = await fetch("link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: price,
      name: "Shop",
      secertKey:
        "sk_test_51RQNgAFaoF7ngClnfOgObwbnWTaeuRHAE6AqNz60eKVoSk54xHOYnVEC49vQzjMH7UlN0B2s7YuMpFiUQC9FRw0700uOZ8vnAm",
      onSuccess: `${baseUrl}/payment/payment.html?status=success`,
      onCancel: `${baseUrl}/payment/payment.html?status=failed`,
    }),
  });

  const data = await response.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Error: " + data.error);
  }
}

// Handling URL After Stripe Process to go to  Payment Page
if (location.search.includes("status=success")) {
  const newUrl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname;
  window.history.replaceState({}, document.title, newUrl);
  simulateOrderCompletion();
  const contShopping = document.getElementById("continue-shopping");
  console.log(contShopping);
  contShopping.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

/*====================================================================================*/
let arrCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let SummaryTotal = 0;

function orderSummary() {
  const summaryContainer = document.querySelector(".cart-items");
  summaryContainer.innerHTML = "";
  arrCartItems.forEach((item) => {
    const itemHTML = `<div
                  class="cart-item d-flex align-items-center mb-3 pb-3 border-bottom">
                  <img
                    src="${item.selectedImageUrl}"
                    alt="Product"
                    class="product-img me-3"
                  />
                  <div class="flex-grow-1">
                    <h6 class="mb-0">${item.title}</h6>
                    <p class="text-muted mb-0 small">
                      Size: ${item.selectedSize} 
                    </p>
                    <div class="d-flex align-items-center mt-1">
                      <span class="text-muted me-2">Q=${item.quantity}</span>
                      <span class="fw-bold">EGP ${item.salePrice}</span>
                    </div>
                  </div>
                </div>`;
    summaryContainer.innerHTML += itemHTML;
    SummaryTotal += item.quantity * item.salePrice;
  });
}

function orderTotals() {
  const Shipping = 50;
  const tax = Math.round(SummaryTotal * 0.14);
  const orderTotal = document.querySelector(".order-totals");
  orderTotal.innerHTML = `<div class="summary-item">
                            <span>Subtotal</span>
                            <span>EGP ${SummaryTotal}</span>
                          </div>
                          <div class="summary-item">
                            <span>Shipping</span>
                            <span>EGP ${Shipping}</span>
                          </div>
                          <div class="summary-item">
                            <span>Tax</span>
                            <span>EGP ${tax}</span>
                          </div>
                          <div class="summary-item total-row">
                            <span>Total</span>
                            <span>EGP ${SummaryTotal + tax + Shipping}</span>
                          </div>`;
}

orderSummary();
orderTotals();
/*====================================================================================*/
