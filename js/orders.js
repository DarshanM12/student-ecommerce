// ============================================
// Orders Module
// ============================================

const orders = {
    // Place order
    async placeOrder(orderData) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cart.length === 0) {
            return null;
        }

        const orderId = 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
        const order = {
            id: orderId,
            orderId: orderId, // Also add as orderId for backend compatibility
            userEmail: auth.getCurrentUser(),
            items: cart.map(item => ({
                id: item.id,
                quantity: item.quantity
            })),
            name: orderData.name,
            phone: orderData.phone,
            address: orderData.address,
            notes: orderData.notes || '',
            status: 'pending',
            placedAt: Date.now(),
            deliveredAt: null
        };

        // Get existing orders
        const orders = this.getAllOrders();
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Save to shopping history in localStorage
        this.saveToHistory(order);

        // Save shopping history to backend (non-blocking)
        if (typeof historyAPI !== 'undefined') {
            historyAPI.saveHistory(order).catch(err => {
                console.error('Failed to save shopping history to backend:', err);
                // Continue even if backend save fails
            });
        }

        return orderId;
    },

    // Get all orders
    getAllOrders() {
        const orders = localStorage.getItem('orders');
        return orders ? JSON.parse(orders) : [];
    },

    // Get order by ID
    getOrder(orderId) {
        const orders = this.getAllOrders();
        return orders.find(o => o.id === orderId);
    },

    // Get user orders
    getUserOrders(userEmail) {
        const orders = this.getAllOrders();
        return orders.filter(o => o.userEmail === userEmail);
    },

    // Cancel order
    cancelOrder(orderId) {
        const order = this.getOrder(orderId);
        if (!order) return false;

        // Check if 12 seconds have passed
        const cancelTime = order.placedAt + (12 * 1000);
        if (Date.now() > cancelTime) {
            return false;
        }

        // Remove order from active orders
        const orders = this.getAllOrders();
        const filtered = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(filtered));

        // Update history to mark as cancelled (keep in history but mark status)
        const history = this.getShoppingHistory();
        const historyOrder = history.find(h => h.id === orderId || h.orderId === orderId);
        if (historyOrder) {
            historyOrder.status = 'cancelled';
            historyOrder.cancelledAt = Date.now();
            localStorage.setItem('shoppingHistory', JSON.stringify(history));
        } else {
            // If not in history, add it as cancelled
            order.status = 'cancelled';
            order.cancelledAt = Date.now();
            this.saveToHistory(order);
        }

        // Log cancellation
        this.logCancellation(orderId, order);

        return true;
    },

    // Log cancellation (admin view)
    logCancellation(orderId, order) {
        const logs = this.getCancellationLogs();
        logs.push({
            orderId: orderId,
            userEmail: order.userEmail,
            cancelledAt: Date.now(),
            totalAmount: this.calculateOrderTotal(order)
        });
        localStorage.setItem('cancellationLogs', JSON.stringify(logs));
    },

    // Get cancellation logs
    getCancellationLogs() {
        const logs = localStorage.getItem('cancellationLogs');
        return logs ? JSON.parse(logs) : [];
    },

    // Delete order (admin)
    deleteOrder(orderId) {
        const orders = this.getAllOrders();
        const filtered = orders.filter(o => o.id !== orderId);
        localStorage.setItem('orders', JSON.stringify(filtered));
        
        // Also remove from shopping history (or mark as deleted)
        const history = this.getShoppingHistory();
        const filteredHistory = history.filter(h => h.id !== orderId && h.orderId !== orderId);
        localStorage.setItem('shoppingHistory', JSON.stringify(filteredHistory));
        
        return true;
    },

    // Mark order as delivered (admin)
    markDelivered(orderId) {
        const orders = this.getAllOrders();
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'delivered';
            order.deliveredAt = Date.now();
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Update in shopping history
            const history = this.getShoppingHistory();
            const historyOrder = history.find(h => h.id === orderId || h.orderId === orderId);
            if (historyOrder) {
                historyOrder.status = 'delivered';
                historyOrder.deliveredAt = Date.now();
                localStorage.setItem('shoppingHistory', JSON.stringify(history));
            } else {
                // If not in history, add it
                this.saveToHistory(order);
            }
            
            return true;
        }
        return false;
    },

    // Calculate order total
    calculateOrderTotal(order) {
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        let total = 0;

        order.items.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                total += product.price * item.quantity;
            }
        });
        //if(total>1000){
          //  total=total*0.90; // Apply 10% discount
        //}

        return total;
    },

    // Get total sales (admin)
    getTotalSales() {
        const orders = this.getAllOrders();
        const deliveredOrders = orders.filter(o => o.status === 'delivered');
        let total = 0;

        deliveredOrders.forEach(order => {
            total += this.calculateOrderTotal(order);
        });

        return total;
    },

    // Save order to shopping history (localStorage)
    saveToHistory(order) {
        const history = this.getShoppingHistory();
        // Check if order already exists in history (avoid duplicates)
        const exists = history.find(h => h.id === order.id || h.orderId === order.orderId);
        if (!exists) {
            history.push(order);
            localStorage.setItem('shoppingHistory', JSON.stringify(history));
        }
    },

    // Get shopping history from localStorage
    getShoppingHistory() {
        const history = localStorage.getItem('shoppingHistory');
        return history ? JSON.parse(history) : [];
    },

    // Get user's shopping history from localStorage
    getUserShoppingHistory(userEmail) {
        const history = this.getShoppingHistory();
        const userHistory = history.filter(order => order.userEmail === userEmail);
        // Sort by most recent first
        userHistory.sort((a, b) => (b.placedAt || 0) - (a.placedAt || 0));
        return userHistory;
    }
};

