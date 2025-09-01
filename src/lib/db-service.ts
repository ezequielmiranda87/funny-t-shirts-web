import { getDatabase, generateSlug } from './database';
import { Product } from '@/app/api/products/route';
import { 
  ProductSummary, 
  ProductDetail, 
  PaginationMeta, 
  CategoryInfo, 
  CatalogOptions 
} from '@/types/api';

// Database service functions to replace direct mockProducts access

/**
 * Get all products from the database
 */
export async function getAllProducts(): Promise<Product[]> {
  const db = await getDatabase();
  await db.read();
  return db.data.products || [];
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find(p => p.id === id) || null;
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find(p => generateSlug(p.name) === slug) || null;
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category: string): Promise<{ products: Product[], totalCount: number }> {
  const products = await getAllProducts();
  const filteredProducts = products.filter(p => 
    p.category.toLowerCase() === category.toLowerCase()
  );
  
  return {
    products: filteredProducts,
    totalCount: filteredProducts.length
  };
}

/**
 * Get all available categories
 */
export async function getCategories(): Promise<string[]> {
  const products = await getAllProducts();
  const categories = [...new Set(products.map(p => p.category))];
  return categories;
}

/**
 * Get products for static generation (used by generateStaticParams)
 * Uses database service for consistent data source
 */
export async function getProductsForStaticGeneration(): Promise<Product[]> {
  // Use database service directly - it will initialize if needed
  return await getAllProducts();
}

// Re-export generateSlug for consistency
export { generateSlug } from './database';

// ============================================================================
// OPTIMIZED API FUNCTIONS FOR PERFORMANCE
// ============================================================================

/**
 * Convert full Product to lightweight ProductSummary
 */
function productToSummary(product: Product): ProductSummary {
  const avgRating = product.reviews.length > 0 
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length 
    : 0;
  
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    stock: product.stock,
    avgRating: Number(avgRating.toFixed(1)),
    reviewCount: product.reviews.length
  };
}

/**
 * Convert full Product to ProductDetail with computed fields
 */
function productToDetail(product: Product): ProductDetail {
  const avgRating = product.reviews.length > 0 
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length 
    : 0;
  
  return {
    ...product,
    avgRating: Number(avgRating.toFixed(1)),
    reviewCount: product.reviews.length
  };
}

/**
 * Get paginated product catalog with enhanced filtering and search
 */
export async function getProductsCatalog(options: CatalogOptions = {}): Promise<{
  products: ProductSummary[],
  pagination: PaginationMeta,
  categories: CategoryInfo[]
}> {
  const { 
    page = 1, 
    limit = 12, 
    q,           // search query
    category, 
    minPrice,
    maxPrice,
    minRating,
    inStock,
    sort = 'newest' 
  } = options;

  const allProducts = await getAllProducts();
  
  // Apply all filters
  let filteredProducts = allProducts.filter(product => {
    // Search filter (case-insensitive search in name and description)
    if (q) {
      const searchTerm = q.toLowerCase();
      const productName = product.name.toLowerCase();
      const productDesc = product.description.toLowerCase();
      const productCategory = product.category.toLowerCase();
      
      if (!productName.includes(searchTerm) && 
          !productDesc.includes(searchTerm) && 
          !productCategory.includes(searchTerm)) {
        return false;
      }
    }
    
    // Category filter
    if (category && product.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    
    // Price range filter
    if (minPrice !== undefined && product.price < minPrice) {
      return false;
    }
    if (maxPrice !== undefined && product.price > maxPrice) {
      return false;
    }
    
    // Rating filter
    if (minRating !== undefined) {
      const avgRating = product.reviews.length > 0 
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length 
        : 0;
      if (avgRating < minRating) {
        return false;
      }
    }
    
    // Stock filter
    if (inStock === true && product.stock <= 0) {
      return false;
    }
    
    return true;
  });
  
  // Sort products
  filteredProducts = sortProducts(filteredProducts, sort);
  
  // Calculate pagination
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  // Get paginated products
  const paginatedProducts = filteredProducts
    .slice(startIndex, endIndex)
    .map(productToSummary);
  
  // Get categories with counts
  const categories = await getCategoriesWithCounts();
  
  return {
    products: paginatedProducts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    },
    categories
  };
}

/**
 * Get full product detail by ID
 */
export async function getProductFullDetail(id: string): Promise<ProductDetail | null> {
  const product = await getProductById(id);
  if (!product) return null;
  
  return productToDetail(product);
}

/**
 * Get related products (lightweight summary)
 */
export async function getRelatedProducts(productId: string, limit: number = 4): Promise<ProductSummary[]> {
  const product = await getProductById(productId);
  if (!product) return [];
  
  const allProducts = await getAllProducts();
  
  // Get products in same category, excluding current product
  const relatedProducts = allProducts
    .filter(p => p.id !== productId && p.category === product.category)
    .slice(0, limit)
    .map(productToSummary);
  
  // If not enough in same category, fill with other products
  if (relatedProducts.length < limit) {
    const additionalProducts = allProducts
      .filter(p => p.id !== productId && p.category !== product.category)
      .slice(0, limit - relatedProducts.length)
      .map(productToSummary);
    
    relatedProducts.push(...additionalProducts);
  }
  
  return relatedProducts;
}

/**
 * Get categories with product counts
 */
export async function getCategoriesWithCounts(): Promise<CategoryInfo[]> {
  const products = await getAllProducts();
  const categoryMap = new Map<string, number>();
  
  products.forEach(product => {
    const count = categoryMap.get(product.category) || 0;
    categoryMap.set(product.category, count + 1);
  });
  
  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    count,
    slug: name.toLowerCase()
  }));
}

/**
 * Sort products array with enhanced sorting options
 */
function sortProducts(products: Product[], sort: string): Product[] {
  const sortedProducts = [...products];
  
  switch (sort) {
    case 'price-asc':
      return sortedProducts.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sortedProducts.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    case 'rating-desc':
      return sortedProducts.sort((a, b) => {
        const avgA = a.reviews.length > 0 ? a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length : 0;
        const avgB = b.reviews.length > 0 ? b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length : 0;
        return avgB - avgA;
      });
    case 'rating-asc':
      return sortedProducts.sort((a, b) => {
        const avgA = a.reviews.length > 0 ? a.reviews.reduce((acc, r) => acc + r.rating, 0) / a.reviews.length : 0;
        const avgB = b.reviews.length > 0 ? b.reviews.reduce((acc, r) => acc + r.rating, 0) / b.reviews.length : 0;
        return avgA - avgB;
      });
    case 'popularity':
      // Sort by number of reviews (more reviews = more popular)
      return sortedProducts.sort((a, b) => b.reviews.length - a.reviews.length);
    case 'oldest':
      // For mock data, sort by ID ascending (lowest ID = oldest)
      return sortedProducts.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    case 'newest':
    default:
      // For mock data, sort by ID descending (highest ID = newest)
      return sortedProducts.sort((a, b) => parseInt(b.id) - parseInt(a.id));
  }
}

/**
 * Get products summary (lightweight) - for backward compatibility
 */
export async function getProductsSummary(): Promise<ProductSummary[]> {
  const products = await getAllProducts();
  return products.map(productToSummary);
}