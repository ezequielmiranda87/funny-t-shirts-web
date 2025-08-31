import { NextRequest, NextResponse } from 'next/server';
import { getProductsCatalog } from '@/lib/db-service';
import { CatalogOptions } from '@/types/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const options: CatalogOptions = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
      category: searchParams.get('category') || undefined,
      sort: searchParams.get('sort') as CatalogOptions['sort'] || 'newest'
    };

    // Validate parameters
    if (options.page! < 1) options.page = 1;
    if (options.limit! < 1) options.limit = 12;
    if (options.limit! > 50) options.limit = 50; // Prevent excessive requests

    // Get paginated catalog
    const catalog = await getProductsCatalog(options);
    
    return NextResponse.json({
      success: true,
      data: catalog,
      message: `Retrieved ${catalog.products.length} products for page ${options.page}`
    });
    
  } catch (error) {
    console.error('Error in catalog API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch product catalog',
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}