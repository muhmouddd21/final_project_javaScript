import { db, collection, getDocs } from "../../src/config.js";

renderProductPage(["men-tops", "women-bottoms"]);
export function renderProductPage(collectionNames) {
  let products = [];
  let fav = JSON.parse(localStorage.getItem("myFavs")) || [];
  let itemChosen = {};

  document.addEventListener("DOMContentLoaded", () => {
    const collectionsToLoad = Array.isArray(collectionNames)
      ? collectionNames
      : [collectionNames];

    Promise.all(collectionsToLoad.map((name) => getDocs(collection(db, name))))
      .then((snapshots) => {
        snapshots.forEach((snapshot) => {
          const docs = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          products.push(...docs);
        });

        localStorage.setItem("products", JSON.stringify(products));
        buildProductCards();
        setupEventListeners();
      })
      .catch((error) => {
        console.error("Error loading products: ", error);
      });
    function buildProductCards() {
      const container = document.getElementById("containerOfCards");
      container.innerHTML = "";

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const productId = product.id;
        const croppedUrl = transformImageUrl(product.url[0], 2400, 2400);

        let card = `
          <div class="card-m" data-product-id="${productId}">
            <div class="image">
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
                ${product.sizes
                  .map(
                    (size, k) =>
                      `<span class="size-elem" id="size-${productId}-${k}">${size}</span>`
                  )
                  .join("")}
              </div>
            </div>

            <div class="discount-badge" id="discount-badge-${productId}">
              -${product.discount}%
            </div>

            <div class="info">
              <h3 class="product-title" id="product-title-${productId}">
                ${product.title}
              </h3>
              <div class="product-price">
                <span class="original-price" id="original-price-${productId}">
                  LE ${product.price}.00
                </span>
                <span class="sale-price" id="sale-price-${productId}">
                  LE ${calculateDiscount(product.price, product.discount)}.00
                </span>
              </div>
            </div>

            <div class="thumbnail-container" id="thumbnail-container-${productId}">
              <div class="pop-up-overlay"></div>
              <div class="pop-up" id="pop-up-shopping-${productId}"></div>
              ${product.url
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

    function setupEventListeners() {
      products.forEach((product) => {
        const productId = product.id;

        const shopping = document.getElementById(`shop-${productId}`);
        if (shopping) {
          shopping.addEventListener("click", () => {
            popUpMenuForShopping(productId);
          });
        }

        const favourite = document.getElementById(`love-${productId}`);
        if (favourite) {
          favourite.addEventListener("click", (e) => {
            addToFav(productId, e);
          });
        }
      });
    }

    function popUpMenuForShopping(productId) {
      const popup = document.getElementById(`pop-up-shopping-${productId}`);
      const overlay = popup?.previousElementSibling;

      if (popup && overlay) {
        popup.classList.add("open");
        overlay.classList.add("open");
        addDataToPopup(productId);
      } else {
        console.error("Popup or overlay not found for product:", productId);
      }
    }

    function closePopup(productId) {
      const popup = document.getElementById(`pop-up-shopping-${productId}`);
      const overlay = popup?.previousElementSibling;

      if (popup) popup.classList.remove("open");
      if (overlay) overlay.classList.remove("open");
    }

    function addToFav(productId, e) {
      const iconDiv = e.currentTarget;
      const icon = iconDiv.querySelector("i");

      const index = fav.indexOf(productId);

      if (index === -1) {
        fav.push(productId);
        localStorage.setItem("myFavs", JSON.stringify(fav));
        iconDiv.classList.add("pressed");
        icon.classList.add("pressed-icon");
      } else {
        fav.splice(index, 1);
        localStorage.setItem("myFavs", JSON.stringify(fav));
        iconDiv.classList.remove("pressed");
        icon.classList.remove("pressed-icon");
      }
    }

    function addDataToPopup(productId) {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const popupContainer = document.getElementById(
        `pop-up-shopping-${productId}`
      );
      if (!popupContainer) return;

      const salePrice = calculateDiscount(product.price, product.discount);
      const originalPrice = product.price;
      const saving = originalPrice - salePrice;

      popupContainer.innerHTML = `
      <button class="close-btn" id="close-btn-popUp-${productId}">×</button>
      <div class="data">
        <h3 class="product-title-pop">${product.title}</h3>
      </div>
      <div class="price"> 
        <span class="original-price">${originalPrice}.00 LE</span>
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

      const sizesContainer = document.getElementById(
        `sizes-pop-up-${productId}`
      );
      sizesContainer.innerHTML = "";

      product.sizes.forEach((size, index) => {
        const sizeDiv = document.createElement("div");
        sizeDiv.classList.add("size-option");
        sizeDiv.textContent = size;
        if (index === 0) sizeDiv.classList.add("selected");

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
      colorsContainer.innerHTML = "";

      product.url.forEach((url, index) => {
        const thumbnailsCropped = transformImageUrl(url, 2400, 2400);
        const img = document.createElement("img");
        img.src = thumbnailsCropped;
        img.classList.add("thumbnail-pop-image");
        if (index === 0) img.classList.add("active");

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
        .addEventListener("click", () => {
          const selectedSizeElement = document.querySelector(
            `#sizes-pop-up-${productId} .size-option.selected`
          );
          const selectedImageElement = document.querySelector(
            `#colors-product-pop-${productId} .thumbnail-pop-image.active`
          );

          if (!selectedSizeElement || !selectedImageElement) {
            alert("Please select both a size and a color.");
            return;
          }

          const selectedSize = selectedSizeElement.textContent;
          const selectedImageUrl = selectedImageElement.src;

          itemChosen = {
            id: product.id,
            title: product.title,
            price: product.price,
            discount: product.discount,
            salePrice: calculateDiscount(product.price, product.discount),
            selectedSize,
            selectedImageUrl,
          };

          closePopup(productId);
          console.log(itemChosen);
        });

      document
        .getElementById(`close-btn-popUp-${productId}`)
        .addEventListener("click", () => {
          closePopup(productId);
        });
    }

    function transformImageUrl(url, width, height) {
      return `${url}?width=${width}&height=${height}`;
    }

    function calculateDiscount(price, discount) {
      return Math.round(price * (1 - discount / 100));
    }
  });
}
