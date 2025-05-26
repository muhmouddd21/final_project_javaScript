// wishlist.js
import { buildProductCards, setupEventListeners } from "./cartItems.js";

const emptyWishList = document.getElementById("emptyWishList");
const contShopBut = document.querySelector(".btn-continue-shopping");

export function renderWishlist(fav) {
  buildProductCards(fav, fav);
  setupEventListeners(fav, fav);
}

document.addEventListener("DOMContentLoaded", () => {
  const fav = JSON.parse(localStorage.getItem("myFavs")) || [];

  if (contShopBut) {
    contShopBut.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
  renderWishlist(fav);
});

/*function buildProductCards() {
function continueShopping() {
  window.location.href = "index.html";
}

function transformImageUrl(url, width, height) {
  return `${url}?width=${width}&height=${height}`;
}

function calculateDiscount(price, discount) {
  return Math.round(price * (1 - discount / 100));
}
  const container = document.getElementById("wishlist-items");
  container.innerHTML = "";

  for (let i = 0; i < fav.length; i++) {
    const productId = fav[i].id;
    const croppedUrl = transformImageUrl(fav[i].url[0], 2400, 2400);

    let card = `
        <div class="card-m" data-product-id="${productId}">
          <div class="image-m">
            <img id="previewImage-${productId}" src="${croppedUrl}" />
            <div class="action-icons">
              <div class="icon shop-icon" id="shop-${productId}">
                <i class="fa-solid fa-cart-shopping"></i>
              </div>
              <div class="icon love-icon" id="love-${productId}">
                <i class="fa-solid fa-heart"></i>
              </div>
            </div>
            <div class="sizes" id="sizes-${productId}">
              ${fav[i].sizes
                .map(
                  (size, k) =>
                    `<span class="size-elem" id="size-${productId}-${k}">${size}</span>`
                )
                .join("")}
            </div>
          </div>

          <div class="discount-badge" id="discount-badge-${productId}">
            -${fav[i].discount}%
          </div>

          <div class="info">
            <h3 class="product-title" id="product-title-${productId}">
              ${fav[i].title}
            </h3>
            <div class="product-price">
              <span class="original-price" id="original-price-${productId}">
                LE ${fav[i].price}.00
              </span>
              <span class="sale-price" id="sale-price-${productId}">
                LE ${calculateDiscount(fav[i].price, fav[i].discount)}.00
              </span>
            </div>
          </div>

          <div class="thumbnail-container" id="thumbnail-container-${productId}">
            <div class="pop-up-overlay"></div>
            <div class="pop-up" id="pop-up-shopping-${productId}"></div>
            ${fav[i].url
              .slice(1)
              .map((thumbUrl, j) => {
                const thumbCropped = transformImageUrl(thumbUrl, 2400, 2400);
                return `<img class="thumbnail" id="previewImage-${productId}-${
                  j + 1
                }" src="${thumbCropped}" />`;
              })
              .join("")}
          </div>
        </div>
      `;

    container.innerHTML += card;
  }
}*/
