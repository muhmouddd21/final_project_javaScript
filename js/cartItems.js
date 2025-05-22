// Cart state management
const CartManager = {
    // Get cart from localStorage
    getCart() {
        try {
            return JSON.parse(localStorage.getItem('cart')) || [];
        } catch (error) {
            console.error('Error reading cart from localStorage:', error);
            return [];
        }
    },

    // Save cart to localStorage
    saveCart(cart) {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    },

    // Add item to cart
    addItem(item) {
        if (!item || !item.id) {
            console.error('Invalid item data');
            return;
        }

        const cart = this.getCart();
        const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1
            });
        }

        this.saveCart(cart);
        this.updateCartCount();
    },

    // Remove item from cart
    removeItem(itemId) {
        const cart = this.getCart();
        const updatedCart = cart.filter(item => item.id !== itemId);
        this.saveCart(updatedCart);
        this.updateCartCount();
    },

    // Update item quantity
    updateQuantity(itemId, newQuantity) {
        if (newQuantity < 0) return;

        const cart = this.getCart();
        const itemIndex = cart.findIndex(item => item.id === itemId);

        if (itemIndex === -1) return;

        if (newQuantity === 0) {
            this.removeItem(itemId);
        } else {
            cart[itemIndex].quantity = newQuantity;
            this.saveCart(cart);
            this.updateCartCount();
        }
    },

    // Update cart count in UI
    updateCartCount() {
        const cart = this.getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    },

    // Calculate total price
    getTotalPrice() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Render cart items
    renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        if (!cartItemsContainer) return;

        const cart = this.getCart();
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="price">$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button onclick="CartManager.updateQuantity(${item.id}, ${item.quantity - 1})" class="quantity-btn">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button onclick="CartManager.updateQuantity(${item.id}, ${item.quantity + 1})" class="quantity-btn">+</button>
                    </div>
                </div>
                <button onclick="CartManager.removeItem(${item.id})" class="remove-btn">×</button>
            </div>
        `).join('');

        // Add total price display
        const totalPrice = this.getTotalPrice();
        cartItemsContainer.innerHTML += `
            <div class="cart-total">
                <p>Total: $${totalPrice.toFixed(2)}</p>
            </div>
        `;
    }
};

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    CartManager.updateCartCount();
});

// Export for use in other files
window.CartManager = CartManager; 