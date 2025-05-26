
import { db, collection, getDocs,deleteDoc,doc,addDoc,updateDoc } from "./config.js";


const loadProducts = [];
let  originalProducts =[];
let filterProducts = [];
let urlsUploaded=[];
let urlMap = new Map();
let collectionsNames= ["men-bottoms","men-tops","women-bottoms","women-tops"];
async function getProductsFromDB(collectionsNames) {

        for(let i=0; i <collectionsNames.length; i++){
          await getDocs(collection(db, collectionsNames[i]))
          .then((snapshot)=>{
              snapshot.docs.forEach((doc)=>{
                loadProducts.push({...doc.data(),
                    id: doc.id,
                    collectionName: collectionsNames[i]
                })
              }) 
              
          })
        }
     return loadProducts; 
  }

(async () => {
  await getProductsFromDB(collectionsNames);
  addSortingEventListeners();
  addFilteringEventListeners();
  addDeleteProductEventListener();
  refreshProducts();
  addEventListenerforFiles();
  renderProducts(loadProducts); 


  
})();


  function refreshProducts(){
    originalProducts = [...loadProducts]; // without any sorting i saved producted in originalProducts
    filterProducts = [...originalProducts];
  }

// // DOM Elements
const generalLink = document.getElementById('general-link');
const productsLink = document.getElementById('products-link');
const generalSection = document.getElementById('general-section');
const productsSection = document.getElementById('products-section');
const productTableBody = document.getElementById('product-table-body');
const saveProductBtn = document.getElementById('save-product-btn');

// const updateProductBtn = document.getElementById('update-product-btn');

const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const filterCategorySelect = document.getElementById('filter-category');
// const sortBySelect = document.getElementById('sort-by');
// const applyFiltersBtn = document.getElementById('apply-filters-btn');
const noProductsMessage = document.getElementById('no-products-message');
const  productCategoryInAddProduct =document.getElementById('product-category');
const ordersLink = document.getElementById('orders-link');
const ordersSection = document.getElementById('orders-section');



generalLink.addEventListener('click', function(e) {
    e.preventDefault();
    activateSection(generalSection, generalLink);
});

productsLink.addEventListener('click', function(e) {
    e.preventDefault();
    activateSection(productsSection, productsLink);
    renderProducts(loadProducts); 
});

ordersLink.addEventListener('click', function(e) {
    e.preventDefault();
    activateSection(ordersSection, ordersLink);
    loadOrdersSection();
});

function activateSection(section, link) {
        document.querySelectorAll('.page-section').forEach(sec => {
            sec.classList.remove('active');
    });

    document.querySelectorAll('.nav-link').forEach(navLink => {
        navLink.classList.remove('active');
    });
            
    section.classList.add('active');
    link.classList.add('active');
}



function addFilteringEventListeners(){
    addTagsFiltersByCategoryAndAddProduct();
    const filterSelect = document.getElementById('filter-category');
     filterSelect.addEventListener("change", (e) => {
         filterProducts = filterdProductsByCategory(originalProducts,e.target.value)
       
        if(e.target.value == "all"){
            filterProducts = originalProducts;
        }

         renderProducts(filterProducts);   
    });

      


}




function filterdProductsByCategory(originalProducts,filter){
    let filterProducts=[];
    originalProducts.forEach((product)=>{
        if(product.collectionName == filter){
            filterProducts.push(product);
        }
    })
    return filterProducts;
}





function addTagsFiltersByCategoryAndAddProduct(){
    collectionsNames.forEach((collection)=>{
            filterCategorySelect.innerHTML += `
            <option value="${collection}">${collection}</option>
            `;
            productCategoryInAddProduct.innerHTML += `
            <option value="${collection}">${collection}</option>
            `;
        
    })

}




let priceClicks = 0;
let titleClicks = 0;

function addSortingEventListeners() {

    
    const priceButton = document.getElementById('price-column');
    const titleButton = document.getElementById('title-column');
    const sortSelect = document.getElementById('sort-by');


    priceButton.addEventListener("click", () => {
        resetTitleSorting();
        priceClicks++;
        if (priceClicks === 1) {
            sortProductsByPrice( filterProducts, 0);
        } else if (priceClicks === 2) {
            sortProductsByPrice(filterProducts, 1);
        } else {
            sortProductsByPrice(filterProducts, 2);
            priceClicks = 0;
        }
    });

    titleButton.addEventListener("click", () => {
        resetPriceSorting();
        titleClicks++;
        if (titleClicks === 1) {
            sortProductsByTitle(filterProducts, 0);
        } else if (titleClicks === 2) {
            sortProductsByTitle(filterProducts, 1);
        } else {
            sortProductsByTitle(filterProducts, 2);
            titleClicks = 0;
        }
    });

    sortSelect.addEventListener("change", (e) => {
        const val = e.target.value;

        if (val === 'price-asc') {
            resetTitleSorting();
            priceClicks = 1;
            sortProductsByPrice(filterProducts, 0);
        } else if (val === 'price-desc') {
            resetTitleSorting();
            priceClicks = 2;
            sortProductsByPrice(filterProducts, 1);
        } else if (val === 'title-asc') {
            resetPriceSorting();
            titleClicks = 1;
            sortProductsByTitle(filterProducts, 0);
        } else if (val === 'title-desc') {
            resetPriceSorting();
            titleClicks = 2;
            sortProductsByTitle(filterProducts, 1);
        } else {
            resetPriceSorting();
            resetTitleSorting();
            renderProducts(filterProducts);
        }
    });
}

function sortAscByPrice(products) {
    return products.slice().sort((a, b) => a.price - b.price);
}
function sortDescByPrice(products) {
    return products.slice().sort((a, b) => b.price - a.price);
}
function sortAscByTitle(products) {
    return products.slice().sort((a, b) => a.title.localeCompare(b.title));
}
function sortDescByTitle(products) {
    return products.slice().sort((a, b) => b.title.localeCompare(a.title));
}

function changeArrow(button, label, flag) {
    if (flag === 0) {
        button.innerHTML = label + ' ↑';
    } else if (flag === 1) {
        button.innerHTML = label + ' ↓';
    } else {
        button.innerHTML = label;
    }
}

function sortProductsByPrice(products, flag) {
    const priceButton = document.getElementById('price-column');
    const sortSelect = document.getElementById('sort-by');
    let sorted = [];

    if (flag === 0) {
        sorted = sortAscByPrice(products);
        sortSelect.value = 'price-asc';
    } else if (flag === 1) {
        sorted = sortDescByPrice(products);
        sortSelect.value = 'price-desc';
    } else {
        sorted = filterProducts;
        sortSelect.value = 'none';
    }

    changeArrow(priceButton, 'Price', flag);
    renderProducts(sorted);
}

function sortProductsByTitle(products, flag) {
    const titleButton = document.getElementById('title-column');
    const sortSelect = document.getElementById('sort-by');
    let sorted = [];

    if (flag === 0) {
        sorted = sortAscByTitle(products);
        sortSelect.value = 'title-asc';
    } else if (flag === 1) {
        sorted = sortDescByTitle(products);
        sortSelect.value = 'title-desc';
    } else {
        sorted = filterProducts;
        sortSelect.value = 'none';
    }

    changeArrow(titleButton, 'Title', flag);
    renderProducts(sorted);
}

function resetPriceSorting() {
    priceClicks = 0;
    const priceButton = document.getElementById('price-column');
    priceButton.innerHTML = 'Price';
}

function resetTitleSorting() {
    titleClicks = 0;
    const titleButton = document.getElementById('title-column');
    titleButton.innerHTML = 'Title';
}


// Render products in table
function renderProducts(loadProducts) {
    const productsToRender = loadProducts;

    productTableBody.innerHTML = '';
    
    if (productsToRender.length === 0) {
        noProductsMessage.classList.remove('d-none');
    } else {
        noProductsMessage.classList.add('d-none');
        

        for(let i =0; i< productsToRender.length; i++){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${productsToRender[i].id}</td>
                <td id ="img-${i}"></td>
                <td>${productsToRender[i].title}</td>
                <td>${productsToRender[i].collectionName}</td>
                <td id ="size-${i}"></td>
                <td>${productsToRender[i].price.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-dark edit-btn" data-id="${productsToRender[i].id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${productsToRender[i].id}">

                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;


            productTableBody.appendChild(row);
            let targetImage = document.getElementById(`img-${i}`);
            productsToRender[i].url.forEach((image)=>{
                targetImage.innerHTML += `
                    <img src="${image}" alt="${productsToRender[i].title}" >
                `

            })
            let targetSize = document.getElementById(`size-${i}`);
            productsToRender[i].sizes.forEach((size)=>{
                targetSize.innerHTML += `
                    ${size} <br>
                `
            })
            
            
            
        }
        let imagesOfTable =document.querySelectorAll('#product-table-body tr td img');
        [].forEach.call(imagesOfTable, img =>{
            img.style.cssText=`
                        width: 3.75rem;
                        height: 3.75rem;
                        object-fit: cover;
                        border-radius: 5px;
                        display: block;
                        max-width: 100%;
                        max-height: 100%;
                        cursor:pointer;

            `
        })

    }
    addingEventListners();
}

   




function addingEventListners(){
        document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            let id = this.getAttribute('data-id');
        
            openEditModal(id);

        });
        })
        document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            let id = this.getAttribute('data-id');
    
            openDeleteModal(id);
        });
        })
        let images =document.querySelectorAll('#product-table-body tr td img');
        let targetDiv = document.getElementById("target-div-To-Show-photo");
        [].forEach.call(images,(image)=>{
            image.addEventListener("click",(e)=>{
               
                targetDiv.style.cssText=`
                        opacity: 1;
                        z-index: 9999;
                        pointer-events: auto;
                        width: 400px;
                        height: 600px;
                        background-size: contain;
                        background-repeat: no-repeat;
                        background-position: center center;  
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        transition: all 0.3s ease-in-out; 
                `;
                targetDiv.style.backgroundImage ="url("+ e.target.src +")";
            })
        })
        document.addEventListener("click",(e)=>{
            if(e.target.tagName !== 'IMG' && e.target.id !== 'target-div-To-Show-photo'){
      
                targetDiv.style.cssText ='';
            }
            
            
        })  
        document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            targetDiv.style.cssText ='';
        }
        });
        

      
}
// function openEditModal(productId) {
//     const product = loadProducts.find(p => p.id === productId);

    
//     if (product) {
//         document.getElementById('edit-product-id').value = product.id;
//         document.getElementById('edit-product-name').value = product.title;
//         document.getElementById('edit-product-category').value = product.collectionName;
//         document.getElementById('edit-product-price').value = product.price;
        
//         const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
//         modal.show();
//     }
// }
function openDeleteModal(productId) {
    
    
    document.getElementById('delete-product-id').value = productId;
    const modal = new bootstrap.Modal(document.getElementById('deleteProductModal'));
    modal.show();
}


function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const content = document.querySelector('.content');
    content.insertBefore(alertDiv, content.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function addDeleteProductEventListener(){
    confirmDeleteBtn.addEventListener("click",()=>{
    console.log("hey");
    const productId = document.getElementById('delete-product-id').value;

    let IndexToBeDeleted=0;
    let collectionName = null;
    loadProducts.forEach((product,I)=>{
        if(product.id == productId){
            IndexToBeDeleted =I;
            collectionName = product.collectionName;
        }
    });
    const refDoc= doc(db,collectionName,productId);
    deleteDoc(refDoc)
    .then(()=>{

                loadProducts.splice(IndexToBeDeleted,1);
                refreshProducts();
                renderProducts(loadProducts);
                const modal = bootstrap.Modal.getInstance(document.getElementById('deleteProductModal'));
                modal.hide();
                showAlert('Product deleted successfully!', 'success');
    })
    

        
    })
    
}

document.getElementById("addSizeBtn").addEventListener("click", function () {
    const sizesContainer = document.getElementById("sizesContainer");
    const sizeItem = document.createElement("div");
    sizeItem.className = "size-item-m";
    sizeItem.innerHTML = `
        <input type="text" name="sizeValue[]" placeholder="Size value (e.g., M)" value="M">
        <button type="button" class="remove-btn-m">Remove</button>
    `;
    sizesContainer.appendChild(sizeItem);
});


let imageId = 0; 

document.getElementById("addImageBtn").addEventListener("click", function () {
    const imagesContainer = document.getElementById("ImagesContainer");

    const imageItem = document.createElement("div");
    imageItem.className = "image-item-m";
    imageItem.innerHTML = `
        <input
            type="file"
            class="form-control focus-ring focus-ring-dark"
            name="product-image[]"
            id="img-id-${imageId}"
            accept="image/*"
        />
    `;

    const delButton = document.createElement("button");
    delButton.type = "button";
    delButton.className = "remove-btn-m-img";
    delButton.id = `remove-btn-m-img-${imageId}`;
    delButton.textContent = "Remove";

    imageItem.appendChild(delButton);
    imagesContainer.appendChild(imageItem);



    imageId++;


    
});


document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("remove-btn-m-img")) {
        const parentDiv = e.target.parentElement;
        const input = parentDiv.querySelector("input[type='file']");
        const inputId = input ? input.id : undefined;

        if (inputId && urlMap.has(inputId)) {
            const urlToRemove = urlMap.get(inputId);

            urlsUploaded = urlsUploaded.filter(url => url !== urlToRemove);

            urlMap.delete(inputId);
        }
        console.log(urlsUploaded);
        
        parentDiv.remove(); 
    }
});

let spanId=0; // for the word uploading
function addEventListenerforFiles() {
    
    const imagesContainer = document.getElementById("ImagesContainer");

    imagesContainer.addEventListener("change", function(e) {
        if (e.target && e.target.matches("input[type='file']")) {
            spanId++;
            uploadImageToCloudinary(e.target.id,spanId);
        }
    });
}



async function uploadImageToCloudinary(idElement,currentSpanId){

    const fileInput = document.getElementById(idElement);
    let url = await uploadImage(fileInput,currentSpanId);
  
    if(url){
        const sign = document.getElementById(`deliveredOrNot-${currentSpanId}`);
        sign.innerHTML = `<i class="fa-solid fa-check" style="color: green;"></i>`;
        urlsUploaded.push(url);
        urlMap.set(idElement, url);
     
    }

   
}


async function uploadImage(fileInput,currentSpanId) {


    let container1 =fileInput.parentElement;
    let span = document.createElement("span");
    span.id =`deliveredOrNot-${currentSpanId}`;
    span.style.paddingLeft = '10px';
    span.innerHTML = "Uploading ...";
    container1.appendChild(span);


    const file = fileInput.files[0];

    
    if (!file) {
        alert("Please select a file");
        return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'shoes-test'); 

    try {
        const response = await fetch('https://api.cloudinary.com/v1_1/denqwkum6/image/upload', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error('Upload failed');
        
        const data = await response.json();
        return (data.secure_url);

    } catch (error) {
        console.error('Error:', error);
        alert("Upload failed: " + error.message);
    }
}


function initializeSaveProduct() {
    const saveProductBtn = document.getElementById('save-product-btn');
    
    saveProductBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const errorContainer = document.getElementById('add-product-errors');
        errorContainer.classList.add('d-none');
        

        const title = document.getElementById('product-name').value.trim();
        const discountValue = document.getElementById('product-Discount').value;
        const priceValue = document.getElementById('product-price').value;
        const collectionN = document.getElementById('product-category').value;


        const sizes = [];
        document.querySelectorAll('#sizesContainer .size-item-m').forEach(item => {
            const value = item.querySelector('input[name="sizeValue[]"]').value.trim();
            if (value) {
                sizes.push(value);
            }
        });
        const urls = [...urlsUploaded];
        let errors = [];

        // Validation
        if (!title) {
            errors.push('Title is required.');
        }

        if (priceValue === '' || isNaN(priceValue) || Number(priceValue) <= 0) {
            errors.push('Price must be a valid number greater than 0.');
        }

        const discount = Number(discountValue);
        if (isNaN(discount) || discount < 0 || discount > 100) {
            errors.push('Discount must be a number between 0 and 100.');
        }

        if (sizes.length === 0) {
            errors.push('At least one size is required.');
        }

        if (urls.length === 0) {
            errors.push('At least one image is required.');
        }


        if (errors.length > 0) {
            errorContainer.innerHTML = `
                <strong>Validation Errors:</strong>
                <ul class="mb-0">
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            `;
            errorContainer.classList.remove('d-none');
            
            errorContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        const formData = {
            title: title,
            discount: discount,
            price: Number(priceValue),
            sizes: sizes,
            url: urls
        };

        const colRef = collection(db, collectionN);
        addDoc(colRef, formData)
            .then((docRef) => {
                const productForm = document.getElementById("add-product-form");
                productForm.reset();
                urlsUploaded = [];
                urlMap.clear();
                loadProducts.push({ ...formData, id: docRef.id, collectionName: collectionN });
                refreshProducts();
                renderProducts(loadProducts);
                const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
                modal.hide();
                showAlert('Product added successfully!', 'success');
            })
            .catch((error) => {
                errorContainer.innerHTML = `
                    <strong>Server Error:</strong>
                    <div class="mb-0">${error.message}</div>
                `;
                errorContainer.classList.remove('d-none');
                errorContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeSaveProduct();
});

// Clearing errors 
document.getElementById('addProductModal').addEventListener('show.bs.modal', function () {
    document.getElementById('add-product-errors').classList.add('d-none');
});

// edit
let editUrlsUploaded = [];
let editUrlMap = new Map(); // if after upload an image and then delete it i need to create a map to the array editURLSUpladed to delete the link pushed 
let editImageId = 0;
let imagesToDelete = []; // Track images to be removed

// Updated openEditModal function
function openEditModal(productId) {
    const product = loadProducts.find(p => p.id === productId);

    if (product) {
        // Reset edit-specific variables
        editUrlsUploaded = [];
        editUrlMap.clear();
        editImageId = 0;
        imagesToDelete = [];

        // Populate basic fields
        document.getElementById('edit-product-id').value = product.id;
        document.getElementById('edit-product-collection').value = product.collectionName;
        document.getElementById('edit-product-name').value = product.title;
        document.getElementById('edit-product-category').value = product.collectionName;
        document.getElementById('edit-product-price').value = product.price;
        document.getElementById('edit-product-discount').value = product.discount || 0;

        // Populate category options
        populateEditCategoryOptions();

        // Populate sizes
        populateEditSizes(product.sizes);

        // Display current images
        displayCurrentImages(product.url);

        // Clear any previous new image inputs and their status indicators
        const editImagesContainer = document.getElementById('editImagesContainer');
        editImagesContainer.innerHTML = '';

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
        modal.show();
    }
}


function populateEditCategoryOptions() {
    const editCategorySelect = document.getElementById('edit-product-category');
    
    collectionsNames.forEach((collection) => {
        editCategorySelect.innerHTML += `
            <option value="${collection}">${collection}</option>
        `;
    });
}

// Populate sizes in edit modal
function populateEditSizes(sizes) {
    const sizesContainer = document.getElementById('editSizesContainer');
    sizesContainer.innerHTML = '';

    sizes.forEach((size) => {
        const sizeItem = document.createElement("div");
        sizeItem.className = "size-item-m";
        sizeItem.innerHTML = `
            <input type="text" name="editSizeValue[]" placeholder="Size value" value="${size}">
            <button type="button" class="remove-btn-m">Remove</button>
        `;
        sizesContainer.appendChild(sizeItem);
    });
}

function displayCurrentImages(imageUrls) {
    const currentImagesContainer = document.getElementById('currentImagesContainer');
    currentImagesContainer.innerHTML = '';

    imageUrls.forEach((url, index) => {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'position-relative d-inline-block';
        imageDiv.innerHTML = `
            <img src="${url}" alt="Product Image" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
            <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle delete-image-btn" 
                    style="width: 25px; height: 25px; font-size: 12px; padding: 0;" 
                    data-url="${url}">
                ×
            </button>
        `;
        currentImagesContainer.appendChild(imageDiv);
    });

    // Add event listeners for delete buttons
    currentImagesContainer.querySelectorAll('.delete-image-btn').forEach(button => {
        button.addEventListener('click', function() {
            const imageUrl = this.getAttribute('data-url');
            toggleImageDeletion(imageUrl, this);
        });
    });
}


// Replace the markImageForDeletion and unmarkImageForDeletion functions with this single function:
function toggleImageDeletion(imageUrl, button) {
    if (imagesToDelete.includes(imageUrl)) {
        // Unmark for deletion
        const index = imagesToDelete.indexOf(imageUrl);
        imagesToDelete.splice(index, 1);
        button.parentElement.style.opacity = '1';
        button.innerHTML = '×';
        button.title = 'Mark for deletion';
    } else {
        // Mark for deletion
        imagesToDelete.push(imageUrl);
        button.parentElement.style.opacity = '0.5';
        button.innerHTML = '↶';
        button.title = 'Undo deletion';
    }
}

// Add size functionality for edit modal
document.getElementById("editAddSizeBtn").addEventListener("click", function () {
    const sizesContainer = document.getElementById("editSizesContainer");
    const sizeItem = document.createElement("div");
    sizeItem.className = "size-item-m";
    sizeItem.innerHTML = `
        <input type="text" name="editSizeValue[]" placeholder="Size value (e.g., M)" value="M">
        <button type="button" class="remove-btn-m">Remove</button>
    `;
    sizesContainer.appendChild(sizeItem);
});

// Add image functionality for edit modal
document.getElementById("editAddImageBtn").addEventListener("click", function () {
    const imagesContainer = document.getElementById("editImagesContainer");

    const imageItem = document.createElement("div");
    imageItem.className = "image-item-m";
    imageItem.innerHTML = `
        <input
            type="file"
            class="form-control focus-ring focus-ring-dark"
            name="edit-product-image[]"
            id="edit-img-id-${editImageId}"
            accept="image/*"
        />
    `;

    const delButton = document.createElement("button");
    delButton.type = "button";
    delButton.className = "remove-btn-m-img";
    delButton.id = `edit-remove-btn-m-img-${editImageId}`;
    delButton.textContent = "Remove";

    imageItem.appendChild(delButton);
    imagesContainer.appendChild(imageItem);

    editImageId++;
});

// Handle file changes for edit modal
document.getElementById("editImagesContainer").addEventListener("change", function(e) {
    if (e.target && e.target.matches("input[type='file']")) {
        uploadEditImageToCloudinary(e.target.id);
    }
});

// Remove image functionality for edit modal
document.addEventListener("click", function (e) {
    if (e.target && e.target.classList.contains("remove-btn-m-img") && e.target.id.includes('edit-remove')) {
        const parentDiv = e.target.parentElement;
        const input = parentDiv.querySelector("input[type='file']");
        const inputId = input ? input.id : undefined;

        if (inputId && editUrlMap.has(inputId)) {
            const urlToRemove = editUrlMap.get(inputId);
            editUrlsUploaded = editUrlsUploaded.filter(url => url !== urlToRemove);
            editUrlMap.delete(inputId);
        }
        
        parentDiv.remove(); 
    }
});

// Upload image for edit modal
async function uploadEditImageToCloudinary(idElement) {
    const fileInput = document.getElementById(idElement);
    
    // Create a unique span ID for this upload
    const currentSpanId = `edit-${editImageId}-${Date.now()}`;
    
    let url = await uploadImage(fileInput, currentSpanId);
  
    if(url) {
        // Mark upload as complete
        const sign = document.getElementById(`deliveredOrNot-${currentSpanId}`);
        if (sign) {
            sign.innerHTML = `<i class="fa-solid fa-check" style="color: green;"></i>`;
        }
        
        editUrlsUploaded.push(url);
        editUrlMap.set(idElement, url);
    }
}

// Update product functionality
function initializeUpdateProduct() {
    const updateProductBtn = document.getElementById('update-product-btn');
    
    updateProductBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const errorContainer = document.getElementById('edit-product-errors');
        errorContainer.classList.add('d-none');
        
        // Collect form values
        const productId = document.getElementById('edit-product-id').value;
        const originalCollectionName = document.getElementById('edit-product-collection').value;
        const title = document.getElementById('edit-product-name').value.trim();
        const newCollectionName = document.getElementById('edit-product-category').value;
        const priceValue = document.getElementById('edit-product-price').value;
        const discountValue = document.getElementById('edit-product-discount').value;

        // Collect sizes
        const sizes = [];
        document.querySelectorAll('#editSizesContainer .size-item-m').forEach(item => {
            const value = item.querySelector('input[name="editSizeValue[]"]').value.trim();
            if (value) {
                sizes.push(value);
            }
        });

        // Get current product to preserve existing images
        const currentProduct = loadProducts.find(p => p.id === productId);
        if (!currentProduct) {
            console.error('Product not found');
            return;
        }

        // Calculate final image URLs
        let finalImageUrls = currentProduct.url.filter(url => !imagesToDelete.includes(url));
        finalImageUrls = [...finalImageUrls, ...editUrlsUploaded];

        let errors = [];

        // Validation
        if (!title) {
            errors.push('Title is required.');
        }

        if (priceValue === '' || isNaN(priceValue) || Number(priceValue) <= 0) {
            errors.push('Price must be a valid number greater than 0.');
        }

        const discount = Number(discountValue);
        if (isNaN(discount) || discount < 0 || discount > 100) {
            errors.push('Discount must be a number between 0 and 100.');
        }

        if (sizes.length === 0) {
            errors.push('At least one size is required.');
        }

        if (finalImageUrls.length === 0) {
            errors.push('At least one image is required.');
        }

        if (!newCollectionName) {
            errors.push('Category is required.');
        }

        // Show errors if any
        if (errors.length > 0) {
            errorContainer.innerHTML = `
                <strong>Validation Errors:</strong>
                <ul class="mb-0">
                    ${errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            `;
            errorContainer.classList.remove('d-none');
            errorContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        // Prepare update data
        const updateData = {
            title: title,
            discount: discount,
            price: Number(priceValue),
            sizes: sizes,
            url: finalImageUrls
        };

        // Check if collection changed - if so, need to move document
        if (originalCollectionName !== newCollectionName) {
            // Delete from old collection and add to new collection
            handleCollectionChange(productId, originalCollectionName, newCollectionName, updateData, errorContainer);
        } else {
            // Simple update in same collection
            const docRef = doc(db, originalCollectionName, productId);
            updateDoc(docRef, updateData)
                .then(() => {
                    updateLocalProductData(productId, updateData, newCollectionName);
                    showUpdateSuccess();
                })
                .catch((error) => {
                    showUpdateError(error, errorContainer);
                });
        }
    });
}

// Clear errors when edit modal is shown
document.getElementById('editProductModal').addEventListener('show.bs.modal', function () {
    document.getElementById('edit-product-errors').classList.add('d-none');
});

// Initialize update product functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeUpdateProduct();
});

async function handleCollectionChange(productId, oldCollection, newCollection, updateData, errorContainer) {
    try {
        // Add to new collection
        const newColRef = collection(db, newCollection);
        const newDocRef = await addDoc(newColRef, updateData);
        
        // Delete from old collection
        const oldDocRef = doc(db, oldCollection, productId);
        await deleteDoc(oldDocRef);
        
        // Update local data with new ID and collection
        const productIndex = loadProducts.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            loadProducts[productIndex] = {
                ...updateData,
                id: newDocRef.id,
                collectionName: newCollection
            };
        }
        
        showUpdateSuccess();
    } catch (error) {
        showUpdateError(error, errorContainer);
    }
}

// Helper function to update local product data
function updateLocalProductData(productId, updateData, collectionName) {
    const productIndex = loadProducts.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        loadProducts[productIndex] = {
            ...loadProducts[productIndex],
            ...updateData,
            collectionName: collectionName
        };
    }
    
    refreshProducts();
    renderProducts(loadProducts);
}

// Helper function to show update success
function showUpdateSuccess() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
    modal.hide();
    showAlert('Product updated successfully!', 'success');
}

// Helper function to show update error
function showUpdateError(error, errorContainer) {
    console.error('Update error:', error);
    errorContainer.innerHTML = `
        <strong>Server Error:</strong>
        <div class="mb-0">${error.message}</div>
    `;
    errorContainer.classList.remove('d-none');
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Enhanced remove image functionality for edit modal
document.addEventListener("click", function (e) {
    // Handle remove buttons for new images in edit modal
    if (e.target && e.target.classList.contains("remove-btn-m-img") && e.target.id.includes('edit-remove')) {
        const parentDiv = e.target.parentElement;
        const input = parentDiv.querySelector("input[type='file']");
        const inputId = input ? input.id : undefined;

        if (inputId && editUrlMap.has(inputId)) {
            const urlToRemove = editUrlMap.get(inputId);
            editUrlsUploaded = editUrlsUploaded.filter(url => url !== urlToRemove);
            editUrlMap.delete(inputId);
        }
        
        // Also remove any upload status indicators
        const statusSpan = parentDiv.querySelector('span[id^="deliveredOrNot-"]');
        if (statusSpan) {
            statusSpan.remove();
        }
        
        parentDiv.remove(); 
    }
    
    // Handle remove buttons for sizes in edit modal
    if (e.target && e.target.classList.contains("remove-btn-m")) {
        const parentDiv = e.target.parentElement;
        // Only remove if it's not the last size item
        const sizeContainer = parentDiv.parentElement;
        const sizeItems = sizeContainer.querySelectorAll('.size-item-m');
        
        if (sizeItems.length > 1) {
            parentDiv.remove();
        } else {
            showAlert('At least one size is required.', 'warning');
        }
    }
});

// Clear edit modal data when closed
document.getElementById('editProductModal').addEventListener('hidden.bs.modal', function () {
    // Clear upload arrays
    editUrlsUploaded = [];
    editUrlMap.clear();
    imagesToDelete = [];
    editImageId = 0;
    
    // Clear error messages
    document.getElementById('edit-product-errors').classList.add('d-none');
    
    // Reset form
    document.getElementById('edit-product-form').reset();
});

// -------------------- order history
let isLoadingOrders = false;
let currentLoadingOperation = null;


  async function getUsersFromDB() {
    let users =[];
    const usersCollection = collection(db, "users");
    const userSnapshots = await getDocs(usersCollection);

    for (const userDoc of userSnapshots.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;

        const ordersCollection = collection(db, `users/${userId}/orders`);
        const ordersSnapshot = await getDocs(ordersCollection);

        const orders = ordersSnapshot.docs.map(orderDoc => ({
        id: orderDoc.id,
        ...orderDoc.data(),
        }));

        users.push({
        id: userId,
        ...userData,
        orders,  
        });
    }
    return users;
}

     

function getFilteredOrders(users) {
    let filteredOrders =[];
  users.forEach((user) => {
    if (user.orders && user.orders.length > 0) {
      user.orders.forEach((order) => {
        filteredOrders.push({
          id: order.orderId,
          firstName:user.firstName,
          lastName:user.lastName,
          email:user.email,
          createdAt: new Date(user.createdAt),
          status: order.status,
          totalAmount: order.totalAmount,
          items: order.items || [],
        });
      });
    } else {
      filteredOrders.push({
        id: "none",
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email,
        createdAt: new Date(user.createdAt),
        status: "None",
        totalAmount: 0,
        items: [],
      });
    }
  });
  return filteredOrders; 
}
        

const ordersTableBody = document.getElementById('orders-table-body');
const noOrdersMessage = document.getElementById('no-orders-message');
const ordersLoading = document.getElementById('orders-loading');
const refreshOrdersBtn = document.getElementById('refresh-orders-btn');


async function loadOrdersSection() {
 
    if (isLoadingOrders) {
        console.log('Already loading orders, skipping...');
        return;
    }
    

    isLoadingOrders = true;
    

    const operationId = Date.now();
    currentLoadingOperation = operationId;
    
    try {
        showOrdersLoading(true);
        

        if (currentLoadingOperation !== operationId) {
            console.log('Load operation cancelled');
            return;
        }
        
        const users = await getUsersFromDB();
        console.log('Users loaded:', users);
        
 
        if (currentLoadingOperation !== operationId) {
            console.log('Load operation cancelled after getUsersFromDB');
            return;
        }
        
        const filteredOrders = getFilteredOrders(users);
        console.log('Filtered orders:', filteredOrders);
        

        if (currentLoadingOperation !== operationId) {
            console.log('Load operation cancelled before rendering');
            return;
        }
        
        renderOrders(filteredOrders);
        showOrdersLoading(false);
        
    } catch (error) {
        console.error('Error loading orders:', error);
        showOrdersLoading(false);
        // Optionally show error message to user
    } finally {
        // Reset loading state only if this is still the current operation
        if (currentLoadingOperation === operationId) {
            isLoadingOrders = false;
            currentLoadingOperation = null;
        }
    }
}

 
function showOrdersLoading(show) {
    if (show) {
        ordersLoading.classList.remove('d-none');
        ordersTableBody.innerHTML = '';
        noOrdersMessage.classList.add('d-none');
    } else {
        ordersLoading.classList.add('d-none');
    }
}


function renderOrders(orders) {
    ordersTableBody.innerHTML = '';
    
    if (orders.length === 0) {
        noOrdersMessage.classList.remove('d-none');
        return;
    }
    
    noOrdersMessage.classList.add('d-none');
    
    orders.forEach(order => {
        const row = createOrderRow(order);
        ordersTableBody.appendChild(row);
    });
}
  function createOrderRow(order) {
        const row = document.createElement('tr');
        
        const statusClass = getStatusClass(order.status);
        const formattedDate = order.createdAt.toLocaleDateString() + ' ' + 
                             order.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const itemsPreview = order.items.slice(0, 2).map(item => {
        const title = item.title || 'Product';
        const size = item.size ? `(${item.size})` : '';
        const quantity = item.quantity || 1;
        return `<div class="order-item">${title} ${size} x${quantity}</div>`;
        }).join('');
    
        const moreItemsText = order.items.length > 2 ? 
          `<div class="order-item">+${order.items.length - 2} more items</div>` : '';
        
        row.innerHTML = `
          <td><code>${order.id}</code></td>
          <td>${order.firstName}</td>
          <td>${order.lastName}</td>
          <td>${order.email}</td>
          <td>${formattedDate}</td>
          <td>
            <div class="order-items">
              ${itemsPreview}
              ${moreItemsText}
            </div>
          </td>
          <td><strong>${order.totalAmount.toFixed(2)}</strong></td>
          <td><span class="order-status ${statusClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
        `;
        
        return row;
}

 
      function getStatusClass(status) {
        switch(status) {
          case 'pending': return 'status-pending';
          case 'completed': return 'status-completed';
          case 'cancelled': return 'status-cancelled';
          default: return 'status-pending';
        }
    }   
    
document.addEventListener('DOMContentLoaded', function() {
  
    if (refreshOrdersBtn) {
        refreshOrdersBtn.addEventListener('click', function() {
            loadOrdersSection();
        });
    }
  
    loadOrdersSection();
});


window.addEventListener('beforeunload', function() {
    currentLoadingOperation = null;
    isLoadingOrders = false;
});


document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible' && isLoadingOrders) {
  
        console.log('Page became visible, checking loading state...');
   
    }
});