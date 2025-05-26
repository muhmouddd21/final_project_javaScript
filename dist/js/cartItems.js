import { db, collection, getDocs } from "./config.js";
import { renderWishlist } from "./wishlist.js";
let itemChosen = {};

function handleFavouriteToggle(product, e, fav) {
  const iconDiv = e.currentTarget;
  const icon = iconDiv.querySelector("i");
  const index = fav.findIndex((item) => item.id === product.id);

  if (index === -1) {
    fav.push(product);
    iconDiv.classList.add("pressed");
    icon.classList.add("pressed-icon");
  } else {
    fav.splice(index, 1);
    iconDiv.classList.remove("pressed");
    icon.classList.remove("pressed-icon");
  }

  localStorage.setItem("myFavs", JSON.stringify(fav));
  if (window.location.pathname.endsWith("wishlist.html")) {
    renderWishlist(fav);
  }
}

/*above this line to be rev*/

function handleAddToCart(productId, products) {
  const selectedSize = document.querySelector(
    `#sizes-pop-up-${productId} .size-option.selected`
  )?.textContent;
  const selectedImage = document.querySelector(
    `#colors-product-pop-${productId} .thumbnail-pop-image.active`
  )?.src;

  const product = products.find((p) => p.id === productId);
  const salePrice = calculateDiscount(product.price, product.discount);
  itemChosen = {
    id: product.id,
    title: product.title,
    price: product.price,
    discount: product.discount,
    salePrice,
    selectedSize,
    selectedImageUrl: selectedImage,
  };
  localStorage.setItem("itemChosen", JSON.stringify(itemChosen));
  closePopup(productId);
}

/*==============================================*/

/*============================================*/
function popUpMenuForShopping(productId, products) {
  const popup = document.getElementById(`pop-up-shopping-${productId}`);
  const overlay = document.getElementById("pop-up-overlay");
  popup.classList.add("open");
  overlay.classList.add("open");
  renderPopupContent(productId, products);
}

function renderPopupContent(productId, products) {
  const product = products.find((p) => p.id === productId);
  const { title, price, discount, sizes, url } = product;
  const salePrice = calculateDiscount(price, discount);
  const saving = price - salePrice;
  const popup = document.getElementById(`pop-up-shopping-${productId}`);

  popup.innerHTML = `
    <button class="close-btn" id="close-btn-popUp-${productId}">×</button>
    <div class="data"><h3 class="product-title-pop">${title}</h3></div>
    <div class="price">
      <span class="original-price">${price}.00 LE</span>
      <span class="sale-price">${salePrice}.00 LE</span>
    </div>
    <div class="savings">SAVE ${saving}.00 LE</div>
    <span class="colors-label">COLORS AVAILABLE</span>
    <div class="colors-product-pop" id="colors-product-pop-${productId}"></div>
    <div class="color-section">
      <div class="size-title"><span class="size-label">SIZES AVAILABLE</span></div>
      <div class="sizes" id="sizes-pop-up-${productId}"></div>
    </div>
    <button class="add-to-cart" id="add-to-cart-pop-${productId}">ADD TO CART</button>
  `;

  const sizesContainer = document.getElementById(`sizes-pop-up-${productId}`);
  sizes.forEach((size, i) => {
    const sizeDiv = document.createElement("div");
    sizeDiv.classList.add("size-option");
    sizeDiv.textContent = size;
    if (i == 0) sizeDiv.classList.add("selected");
    sizeDiv.addEventListener("click", () => {
      sizesContainer
        .querySelectorAll(".size-option")
        .forEach((el) => el.classList.remove("selected"));
      sizeDiv.classList.add("selected");
    });
    sizesContainer.appendChild(sizeDiv);
  });

  const colorsContainer = document.getElementById(
    `colors-product-pop-${productId}`
  );

  url.forEach((imgUrl, i) => {
    const img = document.createElement("img");
    img.src = transformImageUrl(imgUrl, 2400, 2400);
    img.classList.add("thumbnail-pop-image");
    if (i == 0) img.classList.add("active");

    img.addEventListener("click", () => {
      colorsContainer
        .querySelectorAll(".thumbnail-pop-image")
        .forEach((el) => el.classList.remove("active"));
      img.classList.add("active");
    });
    colorsContainer.appendChild(img);
  });

  document
    .getElementById(`add-to-cart-pop-${productId}`)
    .addEventListener("click", () => handleAddToCart(productId, products));

  document
    .getElementById(`close-btn-popUp-${productId}`)
    .addEventListener("click", () => closePopup(productId));
}

export function setupEventListeners(products, fav) {
  products.forEach((product) => {
    const shoppingBtn = document.getElementById(`shop-${product.id}`);
    const favBtn = document.getElementById(`love-${product.id}`);

    shoppingBtn.addEventListener("click", () =>
      popUpMenuForShopping(product.id, products)
    );
    favBtn.addEventListener("click", (e) =>
      handleFavouriteToggle(product, e, fav)
    );
  });
}

/*----------------------------------------------------------------------*/
export function buildProductCards(products, fav) {
  const container = document.getElementById("containerOfCards");
  container.innerHTML = "";

  products.forEach((product) => {
    const { id, url, sizes, discount, title, price } = product;
    const cropImgURL = transformImageUrl(url[0], 2400, 2400);

    const thumbnails = url.map(
      (thumbUrl, i) =>
        `<img
            class="thumbnail img-${i}"
            id="${id}"
            src="${transformImageUrl(thumbUrl, 2400, 2400)}"
          />`
    );

    container.innerHTML += `
      <div class="card-m" data-product-id="${id}">
        <div class="image">
          <img id="previewImage-${id}" src="${cropImgURL}" />
          <div class="action-icons">
            <div class="icon shop-icon" id="shop-${id}">
              <i class="fa-solid fa-cart-shopping"></i>
            </div>
            <div class="icon love-icon ${
              fav.some((favItem) => favItem.id === id) ? "pressed" : ""
            }" id="love-${id}">
              <i class="fa-solid fa-heart ${
                fav.some((favItem) => favItem.id === id) ? "pressed-icon" : ""
              }"></i>
            </div>
          </div>
        </div>

        <div class="discount-badge" id="discount-badge-${id}">
          -${discount}%
        </div>

        <div class="info">
          <h3 class="product-title" id="product-title-${id}">${title}</h3>
          <div class="product-price">
            <span class="original-price" id="original-price-${id}">LE ${price}.00</span>
            <span class="sale-price" id="sale-price-${id}">
              LE ${calculateDiscount(price, discount)}.00
            </span>
          </div>
        </div>

        <div class="thumbnail-container" id="thumbnail-container-${id}">
          <div class="pop-up-overlay" id="pop-up-overlay"></div>
          <div class="pop-up" id="pop-up-shopping-${id}"></div>
          ${thumbnails.join("")}
        </div>
      </div>
    `;
  });

  const allThumbnails = document.querySelectorAll(".thumbnail");

  allThumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const card = thumb.closest(".card-m");
      const previewImage = card.querySelector(".image > img");
      previewImage.src = thumb.src;
    });
  });
}

/*----------------------------------------------------------------------*/
function closePopup(productId) {
  document
    .getElementById(`pop-up-shopping-${productId}`)
    .classList.remove("open");
  document.getElementById("pop-up-overlay").classList.remove("open");
}
/*----------------------------------------------------------------------*/
export function renderProductPage(collectionNames) {
  const products = [];
  const fav = JSON.parse(localStorage.getItem("myFavs")) || [];

  document.addEventListener("DOMContentLoaded", () => {
    Promise.all(collectionNames.map((name) => getDocs(collection(db, name))))
      .then((snapshots) => {
        snapshots.forEach((snapshot) => {
          const docs = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          products.push(...docs);
        });

        buildProductCards(products, fav);
        setupEventListeners(products, fav);
      })
      .catch((error) => console.error("Error loading products:", error));
  });
}

function transformImageUrl(url, width, height) {
  return `${url}?width=${width}&height=${height}`;
}

function calculateDiscount(price, discount) {
  return Math.round(price * (1 - discount / 100));
}
/*----------------------------------------------------------------------*/
