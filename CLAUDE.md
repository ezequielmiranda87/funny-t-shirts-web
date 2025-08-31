# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start development server (localhost:3000)
npm run build      # Build for production and validate static generation
npm start          # Start production server
npm run lint       # Run ESLint
```

**Important**: Always run `npm run build` after making changes to validate that static generation still works correctly for Vercel deployment.

## Architecture & Structure

This is a Next.js 15 e-commerce demo application for funny t-shirts with optimized static generation and performance.

### Key Architecture Components

- **Static Generation**: All product pages (`/products/[slug]`) are pre-generated at build time using `generateStaticParams()`
- **Shared Data Module**: `src/lib/products-data.ts` contains centralized mock data used by both API routes and static generation
- **Mixed Rendering**: Home page uses client-side data fetching, product/category pages use static generation
- **UI Components**: Built with shadcn/ui components (Radix UI + Tailwind CSS)

### Data Architecture 

**Core Pattern**: Shared data module approach for consistency between static generation and runtime

1. **Shared Data Source**: `src/lib/products-data.ts` exports:
   - `mockProducts`: Array of 12 t-shirt products with full details (reviews, categories, stock)
   - `generateSlug()`: Consistent slug generation function used across the app

2. **Static Generation**: Product pages use `generateStaticParams()` with shared data to pre-generate all routes
3. **API Routes**: Use the same shared data, avoiding duplication
4. **Category Pages**: Filter shared data directly instead of API calls for better performance

### Routing Structure

- **Home (`/`)**: Client-rendered product grid with category navigation
- **Product Pages (`/products/[slug]`)**: Statically generated with ISR, includes full product details and reviews
- **Category Pages (`/categories/[category]`)**: Server-rendered with shared data filtering
- **API (`/api/products`)**: Returns all products, used primarily by home page

### Vercel Deployment Considerations

- **Critical**: Product pages use `process.env.VERCEL_ENV` detection to avoid API calls during build
- **Fallback Strategy**: Multiple fallback layers (API → shared data → error handling) for reliability
- **Static Assets**: All product routes generate statically, confirmed in build output

### Slug Generation Strategy

Uses consistent slug generation across all components:
```typescript
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
```

### Performance Optimizations

- **No API Simulation Delays**: Removed `simulateSlowAPI()` for production
- **Direct Data Access**: Category pages bypass API calls, filter shared data directly
- **Static Generation**: All product routes pre-built, no runtime data fetching needed
- **Image Optimization**: Uses Next.js `<Image>` component with proper sizing

### Type System

- **Product Interface**: Defined in `src/app/api/products/route.ts`
- **Shared Types**: Product and Review interfaces used consistently across components
- **Full TypeScript**: Complete type coverage with strict configuration

### UI Component System

- **shadcn/ui**: Tailwind-based component library with consistent styling
- **Interactive Elements**: Product cards have hover effects and cursor pointer
- **Responsive Design**: Mobile-first grid layouts with proper breakpoints

### File Organization Patterns

- **API Routes**: `src/app/api/*/route.ts` - Next.js App Router endpoints
- **Page Components**: Feature-specific pages with co-located loading/error components  
- **Shared Utilities**: `src/lib/*` for cross-cutting concerns (data, utilities, API config)
- **UI Components**: Reusable components in `src/components/` with ui primitives in `/ui`

### Development Guidelines

- **Static-First**: Prefer static generation over server rendering when possible
- **Shared Data**: Always use `src/lib/products-data.ts` instead of duplicating product data
- **Build Validation**: Test builds locally before deployment to catch static generation issues
- **Consistent Slugs**: Use the shared `generateSlug()` function across all components