import { test, expect, Page } from '@playwright/test';
import testUsers from '../test-data/test-users.json';

// ============================================================
// THE PAGE GALLERY — 100-USER SIGNUP STRESS TEST
// ============================================================
// Target: https://thepagegalleryjournal.com/signup
// Form fields: #name, #writerName, #email, #password
// ============================================================

interface TestUser {
  id: number;
  name: string;
  writerName: string;
  email: string;
  password: string;
  submission: { title: string; body: string; type: string };
}

const RESULTS: {
  userId: number;
  name: string;
  email: string;
  status: 'success' | 'failed' | 'error';
  duration: number;
  error?: string;
  redirectedTo?: string;
}[] = [];

async function waitForAppLoaded(page: Page) {
  await page.waitForSelector('#root', { state: 'attached' });
}

for (const user of testUsers as TestUser[]) {
  test(`Signup User #${user.id}: ${user.name}`, async ({ page }) => {
    const start = Date.now();

    try {
      await page.goto('/signup', { waitUntil: 'networkidle' });
      await waitForAppLoaded(page);

      // Headline sanity check
      await expect(page.locator('h1, h2').first()).toContainText(/open your room/i);

      const nameField = page.locator('#name');
      await expect(nameField).toBeVisible();
      await nameField.fill(user.name);

      if (user.writerName) {
        const writerField = page.locator('#writerName');
        await expect(writerField).toBeVisible();
        await writerField.fill(user.writerName);
      }

      const emailField = page.locator('#email');
      await expect(emailField).toBeVisible();
      await emailField.fill(user.email);

      const passwordField = page.locator('#password');
      await expect(passwordField).toBeVisible();
      await passwordField.fill(user.password);

      await Promise.all([
        page.waitForLoadState('networkidle'),
        page.locator('button[type="submit"]').click(),
      ]);

      // Expect successful signup -> redirect somewhere authenticated
      await expect(page).not.toHaveURL(/\/signup$/);
      const url = page.url();

      RESULTS.push({
        userId: user.id,
        name: user.name,
        email: user.email,
        status: 'success',
        duration: Date.now() - start,
        redirectedTo: url,
      });
    } catch (err: any) {
      RESULTS.push({
        userId: user.id,
        name: user.name,
        email: user.email,
        status: 'error',
        duration: Date.now() - start,
        error: err?.message ?? String(err),
      });
      throw err;
    }
  });
}

test.afterAll(async () => {
  console.log(JSON.stringify(RESULTS, null, 2));
});
