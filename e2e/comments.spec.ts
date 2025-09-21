import { test, expect } from '@playwright/test';

test.describe('Comments Discussion Board', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Clear IndexedDB before each test
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        const deleteReq = indexedDB.deleteDatabase('CommentsDatabase');
        deleteReq.onsuccess = () => resolve();
        deleteReq.onerror = () => resolve();
        deleteReq.onblocked = () => resolve();
      });
    });
    await page.reload();
  });

  test('should display the comments page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Comments');
    await expect(page.locator('text=0 comments')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Add a comment');
  });

  test('should add a new comment', async ({ page }) => {
    // Fill in the form
    await page.fill('input[name="author"]', 'E2E Test User');
    await page.fill('textarea[name="text"]', 'This is an E2E test comment');

    // Submit the form
    await page.click('button:has-text("Post comment")');

    // Verify comment appears
    await expect(page.locator('text=This is an E2E test comment')).toBeVisible();
    await expect(page.locator('text=E2E Test User')).toBeVisible();
    await expect(page.locator('text=1 comment')).toBeVisible();
  });

  test('should edit a comment', async ({ page }) => {
    // Add a comment first
    await page.fill('input[name="author"]', 'Test Author');
    await page.fill('textarea[name="text"]', 'Original comment');
    await page.click('button:has-text("Post comment")');

    // Wait for comment to appear
    await expect(page.locator('text=Original comment')).toBeVisible();

    // Click edit button
    await page.click('button:has-text("Edit")');

    // Edit the comment
    const editTextarea = page.locator('textarea[name="text"]').nth(1);
    await editTextarea.fill('Edited comment');
    await page.click('button:has-text("Save")');

    // Verify edited comment
    await expect(page.locator('text=Edited comment')).toBeVisible();
    await expect(page.locator('text=Original comment')).not.toBeVisible();
  });

  test('should delete a comment', async ({ page }) => {
    // Setup dialog handler before any actions
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    // Add a comment
    await page.fill('input[name="author"]', 'Test Author');
    await page.fill('textarea[name="text"]', 'Comment to delete');
    await page.click('button:has-text("Post comment")');

    // Wait for comment to appear
    await expect(page.locator('text=Comment to delete')).toBeVisible();
    await expect(page.locator('text=1 comment')).toBeVisible();

    // Delete the comment
    await page.click('button:has-text("Delete")');

    // Wait for the deletion to complete
    await page.waitForTimeout(1000);

    // Verify comment is deleted
    await expect(page.locator('text=Comment to delete')).not.toBeVisible();
    await expect(page.locator('text=0 comments')).toBeVisible();
  });

  test('should add a reply to a comment', async ({ page }) => {
    // Add parent comment
    await page.fill('input[name="author"]', 'Parent Author');
    await page.fill('textarea[name="text"]', 'Parent comment');
    await page.click('button:has-text("Post comment")');

    // Wait for comment to appear
    await expect(page.locator('text=Parent comment')).toBeVisible();

    // Click reply button
    await page.click('button:has-text("Reply")');

    // Fill reply form
    const replyTextarea = page.locator('textarea').nth(1);
    await replyTextarea.fill('This is a reply');
    await page.locator('button:has-text("Reply")').nth(1).click();

    // Verify reply appears
    await expect(page.locator('text=This is a reply')).toBeVisible();
    await expect(page.locator('text=2 comments')).toBeVisible();
  });

  test('should handle nested comments up to 4 levels', async ({ page }) => {
    // Level 1 - Root comment
    await page.fill('input[name="author"]', 'User');
    await page.fill('textarea[name="text"]', 'Level 1 comment');
    await page.click('button:has-text("Post comment")');
    await expect(page.locator('text=Level 1 comment')).toBeVisible();

    // Level 2 - Reply to root
    await page.click('button:has-text("Reply")');
    await page.locator('textarea').nth(1).fill('Level 2 comment');
    await page.locator('button:has-text("Reply")').nth(1).click();
    await expect(page.locator('text=Level 2 comment')).toBeVisible();

    // Level 3 - Reply to level 2
    await page.locator('button:has-text("Reply")').nth(1).click();
    await page.locator('textarea').nth(1).fill('Level 3 comment');
    await page.locator('button:has-text("Reply")').nth(2).click();
    await expect(page.locator('text=Level 3 comment')).toBeVisible();

    // Level 4 - Reply to level 3
    await page.locator('button:has-text("Reply")').nth(2).click();
    await page.locator('textarea').nth(1).fill('Level 4 comment');
    await page.locator('button:has-text("Reply")').nth(3).click();
    await expect(page.locator('text=Level 4 comment')).toBeVisible();

    // Verify we have 4 comments total
    await expect(page.locator('text=4 comments')).toBeVisible();
  });

  test('should collapse and expand comments', async ({ page }) => {
    // Add a comment with a reply
    await page.fill('input[name="author"]', 'Test User');
    await page.fill('textarea[name="text"]', 'Parent comment');
    await page.click('button:has-text("Post comment")');

    await page.click('button:has-text("Reply")');
    await page.locator('textarea').nth(1).fill('Child comment');
    await page.locator('button:has-text("Reply")').nth(1).click();

    // Both comments should be visible
    await expect(page.locator('text=Parent comment')).toBeVisible();
    await expect(page.locator('text=Child comment')).toBeVisible();

    // Collapse parent comment
    await page.locator('button:has-text("[-]")').first().click();

    // Parent content should be hidden - the collapse hides the content
    await expect(page.locator('text=Parent comment')).not.toBeVisible();
    // Child comments are also hidden when parent is collapsed
    await expect(page.locator('text=Child comment')).not.toBeVisible();

    // Expand parent comment
    await page.click('button:has-text("[+]")');

    // Both should be visible again
    await expect(page.locator('text=Parent comment')).toBeVisible();
    await expect(page.locator('text=Child comment')).toBeVisible();
  });

  test('should persist author name in localStorage', async ({ page }) => {
    // Add a comment with author name
    await page.fill('input[name="author"]', 'Persistent Author');
    await page.fill('textarea[name="text"]', 'First comment');
    await page.click('button:has-text("Post comment")');

    // Reload the page
    await page.reload();

    // Author name should be persisted
    const authorInput = page.locator('input[name="author"]');
    await expect(authorInput).toHaveValue('Persistent Author');
  });

  test('should submit with keyboard shortcut Cmd+Enter or Ctrl+Enter', async ({ page }) => {
    await page.fill('input[name="author"]', 'Keyboard User');
    await page.fill('textarea[name="text"]', 'Submitted with keyboard');

    // Use keyboard shortcut (works on all platforms)
    const textarea = page.locator('textarea[name="text"]');
    await textarea.press('Control+Enter');

    // Verify comment was submitted
    await expect(page.locator('text=Submitted with keyboard')).toBeVisible();
  });

  test('should handle concurrent operations', async ({ page }) => {
    // Add multiple comments quickly
    for (let i = 1; i <= 3; i++) {
      await page.fill('input[name="author"]', `User ${i}`);
      await page.fill('textarea[name="text"]', `Comment ${i}`);
      await page.click('button:has-text("Post comment")');

      // Wait for comment to appear before adding next
      await expect(page.locator(`text=Comment ${i}`)).toBeVisible();
    }

    // All comments should be visible
    await expect(page.locator('text=3 comments')).toBeVisible();
    await expect(page.locator('text=Comment 1')).toBeVisible();
    await expect(page.locator('text=Comment 2')).toBeVisible();
    await expect(page.locator('text=Comment 3')).toBeVisible();
  });

  test('should handle soft delete for parent comments', async ({ page }) => {
    // Setup dialog handler before any actions
    page.on('dialog', async (dialog) => {
      await dialog.accept();
    });

    // Add parent comment
    await page.fill('input[name="author"]', 'Parent User');
    await page.fill('textarea[name="text"]', 'Parent comment');
    await page.click('button:has-text("Post comment")');

    // Wait for comment to appear
    await expect(page.locator('text=Parent comment')).toBeVisible();

    // Add reply
    await page.click('button:has-text("Reply")');
    await page.locator('textarea').nth(1).fill('Child comment');
    await page.locator('button:has-text("Reply")').nth(1).click();

    // Wait for reply to appear
    await expect(page.locator('text=Child comment')).toBeVisible();

    // Delete parent (should soft delete)
    await page.locator('button:has-text("Delete")').first().click();

    // Wait for the deletion to process
    await page.waitForTimeout(1000);

    // Parent should show [deleted] - there should be exactly 2 (author and text)
    await expect(page.locator('text=[deleted]').first()).toBeVisible();
    // Child should still be visible
    await expect(page.locator('text=Child comment')).toBeVisible();
  });
});
