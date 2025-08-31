import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
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
        </div>
      </header>

      {/* 404 Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-6xl mb-4">😵</CardTitle>
              <CardTitle className="text-center">
                Page Not Found
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                This page does not exist or might have been moved. Do not worry, our funny t-shirts are still here!
              </p>
              
              <div className="flex flex-col space-y-2">
                <Button asChild>
                  <Link href="/">Browse T-Shirts</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Go Back Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}