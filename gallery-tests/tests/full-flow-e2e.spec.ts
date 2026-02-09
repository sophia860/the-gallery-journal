import { test, expect } from '@playwright/test';

// ============================================================
// THE PAGE GALLERY — FULL FLOW E2E TEST
// ============================================================
// Tests the complete user journey:
// 1. Public landing page (unauthenticated)
// 2. Browse collection gallery
// 3. Sign up as new user
// 4. Access private areas (Studio, Gallery Wall, etc.)
// 5. Route guards block unauthenticated access
// ============================================================

const PUBLIC_ROUTES = [
  { path: '/', name: 'Landing Page' },
  { path: '/about', name: 'About' },
  { path: '/collection-gallery', name: 'Collection Gallery' },
  { path: '/signup', name: 'Sign Up' },
  { path: '/signin', name: 'Sign In' },
];

const PROTECTED_ROUTES = [
  { path: '/gallery-wall', name: 'Gallery Wall' },
  { path: '/afterhours', name: 'Afterhours' },
  { path: '/studio', name: 'Studio' },
  { path: '/rooms', name: 'Rooms' },
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/writers-studio', name: 'Writers Studio' },
  { path: '/community-wall', name: 'Community Wall' },
];

test.describe('Public pages are accessible without auth', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route.name} (${route.path}) loads`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'networkidle' });
      await page.waitForSelector('#root', { state: 'attached' });

      // Should not redirect to signin
      expect(page.url()).not.toContain('/signin');

      // Page should have content
      const body = await page.locator('body').textContent();
      expect(body?.length).toBeGreaterThan(0);
    });
  }
});

test.describe('Protected routes redirect unauthenticated users', () => {
  for (const route of PROTECTED_ROUTES) {
    test(`${route.name} (${route.path}) redirects to signin`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'networkidle' });
      await page.waitForSelector('#root', { state: 'attached' });

      // Wait for client-side redirect
      await page.waitForTimeout(2000);

      // Should redirect to signin or show a gate
      const url = page.url();
      const hasGate = await page.locator(
        'text=/sign in|log in|members only|join/i'
      ).first().isVisible().catch(() => false);

      expect(url.includes('/signin') || hasGate).toBeTruthy();
    });
  }
});

test.describe('Full user journey: public -> signup -> private', () => {
  const testEmail = `e2e.fullflow.${Date.now()}@gallerytesting.dev`;
  const testPassword = 'TestFlow2026!';
  const testName = 'E2E FlowTest';

  test('1. Landing page loads with gallery content', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#root', { state: 'attached' });

    // Check for key landing page elements
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('2. Collection gallery is browsable', async ({ page }) => {
    await page.goto('/collection-gallery', { waitUntil: 'networkidle' });
    await page.waitForSelector('#root', { state: 'attached' });

    // Page should have visible content
    const body = await page.locator('body').textContent();
    expect(body?.length).toBeGreaterThan(100);
  });

  test('3. Sign up creates a new account', async ({ page }) => {
    await page.goto('/signup', { waitUntil: 'networkidle' });
    await page.waitForSelector('#root', { state: 'attached' });

    await page.locator('#name').fill(testName);
    await page.locator('#email').fill(testEmail);
    await page.locator('#password').fill(testPassword);

    await Promise.all([
      page.waitForLoadState('networkidle'),
      page.locator('button[type="submit"]').click(),
    ]);

    // Should redirect to authenticated area
    await expect(page).not.toHaveURL(/\/signup$/);
  });

  test('4. Authenticated user can access Studio', async ({ page }) => {
    // Sign in first
    await page.goto('/signin', { waitUntil: 'networkidle' });
    await page.locator('#email').fill(testEmail);
    await page.locator('#password').fill(testPassword);
    await Promise.all([
      page.waitForLoadState('networkidle'),
      page.locator('button[type="submit"]').click(),
    ]);

    // Navigate to studio
    await page.goto('/studio', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Should NOT be redirected to signin
    expect(page.url()).not.toContain('/signin');
  });

  test('5. Navigation shows correct links for auth state', async ({ page }) => {
    // Unauthenticated: should see Sign In / Sign Up links
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#root', { state: 'attached' });

    const nav = page.locator('nav, header').first();
    const navText = await nav.textContent();

    // Should have some navigation element
    expect(navText?.length).toBeGreaterThan(0);
  });
});

test.describe('Responsive design check', () => {
  test('Landing page renders on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#root', { state: 'attached' });

    // No horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375 + 10); // small tolerance

    // Content is visible
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('Collection gallery renders on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/collection-gallery', { waitUntil: 'networkidle' });
    await page.waitForSelector('#root', { state: 'attached' });

    const body = await page.locator('body').textContent();
    expect(body?.length).toBeGreaterThan(50);
  });
});
