
import { db, collection, getDocs } from "../../src/config.js";


const loadProducts = [];
let collectionsNames= ["men-tops", "women-bottoms"];
getProductsFromDB(collectionsNames);
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

let originalProducts =[];
(async () => {
  await getProductsFromDB(collectionsNames);
  addSortingEventListeners();
    originalProducts = [...loadProducts];
  renderProducts(loadProducts); 
})();

  

// // DOM Elements
// const generalLink = document.getElementById('general-link');
// const productsLink = document.getElementById('products-link');
// const generalSection = document.getElementById('general-section');
// const productsSection = document.getElementById('products-section');
const productTableBody = document.getElementById('product-table-body');
// const saveProductBtn = document.getElementById('save-product-btn');
// const updateProductBtn = document.getElementById('update-product-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
// const filterCategorySelect = document.getElementById('filter-category');
// const sortBySelect = document.getElementById('sort-by');
// const applyFiltersBtn = document.getElementById('apply-filters-btn');
const noProductsMessage = document.getElementById('no-products-message');

// Navigate from general to product section
// generalLink.addEventListener('click', function(e) {
//     e.preventDefault();
//     activateSection(generalSection, generalLink);
// });

// productsLink.addEventListener('click', function(e) {
//     e.preventDefault();
//     activateSection(productsSection, productsLink);
//     renderProducts();
// });

// function activateSection(section, link) {

//     document.querySelectorAll('.page-section').forEach(sec => {
//         sec.classList.remove('active');
//     });

//     document.querySelectorAll('.nav-link').forEach(navLink => {
//         navLink.classList.remove('active');
//     });
    
//     section.classList.add('active');
    
//     link.classList.add('active');
// }

// Render products in table



// async function renderProducts(products) {

//     let productsToRender = products;

//     console.log(productsToRender.length);
    


 // Sample product data


// Navigate from general to product section
// generalLink.addEventListener('click', function(e) {
//     e.preventDefault();
//     activateSection(generalSection, generalLink);
// });

// productsLink.addEventListener('click', function(e) {
//     e.preventDefault();
//     activateSection(productsSection, productsLink);
//     renderProducts();
// });

// function activateSection(section, link) {

//     document.querySelectorAll('.page-section').forEach(sec => {
//         sec.classList.remove('active');
//     });

//     document.querySelectorAll('.nav-link').forEach(navLink => {
//         navLink.classList.remove('active');
//     });
    
//     section.classList.add('active');
    
//     link.classList.add('active');
// }
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
            sortProductsByPrice(originalProducts, 0);
        } else if (priceClicks === 2) {
            sortProductsByPrice(originalProducts, 1);
        } else {
            sortProductsByPrice(originalProducts, 2);
            priceClicks = 0;
        }
    });

    titleButton.addEventListener("click", () => {
        resetPriceSorting();
        titleClicks++;
        if (titleClicks === 1) {
            sortProductsByTitle(originalProducts, 0);
        } else if (titleClicks === 2) {
            sortProductsByTitle(originalProducts, 1);
        } else {
            sortProductsByTitle(originalProducts, 2);
            titleClicks = 0;
        }
    });

    sortSelect.addEventListener("change", (e) => {
        const val = e.target.value;

        if (val === 'price-asc') {
            resetTitleSorting();
            priceClicks = 1;
            sortProductsByPrice(originalProducts, 0);
        } else if (val === 'price-desc') {
            resetTitleSorting();
            priceClicks = 2;
            sortProductsByPrice(originalProducts, 1);
        } else if (val === 'title-asc') {
            resetPriceSorting();
            titleClicks = 1;
            sortProductsByTitle(originalProducts, 0);
        } else if (val === 'title-desc') {
            resetPriceSorting();
            titleClicks = 2;
            sortProductsByTitle(originalProducts, 1);
        } else {
            resetPriceSorting();
            resetTitleSorting();
            renderProducts(originalProducts);
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
        sorted = originalProducts;
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
        sorted = originalProducts;
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
function openEditModal(productId) {
    const product = loadProducts.find(p => p.id === productId);

    
    if (product) {
        document.getElementById('edit-product-id').value = product.id;
        document.getElementById('edit-product-name').value = product.title;
        document.getElementById('edit-product-category').value = product.collectionName;
        document.getElementById('edit-product-price').value = product.price;
        // document.getElementById('edit-product-description').value = product.description;
        
        const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
        modal.show();
    }
}
function openDeleteModal(productId) {
    
    
    document.getElementById('delete-product-id').value = productId;
    const modal = new bootstrap.Modal(document.getElementById('deleteProductModal'));
    modal.show();
}

confirmDeleteBtn.addEventListener('click', function() {

    const productId = document.getElementById('delete-product-id').value;
   
    
    let TobeDeleteProduct = loadProducts.filter(p => p.id === productId);
    console.log(TobeDeleteProduct);
    
    filterAndSortProducts();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteProductModal'));
    modal.hide();
    
    showAlert('Product deleted successfully!', 'success');
});

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






// // Filter products according to selected category and sort option
// function filterAndSortProducts() {
//     const selectedCategory = filterCategorySelect.value;
//     const sortOption = sortBySelect.value;
    
//     let filteredProducts = products;
//     if (selectedCategory && selectedCategory !== 'all') {
//         filteredProducts = products.filter(product => product.category === selectedCategory);
//     }
    
//     filteredProducts = sortProducts(filteredProducts, sortOption);
    
//     renderProducts(filteredProducts);
// }

// // Sort products according to selected option
// function sortProducts(productsArray, sortOption) {
//     const sortedProducts = [...productsArray];
    
//     switch (sortOption) {
//         case 'name-asc':
//             sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
//             break;
//         case 'name-desc':
//             sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
//             break;
//         case 'price-asc':
//             sortedProducts.sort((a, b) => a.price - b.price);
//             break;
//         case 'price-desc':
//             sortedProducts.sort((a, b) => b.price - a.price);
//             break;
//     }
    
//     return sortedProducts;
// }

// // Add new product
// saveProductBtn.addEventListener('click', function() {
//     const name = document.getElementById('product-name').value;
//     const category = document.getElementById('product-category').value;
//     const price = parseFloat(document.getElementById('product-price').value);
//     const description = document.getElementById('product-description').value;
    
//     if (name && category && price && description) {
//         const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
//         const newProduct = {
//             id: newId,
//             name: name,
//             category: category,
//             price: price,
//             description: description,
//             image: "/api/placeholder/60/60"
//         };
        
//         products.push(newProduct);
//         filterAndSortProducts();
        
//         const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
//         modal.hide();
//         document.getElementById('add-product-form').reset();

//         showAlert('Product added successfully!', 'success');
//     } else {
//         showAlert('Please fill all required fields!', 'danger');
//     }
// });

// // Edit product


// updateProductBtn.addEventListener('click', function() {
//     const id = parseInt(document.getElementById('edit-product-id').value);
//     const name = document.getElementById('edit-product-name').value;
//     const category = document.getElementById('edit-product-category').value;
//     const price = parseFloat(document.getElementById('edit-product-price').value);
//     const description = document.getElementById('edit-product-description').value;
    
//     if (name && category && price && description) {
//         const productIndex = products.findIndex(p => p.id === id);
        
//         if (productIndex !== -1) {
//             products[productIndex] = {
//                 ...products[productIndex],
//                 name: name,
//                 category: category,
//                 price: price,
//                 description: description
//             };
            
//             filterAndSortProducts();
           
//             const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
//             modal.hide();
          
//             showAlert('Product updated successfully!', 'success');
//         }
//     } else {
//         showAlert('Please fill all required fields!', 'danger');
//     }
// });

// Delete product 


// renderProducts();

// applyFiltersBtn.addEventListener('click', filterAndSortProducts);

// //----------------------------------------------------------------------------

// //prevent to return back to genral page when refershing the page
// function saveActiveSection(sectionId) {
//     localStorage.setItem('activeSection', sectionId);
// }

// function loadActiveSection() {
//     return localStorage.getItem('activeSection') || 'general'; // Default to general if not set
// }

// function activateSection(section, link) {
//     document.querySelectorAll('.page-section').forEach(sec => {
//         sec.classList.remove('active');
//     });
    
//     document.querySelectorAll('.nav-link').forEach(navLink => {
//         navLink.classList.remove('active');
//     });
    
//     section.classList.add('active');
    
//     link.classList.add('active');
    
//     if (section === generalSection) {
//         saveActiveSection('general');
//     } else if (section === productsSection) {
//         saveActiveSection('products');
//     }
// }

// document.addEventListener('DOMContentLoaded', function() {
//     const activeSection = loadActiveSection();
//     if (activeSection === 'products') {
//         activateSection(productsSection, productsLink);
//         renderProducts();
//     } else {
//         activateSection(generalSection, generalLink);
//     }
// });

// Filter products according to selected category and sort option
// function filterAndSortProducts() {
//     const selectedCategory = filterCategorySelect.value;
//     const sortOption = sortBySelect.value;
    
//     let filteredProducts = products;
//     if (selectedCategory && selectedCategory !== 'all') {
//         filteredProducts = products.filter(product => product.category === selectedCategory);
//     }
    
//     filteredProducts = sortProducts(filteredProducts, sortOption);
    
//     renderProducts(filteredProducts);
// }

// Sort products according to selected option
// function sortProducts(productsArray, sortOption) {
//     const sortedProducts = [...productsArray];
    
//     switch (sortOption) {
//         case 'name-asc':
//             sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
//             break;
//         case 'name-desc':
//             sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
//             break;
//         case 'price-asc':
//             sortedProducts.sort((a, b) => a.price - b.price);
//             break;
//         case 'price-desc':
//             sortedProducts.sort((a, b) => b.price - a.price);
//             break;
//     }
    
//     return sortedProducts;
// }

// Add new product
// saveProductBtn.addEventListener('click', function() {
//     const name = document.getElementById('product-name').value;
//     const category = document.getElementById('product-category').value;
//     const price = parseFloat(document.getElementById('product-price').value);
//     const description = document.getElementById('product-description').value;
    
//     if (name && category && price && description) {
//         const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
//         const newProduct = {
//             id: newId,
//             name: name,
//             category: category,
//             price: price,
//             description: description,
//             image: "/api/placeholder/60/60"
//         };
        
//         products.push(newProduct);
//         filterAndSortProducts();
        
//         const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
//         modal.hide();
//         document.getElementById('add-product-form').reset();

//         showAlert('Product added successfully!', 'success');
//     } else {
//         showAlert('Please fill all required fields!', 'danger');
//     }
// });

// Edit product
// function openEditModal(productId) {
//     const product = products.find(p => p.id === productId);
    
//     if (product) {
//         document.getElementById('edit-product-id').value = product.id;
//         document.getElementById('edit-product-name').value = product.name;
//         document.getElementById('edit-product-category').value = product.category;
//         document.getElementById('edit-product-price').value = product.price;
//         document.getElementById('edit-product-description').value = product.description;
        
//         const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
//         modal.show();
//     }
// }

// updateProductBtn.addEventListener('click', function() {
//     const id = parseInt(document.getElementById('edit-product-id').value);
//     const name = document.getElementById('edit-product-name').value;
//     const category = document.getElementById('edit-product-category').value;
//     const price = parseFloat(document.getElementById('edit-product-price').value);
//     const description = document.getElementById('edit-product-description').value;
    
//     if (name && category && price && description) {
//         const productIndex = products.findIndex(p => p.id === id);
        
//         if (productIndex !== -1) {
//             products[productIndex] = {
//                 ...products[productIndex],
//                 name: name,
//                 category: category,
//                 price: price,
//                 description: description
//             };
            
//             filterAndSortProducts();
           
//             const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
//             modal.hide();
          
//             showAlert('Product updated successfully!', 'success');
//         }
//     } else {
//         showAlert('Please fill all required fields!', 'danger');
//     }
// });


// renderProducts();

// applyFiltersBtn.addEventListener('click', filterAndSortProducts);

//----------------------------------------------------------------------------

//prevent to return back to genral page when refershing the page
// function saveActiveSection(sectionId) {
//     localStorage.setItem('activeSection', sectionId);
// }

// function loadActiveSection() {
//     return localStorage.getItem('activeSection') || 'general'; // Default to general if not set
// }

// function activateSection(section, link) {
//     document.querySelectorAll('.page-section').forEach(sec => {
//         sec.classList.remove('active');
//     });
    
//     document.querySelectorAll('.nav-link').forEach(navLink => {
//         navLink.classList.remove('active');
//     });
    
//     section.classList.add('active');
    
//     link.classList.add('active');
    
//     if (section === generalSection) {
//         saveActiveSection('general');
//     } else if (section === productsSection) {
//         saveActiveSection('products');
//     }
// }

// document.addEventListener('DOMContentLoaded', function() {
//     const activeSection = loadActiveSection();
//     if (activeSection === 'products') {
//         activateSection(productsSection, productsLink);
//         renderProducts();
//     } else {
//         activateSection(generalSection, generalLink);
//     }
// });

