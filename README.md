# Funny T-Shirts Shop

A modern Next.js e-commerce application for funny t-shirts with comprehensive accessibility features, optimized API architecture, and full WCAG 2.1 AA compliance.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## 📚 API Documentation

### Overview

The application features a comprehensive API architecture built for performance, scalability, and maintainability. The API supports both static site generation (SSG) and incremental static regeneration (ISR) for optimal performance.

### Base URL
- **Development**: `http://localhost:3000`
- **Production**: Configurable via `NEXT_PUBLIC_API_URL` or `API_URL` environment variables

---

## 🛒 Products API

### GET `/api/products`
🚀 **Production-grade e-commerce catalog API** with comprehensive search, filtering, sorting, and pagination.

**Query Parameters:**

**📄 Pagination:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12, max: 100)

**🔍 Search & Filtering:**
- `q` (string): Search products by name, description, or category
- `category` (string): Filter by specific category
- `min_price` (number): Minimum price filter
- `max_price` (number): Maximum price filter  
- `min_rating` (number): Minimum rating filter (0-5)
- `in_stock` (boolean): Only show in-stock items (`true`)

**📊 Sorting Options:**
- `sort` (string): Sort by:
  - `newest` (default) - Most recently added
  - `oldest` - Oldest first
  - `price-asc` - Price: Low to High
  - `price-desc` - Price: High to Low
  - `rating-desc` - Highest rated first
  - `rating-asc` - Lowest rated first
  - `name-asc` - Name: A to Z
  - `name-desc` - Name: Z to A
  - `popularity` - Most reviewed first

**Enhanced Response Format:**
```json
{
  "success": true,
  "data": ProductSummary[],
  "pagination": PaginationMeta,
  "categories": CategoryInfo[],
  "filters": {
    "applied": {
      "search": string | null,
      "category": string | null,
      "priceRange": { "min": number, "max": number } | null,
      "minRating": number | null,
      "inStock": boolean | null,
      "sort": string
    }
  },
  "meta": {
    "processingTime": string,
    "timestamp": string,
    "totalResults": number
  }
}
```

**ProductSummary:**
```json
{
  "id": "1",
  "name": "I'm Not Arguing, I'm Just Explaining Why I'm Right",
  "price": 19.99,
  "image": "https://picsum.photos/800/800?random=1",
  "category": "Sarcastic",
  "stock": 15,
  "avgRating": 4.5,
  "reviewCount": 2
}
```

**PaginationMeta:**
```json
{
  "page": 1,
  "limit": 12,
  "total": 32,
  "totalPages": 3,
  "hasNext": true,
  "hasPrev": false
}
```

**CategoryInfo:**
```json
{
  "name": "Tech Tees",
  "count": 8,
  "slug": "tech-tees"
}
```

**💡 Advanced Example Requests:**
```bash
# Simple catalog request (first page, default settings)
GET /api/products

# Search for "coffee" shirts
GET /api/products?q=coffee

# Price range filtering ($10-$25)
GET /api/products?min_price=10&max_price=25

# High-rated products in tech category
GET /api/products?category=tech&min_rating=4&sort=rating-desc

# Advanced multi-filter search
GET /api/products?q=funny&category=sarcastic&min_price=15&max_price=30&min_rating=3&in_stock=true&sort=popularity&page=1&limit=8

# Budget-friendly options
GET /api/products?max_price=20&sort=price-asc&in_stock=true
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1", 
      "name": "I'm Not Arguing, I'm Just Explaining Why I'm Right",
      "price": 19.99,
      "image": "https://picsum.photos/800/800?random=1",
      "category": "Sarcastic",
      "stock": 15,
      "avgRating": 4.5,
      "reviewCount": 2
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 32,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  },
  "categories": [
    { "name": "Tech Tees", "count": 8, "slug": "tech-tees" },
    { "name": "Coffee Humor", "count": 6, "slug": "coffee-humor" },
    { "name": "Office Life", "count": 7, "slug": "office-life" },
    { "name": "Sarcastic", "count": 11, "slug": "sarcastic" }
  ],
  "filters": {
    "applied": {
      "search": null,
      "category": null,
      "priceRange": null,
      "minRating": null,
      "inStock": null,
      "sort": "newest"
    }
  },
  "meta": {
    "processingTime": "15ms",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "totalResults": 32
  }
}
```

---

### GET `/api/products/[id]`
Get detailed product information by product ID.

**Path Parameters:**
- `id` (string): Product ID

**Response Format:**
```json
{
  "success": true,
  "data": {
    "product": ProductDetail,
    "relatedProducts": ProductSummary[]
  },
  "message": string
}
```

**ProductDetail:**
```json
{
  "id": "1",
  "name": "I'm Not Arguing, I'm Just Explaining Why I'm Right",
  "price": 19.99,
  "image": "https://picsum.photos/800/800?random=1",
  "description": "Perfect for those heated discussions...",
  "category": "Sarcastic",
  "stock": 15,
  "reviews": [
    {
      "id": "1",
      "userName": "DebateMaster",
      "rating": 5,
      "comment": "Wore this to a family dinner. Can confirm it works perfectly!",
      "date": "2024-01-15"
    }
  ],
  "similarProducts": ["2", "3", "4"]
}
```

---

## 📂 Categories API

### GET `/api/categories`
Get all product categories with product counts.

**Response Format:**
```json
{
  "success": true,
  "data": {
    "categories": CategoryInfo[]
  },
  "message": string
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      { "name": "Tech Tees", "count": 8, "slug": "tech-tees" },
      { "name": "Coffee Humor", "count": 6, "slug": "coffee-humor" },
      { "name": "Office Life", "count": 7, "slug": "office-life" },
      { "name": "Sarcastic", "count": 11, "slug": "sarcastic" }
    ]
  },
  "message": "Retrieved 4 product categories"
}
```

---

## 🔄 Cache Management API

### POST `/api/revalidate`
Revalidate specific pages for Incremental Static Regeneration (ISR).

**Request Body:**
```json
{
  "path": "/products/product-slug",
  "secret": "your-revalidation-secret" // optional
}
```

**Response Format:**
```json
{
  "revalidated": true,
  "now": 1641024000000,
  "path": "/products/product-slug"
}
```

### GET `/api/revalidate`
Alternative GET endpoint for webhook integrations.

**Query Parameters:**
- `path` (string): Path to revalidate
- `secret` (string): Revalidation secret (optional)

**Example Request:**
```
GET /api/revalidate?path=/products/funny-shirt&secret=your-secret
```

---

## 📊 Data Models

### ProductSummary
Lightweight product data for catalog/grid views:
```typescript
interface ProductSummary {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  avgRating: number;
  reviewCount: number;
}
```

### ProductDetail
Complete product information:
```typescript
interface ProductDetail {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  reviews: Review[];
  similarProducts: string[];
  category: string;
  stock: number;
  avgRating: number;
  reviewCount: number;
}
```

### Review
Customer review data:
```typescript
interface Review {
  id: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string; // ISO date string
}
```

### CategoryInfo
Category metadata:
```typescript
interface CategoryInfo {
  name: string;
  count: number; // Number of products in category
  slug: string;
}
```

---

## 🔧 Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error description",
  "message": "User-friendly error message"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `404` - Not Found (product/category doesn't exist)
- `500` - Internal Server Error

**Example Error Response:**
```json
{
  "success": false,
  "error": "Product not found",
  "message": "Product with ID \"invalid-id\" does not exist"
}
```

---

## 🏗️ Architecture Features

### Database Integration
- **Storage**: lowdb (JSON file-based database)
- **Location**: `src/lib/database.ts`
- **Initialization**: Automatic database setup with 32 mock products
- **Service Layer**: `src/lib/db-service.ts` provides abstraction layer

### Performance Optimizations
- **Static Site Generation (SSG)**: Product pages pre-generated at build time
- **Incremental Static Regeneration (ISR)**: On-demand page updates
- **API Response Optimization**: Lightweight ProductSummary for catalogs
- **Pagination**: Configurable page size with max limits
- **Caching Strategy**: Appropriate cache headers for different content types

### Type Safety
- **Full TypeScript Coverage**: All API responses and data models typed
- **Shared Types**: Consistent interfaces across client and server
- **Runtime Validation**: Query parameter validation and sanitization

### Accessibility Features
- **WCAG 2.1 AA Compliant**: Full accessibility support
- **Screen Reader Support**: Comprehensive ARIA labels and live regions
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus trapping and management
- **Semantic HTML**: Proper landmarks and structure

---

## 🛠️ Technical Stack

- **Framework**: Next.js 15 with App Router
- **Database**: lowdb (JSON file-based)
- **UI Library**: shadcn/ui components (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS with custom accessibility utilities
- **TypeScript**: Full type safety throughout
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: SSG + ISR with optimized API responses

---

## 🌐 Environment Configuration

```bash
# Optional: Custom API base URL
NEXT_PUBLIC_API_URL=https://your-domain.com

# Optional: Server-side API URL (different from client)
API_URL=https://internal-api.com

# Optional: Revalidation secret for ISR
REVALIDATION_SECRET=your-secret-key
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── products/           # Product endpoints
│   │   │   ├── route.ts        # GET /api/products (comprehensive catalog)
│   │   │   └── [id]/           # GET /api/products/[id]
│   │   ├── categories/         # Category endpoints
│   │   └── revalidate/         # Cache revalidation
│   ├── products/[slug]/        # Product detail pages
│   ├── categories/[category]/  # Category pages
│   └── page.tsx                # Home page
├── lib/
│   ├── api.ts                  # API client utilities
│   ├── database.ts             # Database configuration
│   ├── db-service.ts           # Database service layer
│   └── products-data.ts        # Mock product data
├── types/
│   └── api.ts                  # TypeScript API interfaces
└── components/                 # React components
    ├── Header.tsx              # Accessible navigation
    ├── ProductCard.tsx         # Product grid items
    ├── ProductFilters.tsx      # Category/sort filters
    └── ui/                     # shadcn/ui components
```
