import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '5183', '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
let browser;
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Vite startup timed out')), 15000);
    server.stdout.on('data', chunk => { if (chunk.toString().includes('ready')) { clearTimeout(timer); resolve(); } });
    server.on('exit', code => reject(new Error(`Vite exited ${code}`)));
    server.stderr.on('data', chunk => process.stderr.write(chunk));
  });
  browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  let admin = false;
  let signupSession = false;
  let rpcFail = false;
  let signupPayload;
  const user = (email) => ({ id: email.startsWith('admin') ? '00000000-0000-4000-8000-000000000001' : '00000000-0000-4000-8000-000000000002', aud: 'authenticated', role: 'authenticated', email, email_confirmed_at: new Date().toISOString(), app_metadata: { provider: 'email', providers: ['email'] }, user_metadata: { full_name: 'Test Patron', role: 'admin' }, created_at: new Date().toISOString() });
  const token = email => {
    const u = user(email);
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const jwt = [Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url'), Buffer.from(JSON.stringify({ sub: u.id, exp, role: 'authenticated' })).toString('base64url'), 'test'].join('.');
    return { access_token: jwt, token_type: 'bearer', expires_in: 3600, expires_at: exp, refresh_token: 'test-refresh', user: u };
  };
  await page.route('https://xdppczyeztarvralihtt.supabase.co/**', async route => {
    const url = route.request().url();
    const body = route.request().postDataJSON();
    let response = [];
    let status = 200;
    if (url.includes('/auth/v1/token')) {
      if (body.password === 'incorrect') { status = 400; response = { code: 'invalid_credentials', msg: 'Invalid login credentials' }; }
      else { admin = body.email === 'admin@mothernature.in'; response = token(body.email); }
    } else if (url.includes('/auth/v1/signup')) {
      signupPayload = body;
      admin = false;
      response = signupSession ? token(body.email) : { user: user(body.email), session: null };
    } else if (url.includes('/auth/v1/logout')) response = {};
    else if (url.includes('/rpc/is_store_admin')) {
      response = rpcFail ? { message: 'RPC unavailable' } : admin;
      if (rpcFail) status = 503;
    }
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(response) });
  });
  const open = async path => { await page.goto(`http://127.0.0.1:5183/#${path}`); };
  const waitPath = async path => { await page.waitForURL(url => url.hash === `#${path}`); };
  for (const path of ['/', '/shop?cat=heritage-rice', '/product/1', '/checkout', '/admin']) {
    await open(path); await waitPath('/login');
    assert.equal(await page.getByRole('navigation', { name: 'Account access' }).count(), 1);
    assert.equal(await page.locator('.mn-store-wrapper').count(), 0);
  }
  console.log('PASS signed-out deep links require login, without exposing the store layout');
  await page.getByLabel('Email address').fill('customer@example.com');
  await page.getByLabel('Password', { exact: true }).fill('incorrect');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('alert').waitFor();
  assert.match(await page.getByRole('alert').innerText(), /Invalid login credentials/);
  console.log('PASS invalid credentials stay on login');
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await waitPath('/');
  await open('/admin'); await waitPath('/');
  console.log('PASS customer goes to store and cannot enter admin, even with forged user_metadata.role');
  await page.getByTitle('Royal Sanctuary Account').click();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await waitPath('/login');
  await page.reload(); await waitPath('/login');
  console.log('PASS logout removes protected access across reload');
  await page.getByLabel('Email address').fill('admin@mothernature.in');
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await waitPath('/admin');
  await page.reload(); await waitPath('/admin');
  await page.locator('.mn-store-wrapper').waitFor();
  assert.equal(await page.locator('.mn-store-wrapper').count(), 1);
  await open('/checkout'); await waitPath('/admin');
  console.log('PASS server-verified admin opens dashboard, persists on reload, and stays in admin area');
  await page.getByTitle('Royal Sanctuary Account').click();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await waitPath('/login');
  await open('/register');
  await page.getByLabel('Full name').fill('Test Patron');
  await page.getByLabel('Email address').fill('new@example.com');
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByLabel('Confirm password').fill('different-password');
  await page.getByRole('button', { name: 'Create customer account' }).click();
  await page.getByRole('alert').waitFor();
  assert.match(await page.getByRole('alert').innerText(), /do not match/);
  await page.getByLabel('Confirm password').fill('test-password');
  await page.getByRole('button', { name: 'Create customer account' }).click();
  await page.getByRole('status').filter({ hasText: 'Check your email' }).waitFor();
  assert.equal(signupPayload.data.role, undefined);
  assert.equal(page.url().split('#')[1], '/register');
  console.log('PASS registration validates confirmation and handles email verification without granting admin');
  signupSession = true;
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByLabel('Confirm password').fill('test-password');
  await page.getByRole('button', { name: 'Create customer account' }).click();
  await waitPath('/');
  console.log('PASS immediate-session registration opens customer store');
  await page.getByTitle('Royal Sanctuary Account').click();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await waitPath('/login');
  rpcFail = true;
  await page.getByLabel('Email address').fill('admin@mothernature.in');
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('button', { name: 'Try again' }).waitFor();
  await open('/admin'); await waitPath('/login');
  console.log('PASS role verification failure keeps protected routes closed');
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.getByLabel('Email address').waitFor();
  await mkdir('test-results', { recursive: true });
  await page.screenshot({ path: 'test-results/login-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'test-results/login-mobile.png', fullPage: true });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
  await open('/register');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth), false);
  assert.deepEqual(errors, []);
  console.log('PASS mobile login/registration fit the viewport; no browser errors');
} finally {
  await browser?.close();
  server.kill();
  if (server.exitCode === null) await Promise.race([once(server, 'exit'), new Promise(resolve => setTimeout(resolve, 2000))]);
}
