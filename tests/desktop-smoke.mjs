import assert from 'node:assert/strict';
import {startBrowser} from './browser-harness.mjs';
const app=await startBrowser({desktop:true});
const {page,open,state}=app;
try {
  await open('/admin');await page.waitForURL(url=>url.hash==='#/login');
  await page.getByLabel('Email address',{exact:true}).fill('customer@example.com');
  await page.getByLabel('Password',{exact:true}).fill('test-password');
  await page.getByRole('button',{name:'Sign in',exact:true}).click();
  await page.getByRole('heading',{name:'Store admin access required'}).waitFor();
  await page.getByRole('button',{name:'Sign out and switch account'}).click();
  await page.getByLabel('Email address',{exact:true}).waitFor();
  await page.getByLabel('Email address',{exact:true}).fill('admin@mothernature.in');
  await page.getByLabel('Password',{exact:true}).fill('test-password');
  await page.getByRole('button',{name:'Sign in',exact:true}).click();
  await page.getByRole('heading',{name:'Mother Nature Admin',exact:true}).waitFor();
  await page.getByRole('link',{name:'Financials, cancellation requests, feedback and newsletter preferences'}).click();
  await page.getByRole('heading',{name:'Financials and feedback'}).waitFor();
  await page.getByRole('heading',{name:'Newsletter preferences'}).waitFor();
  assert.deepEqual(state.pageErrors,[]);
  console.log('PASS desktop renderer rejects customers and loads owner inventory, financials and feedback');
} finally { await app.close(); }
