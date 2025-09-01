import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductSummary } from '@/types/api';

interface ProductCardProps {
  product: ProductSummary;
  priority?: boolean;
}

// Generate slug from product name (consistent with backend logic)
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <article className="w-full h-full">
      <Link 
        href={`/products/${generateSlug(product.name)}`} 
        className="block w-full h-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
        aria-labelledby={`product-title-${product.id}`}
        aria-describedby={`product-details-${product.id}`}
      >
        <Card className="w-full h-full flex flex-col overflow-hidden py-0 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group focus-within:shadow-lg focus-within:scale-[1.02]">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={product.image}
              alt={`${product.name} - ${product.category} t-shirt design`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              priority={priority}
            />
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow p-4">
          <div className="space-y-2">
            <Badge variant="secondary" className="text-xs" aria-hidden="true">
              {product.category}
            </Badge>
            <h3 id={`product-title-${product.id}`} className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {product.name}
            </h3>
            <div id={`product-details-${product.id}`}>
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
                    {product.reviewCount > 0 
                      ? `Rating: ${product.avgRating.toFixed(1)} out of 5 stars`
                      : 'No ratings yet'
                    }
                  </span>
                  <span aria-hidden="true">
                    {product.reviewCount > 0 
                      ? product.avgRating.toFixed(1)
                      : 'No reviews'
                    }
                  </span>
                </span>
                <span aria-hidden="true">({product.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200" 
            variant="outline"
            tabIndex={-1}
            aria-hidden="true"
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
      </Link>
    </article>
  );
}