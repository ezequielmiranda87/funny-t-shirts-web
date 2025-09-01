import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header, { Breadcrumb } from '@/components/Header';

export default function NotFound() {
  // Create breadcrumbs for navigation
  const breadcrumbs: Breadcrumb[] = [
    { label: 'Home', href: '/' },
    { label: '404 - Page Not Found', href: '', active: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Professional Header */}
      <Header
        showBackButton={true}
        backButtonText="Back to Shop"
        backButtonHref="/"
        breadcrumbs={breadcrumbs}
        cartItemCount={0}
      />

      {/* 404 Content */}
      <main id="main-content" className="container mx-auto px-4 py-16" role="main">
        <div className="max-w-md mx-auto">
          <Card role="alert" aria-labelledby="error-title">
            <CardHeader>
              <div className="text-center text-6xl mb-4" aria-hidden="true" role="img" aria-label="Confused emoji">
                😵
              </div>
              <CardTitle id="error-title" className="text-center">
                404 - Page Not Found
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                This page does not exist or might have been moved. Don&apos;t worry, our funny t-shirts are still here!
              </p>
              
              <nav aria-label="Error page navigation">
                <div className="flex flex-col space-y-2">
                  <Button asChild className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <Link href="/" aria-describedby="browse-help">
                      Browse T-Shirts
                    </Link>
                  </Button>
                  <div id="browse-help" className="sr-only">
                    Navigate to the main shop page to browse all funny t-shirts
                  </div>
                  
                  <Button variant="outline" asChild className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <Link href="/" aria-describedby="home-help">
                      Go Back Home
                    </Link>
                  </Button>
                  <div id="home-help" className="sr-only">
                    Return to the homepage
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