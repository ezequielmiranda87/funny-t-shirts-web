'use client';

import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import PaginationControls from '@/components/PaginationControls';
import ProductFilters from '@/components/ProductFilters';
import { ProductGridSkeleton } from '@/components/ProductCardSkeleton';
import { ProductSummary, CategoryInfo, PaginationMeta, CatalogResponse } from '@/types/api';
import Header from '@/components/Header';

export default function Home() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState<string | undefined>();
  const [currentSort, setCurrentSort] = useState('newest');
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Fetch catalog data
  const fetchCatalog = async (page = 1, category?: string, sort = 'newest') => {
    try {
      setLoading(true);
      setError(null);
      setStatusMessage('Loading products...');
      
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
      setStatusMessage(`Loaded ${data.products.length} products`);
      
    } catch (error) {
      console.error('Failed to fetch catalog:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
      setStatusMessage('Failed to load products');
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
    setStatusMessage(`Navigated to page ${page}`);
  };

  // Handle category filter
  const handleCategoryChange = (category: string | undefined) => {
    setCurrentCategory(category);
    setCurrentPage(1);
    fetchCatalog(1, category, currentSort);
    setStatusMessage(category ? `Filtered to ${category} category` : 'Showing all categories');
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    setCurrentSort(sort);
    setCurrentPage(1);
    fetchCatalog(1, currentCategory, sort);
    const sortLabels: { [key: string]: string } = {
      'newest': 'newest first',
      'price-asc': 'price low to high',
      'price-desc': 'price high to low',
      'rating': 'highest rated',
      'name': 'alphabetical'
    };
    setStatusMessage(`Sorted by ${sortLabels[sort] || sort}`);
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center" role="alert" aria-live="assertive">
          <p className="text-lg text-red-600 mb-4">
            <span aria-hidden="true">❌</span>
            <span className="sr-only">Error: </span>
            {error}
          </p>
          <button 
            onClick={() => fetchCatalog()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-describedby="error-help"
          >
            Try Again
          </button>
          <div id="error-help" className="sr-only">
            Retry loading the product catalog
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Header */}
      <Header
        title="Funny T-Shirts Shop"
        subtitle={pagination ? `Discover ${pagination.total} hilarious t-shirt designs` : 'Loading amazing t-shirt designs...'}
        cartItemCount={0}
      />

      {/* Product Filters and Grid */}
      <main id="main-content" className="container mx-auto px-4 py-8" role="main">
        {/* Screen reader announcements */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {statusMessage}
        </div>
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
            <section aria-labelledby="products-heading">
              <h2 id="products-heading" className="sr-only">
                Product listings
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </section>

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
          <div className="text-center py-12" role="status" aria-live="polite">
            <p className="text-lg text-muted-foreground mb-4">
              No products found
              {currentCategory && ` in "${currentCategory}" category`}.
            </p>
            {currentCategory && (
              <button
                onClick={() => handleCategoryChange(undefined)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Clear category filter and show all products"
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
