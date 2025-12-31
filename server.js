// ============================================
// DSCE Student Store - Node.js Server
// Shopping History Storage
// ============================================

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files (HTML, CSS, JS)

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const shoppingHistoryFile = path.join(dataDir, 'shopping-history.json');

// Initialize shopping history file if it doesn't exist
if (!fs.existsSync(shoppingHistoryFile)) {
    fs.writeFileSync(shoppingHistoryFile, JSON.stringify([], null, 2));
}

// Helper function to read shopping history
function readShoppingHistory() {
    try {
        const data = fs.readFileSync(shoppingHistoryFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading shopping history:', error);
        return [];
    }
}

// Helper function to write shopping history
function writeShoppingHistory(history) {
    try {
        fs.writeFileSync(shoppingHistoryFile, JSON.stringify(history, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing shopping history:', error);
        return false;
    }
}

// ============================================
// API Routes
// ============================================

// Save shopping history (when order is placed)
app.post('/api/shopping-history', (req, res) => {
    try {
        const orderData = req.body;
        
        // Validate required fields
        if (!orderData.orderId || !orderData.userEmail || !orderData.items) {
            return res.status(400).json({ 
                success: false, 
                message: 'Missing required fields' 
            });
        }

        const history = readShoppingHistory();
        
        // Add timestamp if not present
        if (!orderData.placedAt) {
            orderData.placedAt = Date.now();
        }

        // Add to history
        history.push(orderData);
        
        if (writeShoppingHistory(history)) {
            res.json({ 
                success: true, 
                message: 'Shopping history saved successfully',
                orderId: orderData.orderId
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Failed to save shopping history' 
            });
        }
    } catch (error) {
        console.error('Error saving shopping history:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Get shopping history for a user
app.get('/api/shopping-history/:email', (req, res) => {
    try {
        const userEmail = req.params.email;
        const history = readShoppingHistory();
        
        // Filter history by user email
        const userHistory = history.filter(order => order.userEmail === userEmail);
        
        // Sort by most recent first
        userHistory.sort((a, b) => (b.placedAt || 0) - (a.placedAt || 0));
        
        res.json({ 
            success: true, 
            history: userHistory 
        });
    } catch (error) {
        console.error('Error fetching shopping history:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Get all shopping history (for admin)
app.get('/api/shopping-history', (req, res) => {
    try {
        const history = readShoppingHistory();
        // Sort by most recent first
        history.sort((a, b) => (b.placedAt || 0) - (a.placedAt || 0));
        
        res.json({ 
            success: true, 
            history: history 
        });
    } catch (error) {
        console.error('Error fetching all shopping history:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Delete a shopping history entry
app.delete('/api/shopping-history/:orderId', (req, res) => {
    try {
        const orderId = req.params.orderId;
        const history = readShoppingHistory();
        
        const filteredHistory = history.filter(order => order.id !== orderId && order.orderId !== orderId);
        
        if (filteredHistory.length === history.length) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }
        
        if (writeShoppingHistory(filteredHistory)) {
            res.json({ 
                success: true, 
                message: 'Shopping history deleted successfully' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Failed to delete shopping history' 
            });
        }
    } catch (error) {
        console.error('Error deleting shopping history:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Export shopping history as text file
app.get('/api/shopping-history/:email/export', (req, res) => {
    try {
        const userEmail = req.params.email;
        const history = readShoppingHistory();
        
        // Filter history by user email
        const userHistory = history.filter(order => order.userEmail === userEmail);
        
        // Sort by most recent first
        userHistory.sort((a, b) => (b.placedAt || 0) - (a.placedAt || 0));
        
        // Generate text content
        let textContent = `========================================\n`;
        textContent += `DSCE STUDENT STORE - SHOPPING HISTORY\n`;
        textContent += `========================================\n\n`;
        textContent += `User: ${userEmail}\n`;
        textContent += `Generated: ${new Date().toLocaleString()}\n`;
        textContent += `Total Orders: ${userHistory.length}\n\n`;
        textContent += `========================================\n\n`;
        
        if (userHistory.length === 0) {
            textContent += `No orders found.\n`;
        } else {
            userHistory.forEach((order, index) => {
                const placedDate = new Date(order.placedAt).toLocaleString();
                const orderId = order.orderId || order.id;
                
                textContent += `ORDER #${index + 1}\n`;
                textContent += `----------------------------------------\n`;
                textContent += `Order ID: ${orderId}\n`;
                textContent += `Date: ${placedDate}\n`;
                textContent += `Status: ${(order.status || 'pending').toUpperCase()}\n\n`;
                
                textContent += `Items:\n`;
                order.items.forEach((item, itemIndex) => {
                    textContent += `  ${itemIndex + 1}. Item ID: ${item.id}, Quantity: ${item.quantity}\n`;
                });
                textContent += `\n`;
                
                textContent += `Delivery Details:\n`;
                textContent += `  Name: ${order.name || 'N/A'}\n`;
                textContent += `  Phone: ${order.phone || 'N/A'}\n`;
                textContent += `  Address: ${order.address || 'N/A'}\n`;
                if (order.notes) {
                    textContent += `  Notes: ${order.notes}\n`;
                }
                textContent += `\n`;
                
                if (order.deliveredAt) {
                    const deliveredDate = new Date(order.deliveredAt).toLocaleString();
                    textContent += `Delivered: ${deliveredDate}\n`;
                }
                
                textContent += `\n========================================\n\n`;
            });
        }
        
        // Set headers for file download
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="shopping-history-${userEmail.replace('@', '-at-')}-${Date.now()}.txt"`);
        res.send(textContent);
    } catch (error) {
        console.error('Error exporting shopping history:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 DSCE Student Store Server running on http://localhost:${PORT}`);
    console.log(`📦 Shopping history storage enabled`);
});

