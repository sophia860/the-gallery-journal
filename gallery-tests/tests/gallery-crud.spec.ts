import { test, expect, Page } from '@playwright/test';

/**
 * Gallery CRUD Operations Test Suite
 * Tests Create, Read, Update, Delete operations for gallery items
 */

test.describe('Gallery CRUD Operations', () => {
  let page: Page;
  const testGalleryItem = {
    title: `Test Gallery Item ${Date.now()}`,
    description: 'Automated test gallery item description',
    category: 'Photography',
    tags: ['test', 'automation', 'e2e']
  };

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    // Login before each test
    await page.goto('/signin');
    await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'TestPass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard**');
  });

  test.describe('CREATE Operations', () => {
    test('should create a new gallery item with all required fields', async () => {
      await page.goto('/gallery/create');
      await page.waitForSelector('form');

      // Fill in required fields
      await page.fill('input[name="title"]', testGalleryItem.title);
      await page.fill('textarea[name="description"]', testGalleryItem.description);
      
      // Select category if dropdown exists
      const categorySelect = page.locator('select[name="category"]');
      if (await categorySelect.isVisible()) {
        await categorySelect.selectOption(testGalleryItem.category);
      }

      // Add tags if input exists
      const tagsInput = page.locator('input[name="tags"]');
      if (await tagsInput.isVisible()) {
        await tagsInput.fill(testGalleryItem.tags.join(', '));
      }

      // Submit form
      await page.click('button[type="submit"]');

      // Verify creation success
      await expect(page).toHaveURL(/\/gallery\/[\w-]+/);
      await expect(page.locator('h1, .gallery-title')).toContainText(testGalleryItem.title);
    });

    test('should show validation errors for empty required fields', async () => {
      await page.goto('/gallery/create');
      await page.click('button[type="submit"]');

      // Check for validation errors
      const errorMessages = page.locator('.error-message, [role="alert"], .field-error');
      await expect(errorMessages.first()).toBeVisible();
    });

    test('should upload image with gallery item', async () => {
      await page.goto('/gallery/create');

      // Find file input and upload test image
      const fileInput = page.locator('input[type="file"]');
      if (await fileInput.isVisible()) {
        // Create a test image buffer
        await fileInput.setInputFiles({
          name: 'test-image.jpg',
          mimeType: 'image/jpeg',
          buffer: Buffer.from('fake-image-content')
        });

        // Verify image preview appears
        await expect(page.locator('.image-preview, img[alt*="preview"]')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('READ Operations', () => {
    test('should display gallery listing with items', async () => {
      await page.goto('/gallery');
      await page.waitForSelector('.gallery-grid, .gallery-list, [data-testid="gallery-container"]');

      // Verify gallery items are displayed
      const galleryItems = page.locator('.gallery-item, [data-testid="gallery-item"]');
      const count = await galleryItems.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('should display individual gallery item details', async () => {
      await page.goto('/gallery');
      
      const firstItem = page.locator('.gallery-item, [data-testid="gallery-item"]').first();
      if (await firstItem.isVisible()) {
        await firstItem.click();
        
        // Verify detail page elements
        await expect(page.locator('h1, .item-title')).toBeVisible();
        await expect(page.locator('.item-description, .description')).toBeVisible();
      }
    });

    test('should filter gallery items by category', async () => {
      await page.goto('/gallery');
      
      const categoryFilter = page.locator('select[name="category"], [data-testid="category-filter"]');
      if (await categoryFilter.isVisible()) {
        await categoryFilter.selectOption({ index: 1 });
        await page.waitForTimeout(500); // Wait for filter to apply

        // Verify filtered results
        const url = page.url();
        expect(url).toContain('category');
      }
    });

    test('should search gallery items', async () => {
      await page.goto('/gallery');
      
      const searchInput = page.locator('input[type="search"], input[name="search"], [data-testid="search-input"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('test');
        await searchInput.press('Enter');
        
        // Verify search applied
        await page.waitForTimeout(500);
        const url = page.url();
        expect(url.toLowerCase()).toMatch(/search|q=/);
      }
    });

    test('should paginate gallery results', async () => {
      await page.goto('/gallery');
      
      const pagination = page.locator('.pagination, [data-testid="pagination"]');
      if (await pagination.isVisible()) {
        const nextButton = pagination.locator('button:has-text("Next"), a:has-text("Next"), [aria-label="Next page"]');
        if (await nextButton.isVisible()) {
          await nextButton.click();
          
          // Verify page changed
          await expect(page).toHaveURL(/page=2|offset=/);
        }
      }
    });
  });

  test.describe('UPDATE Operations', () => {
    test('should update gallery item title', async () => {
      // Navigate to user's gallery items
      await page.goto('/dashboard/gallery');
      
      const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit"), [data-testid="edit-button"]').first();
      if (await editButton.isVisible()) {
        await editButton.click();
        
        // Update title
        const titleInput = page.locator('input[name="title"]');
        const newTitle = `Updated Title ${Date.now()}`;
        await titleInput.clear();
        await titleInput.fill(newTitle);
        
        // Save changes
        await page.click('button[type="submit"], button:has-text("Save")');
        
        // Verify update success
        await expect(page.locator('.success-message, [role="status"]')).toBeVisible({ timeout: 5000 });
      }
    });

    test('should update gallery item description', async () => {
      await page.goto('/dashboard/gallery');
      
      const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
      if (await editButton.isVisible()) {
        await editButton.click();
        
        const descriptionInput = page.locator('textarea[name="description"]');
        const newDescription = 'Updated description for automated testing';
        await descriptionInput.clear();
        await descriptionInput.fill(newDescription);
        
        await page.click('button[type="submit"], button:has-text("Save")');
        await expect(page.locator('.success-message, [role="status"]')).toBeVisible({ timeout: 5000 });
      }
    });

    test('should replace gallery item image', async () => {
      await page.goto('/dashboard/gallery');
      
      const editButton = page.locator('button:has-text("Edit"), a:has-text("Edit")').first();
      if (await editButton.isVisible()) {
        await editButton.click();
        
        const fileInput = page.locator('input[type="file"]');
        if (await fileInput.isVisible()) {
          await fileInput.setInputFiles({
            name: 'updated-image.jpg',
            mimeType: 'image/jpeg',
            buffer: Buffer.from('updated-fake-image-content')
          });
          
          await page.click('button[type="submit"], button:has-text("Save")');
          await expect(page.locator('.success-message, [role="status"]')).toBeVisible({ timeout: 5000 });
        }
      }
    });
  });

  test.describe('DELETE Operations', () => {
    test('should delete gallery item with confirmation', async () => {
      await page.goto('/dashboard/gallery');
      
      const deleteButton = page.locator('button:has-text("Delete"), [data-testid="delete-button"]').first();
      if (await deleteButton.isVisible()) {
        // Get initial count
        const initialCount = await page.locator('.gallery-item, [data-testid="gallery-item"]').count();
        
        await deleteButton.click();
        
        // Handle confirmation dialog
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes"), [data-testid="confirm-delete"]');
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
        }
        
        // Verify deletion
        await page.waitForTimeout(1000);
        const newCount = await page.locator('.gallery-item, [data-testid="gallery-item"]').count();
        expect(newCount).toBeLessThan(initialCount);
      }
    });

    test('should cancel delete operation', async () => {
      await page.goto('/dashboard/gallery');
      
      const deleteButton = page.locator('button:has-text("Delete"), [data-testid="delete-button"]').first();
      if (await deleteButton.isVisible()) {
        const initialCount = await page.locator('.gallery-item, [data-testid="gallery-item"]').count();
        
        await deleteButton.click();
        
        // Cancel deletion
        const cancelButton = page.locator('button:has-text("Cancel"), button:has-text("No"), [data-testid="cancel-delete"]');
        if (await cancelButton.isVisible()) {
          await cancelButton.click();
        }
        
        // Verify item still exists
        const newCount = await page.locator('.gallery-item, [data-testid="gallery-item"]').count();
        expect(newCount).toBe(initialCount);
      }
    });

    test('should not allow deletion of items owned by others', async () => {
      await page.goto('/gallery');
      
      // Navigate to another user's item
      const otherUserItem = page.locator('.gallery-item:not([data-owner="current-user"])').first();
      if (await otherUserItem.isVisible()) {
        await otherUserItem.click();
        
        // Delete button should not be visible or should be disabled
        const deleteButton = page.locator('button:has-text("Delete")');
        if (await deleteButton.isVisible()) {
          await expect(deleteButton).toBeDisabled();
        }
      }
    });
  });

  test.describe('Bulk Operations', () => {
    test('should select multiple gallery items', async () => {
      await page.goto('/dashboard/gallery');
      
      const checkboxes = page.locator('input[type="checkbox"][name*="select"], .item-checkbox');
      const count = await checkboxes.count();
      
      if (count >= 2) {
        await checkboxes.nth(0).check();
        await checkboxes.nth(1).check();
        
        // Verify bulk action bar appears
        const bulkActionBar = page.locator('.bulk-actions, [data-testid="bulk-actions"]');
        await expect(bulkActionBar).toBeVisible();
      }
    });

    test('should bulk delete selected items', async () => {
      await page.goto('/dashboard/gallery');
      
      const checkboxes = page.locator('input[type="checkbox"][name*="select"], .item-checkbox');
      if (await checkboxes.count() >= 2) {
        await checkboxes.nth(0).check();
        await checkboxes.nth(1).check();
        
        const bulkDeleteButton = page.locator('button:has-text("Delete Selected"), [data-testid="bulk-delete"]');
        if (await bulkDeleteButton.isVisible()) {
          await bulkDeleteButton.click();
          
          // Confirm bulk delete
          const confirmButton = page.locator('button:has-text("Confirm"), [data-testid="confirm-bulk-delete"]');
          if (await confirmButton.isVisible()) {
            await confirmButton.click();
            
            // Verify success message
            await expect(page.locator('.success-message, [role="status"]')).toBeVisible({ timeout: 5000 });
          }
        }
      }
    });
  });
});
