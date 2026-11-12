import assert from 'node:assert/strict';
export async function assertPrivateResponse(response, marker='') {
  const status=response.status();
  const body=await response.text();
  if(marker) assert.equal(body.includes(marker),false,'Private CSV content must never be exposed');
  if(status===403 || status===404) return;
  // A missing ignored file may reach Vite's SPA fallback in a fresh CI checkout.
  assert.equal(status,200,'Private paths must be denied, missing, or return the app shell');
  assert.match(response.headers()['content-type'] || '',/^text\/html\b/i,'A 200 response must be HTML, never CSV');
  assert.match(body,/<div\s+id=["']root["']\s*>\s*<\/div>/,'A 200 response must contain the app root');
  assert.match(body,/<script\b[^>]*src=["']\/src\/main\.jsx["']/,'A 200 response must be the Vite app shell');
}
