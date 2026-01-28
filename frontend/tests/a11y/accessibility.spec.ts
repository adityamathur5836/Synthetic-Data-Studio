import { test, expect } from '@playwright/test';
const { injectAxe, checkA11y } = require('axe-playwright');

test.describe('Platform Accessibility Audit', () => {
    test('home page should be accessible', async ({ page }) => {
        await page.goto('/');
        await injectAxe(page);
        await checkA11y(page, null, {
            axeOptions: {
                runOnly: {
                    type: 'tag',
                    values: ['wcag2a', 'wcag2aa', 'best-practice'],
                },
            },
            detailedReport: true,
            detailedReportOptions: { html: true },
        });
    });

    test('analytics page should be accessible', async ({ page }) => {
        await page.goto('/analyze');
        await injectAxe(page);
        await checkA11y(page);
    });
});
