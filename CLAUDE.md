# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start development server (localhost:3000)
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

## Architecture & Structure

This is a Next.js 15 e-commerce demo application showcasing funny t-shirt products with an intentionally inefficient loading pattern for performance demonstration purposes.

### Key Components Architecture

- **App Router Structure**: Uses Next.js 15 App Router with TypeScript
- **UI Components**: Built with shadcn/ui components (Radix UI + Tailwind CSS)
- **State Management**: Client-side React state (useState/useEffect) for product data
- **Data Layer**: Mock API endpoints with simulated slow responses (2-second delay)

### Core Application Flow

1. **Product Loading**: `src/app/page.tsx` fetches ALL products at once via `/api/products`
2. **Product Display**: `ProductCard` components render in a responsive grid
3. **Product Details**: `ProductModal` shows detailed view with reviews and similar products
4. **API Simulation**: `src/app/api/products/route.ts` contains 12 hardcoded products with reviews

### Important Implementation Details

- **Performance Demo**: Intentionally inefficient - loads all product data upfront
- **Image Loading**: Uses regular `<img>` tags with `loading="eager"` instead of Next.js Image optimization
- **Mock Data**: Products include full details (reviews, similar products, stock) loaded immediately
- **Type Safety**: Full TypeScript coverage with shared `Product` and `Review` interfaces

### UI Component System

- **shadcn/ui**: New York style variant with CSS variables
- **Tailwind CSS**: Utility-first styling with custom component variants
- **Component Path**: `@/components/ui/*` for reusable UI primitives
- **Icons**: Lucide React icon library

### File Structure Patterns

- **API Routes**: `src/app/api/*/route.ts` - Next.js App Router API endpoints
- **Components**: Organized by feature (`ProductCard`, `ProductModal`) and UI primitives (`/ui`)
- **Type Definitions**: Shared interfaces in API route files (`Product`, `Review`)

### Development Notes

- This codebase demonstrates performance anti-patterns intentionally
- All products load simultaneously rather than using pagination or lazy loading
- Images are not optimized and load eagerly for demonstration purposes