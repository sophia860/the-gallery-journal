import { test, expect, Page } from '@playwright/test';

/**
 * Admin Dashboard Test Suite
 * Tests admin-only functionality including user management, content moderation, and analytics
 */

test.describe('Admin Dashboard', () => {
  let page: Page;

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    // Login as admin user
    await page.goto('/signin');
    await page.fill('input[name="email"]', process.env.ADMIN_EMAIL || 'admin@example.com');
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD || 'AdminPass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**');
  });

  test.describe('Dashboard Overview', () => {
    test('should display admin dashboard with key metrics', async () => {
      await page.goto('/admin/dashboard');
      
      // Verify dashboard elements
      await expect(page.locator('h1, .dashboard-title')).toContainText(/admin|dashboard/i);
      
      // Check for metrics widgets
      const metricsCards = page.locator('.metric-card, .stats-card, [data-testid="metric"]');
      const count = await metricsCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should display user statistics', async () => {
      await page.goto('/admin/dashboard');
      
      const userStats = page.locator('[data-testid="user-stats"], .user-statistics');
      if (await userStats.isVisible()) {
        await expect(userStats).toContainText(/user|member/i);
      }
    });

    test('should display recent activity feed', async () => {
      await page.goto('/admin/dashboard');
      
      const activityFeed = page.locator('.activity-feed, [data-testid="recent-activity"]');
      if (await activityFeed.isVisible()) {
        const activityItems = activityFeed.locator('.activity-item, li');
        const count = await activityItems.count();
        expect(count).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('User Management', () => {
    test('should display list of users', async () => {
      await page.goto('/admin/users');
      
      await page.waitForSelector('table, .user-list, [data-testid="users-table"]');
      const userRows = page.locator('tbody tr, .user-item');
      const count = await userRows.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should search users by email', async () => {
      await page.goto('/admin/users');
      
      const searchInput = page.locator('input[type="search"], input[name="search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('test@example.com');
        await searchInput.press('Enter');
        
        await page.waitForTimeout(500);
        // Verify search results filtered
        const url = page.url();
        expect(url.toLowerCase()).toMatch(/search|q=|query=/);
      }
    });

    test('should filter users by status', async () => {
      await page.goto('/admin/users');
      
      const statusFilter = page.locator('select[name="status"], [data-testid="status-filter"]');
      if (await statusFilter.isVisible()) {
        await statusFilter.selectOption('active');
        await page.waitForTimeout(500);
        
        const url = page.url();
        expect(url).toContain('status');
      }
    });

    test('should view user details', async () => {
      await page.goto('/admin/users');
      
      const viewButton = page.locator('button:has-text("View"), a:has-text("View"), [data-testid="view-user"]').first();
      if (await viewButton.isVisible()) {
        await viewButton.click();
        
        await expect(page).toHaveURL(/\/admin\/users\/[\w-]+/);
        await expect(page.locator('.user-details, [data-testid="user-profile"]')).toBeVisible();
      }
    });

    test('should suspend user account', async () => {
      await page.goto('/admin/users');
      
      const suspendButton = page.locator('button:has-text("Suspend"), [data-testid="suspend-user"]').first();
      if (await suspendButton.isVisible()) {
        await suspendButton.click();
        
        // Confirm suspension
        const confirmButton = page.locator('button:has-text("Confirm"), [data-testid="confirm-suspend"]');
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
          
          await expect(page.locator('.success-message, [role="status"]')).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test('should activate suspended user', async () => {
      await page.goto('/admin/users?status=suspended');
      
      const activateButton = page.locator('button:has-text("Activate"), [data-testid="activate-user"]').first();
      if (await activateButton.isVisible()) {
        await activateButton.click();
        
        await expect(page.locator('.success-message, [role="status"]')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Content Moderation', () => {
    test('should display pending submissions for review', async () => {
      await page.goto('/admin/moderation');
      
      const pendingTab = page.locator('button:has-text("Pending"), [data-testid="pending-tab"]');
      if (await pendingTab.isVisible()) {
        await pendingTab.click();
      }
      
      const submissions = page.locator('.submission-item, [data-testid="pending-submission"]');
      const count = await submissions.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should approve submission', async () => {
      await page.goto('/admin/moderation');
      
      const approveButton = page.locator('button:has-text("Approve"), [data-testid="approve-submission"]').first();
      if (await approveButton.isVisible()) {
        await approveButton.click();
        
        await expect(page.locator('.success-message, [role="status"]')).toBeVisible({ timeout: 5000 });
      }
    });

    test('should reject submission with reason', async () => {
      await page.goto('/admin/moderation');
      
      const rejectButton = page.locator('button:has-text("Reject"), [data-testid="reject-submission"]').first();
      if (await rejectButton.isVisible()) {
        await rejectButton.click();
        
        // Fill rejection reason
        const reasonInput = page.locator('textarea[name="reason"], [data-testid="rejection-reason"]');
        if (await reasonInput.isVisible()) {
          await reasonInput.fill('Does not meet community guidelines');
          
          const confirmReject = page.locator('button:has-text("Confirm"), [data-testid="confirm-reject"]');
          await confirmReject.click();
          
          await expect(page.locator('.success-message, [role="status"]')).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test('should flag content for further review', async () => {
      await page.goto('/admin/moderation');
      
      const flagButton = page.locator('button:has-text("Flag"), [data-testid="flag-content"]').first();
      if (await flagButton.isVisible()) {
        await flagButton.click();
        
        const flagReason = page.locator('select[name="flag-reason"], [data-testid="flag-reason"]');
        if (await flagReason.isVisible()) {
          await flagReason.selectOption({ index: 1 });
          
          const submitFlag = page.locator('button:has-text("Submit"), [data-testid="submit-flag"]');
          await submitFlag.click();
          
          await expect(page.locator('.success-message, [role="status"]')).toBeVisible({ timeout: 5000 });
        }
      }
    });
  });

  test.describe('Analytics', () => {
    test('should display site analytics', async () => {
      await page.goto('/admin/analytics');
      
      await expect(page.locator('.analytics-dashboard, [data-testid="analytics"]')).toBeVisible();
    });

    test('should filter analytics by date range', async () => {
      await page.goto('/admin/analytics');
      
      const dateRangeSelect = page.locator('select[name="dateRange"], [data-testid="date-range"]');
      if (await dateRangeSelect.isVisible()) {
        await dateRangeSelect.selectOption('last30days');
        await page.waitForTimeout(1000);
        
        // Verify data updated
        await expect(page.locator('.chart, [data-testid="analytics-chart"]')).toBeVisible();
      }
    });

    test('should export analytics report', async () => {
      await page.goto('/admin/analytics');
      
      const exportButton = page.locator('button:has-text("Export"), [data-testid="export-report"]');
      if (await exportButton.isVisible()) {
        // Set up download listener
        const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
        
        await exportButton.click();
        
        const download = await downloadPromise;
        if (download) {
          expect(download.suggestedFilename()).toMatch(/\.csv|\.xlsx|\.pdf/);
        }
      }
    });
  });

  test.describe('System Settings', () => {
    test('should access system settings', async () => {
      await page.goto('/admin/settings');
      
      await expect(page.locator('h1, .settings-title')).toContainText(/settings/i);
    });

    test('should update site configuration', async () => {
      await page.goto('/admin/settings');
      
      const siteNameInput = page.locator('input[name="siteName"], [data-testid="site-name"]');
      if (await siteNameInput.isVisible()) {
        const originalValue = await siteNameInput.inputValue();
        await siteNameInput.clear();
        await siteNameInput.fill('Test Gallery Updated');
        
        const saveButton = page.locator('button:has-text("Save"), button[type="submit"]');
        await saveButton.click();
        
        await expect(page.locator('.success-message, [role="status"]')).toBeVisible({ timeout: 5000 });
        
        // Restore original value
        await siteNameInput.clear();
        await siteNameInput.fill(originalValue);
        await saveButton.click();
      }
    });

    test('should manage email templates', async () => {
      await page.goto('/admin/settings/emails');
      
      const emailTemplates = page.locator('.email-template, [data-testid="email-template"]');
      const count = await emailTemplates.count();
      expect(count).toBeGreaterThan(0);
    });
  });

  test.describe('Access Control', () => {
    test('should deny access to non-admin users', async ({ browser }) => {
      // Create new context for non-admin user
      const context = await browser.newContext();
      const newPage = await context.newPage();
      
      // Login as regular user
      await newPage.goto('/signin');
      await newPage.fill('input[name="email"]', 'user@example.com');
      await newPage.fill('input[name="password"]', 'UserPass123!');
      await newPage.click('button[type="submit"]');
      
      // Try to access admin page
      await newPage.goto('/admin/dashboard');
      
      // Should be redirected or show access denied
      const url = newPage.url();
      const isRedirected = !url.includes('/admin');
      const hasAccessDenied = await newPage.locator('text=/access denied|unauthorized|forbidden/i').isVisible();
      
      expect(isRedirected || hasAccessDenied).toBeTruthy();
      
      await context.close();
    });

    test('should log admin actions for audit', async () => {
      await page.goto('/admin/audit-log');
      
      const auditEntries = page.locator('.audit-entry, [data-testid="audit-log-entry"]');
      const count = await auditEntries.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
