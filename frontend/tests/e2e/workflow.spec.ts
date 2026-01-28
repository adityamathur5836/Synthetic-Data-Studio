import { test, expect } from '@playwright/test';

test.describe('Reseach Studio Workflow', () => {
    test('should navigate through the full synthesis pipeline', async ({ page }) => {
        // 1. Visit Home
        await page.goto('/');
        await expect(page.locator('h1')).toContainText('Medical Data Synthesis');

        // 2. Navigate to Upload
        await page.click('text=1. Upload Dataset');
        await expect(page).toHaveURL(/.*upload/);

        // Simulate File selection (Simplified for E2E)
        await expect(page.locator('text=Click to upload clinical datasets')).toBeVisible();

        // 3. Navigate to Train
        await page.click('text=2. Train GAN');
        await expect(page).toHaveURL(/.*train/);
        await expect(page.locator('text=GAN Training Engine')).toBeVisible();

        // 4. Navigate to Generate
        await page.click('text=3. Generate Data');
        await expect(page).toHaveURL(/.*generate/);
        await expect(page.locator('text=Synthetic Cohort Generator')).toBeVisible();

        // 5. Navigate to Analyze
        await page.click('text=4. Analytics');
        await expect(page).toHaveURL(/.*analyze/);
        await expect(page.locator('text=Privacy & Fidelity Metrics')).toBeVisible();

        // 6. Navigate to Export
        await page.click('text=5. Export Data');
        await expect(page).toHaveURL(/.*export/);
        await expect(page.locator('text=Clinical Export Wizard')).toBeVisible();
    });

    test('should open the documentation help tray', async ({ page }) => {
        await page.goto('/');
        await page.click('button:has-text("Ask AI")');
        await expect(page.locator('text=Research Help')).toBeVisible();
        await expect(page.locator('placeholder=Search documentation...')).toBeVisible();
    });
});
