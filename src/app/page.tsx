'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import PaginationControls from '@/components/PaginationControls';
import ProductFilters from '@/components/ProductFilters';
import { ProductGridSkeleton } from '@/components/ProductCardSkeleton';
import { ProductSummary, CategoryInfo, PaginationMeta, CatalogResponse } from '@/types/api';

export default function Home() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState<string | undefined>();
  const [currentSort, setCurrentSort] = useState('newest');
  const [error, setError] = useState<string | null>(null);

  // Fetch catalog data
  const fetchCatalog = async (page = 1, category?: string, sort = 'newest') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sort: sort
      });
      
      if (category) {
        params.append('category', category);
      }
      
      const response = await fetch(`/api/products/catalog?${params.toString()}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch products');
      }
      
      const data: CatalogResponse = result.data;
      setProducts(data.products);
      setPagination(data.pagination);
      setCategories(data.categories);
      
    } catch (error) {
      console.error('Failed to fetch catalog:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchCatalog();
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchCatalog(page, currentCategory, currentSort);
    // Scroll to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle category filter
  const handleCategoryChange = (category: string | undefined) => {
    setCurrentCategory(category);
    setCurrentPage(1);
    fetchCatalog(1, category, currentSort);
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
    setCurrentPage(1);
    fetchCatalog(1, currentCategory, sort);
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">❌ {error}</p>
          <button 
            onClick={() => fetchCatalog()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center">
            😂 Funny T-Shirts Shop
          </h1>
          <p className="text-center text-muted-foreground mt-2">
            {pagination ? (
              <>Discover {pagination.total} hilarious t-shirt designs</>
            ) : (
              'Loading amazing t-shirt designs...'
            )}
          </p>
        </div>
      </header>

      {/* Product Filters and Grid */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        {!loading && categories.length > 0 && (
          <ProductFilters
            categories={categories}
            currentCategory={currentCategory}
            currentSort={currentSort}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
          />
        )}

        {/* Loading State */}
        {loading && <ProductGridSkeleton count={12} />}

        {/* Products Grid */}
        {!loading && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && (
              <PaginationControls
                pagination={pagination}
                onPageChange={handlePageChange}
                isLoading={loading}
              />
            )}
          </>
        )}

        {/* No Products State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No products found
              {currentCategory && ` in "${currentCategory}" category`}.
            </p>
            {currentCategory && (
              <button
                onClick={() => handleCategoryChange(undefined)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Show All Products
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
