import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/app/api/products/route';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getProductBySlug, getProductsForStaticGeneration, generateSlug } from '@/lib/db-service';
import Header, { Breadcrumb } from '@/components/Header';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Use shared slug generation function from products-data

// Fetch product by slug using database service consistently
async function getProductBySlugWithFallback(slug: string): Promise<Product | null> {
  try {
    // Use database service directly - it handles initialization
    return await getProductBySlug(slug);
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
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

  // Create breadcrumbs for navigation
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/', active: false },
    { label: product.name, href: '', active: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Header with Back Button */}
      <Header
        showBackButton={true}
        backButtonText="Back to Shop"
        backButtonHref="/"
        breadcrumbs={breadcrumbs}
        title={product.name}
        subtitle={`${product.category} • $${product.price} • ${product.stock} in stock`}
        cartItemCount={0}
      />

      {/* Product Content */}
      <main id="main-content" className="container mx-auto px-4 py-8" role="main">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg border">
              <Image
                src={product.image}
                alt={`${product.name} - ${product.category} funny t-shirt design featuring humorous artwork`}
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
            <header>
              <Badge variant="secondary" className="mb-3" aria-hidden="true">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-4xl font-bold text-primary mb-4">
                <span className="sr-only">Price: </span>
                ${product.price}
              </p>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                <span aria-hidden="true">⭐ {averageRating.toFixed(1)}</span>
                <span className="sr-only">
                  Average rating: {averageRating.toFixed(1)} out of 5 stars
                </span>
                <span aria-hidden="true">({product.reviews.length} reviews)</span>
                <span className="sr-only">
                  {product.reviews.length} customer review{product.reviews.length !== 1 ? 's' : ''}
                </span>
                <span aria-hidden="true">•</span>
                <span>
                  <span className="sr-only">Stock available: </span>
                  {product.stock} in stock
                </span>
              </div>
            </header>
            
            {/* Description */}
            <section aria-labelledby="product-description">
              <h2 id="product-description" className="sr-only">Product Description</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </section>
            
            {/* Add to Cart */}
            <section aria-labelledby="purchase-options">
              <h2 id="purchase-options" className="sr-only">Purchase Options</h2>
              <div className="space-y-4">
                <Button className="w-full" size="lg" aria-describedby="add-to-cart-help">
                  Add to Cart - ${product.price}
                </Button>
                <div id="add-to-cart-help" className="sr-only">
                  Add this {product.name} t-shirt to your shopping cart for ${product.price}
                </div>
                <Button variant="outline" className="w-full" size="lg" aria-describedby="buy-now-help">
                  Buy Now
                </Button>
                <div id="buy-now-help" className="sr-only">
                  Purchase this {product.name} t-shirt immediately for ${product.price}
                </div>
              </div>
            </section>
            
            {/* Reviews */}
            <section className="border-t pt-6" aria-labelledby="reviews-heading">
              <h2 id="reviews-heading" className="font-semibold mb-4">Customer Reviews</h2>
              <div className="space-y-4 max-h-64 overflow-y-auto" role="region" aria-label="Customer reviews list">
                {product.reviews.map((review) => (
                  <Card key={review.id} className="p-4" role="article" aria-labelledby={`review-${review.id}-author`}>
                    <div className="flex items-center justify-between mb-2">
                      <p id={`review-${review.id}-author`} className="font-medium text-sm">{review.userName}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm" aria-label={`${review.rating} out of 5 stars`}>
                          <span aria-hidden="true">
                            {'⭐'.repeat(review.rating)}
                          </span>
                        </span>
                        <time className="text-xs text-muted-foreground" dateTime={review.date}>
                          {new Date(review.date).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </Card>
                ))}
                
                {product.reviews.length === 0 && (
                  <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            </section>
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