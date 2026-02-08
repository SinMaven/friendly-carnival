import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('should allow user to navigate to login page', async ({ page }) => {
        await page.goto('/login');
        await expect(page).toHaveTitle(/Login/);
    });
});

test.describe('Public Access', () => {
    test('should show landing page', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/Duckurity/);
    });
});
