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




 function openCart() { 
    cartPanel.classList.add("open");
    cartOverlay.classList.add("show");

    hasItems();
}

function closeCartPanel() {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("show");
    searchPanel.classList.remove("open");
}

function openSearchCart() {
    searchPanel.classList.add("open");
    cartOverlay.classList.add("show");
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

shoppingBag.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartPanel);
closeSearch.addEventListener("click", closeCartPanel);
cartOverlay.addEventListener("click", closeCartPanel);
searchButton.addEventListener("click", openSearchCart);

 backToShopping.forEach(button => {
    button.addEventListener('click', () => {
      closeCartPanel();
    });
  });
// =======================================================

const menSpan = document.getElementById("tab-men");
const womenSpan = document.getElementById("tab-women");
const toggleButt = document.getElementById("menu-toggle");
const toggleMenu = document.getElementById("menu");
const toggleCloseButt = document.getElementById("menu-close");

function selectMen() {
    menSpan.classList.add("active");
    womenSpan.classList.remove("active");
    document.querySelector('.category-list-men').style.display = 'block';
    document.querySelector('.category-list-women').style.display = 'none';
}

function selectWomen() {
    womenSpan.classList.add("active");
    menSpan.classList.remove("active");
    document.querySelector('.category-list-men').style.display = 'none';
    document.querySelector('.category-list-women').style.display = 'block';
}

function openMenu() {
    toggleMenu.classList.add("open");
    cartOverlay.classList.add("show");
}

function closeMenu() {
    toggleMenu.classList.remove("open");
    cartOverlay.classList.remove("show");
}

menSpan.addEventListener("click", selectMen);
womenSpan.addEventListener("click", selectWomen);
toggleButt.addEventListener("click", openMenu);
toggleCloseButt.addEventListener("click", closeMenu);

// =======================================================




let arrCartItems = [];

const object1 = {
    id: "IOc3fBTPLXSjkPJ7OAR7",
    price: 1500,
    discount: 60,
    title: "Snickers",
    sizes: "L",
    url: "https://res.cloudinary.com/denqwkum6/image/upload/v1747405561/akbwkfmgkfwzdin3p3ba.jpg"
};

function idExistsInArray(id, array) {
    return array.some(item => item.id === id);
}



function addToCart(object1) {
    if (idExistsInArray(object1.id, arrCartItems)) {
        const existingItem = arrCartItems.find(item => item.id === object1.id);
        existingItem.quantity += 1;
    } else {
        object1.quantity = 1;
        arrCartItems.push(object1);
    }
}



addToCart(object1);


function renderItems() {
  const container = document.getElementById('itemsContainer');
  container.innerHTML = ''; // clear previous content if any

  for (let i = 0; i < arrCartItems.length; i++) {
    const item = arrCartItems[i];
    const discountedPrice = item.price - (item.price * item.discount / 100);

    const itemHTML = `
      <div class="item-card" data-id="${item.id}">
        <img src="${item.url}" alt="${item.title}" class="item-image">
        <div class="item-details">
          <h2 class="item-title">${item.title}</h2>
          <p class="item-size">Size: ${item.sizes}</p>
          <p class="item-price">
            <span class="original">LE ${item.price.toFixed(2)}</span>
            <span class="discounted">LE ${discountedPrice.toFixed(2)}</span>
          </p>
          <div class="item-controls">
            <button class="delete-btn" id="del-btn-${item.id}" >🗑</button>
            <div class="quantity-box">
              <button class="decrease-btn" data-id="${item.id}">-</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="increase-btn" data-id="${item.id}">+</button>
            </div>
            <button class="edit-btn">✏️</button>
          </div>
        </div>
      </div>
    `;
    attachEventListnerToDeleteButtons(item);

    container.innerHTML += itemHTML;
  }

  calculateTotal();

  attachQuantityListeners(item);
 
}

function attachEventListnerToDeleteButtons(item){
  console.log(item.id);
  
}

console.log(arrCartItems);


document.addEventListener("click",deleteItemOfCart)
function deleteItemOfCart(){
  
}
function attachQuantityListeners() {
  const increaseButtons = document.querySelectorAll('.increase-btn');
  const decreaseButtons = document.querySelectorAll('.decrease-btn');

  increaseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const itemId = button.getAttribute('data-id');
      const item = arrCartItems.find(i => i.id === itemId);
      if (item) {
        item.quantity += 1;
        const card = button.closest('.item-card');
        const quantityDisplay = card.querySelector('.quantity-display');
        quantityDisplay.textContent = item.quantity;
        calculateTotal();  
      }
    });
  });

  decreaseButtons.forEach(button => {
    button.addEventListener('click', () => {
      const itemId = button.getAttribute('data-id');
      const item = arrCartItems.find(i => i.id === itemId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        const card = button.closest('.item-card');
        const quantityDisplay = card.querySelector('.quantity-display');
        quantityDisplay.textContent = item.quantity;
        calculateTotal();  
      }
    });
  });
}

function calculateTotal() {
  let sum = 0;
  for (let i = 0; i < arrCartItems.length; i++) {
    const item = arrCartItems[i];
    const discountedPrice = item.price - (item.price * item.discount / 100);
    sum += discountedPrice * item.quantity;
  }
  const totalElement = document.querySelector(".total-amount").textContent = `${sum.toFixed(2)}$`;
  
}

renderItems();





 /**drop down  */
        // Toggle dropdowns on click
document.querySelectorAll('.dropbtn').forEach(button => {
  button.addEventListener('click', function (e) {
    e.preventDefault(); // prevent navigating
    const content = this.nextElementSibling;
    content.classList.toggle('show');
  });
});

// Close if clicked outside
window.addEventListener('click', function (e) {
  document.querySelectorAll('.dropdown-content').forEach(menu => {
    if (!menu.contains(e.target) && !menu.previousElementSibling.contains(e.target)) {
      menu.classList.remove('show');
    }
  });
});