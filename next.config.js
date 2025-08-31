/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experimental features disabled for stability (will be enabled when upgrading to canary)
  experimental: {},
  
  // Configure static generation behavior
  output: 'standalone', // Optimized for deployment
  
  // Image optimization settings (will be enhanced in Phase 3)
  images: {
    // Allow external images for now (mock API uses picsum.photos)
    domains: ['picsum.photos'],
    // Enable modern formats
    formats: ['image/webp', 'image/avif'],
  },
  
  // Build performance optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers for better caching and performance
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/products/:slug*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;