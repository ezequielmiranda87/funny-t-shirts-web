import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/app/api/products/route';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getProductsByCategory, getCategories, generateSlug } from '@/lib/db-service';
import Header from '@/components/Header';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}


// Get products by category using database service
async function getProductsByCategoryFromDB(category: string): Promise<{ products: Product[], totalCount: number }> {
  try {
    return await getProductsByCategory(category);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return { products: [], totalCount: 0 };
  }
}

// Get all available categories using database service
async function getAvailableCategories(): Promise<string[]> {
  try {
    return await getCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const availableCategories = await getAvailableCategories();
  
  // Check if category exists
  const categoryExists = availableCategories.some(
    cat => cat.toLowerCase() === category.toLowerCase()
  );
  
  if (!categoryExists) {
    notFound();
  }
  
  const { products, totalCount } = await getProductsByCategoryFromDB(category);
  
  // Capitalize category name for display
  const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Header */}
      <Header
        title="Funny T-Shirts Shop"
        subtitle={`Browse ${totalCount} hilarious ${displayCategory.toLowerCase()} t-shirt designs`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Categories', href: '/categories' },
          { label: displayCategory, href: '', active: true }
        ]}
        cartItemCount={0}
      />

      {/* Category Content */}
      <main id="main-content" className="container mx-auto px-4 py-8" role="main">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{displayCategory} T-Shirts</h1>
          <p className="text-muted-foreground mb-4">
            Found {totalCount} funny t-shirt{totalCount !== 1 ? 's' : ''} in the {displayCategory} category
          </p>
          
          {/* Category Links */}
          <div className="flex flex-wrap gap-2 mb-6">
            {availableCategories.map((cat) => (
              <Link
                key={cat}
                href={`/categories/${cat.toLowerCase()}`}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  cat.toLowerCase() === category.toLowerCase()
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:bg-muted'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <section aria-labelledby="category-products-heading">
            <h2 id="category-products-heading" className="sr-only">
              {displayCategory} category products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <article key={product.id}>
                  <Card className="w-full h-full flex flex-col overflow-hidden">
                    <CardHeader className="p-0">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={product.image}
                          alt={`${product.name} - ${product.category} funny t-shirt design`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          priority={index < 4}
                        />
                      </div>
                    </CardHeader>
                
                    <CardContent className="flex-grow p-4">
                      <div className="space-y-2">
                        <Badge variant="secondary" className="text-xs" aria-hidden="true">
                          {product.category}
                        </Badge>
                        <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-2xl font-bold text-primary">
                          <span className="sr-only">Price: </span>
                          ${product.price}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span className="sr-only">Stock available: </span>
                          Stock: {product.stock} left
                        </p>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <span aria-hidden="true">⭐</span>
                          <span>
                            <span className="sr-only">
                              {product.reviews.length > 0 
                                ? `Rating: ${(product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length).toFixed(1)} out of 5 stars`
                                : 'No ratings yet'
                              }
                            </span>
                            <span aria-hidden="true">
                              {product.reviews.length > 0 
                                ? (product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length).toFixed(1)
                                : 'No reviews'
                              }
                            </span>
                          </span>
                          <span aria-hidden="true">({product.reviews.length} reviews)</span>
                        </div>
                      </div>
                    </CardContent>
                
                    <CardFooter className="p-4 pt-0">
                      <Link href={`/products/${generateSlug(product.name)}`} className="w-full">
                        <Button className="w-full" variant="default" aria-label={`View details for ${product.name}`}>
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No products found in the {displayCategory} category.
            </p>
            <Link href="/">
              <Button variant="outline">
                Browse All Products
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

// Generate metadata for SEO (will be enhanced in Phase 4)
export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);
  
  return {
    title: `${displayCategory} T-Shirts - Funny T-Shirts Shop`,
    description: `Browse our collection of funny ${displayCategory.toLowerCase()} t-shirts. High quality, humorous designs perfect for any occasion.`,
  };
}