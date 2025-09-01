import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductCardSkeleton() {
  return (
    <Card className="w-full h-full flex flex-col overflow-hidden" aria-label="Loading product information">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Skeleton className="w-full h-full" aria-label="Loading product image" />
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" aria-label="Loading category" />
          <Skeleton className="h-4 w-full" aria-label="Loading product name" />
          <Skeleton className="h-4 w-3/4" aria-label="Loading product name continuation" />
          <Skeleton className="h-6 w-20" aria-label="Loading price" />
          <Skeleton className="h-3 w-24" aria-label="Loading stock information" />
          <Skeleton className="h-3 w-32" aria-label="Loading rating information" />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-9 w-full" aria-label="Loading view details button" />
      </CardFooter>
    </Card>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      role="status"
      aria-live="polite"
      aria-label={`Loading ${count} product cards`}
    >
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}