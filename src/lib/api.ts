// API Configuration and Utilities for Backend Integration

// Environment configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:3000';
const INTERNAL_API_URL = process.env.API_URL || API_BASE_URL;

// API endpoints configuration
export const API_ENDPOINTS = {
  // Product endpoints
  PRODUCTS: '/api/products',
  PRODUCT_BY_SLUG: (slug: string) => `/api/products/${slug}`,
  
  // Category endpoints  
  CATEGORIES: '/api/categories',
  CATEGORY_PRODUCTS: (category: string) => `/api/categories/${category}/products`,
  
  // Build-time endpoints (for SSG)
  BUILD_PRODUCT_SLUGS: '/api/build/product-slugs',
  BUILD_CATEGORIES: '/api/build/categories',
  
  // Revalidation endpoint (for ISR)
  REVALIDATE: '/api/revalidate',
} as const;

// Types for API responses (ready for backend integration)
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Product interfaces (enhanced for backend)
export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: ProductImage;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  reviews: Review[];
  similarProducts: ProductSummary[];
  images: ProductImage[];
  sku: string;
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    tags?: string[];
  };
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  isPrimary: boolean;
  formats?: {
    thumbnail?: string;
    medium?: string;
    large?: string;
    webp?: string;
    avif?: string;
  };
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

// API Client Configuration
export interface ApiClientConfig {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  cache?: RequestCache;
  headers?: HeadersInit;
}

// Default configuration
const DEFAULT_CONFIG: ApiClientConfig = {
  baseUrl: API_BASE_URL,
  timeout: 10000, // 10 seconds
  retries: 3,
  cache: 'no-store', // Will be configured per endpoint
  headers: {
    'Content-Type': 'application/json',
  },
};

// Utility functions
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API client with retry logic and error handling
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { config?: ApiClientConfig } = {}
): Promise<T> {
  const config = { ...DEFAULT_CONFIG, ...options.config };
  const url = `${config.baseUrl}${endpoint}`;
  
  let lastError: Error = new Error('Unknown error');
  
  for (let attempt = 1; attempt <= (config.retries || 1); attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...config.headers,
          ...options.headers,
        },
        cache: options.cache || config.cache,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === config.retries) {
        break;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt - 1) * 1000)
      );
    }
  }
  
  throw new ApiError(
    `Failed after ${config.retries} attempts: ${lastError.message}`,
    undefined,
    'NETWORK_ERROR',
    lastError
  );
}

// Specific API functions (ready for backend integration)

// Product API functions
export async function getProducts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  sort?: 'price' | 'name' | 'created';
  order?: 'asc' | 'desc';
}): Promise<PaginatedResponse<ProductSummary>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.category) searchParams.set('category', params.category);
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.order) searchParams.set('order', params.order);
  
  const endpoint = `${API_ENDPOINTS.PRODUCTS}${searchParams.toString() ? `?${searchParams}` : ''}`;
  
  return apiRequest<PaginatedResponse<ProductSummary>>(endpoint, {
    cache: 'force-cache', // Can be cached for a short time
    config: { timeout: 5000 }
  });
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  try {
    return await apiRequest<ProductDetail>(API_ENDPOINTS.PRODUCT_BY_SLUG(slug), {
      cache: 'force-cache', // Products don't change often
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

// Category API functions
export async function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>(API_ENDPOINTS.CATEGORIES, {
    cache: 'force-cache', // Categories rarely change
    config: { timeout: 5000 }
  });
}

export async function getCategoryProducts(
  category: string,
  params?: { page?: number; limit?: number }
): Promise<PaginatedResponse<ProductSummary>> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  
  const endpoint = `${API_ENDPOINTS.CATEGORY_PRODUCTS(category)}${
    searchParams.toString() ? `?${searchParams}` : ''
  }`;
  
  return apiRequest<PaginatedResponse<ProductSummary>>(endpoint, {
    cache: 'force-cache',
  });
}

// Build-time API functions (for SSG)
export async function getAllProductSlugs(): Promise<string[]> {
  const response = await apiRequest<{ slugs: string[] }>(
    API_ENDPOINTS.BUILD_PRODUCT_SLUGS,
    {
      cache: 'no-store', // Always fresh for builds
      config: { timeout: 30000 } // Longer timeout for build operations
    }
  );
  return response.slugs;
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const response = await apiRequest<{ categories: string[] }>(
    API_ENDPOINTS.BUILD_CATEGORIES,
    {
      cache: 'no-store',
      config: { timeout: 30000 }
    }
  );
  return response.categories;
}

// ISR revalidation function
export async function revalidatePage(path: string, secret?: string): Promise<void> {
  await apiRequest(API_ENDPOINTS.REVALIDATE, {
    method: 'POST',
    body: JSON.stringify({ path, secret }),
    cache: 'no-store',
  });
}

// Utility functions
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getApiUrl(endpoint: string, isServerSide: boolean = false): string {
  const baseUrl = isServerSide ? INTERNAL_API_URL : API_BASE_URL;
  return `${baseUrl}${endpoint}`;
}

// Development helper (for transitioning from mock to real API)
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isUsingMockApi = !process.env.API_URL && !process.env.NEXT_PUBLIC_API_URL;