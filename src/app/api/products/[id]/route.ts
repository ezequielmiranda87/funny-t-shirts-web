import { NextRequest, NextResponse } from 'next/server';
import { getProductFullDetail, getRelatedProducts } from '@/lib/db-service';
import { ProductDetailResponse } from '@/types/api';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Product ID is required',
          message: 'Missing product ID parameter' 
        },
        { status: 400 }
      );
    }

    // Get product detail
    const product = await getProductFullDetail(id);
    
    if (!product) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Product not found',
          message: `Product with ID "${id}" does not exist` 
        },
        { status: 404 }
      );
    }

    // Get related products
    const relatedProducts = await getRelatedProducts(id, 4);
    
    const response: ProductDetailResponse = {
      product,
      relatedProducts
    };
    
    return NextResponse.json({
      success: true,
      data: response,
      message: `Retrieved product details for "${product.name}"`
    });
    
  } catch (error) {
    console.error('Error in product detail API:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch product details',
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}