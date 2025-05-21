import { db, collection, getDocs, addDoc } from '../../src/config.js';
let products = [];
let fav = [];
let itemChosen = {};




document.addEventListener('DOMContentLoaded', () => {
    const colRef = collection(db, "men-tops");

    getDocs(colRef)
        .then((snapshot) => {
            products = [];
            snapshot.docs.forEach((doc) => {
                products.push({ ...doc.data(), id: doc.id });
            });
            buildProductCards();
            setupEventListeners();
        })
        .catch(error => {
            console.error("Error loading products: ", error);
        });
});

function buildProductCards() {
    const container = document.getElementById("containerOfCards");
    container.innerHTML = "";

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const productId = product.id; // Firebase product ID
        const croppedUrl = transformImageUrl(product.url[0], 2400, 2400);

        let card = `
            <div class="card-m" data-product-id="${productId}">
                <div class="image">
                    <img id="previewImage-${productId}" src="${croppedUrl}" />
                    <div class="action-icons">
                        <div class="icon shop-icon" id="shop-${productId}"><i class="fa-solid fa-cart-shopping"></i></div>
                        <div class="icon love-icon" id="love-${productId}"><i class="fa-solid fa-heart"></i></div>
                    </div>
                    <div class="sizes" id="sizes-${productId}">
                        ${product.sizes.map((size, k) => `<span class="size-elem" id="size-${productId}-${k}">${size}</span>`).join("")}
                    </div>
                </div>

                <div class="discount-badge" id="discount-badge-${productId}">-${product.discount}%</div>

                <div class="info">
                    <h3 class="product-title" id="product-title-${productId}">${product.title}</h3>
                    <div class="product-price">
                        <span class="original-price" id="original-price-${productId}">LE ${product.price}.00</span>
                        <span class="sale-price" id="sale-price-${productId}">LE ${calculateDiscount(product.price, product.discount)}.00</span>
                    </div>
                </div>

                <div class="thumbnail-container" id="thumbnail-container-${productId}">
                    <div class="pop-up-overlay"></div>
                    <div class="pop-up" id="pop-up-shopping-${productId}"></div>
                    ${product.url.slice(1).map((thumbUrl, j) => {
            const thumbCropped = transformImageUrl(thumbUrl, 2400, 2400);
            return `<img class="thumbnail" id="previewImage-${productId}-${j + 1}" src="${thumbCropped}" />`;
        }).join("")}
                </div>
            </div>
        `;

        container.innerHTML += card;
    }
}


function transformImageUrl(url, width, height) {
    return `${url}?width=${width}&height=${height}`;
}


function calculateDiscount(price, discount) {
    return Math.round(price * (1 - discount / 100));
}

/*=====================================================================================*/

function popUpMenuForShopping(productId) {
    const popup = document.getElementById(`pop-up-shopping-${productId}`);
    const overlay = popup?.previousElementSibling; // Assuming the overlay is just before the popup

    if (popup && overlay) {
        popup.classList.add('open');
        overlay.classList.add('open');
        addDataToPopup(productId);
    } else {
        console.warn("Popup or overlay not found for product:", productId);
    }
}




function addToCart(productId, e) {
    popUpMenuForShopping(productId);
}


function setupEventListeners() {
    for (let i = 0; i < products.length; i++) {
        const productId = products[i].id;

        const shopping = document.getElementById(`shop-${productId}`);
        if (shopping) {
            shopping.addEventListener("click", (e) => {
                addToCart(productId, e);
            });
        }

        const favourite = document.getElementById(`love-${productId}`);
        if (favourite) {
            favourite.addEventListener("click", (e) => {
                addToFav(productId, e);
            });
        }
    }
}
/*=====================================================================================*/
function addToFav(productId, e) {
    const iconDiv = e.currentTarget;
    const icon = iconDiv.querySelector("i");

    const index = fav.indexOf(productId);

    if (index === -1) {
        fav.push(productId);
        iconDiv.classList.add("pressed");
        icon.classList.add("pressed-icon");
    } else {
        fav.splice(index, 1);
        iconDiv.classList.remove("pressed");
        icon.classList.remove("pressed-icon");
    }
    console.log(fav);
}

/*=====================================================================================*/

// Closes the popup
function closePopup(productId) {
    const popup = document.getElementById(`pop-up-shopping-${productId}`);
    const overlay = popup?.previousElementSibling; // Assuming overlay is right before popup

    if (popup) popup.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
}


/*=====================================================================================*/

function addDataToPopup(productId) {
    let product = products.find(p => p.id === productId);
    if (!product) return;

    let popupContainer = document.getElementById(`pop-up-shopping-${productId}`);
    if (!popupContainer) return;

    let salePrice = calculateDiscount(product.price, product.discount);
    let originalPrice = product.price;
    let saving = originalPrice - salePrice;

    let data = `
        <button class="close-btn" id="close-btn-popUp">×</button>
        <div class="data">
            <h3 class="product-title-pop">${product.title}</h3>
        </div>
        <div class="price"> 
            <span class="original-price">LE${originalPrice}.00</span>
            <span class="sale-price">LE${salePrice}.00</span>
        </div>
        <div class="savings">SAVE LE${saving}.00</div>
        <span class="colors-label">COLORS AVAILABLE</span>
        <div class="colors-product-pop" id="colors-product-pop"></div>
        <div class="color-section">
            <div class="size-option">
                <span class="size-label">SIZES AVAILABLE</span>
            </div>
            <div class="sizes" id="sizes-pop-up"></div>
        </div>
        <button class="add-to-cart" id="add-to-cart-pop">ADD TO CART</button>
    `;

    popupContainer.innerHTML = data;

    // Add sizes
    let sizesContainer = document.getElementById("sizes-pop-up");
    product.sizes.forEach(size => {
        sizesContainer.innerHTML += `<div class="size-option">${size}</div>`;
    });

    // Add color options
    let colorsContainer = document.getElementById("colors-product-pop");
    product.url.forEach((url, j) => {
        const thumbnailsCropped = transformImageUrl(url, 2400, 2400);
        colorsContainer.innerHTML += `<img class="thumbnail-pop" src="${thumbnailsCropped}">`;
    });

    // Add event listeners
    document.getElementById("add-to-cart-pop").addEventListener("click", () => {
        closePopup(productId);
        itemChosen = product;
        console.log("Item added to cart:", itemChosen);
    });

    document.getElementById("close-btn-popUp").addEventListener("click", () => {
        closePopup(productId);
    });
}


