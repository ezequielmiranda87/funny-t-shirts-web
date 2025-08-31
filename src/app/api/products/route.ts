import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/db-service';

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


// Product data is now imported from shared module

export async function GET() {
  try {
    // Get all products from database
    const products = await getAllProducts();
    
    return NextResponse.json({
      products,
      total: products.length,
      message: 'Database API - lowdb integration complete'
    });
  } catch (error) {
    console.error('Error fetching products from database:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}