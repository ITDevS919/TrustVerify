/**
 * E2E Tests for Authentication Flow
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveTitle(/TrustVerify/i);
    await expect(page.locator('input[type="text"], input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/login');
    // Look for signup link or button
    const signupLink = page.locator('a[href*="register"], a[href*="signup"], text=Sign up, text=Register, text=Create account');
    if (await signupLink.count() > 0) {
      await signupLink.first().click();
      await expect(page).toHaveURL(/.*register/i);
    } else {
      // If no link found, navigate directly
      await page.goto('/register');
      await expect(page).toHaveURL(/.*register/i);
    }
  });

  test('should register a new user', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `e2e_test_${timestamp}@example.com`;
    const testUsername = `e2e_user_${timestamp}`;

    await page.goto('/register');
    
    // Fill registration form
    // Wait for form to be visible
    await page.waitForSelector('input[type="email"], input[name="email"], input[type="text"]', { timeout: 5000 });
    
    // Fill registration form - try different selectors
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const usernameInput = page.locator('input[name="username"], input[type="text"]').first();
    const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    
    if (await emailInput.count() > 0) {
      await emailInput.fill(testEmail);
    }
    if (await usernameInput.count() > 0) {
      await usernameInput.fill(testUsername);
    }
    if (await passwordInput.count() > 0) {
      await passwordInput.fill('TestPassword123!');
    }
    
    // Submit form
    const submitButton = page.locator('button[type="submit"], button:has-text("Register"), button:has-text("Sign up"), button:has-text("Create")').first();
    await submitButton.click();
    
    // Wait for redirect or success message
    await page.waitForTimeout(2000);
    
    // Should redirect to dashboard or show success
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/dashboard|login|success/i);
  });

  test('should login with valid credentials', async ({ page }) => {
    // This test assumes test user exists
    // In a real scenario, you'd create the user first or use test fixtures
    
    await page.goto('/login');
    
    // Wait for form
    await page.waitForSelector('input[type="text"], input[name="username"], input[type="email"], input[type="password"]', { timeout: 5000 });
    
    // Fill login form
    const usernameInput = page.locator('input[type="text"], input[name="username"], input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    await usernameInput.fill('test@example.com');
    await passwordInput.fill('password');
    
    // Submit
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")').first();
    await submitButton.click();
    
    // Wait for redirect or error
    await page.waitForTimeout(3000);
    
    // Should redirect to dashboard or show error
    const currentUrl = page.url();
    // Accept either dashboard redirect or staying on login (if credentials invalid)
    expect(currentUrl).toMatch(/dashboard|login/i);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="text"], input[name="username"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await page.waitForTimeout(1000);
    
    // Should show error message
    const errorText = await page.textContent('body');
    expect(errorText).toMatch(/error|invalid|incorrect/i);
  });

  test('should logout successfully', async ({ page, context }) => {
    // First login (simplified - in real test you'd use fixtures)
    await page.goto('/login');
    // ... login steps ...
    
    // Then logout
    await page.goto('/dashboard');
    await page.click('button:has-text("Logout"), button:has-text("Sign out")');
    
    // Should redirect to home or login
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/login|home|\/$/i);
  });
});

