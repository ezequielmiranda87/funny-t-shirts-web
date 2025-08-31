import { Metadata } from 'next';
import { Product } from '@/app/api/products/route';

// Site configuration for SEO
export const siteConfig = {
  name: 'Funny T-Shirts Shop',
  description: 'Discover hilarious t-shirt designs that will make you and others laugh. Premium quality funny t-shirts for every personality.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://funny-t-shirts-shop.com',
  ogImage: '/images/og-image.jpg',
  creator: 'Funny T-Shirts Shop',
  keywords: [
    'funny t-shirts',
    'humor apparel',
    'comedy shirts',
    'graphic tees',
    'joke shirts',
    'sarcastic t-shirts',
    'witty clothing',
    'funny gifts',
    'novelty shirts',
    'humorous apparel'
  ],
};

// Generate metadata for home page
export function generateHomeMetadata(): Metadata {
  return {
    title: `${siteConfig.name} - Hilarious T-Shirts for Every Personality`,
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: '@funnytshirtsshop',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Generate metadata for product pages
export function generateProductMetadata(product: Product): Metadata {
  const title = `${product.name} - ${siteConfig.name}`;
  const description = `${product.description} Only $${product.price}. ${product.stock > 0 ? 'In stock' : 'Out of stock'}.`;
  const productUrl = `${siteConfig.url}/products/${generateSlug(product.name)}`;
  
  return {
    title,
    description,
    keywords: [
      ...siteConfig.keywords,
      product.category.toLowerCase(),
      'funny',
      'humor',
      't-shirt',
      'apparel',
      'gift'
    ],
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: productUrl,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.image],
      creator: '@funnytshirtsshop',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Generate metadata for category pages
export function generateCategoryMetadata(
  category: string,
  productCount: number,
  products: Product[]
): Metadata {
  const title = `${category} T-Shirts - ${siteConfig.name}`;
  const description = `Explore our collection of ${productCount} hilarious ${category.toLowerCase()} t-shirts. Premium quality funny apparel with unique designs.`;
  const categoryUrl = `${siteConfig.url}/categories/${category.toLowerCase()}`;
  
  return {
    title,
    description,
    keywords: [
      ...siteConfig.keywords,
      category.toLowerCase(),
      `${category.toLowerCase()} t-shirts`,
      `funny ${category.toLowerCase()}`,
      'collection'
    ],
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: categoryUrl,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: products[0]?.image || siteConfig.ogImage,
          width: 800,
          height: 800,
          alt: `${category} T-Shirts Collection`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [products[0]?.image || siteConfig.ogImage],
      creator: '@funnytshirtsshop',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Generate structured data (JSON-LD) for products
export function generateProductStructuredData(product: Product) {
  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    url: `${siteConfig.url}/products/${generateSlug(product.name)}`,
    sku: product.id,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: siteConfig.name,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      url: `${siteConfig.url}/products/${generateSlug(product.name)}`,
    },
    aggregateRating: product.reviews.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: averageRating.toFixed(1),
      reviewCount: product.reviews.length,
    } : undefined,
    review: product.reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.userName,
      },
      datePublished: review.date,
      reviewBody: review.comment,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
}

// Generate structured data for the website/organization
export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo.png`,
    sameAs: [
      'https://twitter.com/funnytshirtsshop',
      'https://facebook.com/funnytshirtsshop',
      'https://instagram.com/funnytshirtsshop',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  };
}

// Helper function to generate slugs (consistent with other files)
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}