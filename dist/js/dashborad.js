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

(async () => {
  await getProductsFromDB(collectionsNames);
  renderProducts(loadProducts); 
})();

  
// getProductsFromDB(collectionsNames);
// console.log(products);


// let products = [
//     { id: 1, name: "Men's Casual Shirt", category: "Men", price: 49.99,description: "Comfortable casual shirt for men", image: "/api/placeholder/60/60" }
// ];

// // DOM Elements
// const generalLink = document.getElementById('general-link');
// const productsLink = document.getElementById('products-link');
// const generalSection = document.getElementById('general-section');
// const productsSection = document.getElementById('products-section');
const productTableBody = document.getElementById('product-table-body');
// const saveProductBtn = document.getElementById('save-product-btn');
// const updateProductBtn = document.getElementById('update-product-btn');
// const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
// const filterCategorySelect = document.getElementById('filter-category');
// const sortBySelect = document.getElementById('sort-by');
// const applyFiltersBtn = document.getElementById('apply-filters-btn');
const noProductsMessage = document.getElementById('no-products-message');

// // Navigate from general to product section
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



async function renderProducts(products) {

    let productsToRender = products;

    console.log(productsToRender.length);
    
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
                <td>${productsToRender[i].name}</td>
                <td>${productsToRender[i].collectionName}</td>
                <td>${productsToRender[i].collectionName}</td>
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
                    <img src="${image}" alt="${productsToRender[i].title}" class="product-image-m">
                `

            })
        }


        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                openEditModal(productId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                openDeleteModal(productId);
            });
        });
    }
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

// // Delete product 
// function openDeleteModal(productId) {
//     document.getElementById('delete-product-id').value = productId;
//     const modal = new bootstrap.Modal(document.getElementById('deleteProductModal'));
//     modal.show();
// }

// confirmDeleteBtn.addEventListener('click', function() {
//     const productId = parseInt(document.getElementById('delete-product-id').value);
//     products = products.filter(p => p.id !== productId);
    
//     filterAndSortProducts();
    
//     const modal = bootstrap.Modal.getInstance(document.getElementById('deleteProductModal'));
//     modal.hide();
    
//     showAlert('Product deleted successfully!', 'success');
// });

// function showAlert(message, type) {
//     const alertDiv = document.createElement('div');
//     alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
//     alertDiv.role = 'alert';
//     alertDiv.innerHTML = `
//         ${message}
//         <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
//     `;
    
//     const content = document.querySelector('.content');
//     content.insertBefore(alertDiv, content.firstChild);
    
//     setTimeout(() => {
//         alertDiv.remove();
//     }, 3000);
// }

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