import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Accessibility Test Suite
 * Tests WCAG 2.1 AA compliance across key pages using axe-core
 */

test.describe('Accessibility Compliance', () => {
  const routes = [
    { name: 'Landing Page', path: '/' },
    { name: 'Gallery Page', path: '/gallery' },
    { name: 'Sign In Page', path: '/signin' },
    { name: 'Sign Up Page', path: '/signup' },
    { name: 'About Page', path: '/about' },
    { name: 'Contact Page', path: '/contact' }
  ];

  for (const route of routes) {
    test(`${route.name} should have no critical accessibility violations`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'networkidle' });
      await page.waitForSelector('#root, main, body', { state: 'attached' });

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Filter for critical and serious violations only
      const criticalViolations = accessibilityScanResults.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
      );

      expect(criticalViolations).toEqual([]);
    });
  }

  test.describe('Keyboard Navigation', () => {
    test('should navigate landing page with keyboard only', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('#root, main', { state: 'attached' });

      // Tab through interactive elements
      const interactiveElements: string[] = [];
      for (let i = 0; i < 20; i++) {
        await page.keyboard.press('Tab');
        const activeTag = await page.evaluate(() => {
          const el = document.activeElement;
          return el ? `${el.tagName}:${el.getAttribute('role') || ''}` : 'none';
        });
        interactiveElements.push(activeTag);
      }

      // Verify focus moved through elements
      const uniqueElements = new Set(interactiveElements);
      expect(uniqueElements.size).toBeGreaterThan(1);
    });

    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('#root, main', { state: 'attached' });

      // Tab to first interactive element
      await page.keyboard.press('Tab');

      // Check for focus indicator styles
      const hasFocusStyle = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return false;
        const styles = window.getComputedStyle(el);
        const hasOutline = styles.outlineStyle !== 'none' && styles.outlineWidth !== '0px';
        const hasBoxShadow = styles.boxShadow !== 'none';
        const hasBorder = styles.borderColor !== styles.backgroundColor;
        return hasOutline || hasBoxShadow || hasBorder;
      });

      expect(hasFocusStyle).toBeTruthy();
    });

    test('should handle Escape key for modals/dialogs', async ({ page }) => {
      await page.goto('/');
      
      // Try to open a modal if trigger exists
      const modalTrigger = page.locator('button[data-modal], [aria-haspopup="dialog"]').first();
      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();
        
        // Verify modal opened
        const dialog = page.locator('[role="dialog"], .modal');
        await expect(dialog).toBeVisible();
        
        // Press Escape to close
        await page.keyboard.press('Escape');
        await expect(dialog).not.toBeVisible();
      }
    });

    test('should trap focus within modals', async ({ page }) => {
      await page.goto('/');
      
      const modalTrigger = page.locator('button[data-modal], [aria-haspopup="dialog"]').first();
      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();
        
        const dialog = page.locator('[role="dialog"], .modal');
        if (await dialog.isVisible()) {
          // Tab through all elements in modal
          for (let i = 0; i < 30; i++) {
            await page.keyboard.press('Tab');
            
            const focusIsInModal = await page.evaluate(() => {
              const activeEl = document.activeElement;
              const modal = document.querySelector('[role="dialog"], .modal');
              return modal?.contains(activeEl) || false;
            });
            
            expect(focusIsInModal).toBeTruthy();
          }
        }
      }
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      
      const headings = await page.evaluate(() => {
        const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        return Array.from(headingElements).map(h => ({
          level: parseInt(h.tagName.charAt(1)),
          text: h.textContent?.trim().substring(0, 50) || ''
        }));
      });

      // Should have at least one h1
      const h1Count = headings.filter(h => h.level === 1).length;
      expect(h1Count).toBe(1);

      // Headings should not skip levels
      for (let i = 1; i < headings.length; i++) {
        const diff = headings[i].level - headings[i - 1].level;
        expect(diff).toBeLessThanOrEqual(1);
      }
    });

    test('should have alt text on all images', async ({ page }) => {
      await page.goto('/gallery');
      await page.waitForSelector('#root, main', { state: 'attached' });

      const imagesWithoutAlt = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        return Array.from(images).filter(img => {
          const alt = img.getAttribute('alt');
          const role = img.getAttribute('role');
          // Decorative images should have role="presentation" or alt=""
          return alt === null && role !== 'presentation';
        }).length;
      });

      expect(imagesWithoutAlt).toBe(0);
    });

    test('should have proper ARIA labels on interactive elements', async ({ page }) => {
      await page.goto('/');
      
      const unlabeledElements = await page.evaluate(() => {
        const interactive = document.querySelectorAll(
          'button, a, input, select, textarea, [role="button"], [role="link"]'
        );
        return Array.from(interactive).filter(el => {
          const hasAriaLabel = el.getAttribute('aria-label');
          const hasAriaLabelledBy = el.getAttribute('aria-labelledby');
          const hasTitle = el.getAttribute('title');
          const hasText = el.textContent?.trim();
          const hasPlaceholder = el.getAttribute('placeholder');
          const isHidden = el.getAttribute('aria-hidden') === 'true';
          const hasLabel = el.id && document.querySelector(`label[for="${el.id}"]`);
          
          if (isHidden) return false;
          return !hasAriaLabel && !hasAriaLabelledBy && !hasTitle && !hasText && !hasPlaceholder && !hasLabel;
        }).length;
      });

      expect(unlabeledElements).toBe(0);
    });

    test('should have proper landmark regions', async ({ page }) => {
      await page.goto('/');
      
      const landmarks = await page.evaluate(() => {
        const roles = {
          banner: document.querySelectorAll('header, [role="banner"]').length,
          navigation: document.querySelectorAll('nav, [role="navigation"]').length,
          main: document.querySelectorAll('main, [role="main"]').length,
          contentinfo: document.querySelectorAll('footer, [role="contentinfo"]').length
        };
        return roles;
      });

      // Should have at least a main landmark
      expect(landmarks.main).toBeGreaterThanOrEqual(1);
    });

    test('should have proper form labels', async ({ page }) => {
      await page.goto('/signin');
      
      const unlabeledInputs = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"])');
        return Array.from(inputs).filter(input => {
          const id = input.id;
          const hasLabel = id && document.querySelector(`label[for="${id}"]`);
          const hasAriaLabel = input.getAttribute('aria-label');
          const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
          const hasPlaceholder = input.getAttribute('placeholder');
          const hasTitle = input.getAttribute('title');
          return !hasLabel && !hasAriaLabel && !hasAriaLabelledBy && !hasPlaceholder && !hasTitle;
        }).length;
      });

      expect(unlabeledInputs).toBe(0);
    });
  });

  test.describe('Color and Contrast', () => {
    test('should pass color contrast requirements', async ({ page }) => {
      await page.goto('/');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

      const contrastViolations = accessibilityScanResults.violations;
      expect(contrastViolations).toEqual([]);
    });

    test('should not rely solely on color to convey information', async ({ page }) => {
      await page.goto('/gallery');
      
      // Check that error states have more than just color
      const colorOnlyIndicators = await page.evaluate(() => {
        const errorElements = document.querySelectorAll('.error, [aria-invalid="true"]');
        return Array.from(errorElements).filter(el => {
          const hasIcon = el.querySelector('svg, .icon, [aria-hidden]');
          const hasText = el.textContent?.trim();
          return !hasIcon && !hasText;
        }).length;
      });

      expect(colorOnlyIndicators).toBe(0);
    });
  });

  test.describe('Responsive and Zoom', () => {
    test('should be usable at 200% zoom', async ({ page }) => {
      await page.goto('/');
      
      // Simulate 200% zoom via viewport
      await page.setViewportSize({ width: 640, height: 480 });
      await page.waitForTimeout(500);
      
      // Content should still be visible and not overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = 640;
      
      // Allow small tolerance for scrollbar
      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);
      
      // Key content should still be visible
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible();
    });

    test('should support text resizing without loss of content', async ({ page }) => {
      await page.goto('/');
      
      // Increase text size via CSS
      await page.evaluate(() => {
        document.documentElement.style.fontSize = '200%';
      });
      
      await page.waitForTimeout(500);
      
      // Check no content is clipped
      const hasOverflowHidden = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let clippedCount = 0;
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.overflow === 'hidden' && el.scrollHeight > el.clientHeight) {
            clippedCount++;
          }
        });
        return clippedCount;
      });
      
      // Allow some elements (intentional design), but flag excessive clipping
      expect(hasOverflowHidden).toBeLessThan(5);
    });
  });
});
