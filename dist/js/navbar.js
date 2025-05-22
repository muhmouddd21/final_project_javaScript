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

let arrCartItems = [];
let itemChosen = JSON.parse(localStorage.getItem("itemChosen")) || null;

function idExistsInArray(id, array) {
  return array.some((item) => item.id === id);
}

function addToCart(item) {
  if (idExistsInArray(item.id, arrCartItems)) {
    const existingItem = arrCartItems.find((i) => i.id === item.id);
    existingItem.quantity += 1;
  } else {
    item.quantity = 1;
    arrCartItems.push(item);
  }
}

function renderItems() {
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  for (let i = 0; i < arrCartItems.length; i++) {
    const item = arrCartItems[i];
    const price = Number(item.price) || 0;
    const salePrice = Number(item.salePrice) || 0;

    const itemHTML = `
      <div class="item-card" data-id="${item.id}">
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
            <button class="delete-btn" id="del-btn-${item.id}">🗑</button>
            <div class="quantity-box">
              <button class="decrease-btn" data-id="${item.id}">-</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="increase-btn" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML += itemHTML;
  }

  calculateTotal();
  attachQuantityListeners();
  addingEventListenersToDeleteButtons();
  hasItems();
}

function attachQuantityListeners() {
  document.querySelectorAll(".increase-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const item = arrCartItems.find((i) => i.id === id);
      if (item) {
        item.quantity += 1;
        renderItems();
      }
    });
  });

  document.querySelectorAll(".decrease-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const item = arrCartItems.find((i) => i.id === id);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        renderItems();
      }
    });
  });
}

function calculateTotal() {
  let total = 0;
  arrCartItems.forEach((item) => {
    total += Number(item.salePrice) * item.quantity;
  });

  document.querySelector(".total-amount").textContent = `${total.toFixed(2)}$`;
}

function addingEventListenersToDeleteButtons() {
  arrCartItems.forEach((item) => {
    const btn = document.getElementById(`del-btn-${item.id}`);
    if (btn) {
      btn.addEventListener("click", () => deleteItem(item.id));
    }
  });
}

function deleteItem(idToDelete) {
  arrCartItems = arrCartItems.filter((item) => item.id !== idToDelete);
  renderItems();
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

shoppingBag.addEventListener("click", () => {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("show");
  hasItems();
});

closeCart.addEventListener("click", closeCartPanel);
closeSearch.addEventListener("click", closeCartPanel);
cartOverlay.addEventListener("click", closeCartPanel);

backToShopping.forEach((btn) => btn.addEventListener("click", closeCartPanel));

function closeCartPanel() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("show");
  searchPanel.classList.remove("open");
}

searchButton.addEventListener("click", () => {
  searchPanel.classList.add("open");
  cartOverlay.classList.add("show");
});

// DROPDOWN MENU
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

document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("menu").classList.add("open");
  cartOverlay.classList.add("show");
});

document.getElementById("menu-close").addEventListener("click", () => {
  document.getElementById("menu").classList.remove("open");
  cartOverlay.classList.remove("show");
});

if (itemChosen) {
  addToCart(itemChosen);
  localStorage.removeItem("itemChosen");
}

renderItems();
