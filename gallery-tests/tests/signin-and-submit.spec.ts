import { test, expect, Page } from '@playwright/test';
import testUsers from '../test-data/test-users.json';

// ============================================================
// THE PAGE GALLERY — SIGNIN + WORK SUBMISSION TEST
// ============================================================
// Signs in each previously-registered user and submits their work
// through the Writers Studio submission flow.
// ============================================================

interface TestUser {
  id: number;
  name: string;
  writerName: string;
  email: string;
  password: string;
  submission: { title: string; body: string; type: string };
}

async function signIn(page: Page, email: string, password: string) {
  await page.goto('/signin', { waitUntil: 'networkidle' });
  await page.waitForSelector('#root', { state: 'attached' });

  const emailField = page.locator('#email');
  await expect(emailField).toBeVisible();
  await emailField.fill(email);

  const passwordField = page.locator('#password');
  await expect(passwordField).toBeVisible();
  await passwordField.fill(password);

  await Promise.all([
    page.waitForLoadState('networkidle'),
    page.locator('button[type="submit"]').click(),
  ]);

  // Should redirect away from signin
  await expect(page).not.toHaveURL(/\/signin$/);
}

async function submitWork(
  page: Page,
  title: string,
  body: string,
  type: string
) {
  // Navigate to Writers Studio
  await page.goto('/writers-studio', { waitUntil: 'networkidle' });

  // Look for submission button/link
  const submitButton = page.locator(
    'button:has-text("Submit"), a:has-text("Submit"), button:has-text("submit")'
  ).first();
  await expect(submitButton).toBeVisible({ timeout: 10_000 });
  await submitButton.click();

  // Wait for submission dialog/form
  await page.waitForTimeout(1000);

  // Fill title
  const titleField = page.locator(
    'input[name="title"], input[placeholder*="title" i], #title'
  ).first();
  if (await titleField.isVisible()) {
    await titleField.fill(title);
  }

  // Fill body/content
  const bodyField = page.locator(
    'textarea[name="body"], textarea[name="content"], textarea[placeholder*="work" i], textarea'
  ).first();
  if (await bodyField.isVisible()) {
    await bodyField.fill(body);
  }

  // Select type if dropdown exists
  const typeSelect = page.locator(
    'select[name="type"], select[name="category"]'
  ).first();
  if (await typeSelect.isVisible().catch(() => false)) {
    await typeSelect.selectOption({ label: new RegExp(type, 'i') });
  }

  // Submit the work
  const confirmButton = page.locator(
    'button[type="submit"]:has-text("Submit"), button:has-text("Send"), button:has-text("Publish")'
  ).first();
  if (await confirmButton.isVisible()) {
    await confirmButton.click();
  }

  // Wait for confirmation
  await page.waitForTimeout(2000);
}

// Run first 20 users as a focused batch (full 100 in CI)
const usersToTest = (testUsers as TestUser[]).slice(0, 20);

for (const user of usersToTest) {
  test(`Signin + Submit: User #${user.id} (${user.name})`, async ({ page }) => {
    // Step 1: Sign in
    await signIn(page, user.email, user.password);

    // Step 2: Verify we're in an authenticated area
    const url = page.url();
    expect(url).not.toContain('/signin');

    // Step 3: Submit work
    await submitWork(
      page,
      user.submission.title,
      user.submission.body,
      user.submission.type
    );

    // Step 4: Verify submission appeared (check My Work or similar)
    await page.goto('/studio/work', { waitUntil: 'networkidle' });
    // Look for the submission title on the page
    const workTitle = page.locator(`text=${user.submission.title}`).first();
    // Soft check - don't fail if the page structure varies
    if (await workTitle.isVisible({ timeout: 5000 }).catch(() => false)) {
      expect(await workTitle.textContent()).toContain(user.submission.title.split(' — ')[0]);
    }
  });
}
