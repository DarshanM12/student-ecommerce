// ============================================
// Shopping Cart Module
// ============================================

const cart = {
    // Get cart from localStorage
    getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },

    // Save cart to localStorage
    saveCart(cartItems) {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        this.updateCartCount();
    },

    // Add product to cart
    addToCart(product) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                quantity: 1
            });
        }

        this.saveCart(cart);
    },

    // Remove product from cart
    removeFromCart(productId) {
        const cart = this.getCart();
        const filtered = cart.filter(item => item.id !== productId);
        this.saveCart(filtered);
    },

    // Update product quantity
    updateQuantity(productId, change) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);

        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart(cart);
            }
        }
    },

    // Clear cart
    clearCart() {
        localStorage.removeItem('cart');
        this.updateCartCount();
    },

    // Get cart total count
    getCartCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Update cart count badge in navbar
    updateCartCount() {
        const count = this.getCartCount();
        const cartBadge = document.getElementById('cartCount');
        if (cartBadge) {
            cartBadge.textContent = count;
        }
    }
};

