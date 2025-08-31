// Performance monitoring utilities for production use

export interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  fcpToFid?: number;
  bundle?: {
    route: string;
    size: number;
    firstLoadJS: number;
  };
}

// Web Vitals measurement helper
export function measureWebVitals(metric: { name: string; value: number; id: string }) {
  // This would integrate with analytics service in production
  console.log('Web Vital:', metric);
  
  // Example integration points:
  // - Google Analytics 4
  // - Vercel Analytics
  // - Custom analytics endpoint
  
  switch (metric.name) {
    case 'LCP':
      // Largest Contentful Paint
      trackMetric('lcp', metric.value);
      break;
    case 'FID':
      // First Input Delay
      trackMetric('fid', metric.value);
      break;
    case 'CLS':
      // Cumulative Layout Shift
      trackMetric('cls', metric.value);
      break;
    case 'TTFB':
      // Time to First Byte
      trackMetric('ttfb', metric.value);
      break;
    default:
      break;
  }
}

// Generic metric tracking function
function trackMetric(name: string, value: number) {
  // In production, this would send to your analytics service
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name.toUpperCase()}: ${value}`);
  }
  
  // Example implementations:
  // gtag('event', name, { value: Math.round(value) });
  // analytics.track(name, { value });
  // fetch('/api/metrics', { method: 'POST', body: JSON.stringify({ name, value }) });
}

// Performance timing helper
export function measurePageLoad() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      ttfb: navigation.responseStart - navigation.fetchStart,
      domLoad: navigation.domContentLoadedEventEnd - navigation.fetchStart,
      windowLoad: navigation.loadEventEnd - navigation.fetchStart,
      firstPaint: getFirstPaint(),
      firstContentfulPaint: getFirstContentfulPaint(),
    };
  }
  
  return null;
}

// First Paint timing
function getFirstPaint() {
  const paintEntries = performance.getEntriesByType('paint');
  const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
  return firstPaint ? firstPaint.startTime : null;
}

// First Contentful Paint timing
function getFirstContentfulPaint() {
  const paintEntries = performance.getEntriesByType('paint');
  const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
  return fcp ? fcp.startTime : null;
}

// Bundle size tracking for development
export function trackBundleMetrics(route: string) {
  if (process.env.NODE_ENV === 'development') {
    // This would be replaced with actual bundle analysis in CI/CD
    console.log(`Route loaded: ${route}`);
  }
}

// API performance tracking
export function trackAPIPerformance(endpoint: string, duration: number, success: boolean) {
  const metric = {
    endpoint,
    duration,
    success,
    timestamp: Date.now(),
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.log('API Performance:', metric);
  }
  
  // In production, send to monitoring service
  // Example: sendToMonitoring('api_performance', metric);
}

// Cache performance tracking
export function trackCachePerformance(type: 'hit' | 'miss' | 'revalidate', resource: string) {
  const metric = {
    type,
    resource,
    timestamp: Date.now(),
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Cache Performance:', metric);
  }
  
  // In production, send to monitoring service
  // Example: sendToMonitoring('cache_performance', metric);
}

// Error tracking
export function trackError(error: Error, context: string) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: Date.now(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
  };
  
  console.error('Tracked Error:', errorData);
  
  // In production, send to error monitoring service
  // Example: Sentry.captureException(error, { extra: { context } });
}

// User interaction tracking
export function trackUserInteraction(action: string, element: string, value?: string | number) {
  const interaction = {
    action,
    element,
    value,
    timestamp: Date.now(),
  };
  
  if (process.env.NODE_ENV === 'development') {
    console.log('User Interaction:', interaction);
  }
  
  // In production, send to analytics
  // Example: gtag('event', action, { element, value });
}

// Production monitoring setup function
export function setupMonitoring() {
  if (typeof window === 'undefined') return;
  
  // Web Vitals monitoring
  if ('web-vitals' in window) {
    // This would use the actual web-vitals library in production
    // import { getCLS, getFID, getLCP } from 'web-vitals';
    // getCLS(measureWebVitals);
    // getFID(measureWebVitals);
    // getLCP(measureWebVitals);
  }
  
  // Performance observer for additional metrics
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const timing = entry as PerformanceNavigationTiming;
            trackMetric('ttfb', timing.responseStart - timing.fetchStart);
          }
        }
      });
      
      observer.observe({ type: 'navigation', buffered: true });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }
  }
  
  // Global error handling
  window.addEventListener('error', (event) => {
    trackError(new Error(event.message), 'global_error_handler');
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    trackError(new Error(event.reason), 'unhandled_promise_rejection');
  });
}

// Development helpers
export const DevMonitoring = {
  logPageMetrics: measurePageLoad,
  logBundleInfo: trackBundleMetrics,
  logAPICall: trackAPIPerformance,
  logCacheEvent: trackCachePerformance,
};