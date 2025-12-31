# DSCE Student Store

A complete e-commerce website for Dayananda Sagar Institutions students to buy essential college items.

## Features

- ✅ User authentication with @dsce.in email validation
- ✅ Product browsing with 8 categories and 25+ items
- ✅ Shopping cart functionality
- ✅ Order placement and management
- ✅ 3-minute order cancellation window
- ✅ Admin panel for order and product management
- ✅ **Shopping history storage** (Node.js backend)
- ✅ Responsive design

## Tech Stack

### Frontend
- HTML5
- CSS3 (Modern, responsive design)
- Vanilla JavaScript
- LocalStorage (for cart and orders)

### Backend (Optional - for Shopping History)
- Node.js
- Express.js
- JSON file storage

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to:
- **Frontend**: `http://localhost:3000/index.html`
- **API Health Check**: `http://localhost:3000/api/health`

## Usage

### For Students

1. Login with any `@dsce.in` email (e.g., `student@dsce.in`)
2. Browse categories and products
3. Add items to cart
4. Checkout and place order
5. View shopping history in the History page

### For Admin

1. Login with `admin@dsce.in`
2. Access admin dashboard
3. Manage orders and products
4. View cancellation logs

## API Endpoints

### Shopping History API

- `POST /api/shopping-history` - Save shopping history
- `GET /api/shopping-history/:email` - Get user's shopping history
- `GET /api/shopping-history` - Get all shopping history (admin)
- `DELETE /api/shopping-history/:orderId` - Delete shopping history entry
- `GET /api/health` - Health check

## Data Storage

- **LocalStorage**: Cart, current orders, products, user session
- **Backend (JSON)**: Shopping history stored in `data/shopping-history.json`

## File Structure

```
/ecomerce
├── index.html          # Login page
├── home.html           # Categories page
├── products.html       # Product listing
├── cart.html           # Shopping cart
├── checkout.html       # Checkout form
├── order.html          # Order confirmation
├── history.html        # Shopping history
├── admin.html          # Admin dashboard
├── server.js           # Node.js server
├── package.json        # Dependencies
├── css/
│   └── style.css       # Styles
├── js/
│   ├── auth.js         # Authentication
│   ├── products.js     # Product management
│   ├── cart.js         # Cart functionality
│   ├── orders.js       # Order management
│   ├── admin.js        # Admin functions
│   └── history.js      # History API client
└── data/
    └── shopping-history.json  # Shopping history storage
```

## Notes

- The application works offline using LocalStorage
- Shopping history is saved to the backend when orders are placed
- If the backend is unavailable, the app continues to work (shopping history save fails silently)
- All data is stored locally or in JSON files (no database required)

## License

ISC

