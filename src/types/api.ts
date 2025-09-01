// Optimized API types for performance

// Lightweight product summary for homepage/catalog views
export interface ProductSummary {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  avgRating: number;
  reviewCount: number;
}

// Full product detail for individual product pages
export interface ProductDetail {
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

// Review interface (unchanged from current)
export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Catalog API response
export interface CatalogResponse {
  products: ProductSummary[];
  pagination: PaginationMeta;
  categories: CategoryInfo[];
}

// Category information
export interface CategoryInfo {
  name: string;
  count: number;
  slug: string;
}

// Product detail API response
export interface ProductDetailResponse {
  product: ProductDetail;
  relatedProducts: ProductSummary[];
}

// Categories API response
export interface CategoriesResponse {
  categories: CategoryInfo[];
}

// Enhanced catalog query options
export interface CatalogOptions {
  // Pagination
  page?: number;
  limit?: number;
  
  // Search & Filtering
  q?: string;                    // Search query
  category?: string;             // Category filter
  minPrice?: number;             // Minimum price filter
  maxPrice?: number;             // Maximum price filter
  minRating?: number;            // Minimum rating filter (0-5)
  inStock?: boolean;             // Only show in-stock items
  
  // Sorting
  sort?: 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'rating-desc' | 'rating-asc' | 'name-asc' | 'name-desc' | 'popularity';
}