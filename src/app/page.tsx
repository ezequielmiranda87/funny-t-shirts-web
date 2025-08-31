'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from './api/products/route';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch ALL products at once - will be optimized in Phase 2
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  // Get unique categories for navigation
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center">
            😂 Funny T-Shirts Shop
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            Discover {products.length} hilarious t-shirt designs
          </p>
          
          {/* Category Navigation */}
          <nav className="flex justify-center mt-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/categories/${category.toLowerCase()}`}
                  className="px-3 py-1 rounded-full text-sm border border-border bg-background hover:bg-muted transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Product Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
