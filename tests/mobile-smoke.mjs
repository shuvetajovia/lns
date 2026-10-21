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
  const user = (email) => ({ id: email.startsWith('admin') ? '00000000-0000-4000-8000-000000000001' : '00000000-0000-4000-8000-000000000002', aud: 'authenticated', role: 'authenticated', email, email_confirmed_at: new Date().toISOString(), app_metadata: { provider: 'email', providers: ['email'] }, user_metadata: { full_name: 'Test Patron', role: email.startsWith('admin') ? 'admin' : 'customer' }, created_at: new Date().toISOString() });
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
  await mkdir('test-results', { recursive: true });
  const inspect = async (label) => {
    await page.locator('.auth-card, .mn-store-wrapper').first().waitFor();
    const overflow = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => {
      const r = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return r.width && r.right > innerWidth + 2 && style.position !== 'fixed' && !el.closest('.mn-cart-drawer');
    }).slice(0, 8).map(el => ({tag: el.tagName, cls: el.className, text: el.textContent.slice(0, 65), width: Math.round(el.getBoundingClientRect().width)})));
    const dimensions = await page.evaluate(() => ({viewport: innerWidth, document: document.documentElement.scrollWidth}));
    assert.ok(dimensions.document <= dimensions.viewport, `${label}: page exceeds viewport: ${JSON.stringify(dimensions)}`);
    for (const width of [320, 390, 768, 820, 1024, 1440]) {
      await page.setViewportSize({width, height: 900});
      const fits = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
      if (!fits) console.log(await page.evaluate(() => [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > innerWidth + 2).slice(0,12).map(el => ({tag:el.tagName,cls:el.className,text:el.textContent.slice(0,45),w:el.getBoundingClientRect().width}))));
      assert.ok(fits, `${label} overflows at ${width}px`);
    }
    await page.setViewportSize({width: 360, height: 800});
    console.log(`PASS ${label}: no page overflow at phone, tablet, and desktop widths`);
    if (label.endsWith('bottom')) await page.locator('.mn-admin-product-form').evaluate(el => el.scrollTop = el.scrollHeight);
    await page.screenshot({path: `test-results/${label}.png`, fullPage: false});
  };
  await page.setViewportSize({width: 360, height: 800});
  await open('/login'); await inspect('mobile-login');
  await open('/register'); await inspect('mobile-registration');
  await open('/login');
  await page.getByLabel('Email address').fill('customer@example.com');
  await page.getByLabel('Password', {exact:true}).fill('test-password');
  await page.getByRole('button', {name:'Sign in',exact:true}).click(); await waitPath('/');
  for (const path of ['/', '/shop', '/product/1', '/checkout']) { await open(path); await inspect(`mobile-customer-${path.replaceAll('/', '') || 'home'}`); }
  await open('/product/1');
  await page.getByRole('button', {name:'Instant Checkout',exact:true}).click();
  await waitPath('/checkout'); await inspect('mobile-checkout-address');
  await page.getByTitle('Royal Sanctuary Account').click();
  await page.getByRole('button', {name:'Sign out',exact:true}).click(); await waitPath('/login');
  await page.getByLabel('Email address').fill('admin@mothernature.in');
  await page.getByLabel('Password', {exact:true}).fill('test-password');
  await page.getByRole('button', {name:'Sign in',exact:true}).click(); await waitPath('/admin');
  await inspect('mobile-admin');
  await page.getByRole('button', {name:'Add New Product',exact:true}).click();
  await inspect('mobile-admin-product-form');
  const form = page.locator('.mn-admin-product-form');
  await form.evaluate(el => el.scrollTop = el.scrollHeight);
  await inspect('mobile-admin-product-form-bottom');
  assert.deepEqual(errors, []);
  console.log('PASS no browser errors');
} finally {
  await browser?.close(); server.kill();
  if (server.exitCode === null) await Promise.race([once(server, 'exit'), new Promise(resolve => setTimeout(resolve, 2000))]);
}
