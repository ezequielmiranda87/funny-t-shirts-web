# Funny T-Shirt Shop — Full-Stack Plan (Rendering + SEO + Perf)

## Team
- **Frontend Engineer**: Next.js app, routing, UI, SEO, image optimization, performance monitoring
- **Backend Developer**: API design, database, webhooks, cache headers, CDN setup, infrastructure
- **Founder**: Product decisions, copy approval, final sign-offs

---

## Phase 0 — Baseline & Architecture Planning

### Current State Analysis
- **SPA with modal PDP**: Single route `/` with `ProductModal` for details
- **Mock Next.js API**: `src/app/api/products/route.ts` with 12 hardcoded products
- **All-at-once loading**: Fetches complete product data including reviews/similar products
- **Performance bottlenecks**: 2-second artificial API delay, eager image loading, no optimization

### Tasks
**Frontend Engineer**
- **Capture baseline performance**:
  - Run Lighthouse audit on `localhost:3000` (current SPA)
  - Use WebPageTest for multi-location performance testing
  - Measure current bundle size with `npm run build` and analyze `.next/static/`
  - Document Core Web Vitals: LCP, CLS, INP on home page
- **Analyze existing architecture**:
  - Document current component tree: `page.tsx` → `ProductCard` → `ProductModal`
  - Map data flow: API call → state management → component rendering
  - Identify performance bottlenecks: 2s API delay, eager image loading
- **Create baseline documentation**:
  - Create `/docs/baseline.md` with current metrics
  - Include screenshots of current Lighthouse scores
  - Document bundle composition and largest chunks

**Backend Developer**  
- **Review current mock implementation**:
  - Analyze existing `src/app/api/products/route.ts` structure
  - Document current Product interface and mock data format
  - Understand artificial 2s delay implementation and removal strategy
- **Design production API architecture**:
  - Choose backend stack (recommend Node.js/Express or FastAPI for compatibility)
  - Design database schema for products, categories, reviews, images
  - Plan API endpoints with proper REST conventions
- **Create technical documentation**:
  - Document API contracts and data models in `/docs/api-design.md`
  - Include database ERD and migration scripts
  - Define environment setup and deployment requirements
- **Plan integration strategy**:
  - Design gradual migration from Next.js API routes to external backend
  - Plan development/staging/production environment setup

**Founder**
- Approve backend technology choices and hosting strategy
- Define product catalog requirements (categories, inventory, pricing)
- Approve URL structure and SEO strategy

### Current vs Target Architecture

**Current (Mock)**:
```typescript
// Single interface with everything
interface Product {
  id, name, price, image, description, reviews[], 
  similarProducts[], category, stock
}
```

**Target (Real Backend)**:
```typescript
// Separate interfaces for different use cases
interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: ProductImage;
  category: string;
  stock: number;
}

interface ProductDetail extends ProductSummary {
  description: string;
  reviews: Review[];
  similarProducts: ProductSummary[];
  images: ProductImage[];
  sku: string;
  updatedAt: Date;
}
```

---

## Phase 1 — Architecture & Routing Implementation

### Current → Target Architecture  
**Current**: SPA (`/`) + `ProductModal` → **Target**: Multi-page (`/`, `/products/[slug]`, `/categories/[category]`)

### Tasks
**Frontend Engineer**
- **Create new route structure**:
  - Create `src/app/products/[slug]/page.tsx` - new PDP page component
  - Create `src/app/categories/[category]/page.tsx` - category listing page
  - Modify `src/app/page.tsx` to remove modal logic, keep product grid
- **Refactor existing components**:
  - Delete `src/components/ProductModal.tsx` entirely
  - Update `src/components/ProductCard.tsx`:
    - Replace `onViewDetails` prop with Next.js `<Link>` to `/products/[slug]`
    - Remove onClick handler for modal
  - Create new `src/components/ProductDetailView.tsx` for PDP page content
- **Add proper loading states**:
  - Create `src/components/ui/skeleton.tsx` loading components (already exists)
  - Add loading.tsx files for each route
  - Add error.tsx files for error boundaries
- **Integration preparation**:
  - Create utility functions for API calls in `src/lib/api.ts`
  - Prepare for backend integration with environment variables

**Backend Developer**
- **Set up backend infrastructure**:
  - Choose and set up database (PostgreSQL/MySQL recommended)
  - Set up backend server (Node.js/Express or Python/FastAPI)
  - Configure development environment with Docker or direct setup
- **Implement core API endpoints**:
  - `GET /api/products` → paginated `ProductSummary[]` with query params
  - `GET /api/products/[slug]` → full `ProductDetail` with reviews
  - `GET /api/categories` → list of available categories  
  - `GET /api/categories/[category]/products` → filtered products
- **Database schema creation**:
  - Create tables: products, categories, reviews, product_images
  - Implement foreign key relationships and constraints
  - Add indexes for: slug (unique), category_id, price, created_at
- **Migrate existing mock data**:
  - Convert current 12 products from `src/app/api/products/route.ts`
  - Generate slugs from existing product names using consistent algorithm
  - Preserve all existing reviews and product relationships
- **API optimization**:
  - Implement pagination with proper metadata
  - Add caching headers and response optimization
  - Set up CORS for frontend integration

**Founder**
- Approve final URL structure and routing strategy
- Review API response formats and data requirements  
- Approve pagination strategy (pagination vs infinite scroll)

### API Contract Design
```typescript
// GET /api/products?page=1&limit=12&category=sarcastic
{
  products: ProductSummary[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
}

// GET /api/products/[slug]  
{
  product: ProductDetail;
  similarProducts: ProductSummary[];
}
```

### Database Schema Planning
```sql
-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table  
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  stock INTEGER DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_name VARCHAR(100) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product images table
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  width INTEGER,
  height INTEGER,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_product_images_product ON product_images(product_id);
```

---

## Phase 2 — Rendering Strategy (SSG + ISR)

### Target Rendering Strategy
- **Home page (`/`)**: SSG with ISR (revalidate: 300s / 5min)
- **Category pages (`/categories/[category]`)**: SSG with ISR (revalidate: 600s / 10min)  
- **Product pages (`/products/[slug]`)**: SSG with ISR (revalidate: 1800s / 30min)

### Tasks
**Frontend Engineer**
- **Implement SSG + ISR for all routes**:
  - Add `generateStaticParams()` for `/products/[slug]` and `/categories/[category]`
  - Configure appropriate `revalidate` times per page type
  - Ensure all pages can be pre-rendered at build time using backend APIs
- **Create revalidation API endpoint**:
  - `POST /api/revalidate` with path and optional secret token
  - Support revalidating specific product slugs and category pages
  - Add error handling and logging
- **Update data fetching patterns**:
  - Use `fetch()` with Next.js cache tags for revalidation
  - Implement proper error boundaries for SSG failures
- **Build-time data fetching**:
  - Fetch all product slugs from backend during build
  - Handle pagination for large product catalogs in static generation

**Backend Developer**
- **Implement on-demand revalidation system**:
  - Add product change webhooks (`product.created`, `product.updated`, `product.deleted`)
  - Webhook payload: `{ slug, id, action, updatedAt }`
  - Call frontend revalidation endpoint with HMAC signature verification
  - Implement retries and failure logging for webhook delivery
- **Add static generation endpoints**:
  - `GET /api/build/product-slugs` → return all product slugs for `generateStaticParams`
  - `GET /api/build/categories` → return all category slugs for static generation
  - Optimize these endpoints for build performance (no unnecessary data)
- **Cache optimization**:
  - Implement proper `Cache-Control` headers on all endpoints
  - Add `ETag` support for cache validation
  - Configure different cache times per endpoint type (list vs detail)
- **Database indexing for SSG**:
  - Optimize queries for bulk slug fetching
  - Add database indexes for build-time queries

**Founder**
- Approve acceptable freshness SLA (5-30 minute delays)
- Define webhook security requirements

### ISR Webhook Implementation
```typescript
// Backend webhook trigger
POST /webhooks/product-updated
{
  "product_slug": "funny-coffee-shirt",
  "action": "updated",
  "timestamp": "2024-01-15T10:00:00Z",
  "signature": "sha256=..."
}

// Frontend revalidation handler
POST /api/revalidate
{
  "path": "/products/funny-coffee-shirt",
  "secret": "revalidation-token"
}
```

### Build Performance Optimization
```typescript
// Optimized static params generation
export async function generateStaticParams() {
  // Fetch from backend build endpoint, not main API
  const response = await fetch(`${process.env.API_URL}/build/product-slugs`);
  const { slugs } = await response.json();
  
  return slugs.map((slug: string) => ({ slug }));
}
```

---

## Phase 3 — Image Performance & Core Web Vitals

### Current Image Issues
- Using `<img>` tags with `loading="eager"` (anti-pattern)
- External image URLs via picsum.photos (no optimization)
- No width/height attributes (causes CLS)
- No priority hints for LCP images

### Tasks
**Frontend Engineer**
- **Replace all `<img>` with Next.js `<Image>`**:
  - `ProductCard` component: add `sizes` prop for responsive grid
  - Product detail page: add `priority` for hero image
  - Similar products: use smaller sizes and lazy loading
- **Configure Next.js image optimization**:
  - Add `remotePatterns` in `next.config.ts` for picsum.photos
  - Enable AVIF/WebP formats in Next.js config
  - Configure image domains whitelist
- **Fix Core Web Vitals**:
  - Add proper `width` and `height` to all images (prevents CLS)
  - Use `priority` prop on LCP images (first product card, PDP hero)
  - Optimize `sizes` attribute for responsive behavior
- **Add performance monitoring**:
  - Configure Lighthouse CI in GitHub Actions
  - Set CWV budgets: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms
  - Add basic Web Vitals tracking (can use `next/web-vitals`)

**Backend Developer**
- **Implement image hosting and CDN**:
  - Set up image storage (AWS S3, Cloudinary, or similar CDN)
  - Serve images with content-hashed URLs for cache busting
  - Configure `Cache-Control: public, max-age=31536000, immutable` headers
  - Enable WebP/AVIF transformations and responsive image serving
- **Image metadata in API responses**:
  - Include width, height, and alt text in all image objects
  - Provide multiple image sizes/formats per product
  - Add primary image flag for LCP optimization
  ```typescript
  interface ProductImage {
    url: string;
    width: number;
    height: number;
    alt: string;
    isPrimary: boolean;
    formats: {
      webp?: string;
      avif?: string;
      original: string;
    };
  }
  ```
- **Image upload and processing pipeline**:
  - Automatic resizing and format conversion on upload
  - Generate multiple sizes (thumbnail, card, detail, full)
  - Optimize images for Core Web Vitals

### Next.js Configuration
```typescript
// next.config.ts updates - configure for backend CDN
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-cdn-domain.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};
```

**Founder**
- Approve image hosting solution and budget
- Review image quality vs performance trade-offs
- Approve Core Web Vitals performance targets

### Performance Budget Targets
- **LCP**: ≤ 2.5s (75th percentile)
- **CLS**: ≤ 0.1
- **INP**: ≤ 200ms  
- **Bundle size**: ≤ 250KB (First Load JS)

---

## Phase 4 — SEO Implementation

### Current SEO Issues  
- Generic page titles ("Create Next App")
- No meta descriptions
- Missing structured data
- No sitemap or robots.txt

### Tasks
**Frontend Engineer**
- **Add dynamic metadata for all pages**:
  - Home: "Funny T-Shirts Shop | Hilarious Apparel & Gifts"
  - Category: "[Category] T-Shirts | Funny T-Shirts Shop"  
  - Product: "[Product Name] | $[Price] | Funny T-Shirts Shop"
- **Implement Open Graph and Twitter Cards**:
  - Use product images for PDP social sharing
  - Add proper og:type, og:image, og:description
  - Configure Twitter card format
- **Add JSON-LD structured data**:
  - Product schema on PDP pages (Product, Offer, AggregateRating)
  - BreadcrumbList schema for navigation
  - Organization schema on home page
- **Generate sitemap.xml**:
  - Include home page, all product pages, category pages
  - Use `generateSitemaps()` API in Next.js App Router
  - Update sitemap on build with current product slugs
- **Add robots.txt**:
  - Allow crawling of all product and category pages
  - Reference sitemap location
  - Block any admin or api routes if needed

### Next.js Metadata API Implementation
```typescript
// Example for product pages
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  
  return {
    title: `${product.name} | $${product.price} | Funny T-Shirts Shop`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
      type: 'product',
    },
  };
}
```

**Backend Developer**
- **SEO data endpoints**:
  - Provide canonical URLs, updated timestamps for sitemap generation
  - Implement slug change tracking and 301 redirect management
  - Add SEO-friendly product metadata (titles, descriptions) to API responses
- **Sitemap generation support**:
  - `GET /api/sitemap/products` → all product URLs with last modified dates
  - `GET /api/sitemap/categories` → all category URLs
  - Handle large sitemaps with pagination/chunking
- **Schema.org data**:
  - Include structured data fields in product API responses
  - Provide aggregate rating data, review counts, availability status

**Founder**
- Provide SEO copy templates for titles and descriptions
- Approve robots.txt crawling permissions
- Define canonical URL structure and redirect strategy

### Structured Data Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "description": "Product Description", 
  "image": "product-image-url",
  "sku": "PROD-123",
  "brand": "Funny T-Shirts Shop",
  "offers": {
    "@type": "Offer",
    "price": "19.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://site.com/products/product-slug"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "12"
  }
}
```

### SEO-Friendly URLs
- Products: `/products/im-not-arguing-im-just-explaining` (kebab-case slugs)
- Categories: `/categories/sarcastic`, `/categories/coffee`, etc.
- Clean, descriptive URLs without IDs

---

## Phase 5 — Monitoring & Validation

### Tasks
**Frontend Engineer**
- **CI/CD Performance Gates**:
  - Add Lighthouse CI to GitHub Actions workflow
  - Set performance budgets that fail builds on regression
  - Configure bundle size monitoring with `@next/bundle-analyzer`
- **Performance Monitoring Setup**:
  - Implement Web Vitals tracking using `next/web-vitals`
  - Add basic performance logging to console/analytics
  - Track Core Web Vitals (LCP, CLS, INP) on real users
- **Development Experience**:
  - Add performance analysis commands to `package.json`
  - Document performance testing workflow in README
  - Set up local performance profiling tools

**Backend Developer**
- **API Performance Monitoring**:
  - Implement response time tracking and logging
  - Set up database query performance monitoring
  - Add API endpoint health checks and uptime monitoring
- **Webhook Monitoring**:
  - Track webhook delivery success/failure rates
  - Monitor ISR revalidation effectiveness
  - Set up alerts for webhook/revalidation failures
- **Infrastructure Optimization**:
  - Optimize database queries and add proper indexing
  - Configure API response caching and CDN settings
  - Monitor and optimize image delivery performance

**Founder**
- Review performance dashboards and approve monitoring tools
- Define SLA requirements for API response times
- Approve infrastructure monitoring and alerting strategy

### Performance Monitoring Implementation
```typescript
// app/layout.tsx - Web Vitals tracking
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### CI Performance Budget
```yaml
# .github/workflows/performance.yml
- name: Run Lighthouse CI
  run: |
    npm run build
    npx lhci autorun --config=.lighthouserc.js
```

### Success Metrics Dashboard
- **Core Web Vitals**: LCP ≤ 2.5s, CLS ≤ 0.1, INP ≤ 200ms (75th percentile)
- **Bundle Size**: First Load JS ≤ 250KB
- **Build Performance**: Static generation ≤ 30s for all pages
- **API Response Times**: Backend API responses ≤ 200ms average (95th percentile)
- **Database Performance**: Query response times ≤ 50ms average
- **Image Delivery**: CDN response times ≤ 100ms globally
- **Webhook Reliability**: ISR revalidation success rate ≥ 99.9%

---

## Critical Dependencies & Implementation Order

### Phase Dependencies & Blocking Relationships
1. **Phase 0 (Baseline)** → **MUST COMPLETE FIRST**
   - Blocks: All other phases (need baseline metrics for comparison)
   - Deliverable: `/docs/baseline.md` with current performance metrics

2. **Phase 1 (Multi-page Architecture)** → **CRITICAL PATH**  
   - Depends on: Phase 0 baseline documentation
   - Blocks: Phase 2 (SSG needs routes), Phase 4 (SEO needs pages), Phase 5 (monitoring needs pages)
   - Parallel work allowed: Backend infrastructure setup can start

3. **Phase 2 (SSG + ISR)** → **REQUIRES BACKEND**
   - Depends on: Phase 1 routes + Backend API endpoints
   - Blocks: Phase 5 monitoring (needs static generation to be working)
   - Critical: Backend must be ready with build-time endpoints

4. **Phase 3 (Image Optimization)** → **PARALLEL TRACK**
   - Depends on: Phase 1 routes (pages to optimize)
   - Can run parallel with: Phase 2 (independent work)
   - Backend dependency: Image hosting/CDN setup

5. **Phase 4 (SEO)** → **REQUIRES SSG**  
   - Depends on: Phase 1 routes + Phase 2 SSG (for metadata generation)
   - Can run parallel with: Phase 3 (independent work)

6. **Phase 5 (Monitoring)** → **FINAL INTEGRATION**
   - Depends on: All previous phases completed
   - Validates: Performance improvements from Phase 3, SSG from Phase 2

### Critical Blocking Points
⚠️ **Backend API Readiness**: Phase 2 SSG cannot begin until backend provides:
- Product list/detail endpoints
- Build-time slug generation endpoints
- Database with migrated mock data

⚠️ **Slug Consistency**: Must be established in Phase 1 and maintained through all phases

⚠️ **Environment Setup**: Backend development environment must be ready before Phase 1 backend tasks

---

## PR-Based Implementation Strategy

### **Git Workflow**
**Branch Structure**: `main` ← `staging` ← feature branches  
**Current Branch**: `staging` (starting point for all features)  
**Process**: Feature PRs → `staging` → validated merges to `main`

### **Phase-by-Phase PR Plan**

#### **Phase 0: Baseline (1 PR)**
- **PR**: `feat/baseline-performance-analysis`  
- **Branch**: `feat/phase0-baseline` from `staging`
- **Files**: Create `/docs/baseline.md`, performance screenshots
- **Target**: `staging`

#### **Phase 1: Multi-Page Architecture (3 PRs)**
1. **PR**: `feat/new-route-structure` - Create new page routes
2. **PR**: `feat/component-refactoring` - Remove modal, update components  
3. **PR**: `feat/api-integration-prep` - API utilities and environment setup

#### **Phase 2: SSG + ISR (2 PRs)**
1. **PR**: `feat/static-site-generation` - Add `generateStaticParams` and SSG
2. **PR**: `feat/isr-revalidation-system` - Implement revalidation endpoints

#### **Phase 3: Image Optimization (2 PRs)**  
1. **PR**: `feat/nextjs-image-optimization` - Replace `<img>` with Next.js `<Image>`
2. **PR**: `feat/performance-monitoring-setup` - Lighthouse CI and Web Vitals

#### **Phase 4: SEO Implementation (2 PRs)**
1. **PR**: `feat/dynamic-metadata-and-og` - Metadata API and Open Graph  
2. **PR**: `feat/structured-data-and-sitemap` - JSON-LD and sitemap generation

#### **Phase 5: Final Monitoring (1 PR)**
- **PR**: `feat/production-monitoring` - Comprehensive monitoring and validation

### **PR Requirements (Every PR)**
- ✅ Performance check (no bundle regressions)
- ✅ TypeScript compilation passes  
- ✅ ESLint passes
- ✅ Local testing verification
- ✅ Documentation updates (if applicable)
- ✅ Screenshots for UI changes

### **Timeline with PR Milestones**
**Week 1**: Phase 0 (1 PR) + Phase 1 (3 PRs)  
**Week 2**: Phase 2 (2 PRs) + Begin Phase 3  
**Week 3**: Phase 3 (2 PRs) + Phase 4 (2 PRs)  
**Week 4**: Phase 5 (1 PR) + Final staging → main merge

**Total**: 11 feature PRs across 4 weeks

---

## Success Milestones

**M1 (End Week 1): Architecture Foundation**
- ✅ Baseline performance documented in `/docs/baseline.md`
- ✅ Multi-page routes live: `/`, `/products/[slug]`, `/categories/[category]`
- ✅ Mock API refactored with separate list/detail endpoints
- ✅ Product slugs generated and routing functional

**M2 (End Week 2): Static Generation**
- ✅ All pages pre-rendered with SSG + ISR
- ✅ Mock data optimized for static generation
- ✅ Basic pagination implementation working
- ✅ Next.js Image components replacing `<img>` tags

**M3 (End Week 3): Performance & SEO**
- ✅ Core Web Vitals targets met (LCP ≤ 2.5s, CLS ≤ 0.1)  
- ✅ Dynamic metadata and Open Graph tags on all pages
- ✅ JSON-LD structured data on product pages
- ✅ Sitemap.xml and robots.txt generated

**M4 (End Week 4): Production Ready**
- ✅ Performance budgets enforced in CI/CD
- ✅ Web Vitals monitoring implemented
- ✅ All exit criteria met and validated

---

## Exit Criteria (Updated for Mock Data Architecture)

**Performance**
- ✅ LCP ≤ 2.5s (75th percentile) on all page types
- ✅ CLS ≤ 0.1 across all pages  
- ✅ INP ≤ 200ms for all interactions
- ✅ First Load JS ≤ 250KB

**Functionality**
- ✅ All pages (home, category, product) pre-rendered with ISR
- ✅ Backend API responses ≤ 200ms average (95th percentile)
- ✅ Database queries optimized (≤ 50ms average)
- ✅ Product slugs stable and SEO-friendly
- ✅ Pagination working on category pages
- ✅ ISR webhook system operational (≥ 99.9% success rate)

**SEO & Discoverability**
- ✅ Dynamic metadata on all pages
- ✅ Valid JSON-LD Product schema on PDPs
- ✅ Complete sitemap with all routes
- ✅ Proper robots.txt configuration

**Monitoring**
- ✅ CI/CD fails builds on performance regressions
- ✅ Web Vitals tracked and reported
- ✅ Performance budgets documented and enforced