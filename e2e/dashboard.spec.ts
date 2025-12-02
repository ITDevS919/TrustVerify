/**
 * E2E Tests for Dashboard
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login first (in real scenario, use fixtures)
    await page.goto('/login');
    // ... login steps ...
    await page.goto('/dashboard');
  });

  test('should display dashboard after login', async ({ page }) => {
    await expect(page).toHaveURL(/.*dashboard/i);
    await expect(page.locator('text=Dashboard, text=Welcome, h1, h2')).toBeVisible();
  });

  test('should display user statistics', async ({ page }) => {
    // Check for stats cards or metrics
    await expect(page.locator('text=Transactions, text=Trust Score, text=Active')).toBeVisible();
  });

  test('should navigate to new transaction', async ({ page }) => {
    await page.click('text=New Transaction, button:has-text("New Transaction")');
    await expect(page).toHaveURL(/.*transaction.*new/i);
  });

  test('should display transaction list', async ({ page }) => {
    // Check for transaction list or table
    await expect(page.locator('table, [role="table"], .transaction-list')).toBeVisible();
  });
});

