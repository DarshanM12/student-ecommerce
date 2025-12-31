// ============================================
// Shopping History API Module
// ============================================

const API_BASE_URL = 'http://localhost:3000/api';

const historyAPI = {
    // Save shopping history to backend
    async saveHistory(orderData) {
        try {
            const response = await fetch(`${API_BASE_URL}/shopping-history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error saving shopping history:', error);
            // Fail silently - don't break the app if backend is down
            return { success: false, message: 'Backend not available' };
        }
    },

    // Get shopping history for current user
    async getUserHistory(userEmail) {
        // First try to get from localStorage (always available)
        let history = [];
        if (typeof orders !== 'undefined' && orders.getUserShoppingHistory) {
            history = orders.getUserShoppingHistory(userEmail);
        }
        
        // Also try to get from backend and merge (backend has priority for duplicates)
        try {
            const response = await fetch(`${API_BASE_URL}/shopping-history/${encodeURIComponent(userEmail)}`);
            const result = await response.json();
            
            if (result.success && result.history) {
                // Merge backend history with localStorage history
                // Backend entries take priority
                const backendHistory = result.history;
                const historyMap = new Map();
                
                // Add localStorage history first
                history.forEach(order => {
                    const key = order.id || order.orderId;
                    if (key) {
                        historyMap.set(key, order);
                    }
                });
                
                // Overwrite with backend history (more up-to-date)
                backendHistory.forEach(order => {
                    const key = order.id || order.orderId;
                    if (key) {
                        historyMap.set(key, order);
                    }
                });
                
                // Convert back to array and sort
                history = Array.from(historyMap.values());
                history.sort((a, b) => (b.placedAt || 0) - (a.placedAt || 0));
            }
        } catch (error) {
            console.error('Error fetching shopping history from backend:', error);
            // Continue with localStorage history if backend fails
        }
        
        return history;
    },

    // Get all shopping history (admin)
    async getAllHistory() {
        try {
            const response = await fetch(`${API_BASE_URL}/shopping-history`);
            const result = await response.json();
            
            if (result.success) {
                return result.history;
            }
            return [];
        } catch (error) {
            console.error('Error fetching all shopping history:', error);
            return [];
        }
    },

    // Delete shopping history entry
    async deleteHistory(orderId) {
        try {
            const response = await fetch(`${API_BASE_URL}/shopping-history/${orderId}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error deleting shopping history:', error);
            return { success: false, message: 'Backend not available' };
        }
    },

    // Export shopping history as text file
    async exportHistoryAsText(userEmail, productsData) {
        try {
            // Get history from backend
            const history = await this.getUserHistory(userEmail);
            
            if (history.length === 0) {
                return { success: false, message: 'No history to export' };
            }
            
            // Generate text content with product details
            let textContent = `========================================\n`;
            textContent += `DSCE STUDENT STORE - SHOPPING HISTORY\n`;
            textContent += `========================================\n\n`;
            textContent += `User: ${userEmail}\n`;
            textContent += `Generated: ${new Date().toLocaleString()}\n`;
            textContent += `Total Orders: ${history.length}\n\n`;
            textContent += `========================================\n\n`;
            
            history.forEach((order, index) => {
                const placedDate = new Date(order.placedAt).toLocaleString();
                const orderId = order.orderId || order.id;
                
                // Calculate order total
                let orderTotal = 0;
                
                textContent += `ORDER #${index + 1}\n`;
                textContent += `----------------------------------------\n`;
                textContent += `Order ID: ${orderId}\n`;
                textContent += `Date: ${placedDate}\n`;
                textContent += `Status: ${(order.status || 'pending').toUpperCase()}\n\n`;
                
                textContent += `Items:\n`;
                order.items.forEach((item, itemIndex) => {
                    const product = productsData.find(p => p.id === item.id);
                    if (product) {
                        const itemTotal = product.price * item.quantity;
                        orderTotal += itemTotal;
                        textContent += `  ${itemIndex + 1}. ${product.name}\n`;
                        textContent += `     Quantity: ${item.quantity} × ₹${product.price} = ₹${itemTotal}\n`;
                    } else {
                        textContent += `  ${itemIndex + 1}. Item ID: ${item.id}, Quantity: ${item.quantity}\n`;
                    }
                });
                textContent += `\n`;
                textContent += `Order Total: ₹${orderTotal}\n\n`;
                
                textContent += `Delivery Details:\n`;
                textContent += `  Name: ${order.name || 'N/A'}\n`;
                textContent += `  Phone: ${order.phone || 'N/A'}\n`;
                textContent += `  Address: ${order.address || 'N/A'}\n`;
                if (order.notes) {
                    textContent += `  Notes: ${order.notes}\n`;
                }
                textContent += `\n`;
                
                if (order.cancelledAt) {
                    const cancelledDate = new Date(order.cancelledAt).toLocaleString();
                    textContent += `Cancelled: ${cancelledDate}\n`;
                }
                
                if (order.deliveredAt) {
                    const deliveredDate = new Date(order.deliveredAt).toLocaleString();
                    textContent += `Delivered: ${deliveredDate}\n`;
                }
                
                textContent += `\n========================================\n\n`;
            });
            
            // Create and download file
            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `shopping-history-${userEmail.replace('@', '-at-')}-${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            return { success: true, message: 'History exported successfully' };
        } catch (error) {
            console.error('Error exporting shopping history:', error);
            return { success: false, message: 'Failed to export history' };
        }
    }
};

