import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/app/api/products/route';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ProductPageProps {
  params: Promise<{
    slug: string;
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

// Fetch product by slug from API
async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/products`, {
      cache: 'no-store' // For now, until we implement proper caching
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    const product = data.products.find((p: Product) => 
      generateSlug(p.name) === slug
    );
    
    return product || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

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
            <span className="text-sm">Products</span>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-sm text-foreground">{product.name}</span>
          </nav>
        </div>
      </header>

      {/* Product Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <Badge variant="secondary" className="mb-3">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-4xl font-bold text-primary mb-4">
                ${product.price}
              </p>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <span>⭐ {averageRating.toFixed(1)}</span>
                <span>({product.reviews.length} reviews)</span>
                <span>•</span>
                <span>{product.stock} in stock</span>
              </div>
            </div>
            
            {/* Description */}
            <div>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
            
            {/* Add to Cart */}
            <div className="space-y-4">
              <Button className="w-full" size="lg">
                Add to Cart - ${product.price}
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Buy Now
              </Button>
            </div>
            
            {/* Reviews */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Customer Reviews</h3>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {product.reviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{review.userName}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          {'⭐'.repeat(review.rating)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </Card>
                ))}
                
                {product.reviews.length === 0 && (
                  <p className="text-sm text-muted-foreground">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Generate metadata for SEO (will be enhanced in Phase 4)
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Funny T-Shirts Shop`,
    description: product.description,
  };
}