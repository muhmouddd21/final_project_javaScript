import {db,collection,getDocs,addDoc} from './config.js'
import {initScrollToTop} from './scrollToup.js'

let products = []; // Generic products array
let savedURL = {}; // Stores original image URLs
let fav = new Set(); // Tracks favorite items
let itemChosen = {}; // Stores currently selected item

// Initialize the page with default category
document.addEventListener('DOMContentLoaded',() => {
     loadProducts('men-bottoms'); 
});


colRef = collection(db, "jackets");

// Main function to load products from a category
 function loadProducts(category) {
    // Get the appropriate collection reference based on category
    let colRef;
    switch(category.toLowerCase()) {
        case 't-shirts':
            colRef = collection(db, "t-shirts");
            break;
        case 'shoes':
            colRef = collection(db, "shoes");
            break;
        case 'men-bottoms':
            colRef = collection(db, "men-bottoms");
            break;
        case 'men-tops':
            colRef = collection(db, "men-tops");
            break;
        // Add more categories as needed
        default:
            console.error("Unknown product category");
            return;
    }
   
  
    getDocs(colRef)
    .then((snapshot) => {
        products = []; // Reset products array
        snapshot.docs.forEach((doc) => {
            products.push({...doc.data(), id: doc.id});
        });
        

        createStructureOfCards(products.length);
        setupEventListeners(products.length);
        populateProductData(products.length);
        attachThumbnailHoverEvents();
    })
    .catch(error => {
        console.error("Error loading products: ", error);
    });
}

// Creates the HTML structure for product cards
function createStructureOfCards(productsLength) {
    let container = document.getElementById("containerOfCards");
    // container.innerHTML = ""; // Clear existing content
    
    for(let i = 0; i < productsLength; i++) {
        if (!products[i]) continue; // Skip if product doesn't exist
       
        let card = `
        <div class="card-m">
            <div class="image">
                <img id="previewImage-${i}" />

                <div class="action-icons">
                    <div class="icon" id="shop-${i}" ><i class="fa-solid fa-cart-shopping"></i></div>
                    <div class="icon" id="love-${i}"><i class="fa-solid fa-heart"></i></div>
                </div>
                <div class="sizes " id="sizes-${i}"></div>
            </div>
            <div class="discount-badge" id="discount-badge-${i}"></div>

            <div class="info">
                <h3 class="product-title" id="product-title-${i}"></h3>
                <div class="product-price">
                    <span class="original-price" id="original-price-${i}"></span>
                    <span class="sale-price" id="sale-price-${i}"> </span>
                </div>
            </div>
            <div class="thumbnail-container" id="thumbnail-container-${i}">
            <div class="pop-up-overlay"></div>
                <div class="pop-up" id="pop-up-shopping"></div>
            </div>
        </div>
        `;
        container.innerHTML += card;

    
}

// Creates the HTML structure for product cards



// Sets up event listeners for all interactive elements
function setupEventListeners() {
    // Shopping cart icon event listeners
    for (let i = 0; i < products.length; i++) {
        const shopping = document.getElementById(`shop-${i}`);
        if (shopping) {
            shopping.addEventListener("click", (e) => {
                let idOfElem = e.target.closest(".icon").id;
                let locOfHifen = idOfElem.indexOf("-") + 1;
                addToCart(Number(idOfElem.substring(locOfHifen)), e);
            });
        }
    }
    // Favorite icon event listeners
    for (let i = 0; i < products.length; i++) {
        const favourite = document.getElementById(`love-${i}`);
        if (favourite) {
            favourite.addEventListener("click", (e) => {
                let idOfElem = e.target.closest(".icon").id;
                let locOfHifen = idOfElem.indexOf("-") + 1;
                addToFav(Number(idOfElem.substring(locOfHifen)), e);
            });
        }
    }
}

// Populates product data into the cards
function populateProductData() {
    for(let i = 0; i < products.length; i++) { 
        if (!products[i]) continue;
        
        const originalUrl = products[i].url[0];
        const croppedUrl = transformImageUrl(originalUrl, 2400, 2400);

        saveOrginalSrcOfCards(croppedUrl, i);
        document.getElementById(`previewImage-${i}`).src = croppedUrl;

        // Set thumbnails
        for(let j = 1; j < products[i].url.length; j++) {
            const thumbnailsCropped = transformImageUrl(products[i].url[j], 2400, 2400);
            document.getElementById(`previewImage-${i}-${j}`).src = thumbnailsCropped;
        }
        
        // Set product info
        document.getElementById(`product-title-${i}`).innerText = products[i].title;
        document.getElementById(`discount-badge-${i}`).innerText = `-${products[i].discount}%`;
        document.getElementById(`sale-price-${i}`).innerText = `LE ${calculateDiscount(products[i].price, products[i].discount)}.00`;
        document.getElementById(`original-price-${i}`).innerText = `LE ${products[i].price}.00`;
    }
}

// Saves original image URLs for hover effects
function saveOrginalSrcOfCards(src, id) {
    savedURL[id] = src;
}

// Handles thumbnail hover effects
function attachThumbnailHoverEvents() {
    const cards = document.querySelectorAll(".card-m");
    
    cards.forEach((card, i) => {
        const targetImage = document.getElementById(`previewImage-${i}`);
        if (!targetImage) return;
        
        const thumbnailContainer = card.querySelector(".thumbnail-container");
        const thumbnails = thumbnailContainer.querySelectorAll(".thumbnail");
        
        thumbnails.forEach((thumb) => {
            thumb.addEventListener("mouseenter", () => {
                fadeImage(targetImage, thumb.src);
            });
        });
        
        thumbnailContainer.addEventListener("mouseleave", () => {
            fadeImage(targetImage, savedURL[i]);
        });
    });
}

// Fades between images smoothly
function fadeImage(imgElement, newSrc) {
    if (imgElement.src === newSrc) return;
  
    imgElement.classList.add("fade-out");
  
    const onTransitionEnd = () => {
        imgElement.src = newSrc; 
        imgElement.classList.remove("fade-out");
        imgElement.removeEventListener("transitionend", onTransitionEnd);
    };
  
    imgElement.addEventListener("transitionend", onTransitionEnd);
    setTimeout(onTransitionEnd, 300);
}

// Adds item to cart
function addToCart(id, e) {
    let idOfElement = products[id].id;
    popUpMenuForShopping(id, idOfElement);
}

// Adds item to favorites
function addToFav(id, e) {
    const idOfElement = products[id].id;
    const iconDiv = e.currentTarget;
    const icon = iconDiv.querySelector("i");

    if (!fav.has(idOfElement)) {
        fav.add(idOfElement);
        iconDiv.classList.add("pressed");
        icon.classList.add("pressed-icon");
    } else {
        fav.delete(idOfElement);
        iconDiv.classList.remove("pressed");
        icon.classList.remove("pressed-icon");
    }
}

// Shows popup menu for product details
function popUpMenuForShopping(id) {
    document.querySelector('.pop-up').classList.add('open');
    document.querySelector('.pop-up-overlay').classList.add('open');
    addDataToPopup(id);
}

// Adds product data to popup
function addDataToPopup(id) {
    
    let popupContainer = document.getElementById("pop-up-shopping");
    if (!products[id]) return;

    let salePrice = calculateDiscount(products[id].price, products[id].discount);  
    let originalPrice = products[id].price;
    let saving = originalPrice - salePrice;

    let data = `
        <button class="close-btn" id="close-btn-popUp">×</button>
        <div class="data">
            <h3 class="product-title-pop">${products[id].title}</h3>
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
    products[id].sizes.forEach(size => {
        sizesContainer.innerHTML += `<div class="size-option">${size}</div>`;
    });
    
    // Add color options
    let colorsContainer = document.getElementById("colors-product-pop");
    products[id].url.forEach((url, j) => {
        const thumbnailsCropped = transformImageUrl(url, 2400, 2400);
        colorsContainer.innerHTML += `<img class="thumbnail-pop" src="${thumbnailsCropped}">`;
    });
    
    // Add event listeners
    document.getElementById("add-to-cart-pop").addEventListener("click", () => {
        closePopup();
        itemChosen = products[id];
        console.log("Item added to cart:", itemChosen);
    });
    
    document.getElementById("close-btn-popUp").addEventListener("click", closePopup);
}

// Closes the popup
function closePopup() {
    document.querySelector('.pop-up').classList.remove('open');
    document.querySelector('.pop-up-overlay').classList.remove('open');
}

// Helper function to calculate discounted price
function calculateDiscount(price, discount) {
    return Math.round(price * (1 - discount / 100));
}

// Helper function to transform image URLs (implementation depends on your image service)
function transformImageUrl(url, width, height) {
    // Implement your specific image URL transformation logic here
    // This is just a placeholder example
    return `${url}?width=${width}&height=${height}`;
}


// button to scroll to top
 initScrollToTop();













