import { NextResponse } from 'next/server';
import { getCategoriesWithCounts } from '@/lib/db-service';
import { CategoriesResponse } from '@/types/api';

export async function GET() {
  try {
    // Get categories with product counts
    const categories = await getCategoriesWithCounts();
    
    const response: CategoriesResponse = {
      categories
    };
    
    return NextResponse.json({
      success: true,
      data: response,
      message: `Retrieved ${categories.length} product categories`
    });
    
  } catch (error) {
    console.error('Error in categories API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch categories',
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}