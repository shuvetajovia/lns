import assert from 'node:assert/strict';
import { startBrowser } from './browser-harness.mjs';
import { dbProducts } from './fixtures.mjs';

const app = await startBrowser();
const { page, login, open, state } = app;
try {
  await page.route('**/rest/v1/products**', route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify(dbProducts.map(product => ({ ...product, rating: 4.9, reviews_count: 148 })))
  }));
  await page.route('**/rest/v1/reviews**', route => route.fulfill({
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Seeded reviewer', rating: 5, verified: true, comment: 'Seeded testimonial' }])
  }));
  await login('customer@example.com');
  await page.locator('.mn-product-card').first().waitFor();
  assert.equal(await page.getByText('Seeded testimonial').count(), 0);
  assert.equal(await page.getByText('Words from Our Royal Patrons').count(), 0);
  assert.equal(await page.getByText(/Beloved by thousands/).count(), 0);
  assert.equal(await page.locator('.mn-rating-pill').count(), 0);
  await open('/shop');
  await page.locator('.mn-product-card').first().waitFor();
  assert.equal(await page.locator('option[value="rating"]').count(), 0);
  assert.equal(await page.locator('.mn-rating-pill').count(), 0);
  await open('/product/1');
  await page.locator('.mn-pdp-showcase').waitFor();
  assert.equal(await page.getByText(/verified royal patrons|4\.9 \/ 5\.0/).count(), 0);
  assert.deepEqual(state.pageErrors, []);
  console.log('PASS seeded reviews and product ratings never appear as customer purchase evidence');
} finally { await app.close(); }
