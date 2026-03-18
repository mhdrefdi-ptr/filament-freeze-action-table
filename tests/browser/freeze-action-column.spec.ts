import { expect, test } from '@playwright/test';

const TABLE_SELECTOR = '.fi-ta-table';
const FROZEN_SELECTOR = '.fft-freeze-action-col';

test.describe('freeze action column', () => {
    test('no horizontal overflow => no shadow', async ({ page }) => {
        await page.goto(process.env.FFT_TEST_URL ?? 'http://127.0.0.1:8000/admin/users');

        const table = page.locator(TABLE_SELECTOR).first();
        await expect(table).toBeVisible();

        const frozenCell = table.locator(`tbody tr ${FROZEN_SELECTOR}`).first();
        await expect(frozenCell).toBeVisible();

        await expect(frozenCell).not.toHaveClass(/fft-freeze-shadow/);
    });

    test('with horizontal overflow => sticky + shadow', async ({ page }) => {
        await page.goto(process.env.FFT_TEST_URL_WIDE ?? 'http://127.0.0.1:8000/admin/users-wide');

        const table = page.locator(TABLE_SELECTOR).first();
        await expect(table).toBeVisible();

        const frozenCell = table.locator(`tbody tr ${FROZEN_SELECTOR}`).first();
        await expect(frozenCell).toBeVisible();
        await expect(frozenCell).toHaveClass(/fft-freeze-shadow/);
    });

    test('dark mode row hover keeps opaque frozen cell background', async ({ page }) => {
        await page.goto(process.env.FFT_TEST_URL ?? 'http://127.0.0.1:8000/admin/users');

        await page.evaluate(() => document.documentElement.classList.add('dark'));

        const row = page.locator(`${TABLE_SELECTOR} tbody tr.fi-clickable`).first();
        const frozenCell = row.locator(FROZEN_SELECTOR).first();

        await row.hover();

        const bgColor = await frozenCell.evaluate((el) => getComputedStyle(el).backgroundColor);
        expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    });
});
