import { Skeleton } from '@/components/ui/skeleton';

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-12" />
            <span className="mx-2 text-muted-foreground">/</span>
            <Skeleton className="h-4 w-16" />
            <span className="mx-2 text-muted-foreground">/</span>
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </header>

      {/* Product Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image Skeleton */}
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
          
          {/* Product Details Skeleton */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <Skeleton className="h-6 w-20 mb-3" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-10 w-24 mb-4" />
              <div className="flex items-center space-x-2 mb-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            
            {/* Description */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            
            {/* Buttons */}
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
            
            {/* Reviews */}
            <div className="border-t pt-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}