import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/app/api/products/route';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getProductBySlug, getProductsForStaticGeneration, generateSlug } from '@/lib/db-service';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Use shared slug generation function from products-data

// Fetch product by slug with optimized fallback strategy
async function getProductBySlugWithFallback(slug: string): Promise<Product | null> {
  try {
    // For development, always use static data first for performance
    if (process.env.NODE_ENV === 'development') {
      const { getInitialProductsForBuild } = await import('@/lib/database-static-data');
      const products = getInitialProductsForBuild();
      return products.find(p => generateSlug(p.name) === slug) || null;
    }
    
    // During build time, use static data directly
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      const { getInitialProductsForBuild } = await import('@/lib/database-static-data');
      const products = getInitialProductsForBuild();
      return products.find(p => generateSlug(p.name) === slug) || null;
    }
    
    // For production/Vercel runtime, use database service
    if (process.env.VERCEL_ENV || process.env.NODE_ENV === 'production') {
      return await getProductBySlug(slug);
    }
    
    // Fallback to static data
    const { getInitialProductsForBuild } = await import('@/lib/database-static-data');
    const products = getInitialProductsForBuild();
    return products.find(p => generateSlug(p.name) === slug) || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    // Final fallback to static data
    try {
      const { getInitialProductsForBuild } = await import('@/lib/database-static-data');
      const products = getInitialProductsForBuild();
      return products.find(p => generateSlug(p.name) === slug) || null;
    } catch (staticError) {
      console.error('Static data fallback also failed:', staticError);
      return null;
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlugWithFallback(slug);

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
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
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

// Generate static params for all products at build time
export async function generateStaticParams() {
  try {
    // Use database service to get all products for static generation
    const products = await getProductsForStaticGeneration();
    return products.map((product) => ({
      slug: generateSlug(product.name),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array to prevent build failure
    return [];
  }
}

// Generate metadata for SEO (will be enhanced in Phase 4)
export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlugWithFallback(slug);
  
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