let fav = JSON.parse(localStorage.getItem("myFavs"));
let products = JSON.parse(localStorage.getItem("products"));

let productsToPut = [];

function getProductInFav() {
  for (let product of products) {
    for (let id of fav) {
      if (product.id == id && !productsToPut.includes(product)) {
        productsToPut.push(product);
      }
    }
  }
}
getProductInFav();

const emptyWishList = document.getElementById("emptyWishList");

if (productsToPut) {
  emptyWishList.style.display = "none";
} else {
  emptyWishList.style.display = "block";
}

function continueShopping() {
  window.location.href = "index.html";
}

function transformImageUrl(url, width, height) {
  return `${url}?width=${width}&height=${height}`;
}

function calculateDiscount(price, discount) {
  return Math.round(price * (1 - discount / 100));
}
function buildProductCards() {
  const container = document.getElementById("wishlist-items");
  container.innerHTML = "";

  for (let i = 0; i < productsToPut.length; i++) {
    const productId = productsToPut[i].id;
    const croppedUrl = transformImageUrl(productsToPut[i].url[0], 2400, 2400);

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
              ${productsToPut[i].sizes
                .map(
                  (size, k) =>
                    `<span class="size-elem" id="size-${productId}-${k}">${size}</span>`
                )
                .join("")}
            </div>
          </div>

          <div class="discount-badge" id="discount-badge-${productId}">
            -${productsToPut[i].discount}%
          </div>

          <div class="info">
            <h3 class="product-title" id="product-title-${productId}">
              ${productsToPut[i].title}
            </h3>
            <div class="product-price">
              <span class="original-price" id="original-price-${productId}">
                LE ${productsToPut[i].price}.00
              </span>
              <span class="sale-price" id="sale-price-${productId}">
                LE ${calculateDiscount(
                  productsToPut[i].price,
                  productsToPut[i].discount
                )}.00
              </span>
            </div>
          </div>

          <div class="thumbnail-container" id="thumbnail-container-${productId}">
            <div class="pop-up-overlay"></div>
            <div class="pop-up" id="pop-up-shopping-${productId}"></div>
            ${productsToPut[i].url
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
}
buildProductCards();
