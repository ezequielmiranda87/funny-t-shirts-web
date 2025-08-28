'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Product } from '@/app/api/products/route';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  allProducts: Product[];
}

export default function ProductModal({ product, isOpen, onClose, allProducts }: ProductModalProps) {
  if (!product) return null;

  // Get similar products based on the similarProducts array
  const similarProducts = allProducts.filter(p => 
    product.similarProducts.includes(p.id)
  ).slice(0, 3);

  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
          <DialogDescription>
            <Badge variant="secondary">{product.category}</Badge>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              {/* Intentionally using regular img tag for slower loading */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            
            {/* Product Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-primary">
                  ${product.price}
                </p>
                <p className="text-sm text-muted-foreground">
                  {product.stock} in stock
                </p>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <span>⭐ {averageRating.toFixed(1)}</span>
                <span>({product.reviews.length} reviews)</span>
              </div>
              
              <Button className="w-full" size="lg">
                Add to Cart - ${product.price}
              </Button>
            </div>
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
            
            {/* Reviews */}
            <div>
              <h3 className="font-semibold mb-3">Customer Reviews</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {product.reviews.map((review) => (
                  <Card key={review.id} className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{review.userName}</p>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs">
                          {'⭐'.repeat(review.rating)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {review.comment}
                    </p>
                  </Card>
                ))}
                
                {product.reviews.length === 0 && (
                  <p className="text-sm text-muted-foreground">No reviews yet.</p>
                )}
              </div>
            </div>
            
            {/* Similar Products */}
            <div>
              <h3 className="font-semibold mb-3">You Might Also Like</h3>
              <div className="grid grid-cols-1 gap-3">
                {similarProducts.map((similarProduct) => (
                  <Card key={similarProduct.id} className="p-3">
                    <div className="flex space-x-3">
                      <img
                        src={similarProduct.image}
                        alt={similarProduct.name}
                        className="w-16 h-16 object-cover rounded"
                        loading="eager"
                      />
                      <div className="flex-grow">
                        <p className="text-sm font-medium line-clamp-2">
                          {similarProduct.name}
                        </p>
                        <p className="text-sm font-bold text-primary">
                          ${similarProduct.price}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}