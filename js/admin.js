// ============================================
// Admin Module
// ============================================

const admin = {
    // Load dashboard statistics
    loadDashboard() {
        const allOrders = orders.getAllOrders();
        const allProducts = products.getAllProducts();
        const totalSales = orders.getTotalSales();
        const pendingOrders = allOrders.filter(o => o.status === 'pending').length;

        document.getElementById('totalSales').textContent = `₹${totalSales}`;
        document.getElementById('totalOrders').textContent = allOrders.length;
        document.getElementById('pendingOrders').textContent = pendingOrders;
        document.getElementById('totalProducts').textContent = allProducts.length;
    },

    // Load orders list
    loadOrders() {
        const allOrders = orders.getAllOrders();
        const container = document.getElementById('ordersList');
        container.innerHTML = '';

        if (allOrders.length === 0) {
            container.innerHTML = '<p class="no-products">No orders yet.</p>';
            return;
        }

        // Sort by newest first
        const sortedOrders = [...allOrders].sort((a, b) => b.placedAt - a.placedAt);

        sortedOrders.forEach(order => {
            const orderCard = document.createElement('div');
            orderCard.className = 'order-card';
            
            const orderTotal = orders.calculateOrderTotal(order);
            const placedDate = new Date(order.placedAt).toLocaleString();
            
            const itemsHtml = order.items.map(item => {
                const product = products.getProductById(item.id);
                if (product) {
                    return `<p>${product.name} × ${item.quantity}</p>`;
                }
                return '';
            }).join('');

            orderCard.innerHTML = `
                <div class="order-card-header">
                    <div>
                        <span class="order-id">${order.id}</span>
                        <p style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.875rem;">
                            ${order.userEmail} | ${placedDate}
                        </p>
                    </div>
                    <span class="order-status ${order.status}">${order.status.toUpperCase()}</span>
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>Customer:</strong> ${order.name} | ${order.phone}
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>Address:</strong> ${order.address}
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>Items:</strong>
                    ${itemsHtml}
                </div>
                <div style="margin-bottom: 1rem; font-size: 1.125rem;">
                    <strong>Total: ₹${orderTotal}</strong>
                </div>
                <div class="order-actions">
                    ${order.status === 'pending' ? 
                        `<button class="btn btn-primary" onclick="admin.markAsDelivered('${order.id}')">Mark as Delivered</button>` 
                        : ''}
                    <button class="btn btn-danger" onclick="admin.deleteOrderConfirm('${order.id}')">Delete Order</button>
                </div>
            `;

            container.appendChild(orderCard);
        });
    },

    // Load products list
    loadProducts() {
        const allProducts = products.getAllProducts();
        const container = document.getElementById('productsList');
        container.innerHTML = '';

        if (allProducts.length === 0) {
            container.innerHTML = '<p class="no-products">No products available.</p>';
            return;
        }

        allProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-admin-card';
            
            const category = products.getCategoryById(product.category);

            productCard.innerHTML = `
                <div class="product-admin-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/100?text=${encodeURIComponent(product.name)}'">
                </div>
                <div class="product-admin-info">
                    <h3>${product.name}</h3>
                    <p style="color: var(--text-secondary); font-size: 0.875rem; margin-bottom: 0.5rem;">
                        Category: ${category ? category.name : product.category}
                    </p>
                    <p class="product-admin-price">₹${product.price}</p>
                </div>
                <div class="product-admin-actions">
                    <button class="btn btn-primary" onclick="openProductModal('${product.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="admin.deleteProductConfirm('${product.id}')">Delete</button>
                </div>
            `;

            container.appendChild(productCard);
        });
    },

    // Load cancellations list
    loadCancellations() {
        const logs = orders.getCancellationLogs();
        const container = document.getElementById('cancellationsList');
        container.innerHTML = '';

        if (logs.length === 0) {
            container.innerHTML = '<p class="no-products">No cancellations yet.</p>';
            return;
        }

        // Sort by newest first
        const sortedLogs = [...logs].sort((a, b) => b.cancelledAt - a.cancelledAt);

        sortedLogs.forEach(log => {
            const cancellationCard = document.createElement('div');
            cancellationCard.className = 'cancellation-card';
            
            const cancelledDate = new Date(log.cancelledAt).toLocaleString();

            cancellationCard.innerHTML = `
                <div>
                    <strong>Order ID:</strong> ${log.orderId}<br>
                    <strong>User:</strong> ${log.userEmail}<br>
                    <strong>Cancelled At:</strong> ${cancelledDate}
                </div>
                <div>
                    <strong style="font-size: 1.125rem;">Amount: ₹${log.totalAmount}</strong>
                </div>
            `;

            container.appendChild(cancellationCard);
        });
    },

    // Add product
    addProduct(productData) {
        products.addProduct(productData);
        this.showToast('Product added successfully');
    },

    // Update product
    updateProduct(productId, productData) {
        products.updateProduct(productId, productData);
        this.showToast('Product updated successfully');
    },

    // Delete product (with confirmation)
    deleteProductConfirm(productId) {
        const product = products.getProductById(productId);
        if (product && confirm(`Are you sure you want to delete "${product.name}"?`)) {
            products.deleteProduct(productId);
            this.loadProducts();
            this.loadDashboard();
            this.showToast('Product deleted successfully');
        }
    },

    // Mark order as delivered
    markAsDelivered(orderId) {
        if (orders.markDelivered(orderId)) {
            this.loadOrders();
            this.loadDashboard();
            this.showToast('Order marked as delivered');
        }
    },

    // Delete order (with confirmation)
    deleteOrderConfirm(orderId) {
        if (confirm('Are you sure you want to delete this order?')) {
            orders.deleteOrder(orderId);
            this.loadOrders();
            this.loadDashboard();
            this.showToast('Order deleted successfully');
        }
    },

    // Show toast notification
    showToast(message) {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
};

