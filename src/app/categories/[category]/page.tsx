import { notFound } from 'next/navigation';
import { Product } from '@/app/api/products/route';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

// Generate slug from product name (same logic that will be used in backend)
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Fetch products by category
async function getProductsByCategory(category: string): Promise<{ products: Product[], totalCount: number }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store' // For now, until we implement proper caching
    });
    
    if (!response.ok) {
      return { products: [], totalCount: 0 };
    }
    
    const data = await response.json();
    const filteredProducts = data.products.filter((p: Product) => 
      p.category.toLowerCase() === category.toLowerCase()
    );
    
    return { 
      products: filteredProducts,
      totalCount: filteredProducts.length
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], totalCount: 0 };
  }
}

// Get all available categories for validation
async function getAvailableCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    const categories = [...new Set(data.products.map((p: Product) => p.category))] as string[];
    return categories;
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
  
  const { products, totalCount } = await getProductsByCategory(category);
  
  // Capitalize category name for display
  const displayCategory = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">
            <Link href="/" className="text-blue-600 hover:underline">
              😂 Funny T-Shirts Shop
            </Link>
          </h1>
          <nav className="mt-2">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              Home
            </Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-sm">Categories</span>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-sm text-foreground">{displayCategory}</span>
          </nav>
        </div>
      </header>

      {/* Category Content */}
      <main className="container mx-auto px-4 py-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="w-full h-full flex flex-col overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="flex-grow p-4">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-2xl font-bold text-primary">
                      ${product.price}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Stock: {product.stock} left
                    </p>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <span>⭐</span>
                      <span>
                        {product.reviews.length > 0 
                          ? (product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length).toFixed(1)
                          : 'No reviews'
                        }
                      </span>
                      <span>({product.reviews.length} reviews)</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Link href={`/products/${generateSlug(product.name)}`} className="w-full">
                    <Button className="w-full" variant="default">
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
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