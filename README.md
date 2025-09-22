## Order Management System (data_eng)

A minimal full‑stack demo to manage shop orders.

- **Frontend**: vanilla HTML/CSS/JS (`index.html`, `styles.css`, `script.js`)
- **Backend**: Node.js + Express + Mongoose (`server.js`)
- **Database**: MongoDB (local)

### Features
- **Employee login** (demo credentials, no real auth)
- **Create orders** with multiple items and quantities
- **List all orders**
- **View single order** details
- **Update order status**
- **Delete order**
- **Search orders** by text (customer name, item names, status)

### Project Structure
```
data_eng/
  index.html         # UI markup
  styles.css         # UI styles
  script.js          # Frontend logic and API calls
  server.js          # Express API + Mongoose models
  package.json       # Dependencies and scripts
```

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB running locally on `mongodb://localhost:27017`

### Installation
```bash
npm install
```

### Run the backend server
```bash
npm start
# Server runs on http://localhost:3000
```
The backend expects MongoDB at `mongodb://localhost:27017/shop_orders`. Ensure your MongoDB service is running.

### Use the frontend
- Open `index.html` directly in a browser (no build step).
- Demo login credentials (hardcoded in `script.js`):
  - `emp1` / `password1`
  - `emp2` / `password2`

### Configuration
The current code uses hardcoded values:
- API base URL: `http://localhost:3000` (see `script.js` → `BASE_URL`)
- Mongo URL: `mongodb://localhost:27017/shop_orders` (see `server.js`)

If needed, change these directly in the files or add environment variable support.

### API Reference
Base URL: `http://localhost:3000`

- GET `/api/orders`
  - Returns all orders.
  - Example:
    ```bash
    curl http://localhost:3000/api/orders
    ```

- POST `/api/orders`
  - Creates a new order.
  - Body:
    ```json
    {
      "employeeId": "emp1",
      "customerName": "Alice",
      "address": "221B Baker Street",
      "status": "Placed",
      "items": [
        { "name": "TV", "quantity": 1 },
        { "name": "Chair", "quantity": 4 }
      ]
    }
    ```
  - Example:
    ```bash
    curl -X POST http://localhost:3000/api/orders \
      -H 'Content-Type: application/json' \
      -d '{
        "employeeId":"emp1",
        "customerName":"Alice",
        "address":"221B Baker Street",
        "status":"Placed",
        "items":[{"name":"TV","quantity":1}]
      }'
    ```

- GET `/api/orders/:id`
  - Returns one order by id.

- PUT `/api/orders/:id`
  - Updates fields on an order (e.g., status).
  - Example:
    ```bash
    curl -X PUT http://localhost:3000/api/orders/<id> \
      -H 'Content-Type: application/json' \
      -d '{"status":"Delivered"}'
    ```

- DELETE `/api/orders/:id`
  - Deletes an order by id.

- GET `/api/orders/search/:query`
  - Text search over `customerName`, `itemNames`, and `status`.
  - Example:
    ```bash
    curl http://localhost:3000/api/orders/search/TV
    ```

### Notes on Data Model and Search
- Mongoose schema (`server.js`) stores:
  - `employeeId`, `customerName`, `address`, `status`
  - `items`: array of `{ name, quantity }`
  - `itemNames`: array of item name strings for fast text search
- A compound text index is created on `customerName`, `itemNames`, and `status` for the search endpoint.

### Development Tips
- CORS is enabled for local usage.
- The frontend uses `prompt()` for quantities and status updates for simplicity.
- For production, replace the demo login with real authentication and store configuration in environment variables.

### Scripts
```json
{
  "start": "node server.js"
}
```

### License
ISC (see `package.json`).


