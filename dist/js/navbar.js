// DOM Elements
const shoppingBag = document.querySelector(".shopping-bag");
const cartPanel = document.querySelector(".cart-panel");
const cartOverlay = document.querySelector(".cart-overlay");
const backToShopping = document.querySelectorAll(".back-to-shopping");
const searchButton = document.querySelector(".search-small");
const searchPanel = document.querySelector(".search-panel");
const closeCart = document.querySelector(".cart-panel .close-cart");
const closeSearch = document.querySelector(".search-panel .close-cart");
const emptyCart = document.querySelector(".empty-cart");
const cartItems = document.querySelector(".cart-items");

let arrCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

function updateLocalStorage() {
  localStorage.setItem("cartItems", JSON.stringify(arrCartItems));
}

function hasItems() {
  if (arrCartItems.length > 0) {
    emptyCart.style.display = "none";
    cartItems.style.display = "block";
  } else {
    emptyCart.style.display = "block";
    cartItems.style.display = "none";
  }
}

function closeCartPanel() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("show");
  searchPanel.classList.remove("open");
}

function generateItemKey(item) {
  return `${item.id}-${item.selectedSize}-${item.selectedImageUrl}`;
}

function findItemByKey(key) {
  return arrCartItems.find((item) => generateItemKey(item) === key);
}

function addToCart(item) {
  const existingItem = arrCartItems.find(
    (i) =>
      i.id === item.id &&
      i.selectedSize === item.selectedSize &&
      i.selectedImageUrl === item.selectedImageUrl
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    item.quantity = 1;
    arrCartItems.push(item);
  }

  updateLocalStorage();
  renderItems();
}

function deleteItem(keyToDelete) {
  arrCartItems = arrCartItems.filter(
    (item) => generateItemKey(item) !== keyToDelete
  );
  updateLocalStorage();
  renderItems();
}

function updateQuantity(key, change) {
  const item = findItemByKey(key);
  if (item) {
    item.quantity += change;
    if (item.quantity < 1) {
      deleteItem(key);
      return;
    }
    updateLocalStorage();
    renderItems();
  }
}

function renderItems() {
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  arrCartItems.forEach((item) => {
    const price = Number(item.price);
    const salePrice = Number(item.salePrice);
    const uniqueKey = generateItemKey(item);

    const itemHTML = `
      <div class="item-card" data-key="${uniqueKey}">

        <img src="${item.selectedImageUrl}" alt="${
      item.title
    }" class="item-image">
        <div class="item-details">
          <h2 class="item-title">${item.title}</h2>
          <p class="item-size">Size: ${item.selectedSize}</p>
          <p class="item-price">
            <span class="original">LE ${price.toFixed(2)}</span>
            <span class="discounted">LE ${salePrice.toFixed(2)}</span>
          </p>
          <div class="item-controls">

            <button class="delete-btn" data-key="${uniqueKey}">🗑</button>

            <div class="quantity-box">
              <button class="decrease-btn" data-key="${uniqueKey}">-</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="increase-btn" data-key="${uniqueKey}">+</button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML += itemHTML;
  });

  calculateTotal();

  attachEventListeners();
  hasItems();
}

function calculateTotal() {
  let total = 0;
  arrCartItems.forEach((item) => {
    total += Number(item.salePrice) * item.quantity;
  });
  document.querySelector(".total-amount").textContent = `${total.toFixed(
    2
  )} LE`;
}

function attachEventListeners() {
  document.querySelectorAll(".increase-btn").forEach((button) => {
    button.addEventListener("click", () =>
      updateQuantity(button.dataset.key, 1)
    );
  });

  document.querySelectorAll(".decrease-btn").forEach((button) => {
    button.addEventListener("click", () =>
      updateQuantity(button.dataset.key, -1)
    );
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => deleteItem(btn.dataset.key));
  });
}

// Panel Toggles
shoppingBag.addEventListener("click", () => {
  const itemChosen = JSON.parse(localStorage.getItem("itemChosen"));
  if (itemChosen) {
    addToCart(itemChosen);
    localStorage.removeItem("itemChosen");
  }

  // Always render items when opening the cart
  renderItems();
  cartPanel.classList.add("open");
  cartOverlay.classList.add("show");
});

closeCart.addEventListener("click", closeCartPanel);
closeSearch.addEventListener("click", closeCartPanel);
cartOverlay.addEventListener("click", closeCartPanel);
backToShopping.forEach((btn) => btn.addEventListener("click", closeCartPanel));

searchButton.addEventListener("click", () => {
  searchPanel.classList.add("open");
  cartOverlay.classList.add("show");
});

// Dropdown Menu
document.querySelectorAll(".dropbtn").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const menu = this.nextElementSibling;
    menu.classList.toggle("show");
  });
});

window.addEventListener("click", function (e) {
  document.querySelectorAll(".dropdown-content").forEach((menu) => {
    if (
      !menu.contains(e.target) &&
      !menu.previousElementSibling.contains(e.target)
    ) {
      menu.classList.remove("show");
    }
  });
});

// Tab Switching

document.getElementById("tab-men").addEventListener("click", () => {
  document.getElementById("tab-men").classList.add("active");
  document.getElementById("tab-women").classList.remove("active");
  document.querySelector(".category-list-men").style.display = "block";
  document.querySelector(".category-list-women").style.display = "none";
});

document.getElementById("tab-women").addEventListener("click", () => {
  document.getElementById("tab-women").classList.add("active");
  document.getElementById("tab-men").classList.remove("active");
  document.querySelector(".category-list-women").style.display = "block";
  document.querySelector(".category-list-men").style.display = "none";
});

// Mobile Menu

document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("menu").classList.add("open");
  cartOverlay.classList.add("show");
});

document.getElementById("menu-close").addEventListener("click", () => {
  document.getElementById("menu").classList.remove("open");
  cartOverlay.classList.remove("show");
});

// Initialize
function initializeCart() {
  // Check for items added from product page on initial load
  const itemChosen = JSON.parse(localStorage.getItem("itemChosen"));
  if (itemChosen) {
    addToCart(itemChosen);
    localStorage.removeItem("itemChosen");
  }

  renderItems();
}

initializeCart();
