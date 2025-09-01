'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header, { Breadcrumb } from '@/components/Header';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProductError({ error, reset }: ErrorProps) {
  // Create breadcrumbs for navigation
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/' },
    { label: 'Error Loading Product', href: '', active: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Header */}
      <Header
        showBackButton={true}
        backButtonText="Back to Shop"
        backButtonHref="/"
        breadcrumbs={breadcrumbs}
        title="Product Error"
        subtitle="There was a problem loading this product"
        cartItemCount={0}
      />

      {/* Error Content */}
      <main id="main-content" className="container mx-auto px-4 py-8" role="main">
        <div className="max-w-md mx-auto">
          <Card role="alert" aria-labelledby="error-title">
            <CardHeader>
              <CardTitle id="error-title" className="text-center text-red-600">
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                We could not load the product details. This might be a temporary issue.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <details className="text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded">
                    Error details (development only)
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                    {error.message}
                  </pre>
                </details>
              )}
              
              <nav aria-label="Error recovery options">
                <div className="flex flex-col space-y-2">
                  <Button 
                    onClick={reset}
                    className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    aria-describedby="retry-help"
                  >
                    Try Again
                  </Button>
                  <div id="retry-help" className="sr-only">
                    Retry loading the product page
                  </div>
                  
                  <Button 
                    variant="outline" 
                    asChild
                    className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <Link href="/" aria-describedby="home-help">
                      Back to Home
                    </Link>
                  </Button>
                  <div id="home-help" className="sr-only">
                    Return to the homepage to browse all products
                  </div>
                </div>
              </nav>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}