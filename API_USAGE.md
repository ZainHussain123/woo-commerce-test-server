# WooCommerce Products Service API

This service integrates with WooCommerce to ingest products and provides filtering capabilities.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your database (PostgreSQL):
```bash
# Update environment variables in .env or set them directly
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=12345
POSTGRES_DB=woocommerce
```

3. Start the service:
```bash
npm run start:dev
```

## API Endpoints

### 1. Ingest Products from WooCommerce
**POST** `/products/ingest`

Fetches all products from the WooCommerce API and stores them in the local database.

**Response:**
```json
{
  "message": "Products ingested successfully",
  "imported": 150,
  "updated": 25,
  "total": 175
}
```

### 2. Get All Products
**GET** `/products`

Returns all products stored in the local database.

**Response:**
```json
[
  {
    "id": 123,
    "title": "Sample Product",
    "price": 29.99,
    "stock_status": "instock",
    "stock_quantity": 50,
    "category": "Electronics",
    "tags": ["new", "featured"],
    "on_sale": false,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### 3. Get Product by ID
**GET** `/products/:id`

Returns a specific product by its ID.

### 4. Evaluate Segments
**POST** `/segments/evaluate`

Filters products based on text conditions.

**Request Body:**
```json
{
  "conditions": "on sale and in stock"
}
```

**Supported Conditions:**
- `on sale` or `sale` - Products that are on sale
- `in stock` or `instock` - Products that are in stock
- `out of stock` or `outofstock` - Products that are out of stock
- `price < 50` - Products with price less than 50
- `price > 100` - Products with price greater than 100
- `price = 25` - Products with exact price of 25
- `category = "Electronics"` - Products in specific category
- `tag = "featured"` - Products with specific tag

**Response:**
```json
{
  "conditions": "on sale and in stock",
  "count": 15,
  "products": [
    {
      "id": 123,
      "title": "Sample Product",
      "price": 29.99,
      "stock_status": "instock",
      "stock_quantity": 50,
      "category": "Electronics",
      "tags": ["new", "featured"],
      "on_sale": true,
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## Example Usage

1. **First, ingest products:**
```bash
curl -X POST http://localhost:3000/products/ingest
```

2. **Get all products:**
```bash
curl http://localhost:3000/products
```

3. **Filter products on sale:**
```bash
curl -X POST http://localhost:3000/segments/evaluate \
  -H "Content-Type: application/json" \
  -d '{"conditions": "on sale"}'
```

4. **Filter products by price and stock:**
```bash
curl -X POST http://localhost:3000/segments/evaluate \
  -H "Content-Type: application/json" \
  -d '{"conditions": "price < 50 and in stock"}'
```

5. **Filter by category:**
```bash
curl -X POST http://localhost:3000/segments/evaluate \
  -H "Content-Type: application/json" \
  -d '{"conditions": "category = Electronics"}'
```

## Database Schema

The service stores products with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | number | Product ID (from WooCommerce) |
| title | string | Product name |
| price | number | Product price |
| stock_status | string | Stock status (instock/outofstock) |
| stock_quantity | number\|null | Available stock quantity |
| category | string\|null | Product category |
| tags | string[] | Array of product tags |
| on_sale | boolean | Whether product is on sale |
| created_at | Date | When the product was created |
| updatedAt | Date | When the product was last updated |
