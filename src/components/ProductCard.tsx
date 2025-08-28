'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/app/api/products/route';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export default function ProductCard({ product, onViewDetails }: ProductCardProps) {
  return (
    <Card className="w-full h-full flex flex-col overflow-hidden py-0">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* Intentionally using regular img tag instead of Next.js Image for slower loading */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="eager" // Force immediate loading instead of lazy loading
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
        <Button 
          onClick={() => onViewDetails(product)} 
          className="w-full"
          variant="default"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}