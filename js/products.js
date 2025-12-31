// ============================================
// Products Module
// ============================================

const products = {
    // Initialize products (load from localStorage or use default)
    init() {
        const storedProducts = localStorage.getItem('products');
        if (!storedProducts) {
            this.initializeDefaultProducts();
        }
    },

    // Initialize default products (25+ items across 8 categories)
    initializeDefaultProducts() {
        const defaultProducts = [
            // Stationery (4 items)
            { id: 'p1', name: 'Notebook (200 pages)', price: 45, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', category: 'stationery' },
            { id: 'p2', name: 'Ball Point Pen (Pack of 5)', price: 25, image: 'https://images.unsplash.com/photo-1583484963886-47ce95e2e5fb?w=400', category: 'stationery' },
            { id: 'p3', name: 'A4 Paper (500 sheets)', price: 200, image: 'https://images.unsplash.com/photo-1455621481073-d5bc1c40e3cb?w=400', category: 'stationery' },
            { id: 'p4', name: 'Stapler with Staples', price: 75, image: 'https://images.unsplash.com/photo-1585221140117-5bc4baee9cd1?w=400', category: 'stationery' },
            
            // ID Cards & Lanyards (3 items)
            { id: 'p5', name: 'ID Card Lanyard (Nylon)', price: 50, image: 'https://images.unsplash.com/photo-1586268221531-5857a6e4f024?w=400', category: 'id-cards' },
            { id: 'p6', name: 'ID Card Holder (Clear)', price: 30, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400', category: 'id-cards' },
            { id: 'p7', name: 'Premium ID Card Lanyard', price: 100, image: 'https://images.unsplash.com/photo-1622459921698-06a292954f4a?w=400', category: 'id-cards' },
            
            // Lab Materials (4 items)
            { id: 'p8', name: 'Laboratory Notebook', price: 120, image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400', category: 'lab-materials' },
            { id: 'p9', name: 'Safety Goggles', price: 150, image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400', category: 'lab-materials' },
            { id: 'p10', name: 'Lab Coat (White)', price: 400, image: 'https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=400', category: 'lab-materials' },
            { id: 'p11', name: 'Calculator (Scientific)', price: 350, image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400', category: 'lab-materials' },
            
            // Sports Items (3 items)
            { id: 'p12', name: 'Cricket Ball (Leather)', price: 250, image: 'https://images.unsplash.com/photo-1530469380069-488c885a130c?w=400', category: 'sports' },
            { id: 'p13', name: 'Badminton Racket', price: 450, image: 'https://images.unsplash.com/photo-1622163642998-6bd7a686d09f?w=400', category: 'sports' },
            { id: 'p14', name: 'Football (Size 5)', price: 300, image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400', category: 'sports' },
            
            // Snacks (4 items)
            { id: 'p15', name: 'Energy Bar (Chocolate)', price: 30, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400', category: 'snacks' },
            { id: 'p16', name: 'Biscuits (Mixed Pack)', price: 45, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', category: 'snacks' },
            { id: 'p17', name: 'Chips (Family Pack)', price: 40, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', category: 'snacks' },
            { id: 'p18', name: 'Juice Box (Mixed)', price: 25, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', category: 'snacks' },
            
            // Raincoat & Umbrella (3 items)
            { id: 'p19', name: 'Raincoat (Waterproof)', price: 350, image: 'https://images.unsplash.com/photo-1591047135829-37bcedc1b8c1?w=400', category: 'raincoat' },
            { id: 'p20', name: 'Umbrella (Compact)', price: 250, image: 'https://images.unsplash.com/photo-1531891570155-9e961d3ad1f3?w=400', category: 'raincoat' },
            { id: 'p21', name: 'Raincoat + Umbrella Combo', price: 550, image: 'https://images.unsplash.com/photo-1541876163-4cc5c8d5d0d3?w=400', category: 'raincoat' },
            
            // Electronics Accessories (3 items)
            { id: 'p22', name: 'USB Cable (Type-C)', price: 150, image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400', category: 'electronics' },
            { id: 'p23', name: 'Phone Charger (Fast)', price: 200, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c8?w=400', category: 'electronics' },
            { id: 'p24', name: 'Power Bank (10000mAh)', price: 800, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c8?w=400', category: 'electronics' },
            
            // Others (2 items)
            { id: 'p25', name: 'Water Bottle (1L)', price: 150, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', category: 'others' },
            { id: 'p26', name: 'Backpack (College)', price: 650, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', category: 'others' }
        ];

        localStorage.setItem('products', JSON.stringify(defaultProducts));
    },

    // Get all products
    getAllProducts() {
        const products = localStorage.getItem('products');
        return products ? JSON.parse(products) : [];
    },

    // Get product by ID
    getProductById(id) {
        const products = this.getAllProducts();
        return products.find(p => p.id === id);
    },

    // Get products by category
    getProductsByCategory(categoryId) {
        const products = this.getAllProducts();
        return products.filter(p => p.category === categoryId);
    },

    // Search products
    searchProducts(query) {
        const products = this.getAllProducts();
        const lowerQuery = query.toLowerCase();
        return products.filter(p => 
            p.name.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        );
    },

    // Get categories with metadata
    getCategories() {
        const products = this.getAllProducts();
        const categories = [
            { id: 'stationery', name: 'Stationery', icon: '📝', count: 0 },
            { id: 'id-cards', name: 'ID Cards & Lanyards', icon: '🪪', count: 0 },
            { id: 'lab-materials', name: 'Lab Materials', icon: '🔬', count: 0 },
            { id: 'sports', name: 'Sports Items', icon: '⚽', count: 0 },
            { id: 'snacks', name: 'Snacks', icon: '🍪', count: 0 },
            { id: 'raincoat', name: 'Raincoat & Umbrella', icon: '☔', count: 0 },
            { id: 'electronics', name: 'Electronics Accessories', icon: '🔌', count: 0 },
            { id: 'others', name: 'Others', icon: '📦', count: 0 }
        ];

        categories.forEach(cat => {
            cat.count = products.filter(p => p.category === cat.id).length;
        });

        return categories;
    },

    // Get category by ID
    getCategoryById(categoryId) {
        const categories = this.getCategories();
        return categories.find(c => c.id === categoryId);
    },

    // Add new product (admin)
    addProduct(productData) {
        const products = this.getAllProducts();
        const newProduct = {
            id: 'p' + Date.now(),
            ...productData
        };
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        return newProduct.id;
    },

    // Update product (admin)
    updateProduct(productId, productData) {
        const products = this.getAllProducts();
        const index = products.findIndex(p => p.id === productId);
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            localStorage.setItem('products', JSON.stringify(products));
            return true;
        }
        return false;
    },

    // Delete product (admin)
    deleteProduct(productId) {
        const products = this.getAllProducts();
        const filtered = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(filtered));
        return true;
    }
};

