import { NextResponse } from 'next/server';
import { mockProducts } from '@/lib/products-data';

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
  // Return ALL products with ALL their details at once
  return NextResponse.json({
    products: mockProducts,
    total: mockProducts.length,
    message: 'Mock API - ready for backend integration'
  });
}