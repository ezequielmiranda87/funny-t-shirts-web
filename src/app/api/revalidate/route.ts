import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, secret } = body;

    // Verify revalidation secret if configured
    if (process.env.REVALIDATION_SECRET && secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Validate path parameter
    if (!path || typeof path !== 'string') {
      return NextResponse.json(
        { message: 'Path is required' },
        { status: 400 }
      );
    }

    // Revalidate the specific path
    revalidatePath(path);

    // Also revalidate related paths based on the path type
    if (path.startsWith('/products/')) {
      // If a product page is revalidated, also revalidate home and category pages
      revalidatePath('/');
      
      // Extract product category if available and revalidate category page
      // This would be enhanced when we have proper backend integration
    } else if (path.startsWith('/categories/')) {
      // If a category page is revalidated, also revalidate home
      revalidatePath('/');
    } else if (path === '/') {
      // If home is revalidated, revalidate all category pages
      // This would be enhanced with proper category enumeration
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path,
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    );
  }
}

// Handle GET requests with path as query parameter for easier webhook integration
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const path = searchParams.get('path');
    const secret = searchParams.get('secret');

    if (process.env.REVALIDATION_SECRET && secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    if (!path) {
      return NextResponse.json(
        { message: 'Path query parameter is required' },
        { status: 400 }
      );
    }

    revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path,
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    );
  }
}