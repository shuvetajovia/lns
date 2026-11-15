import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { startBrowser } from './browser-harness.mjs';
const app = await startBrowser();
const { page, login, logout, state } = app;
try {
  await login('customer@example.com');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator('.mn-footer-link').first().click();
  await page.waitForURL(url => url.hash.includes('/shop?cat='));
  await page.waitForFunction(() => window.scrollY === 0);
  await page.getByRole('link', { name: 'Our Story', exact: true }).click();
  await page.waitForURL(url => url.hash === '#/#story');
  await page.waitForFunction(() => {
    const top = document.getElementById('story')?.getBoundingClientRect().top;
    return top >= 0 && top < 250;
  });
  await logout();
  let districts = [{ id: 1, district: 'Chennai', is_active: true }];
  let failSave = false;
  await page.route('**/rest/v1/areas**', async route => {
    const request = route.request();
    if (request.method() === 'POST') {
      if (failSave) return route.fulfill({ status: 403, contentType: 'application/json', body: JSON.stringify({ message: 'District save denied' }) });
      const added = { id: 2, ...request.postDataJSON() };
      districts.push(added);
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify(added) });
    }
    return route.fulfill({ contentType: 'application/json', body: JSON.stringify(districts) });
  });
  await login('admin@mothernature.in');
  await page.getByRole('heading', { name: 'Mother Nature Admin', exact: true }).waitFor();
  assert.equal(await page.getByTitle('Shopping Cart').count(), 0);
  assert.equal(await page.locator('footer').count(), 0);
  await page.getByRole('button', { name: /Delivery Zones/ }).click();
  await page.getByLabel('Add delivery district').selectOption('Coimbatore');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Delivery district Coimbatore added.' }).waitFor();
  await page.reload();
  await page.getByRole('button', { name: /Delivery Zones/ }).click();
  await page.getByText('Coimbatore', { exact: true }).waitFor();
  failSave = true;
  await page.getByLabel('Add delivery district').selectOption('Erode');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'Could not add district: District save denied' }).waitFor();
  assert.equal(await page.getByLabel('Add delivery district').inputValue(), 'Erode');
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Admin overflow at ${width}`);
  }
  await mkdir('test-results', { recursive: true });
  await page.screenshot({ path: 'test-results/admin-districts.png', fullPage: true });
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.waitForURL(url => url.hash === '#/login');
  assert.deepEqual(state.pageErrors, []);
  console.log('PASS customer scroll destinations, story links, admin layout, district saves/reloads/errors, responsive layout and admin sign out');
} finally { await app.close(); }
