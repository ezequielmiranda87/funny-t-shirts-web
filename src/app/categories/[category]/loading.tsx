import { Skeleton } from '@/components/ui/skeleton';

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-12" />
            <span className="mx-2 text-muted-foreground">/</span>
            <Skeleton className="h-4 w-20" />
            <span className="mx-2 text-muted-foreground">/</span>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </header>

      {/* Category Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96 mb-4" />
          
          {/* Category Links Skeleton */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              {/* Image Skeleton */}
              <Skeleton className="aspect-[4/3] w-full" />
              
              {/* Content Skeleton */}
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              
              {/* Button Skeleton */}
              <div className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}