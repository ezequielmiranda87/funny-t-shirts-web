import { NextRequest, NextResponse } from 'next/server';
import { getProductsCatalog } from '@/lib/db-service';
import { CatalogOptions } from '@/types/api';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  reviews: Review[];
  similarProducts: string[];
  category: string;
  stock: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate query parameters with better error handling
    const rawPage = searchParams.get('page');
    const rawLimit = searchParams.get('limit');
    const rawMinPrice = searchParams.get('min_price');
    const rawMaxPrice = searchParams.get('max_price');
    const rawMinRating = searchParams.get('min_rating');
    
    // Validate numeric parameters
    const page = rawPage ? parseInt(rawPage) : 1;
    const limit = rawLimit ? parseInt(rawLimit) : 12;
    const minPrice = rawMinPrice ? parseFloat(rawMinPrice) : undefined;
    const maxPrice = rawMaxPrice ? parseFloat(rawMaxPrice) : undefined;
    const minRating = rawMinRating ? parseFloat(rawMinRating) : undefined;

    // Validation with proper error responses
    if (rawPage && (isNaN(page) || page < 1)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid page parameter',
          message: 'Page must be a positive integer'
        },
        { status: 400 }
      );
    }

    if (rawLimit && (isNaN(limit) || limit < 1 || limit > 100)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid limit parameter',
          message: 'Limit must be between 1 and 100'
        },
        { status: 400 }
      );
    }

    if (minPrice !== undefined && (isNaN(minPrice) || minPrice < 0)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid min_price parameter',
          message: 'min_price must be a positive number'
        },
        { status: 400 }
      );
    }

    if (maxPrice !== undefined && (isNaN(maxPrice) || maxPrice < 0)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid max_price parameter',
          message: 'max_price must be a positive number'
        },
        { status: 400 }
      );
    }

    if (minPrice && maxPrice && minPrice > maxPrice) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid price range',
          message: 'min_price cannot be greater than max_price'
        },
        { status: 400 }
      );
    }

    if (minRating !== undefined && (isNaN(minRating) || minRating < 0 || minRating > 5)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid min_rating parameter',
          message: 'min_rating must be between 0 and 5'
        },
        { status: 400 }
      );
    }

    const validSortOptions = ['newest', 'oldest', 'price-asc', 'price-desc', 'rating-desc', 'rating-asc', 'name-asc', 'name-desc', 'popularity'];
    const sort = searchParams.get('sort') || 'newest';
    
    if (!validSortOptions.includes(sort)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid sort parameter',
          message: `sort must be one of: ${validSortOptions.join(', ')}`
        },
        { status: 400 }
      );
    }

    // Enhanced catalog options
    const options: CatalogOptions = {
      // Pagination
      page,
      limit,
      
      // Search & Filtering
      q: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice,
      maxPrice,
      minRating,
      inStock: searchParams.get('in_stock') === 'true' ? true : undefined,
      
      // Sorting
      sort: sort as CatalogOptions['sort']
    };

    // Get paginated catalog
    const startTime = Date.now();
    const catalog = await getProductsCatalog(options);
    const processingTime = Date.now() - startTime;
    
    // Enhanced response format
    return NextResponse.json({
      success: true,
      data: catalog.products,
      pagination: catalog.pagination,
      categories: catalog.categories,
      filters: {
        applied: {
          search: options.q || null,
          category: options.category || null,
          priceRange: minPrice || maxPrice ? { min: minPrice, max: maxPrice } : null,
          minRating: minRating || null,
          inStock: options.inStock || null,
          sort: sort
        }
      },
      meta: {
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
        totalResults: catalog.pagination.total
      }
    });
    
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch products',
        meta: {
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}