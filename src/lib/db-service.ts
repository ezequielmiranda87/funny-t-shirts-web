import { getDatabase, generateSlug } from './database';
import { Product } from '@/app/api/products/route';

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
 * Always uses static data for build performance
 */
export async function getProductsForStaticGeneration(): Promise<Product[]> {
  // Always use static data import to avoid database initialization during build
  const { getInitialProductsForBuild } = await import('./database-static-data');
  return getInitialProductsForBuild();
}

// Re-export generateSlug for consistency
export { generateSlug } from './database';