import { test, expect, Page } from '@playwright/test';

/**
 * Performance Test Suite
 * Tests page load times, Core Web Vitals, resource optimization, and API response times
 */

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  cls: number;
  tti: number;
  domContentLoaded: number;
  loadComplete: number;
}

test.describe('Performance Tests', () => {
  const THRESHOLDS = {
    FCP: 2500,        // First Contentful Paint < 2.5s
    LCP: 4000,        // Largest Contentful Paint < 4s
    CLS: 0.25,        // Cumulative Layout Shift < 0.25
    TTI: 5000,        // Time to Interactive < 5s
    DOM_LOADED: 3000,  // DOMContentLoaded < 3s
    LOAD: 6000,        // Full load < 6s
    API_RESPONSE: 2000 // API responses < 2s
  };

  test.describe('Page Load Performance', () => {
    const criticalPages = [
      { name: 'Landing Page', path: '/' },
      { name: 'Gallery', path: '/gallery' },
      { name: 'Sign In', path: '/signin' },
      { name: 'Sign Up', path: '/signup' }
    ];

    for (const pageInfo of criticalPages) {
      test(`${pageInfo.name} should load within performance budget`, async ({ page }) => {
        const startTime = Date.now();
        
        await page.goto(pageInfo.path, { waitUntil: 'networkidle' });
        
        const loadTime = Date.now() - startTime;

        const metrics = await page.evaluate(() => {
          const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          return {
            domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
            loadComplete: nav.loadEventEnd - nav.startTime,
            ttfb: nav.responseStart - nav.requestStart,
            domInteractive: nav.domInteractive - nav.startTime,
            transferSize: nav.transferSize || 0
          };
        });

        expect(metrics.domContentLoaded).toBeLessThan(THRESHOLDS.DOM_LOADED);
        expect(loadTime).toBeLessThan(THRESHOLDS.LOAD);
      });
    }
  });

  test.describe('Core Web Vitals', () => {
    test('Landing page FCP should be within threshold', async ({ page }) => {
      await page.goto('/', { waitUntil: 'commit' });

      const fcp = await page.evaluate(async () => {
        return new Promise<number>((resolve) => {
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const fcpEntry = entries.find(e => e.name === 'first-contentful-paint');
            if (fcpEntry) resolve(fcpEntry.startTime);
          }).observe({ type: 'paint', buffered: true });

          setTimeout(() => resolve(-1), 10000);
        });
      });

      if (fcp > 0) {
        expect(fcp).toBeLessThan(THRESHOLDS.FCP);
      }
    });

    test('Landing page LCP should be within threshold', async ({ page }) => {
      await page.goto('/', { waitUntil: 'commit' });

      const lcp = await page.evaluate(async () => {
        return new Promise<number>((resolve) => {
          let lcpValue = 0;
          new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
              lcpValue = entry.startTime;
            });
          }).observe({ type: 'largest-contentful-paint', buffered: true });

          setTimeout(() => resolve(lcpValue), 5000);
        });
      });

      if (lcp > 0) {
        expect(lcp).toBeLessThan(THRESHOLDS.LCP);
      }
    });

    test('Landing page CLS should be within threshold', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      const cls = await page.evaluate(async () => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;
          new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
          }).observe({ type: 'layout-shift', buffered: true });

          setTimeout(() => resolve(clsValue), 3000);
        });
      });

      expect(cls).toBeLessThan(THRESHOLDS.CLS);
    });
  });

  test.describe('Resource Optimization', () => {
    test('should not load excessively large resources', async ({ page }) => {
      const largeResources: { url: string; size: number }[] = [];

      page.on('response', async (response) => {
        const headers = response.headers();
        const contentLength = parseInt(headers['content-length'] || '0');
        const url = response.url();

        if (contentLength > 500 * 1024) {
          largeResources.push({ url, size: contentLength });
        }
      });

      await page.goto('/', { waitUntil: 'networkidle' });

      const largeCodeResources = largeResources.filter(
        r => r.url.endsWith('.js') || r.url.endsWith('.css')
      );

      expect(largeCodeResources.length).toBe(0);
    });

    test('should use image optimization', async ({ page }) => {
      await page.goto('/gallery', { waitUntil: 'networkidle' });

      const imageInfo = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        return Array.from(images).map(img => ({
          src: img.src.substring(0, 100),
          hasLazy: img.loading === 'lazy',
          hasSrcset: !!img.srcset,
          width: img.naturalWidth,
          height: img.naturalHeight,
          displayWidth: img.clientWidth,
          displayHeight: img.clientHeight
        }));
      });

      const visibleImages = imageInfo.filter(img => img.displayWidth > 0);
      if (visibleImages.length > 3) {
        const lazyImages = imageInfo.filter(img => img.hasLazy);
        expect(lazyImages.length).toBeGreaterThan(0);
      }
    });

    test('should have efficient total page weight', async ({ page }) => {
      let totalBytes = 0;

      page.on('response', async (response) => {
        const headers = response.headers();
        const contentLength = parseInt(headers['content-length'] || '0');
        totalBytes += contentLength;
      });

      await page.goto('/', { waitUntil: 'networkidle' });

      const totalMB = totalBytes / (1024 * 1024);
      expect(totalMB).toBeLessThan(3);
    });

    test('should minimize number of HTTP requests', async ({ page }) => {
      let requestCount = 0;

      page.on('request', () => {
        requestCount++;
      });

      await page.goto('/', { waitUntil: 'networkidle' });

      expect(requestCount).toBeLessThan(50);
    });
  });

  test.describe('API Response Times', () => {
    test('gallery API should respond quickly', async ({ page }) => {
      const apiTimings: { url: string; duration: number }[] = [];

      page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('/api/')) {
          const timing = response.request().timing();
          apiTimings.push({
            url,
            duration: timing.responseEnd - timing.requestStart
          });
        }
      });

      await page.goto('/gallery', { waitUntil: 'networkidle' });

      for (const timing of apiTimings) {
        expect(timing.duration).toBeLessThan(THRESHOLDS.API_RESPONSE);
      }
    });

    test('authentication API should respond quickly', async ({ page }) => {
      await page.goto('/signin');

      const responsePromise = page.waitForResponse(
        response => response.url().includes('/api/auth') || response.url().includes('/api/signin'),
        { timeout: 10000 }
      ).catch(() => null);

      const startTime = Date.now();
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'TestPass123!');
      await page.click('button[type="submit"]');

      const response = await responsePromise;
      if (response) {
        const duration = Date.now() - startTime;
        expect(duration).toBeLessThan(THRESHOLDS.API_RESPONSE);
      }
    });
  });

  test.describe('Caching', () => {
    test('static assets should have cache headers', async ({ page }) => {
      const uncachedAssets: string[] = [];

      page.on('response', async (response) => {
        const url = response.url();
        const headers = response.headers();

        if (url.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff2?)$/)) {
          const cacheControl = headers['cache-control'] || '';
          const expires = headers['expires'] || '';

          if (!cacheControl && !expires) {
            uncachedAssets.push(url);
          }
        }
      });

      await page.goto('/', { waitUntil: 'networkidle' });

      expect(uncachedAssets.length).toBeLessThan(5);
    });

    test('repeated page visits should be faster', async ({ page }) => {
      const firstStart = Date.now();
      await page.goto('/', { waitUntil: 'networkidle' });
      const firstLoad = Date.now() - firstStart;

      const secondStart = Date.now();
      await page.goto('/', { waitUntil: 'networkidle' });
      const secondLoad = Date.now() - secondStart;

      expect(secondLoad).toBeLessThan(firstLoad * 1.5);
    });
  });

  test.describe('Memory and Runtime Performance', () => {
    test('should not have memory leaks on navigation', async ({ page }) => {
      await page.goto('/');

      const initialMemory = await page.evaluate(() => {
        if ((performance as any).memory) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
      });

      const pages = ['/gallery', '/signin', '/signup', '/about', '/'];
      for (const path of pages) {
        await page.goto(path, { waitUntil: 'networkidle' });
      }

      const finalMemory = await page.evaluate(() => {
        if ((performance as any).memory) {
          return (performance as any).memory.usedJSHeapSize;
        }
        return 0;
      });

      if (initialMemory > 0 && finalMemory > 0) {
        expect(finalMemory).toBeLessThan(initialMemory * 1.5);
      }
    });

    test('should not have excessive DOM nodes', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });

      const domNodeCount = await page.evaluate(() => {
        return document.querySelectorAll('*').length;
      });

      expect(domNodeCount).toBeLessThan(1500);
    });

    test('should not have long-running JavaScript', async ({ page }) => {
      await page.evaluateOnNewDocument(() => {
        (window as any).__longTasks = [];
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            (window as any).__longTasks.push(entry.duration);
          }
        }).observe({ entryTypes: ['longtask'] });
      });

      await page.goto('/', { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      const tasks = await page.evaluate(() => (window as any).__longTasks || []);

      const veryLongTasks = tasks.filter((t: number) => t > 100);
      expect(veryLongTasks.length).toBeLessThan(3);
    });
  });
});
