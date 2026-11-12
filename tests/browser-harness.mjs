import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { dbProducts, mockProfile } from './fixtures.mjs';
export async function startBrowser({desktop=false}={}) {
  const server=spawn(process.execPath,['node_modules/vite/bin/vite.js',...(desktop?['admin-portal','--config','admin-portal/vite.config.js']:[]),'--host','127.0.0.1','--port','5184','--strictPort'],{windowsHide:true,stdio:['ignore','pipe','pipe'],env:{...process.env,VITE_SUPABASE_URL:'https://xdppczyeztarvralihtt.supabase.co',VITE_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_test',VITE_SITE_URL:''}});
  await new Promise((resolve,reject) => {
    const timer=setTimeout(()=>reject(new Error('Vite startup timed out')),20000);
    server.stdout.on('data',chunk=>{if(chunk.toString().includes('ready')){clearTimeout(timer);resolve();}});
    server.on('exit',code=>reject(new Error(`Vite exited ${code}`)));
  });
  let browser;
  try { browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL || (process.platform==='win32'?'msedge':undefined)}); }
  catch(error) { server.kill(); throw error; }
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const state={ email:'customer@example.com', catalogError:false, emptyCatalog:false, zoneActive:true, orders:[], profiles:{}, requests:[], pageErrors:[] };
  page.on('pageerror',error=>state.pageErrors.push(error.message));
  const uid=email=>email.startsWith('admin')?'00000000-0000-4000-8000-000000000001':email.startsWith('other')?'00000000-0000-4000-8000-000000000003':'00000000-0000-4000-8000-000000000002';
  const user=email=>({id:uid(email),aud:'authenticated',role:'authenticated',email,email_confirmed_at:new Date().toISOString(),user_metadata:{full_name:email.startsWith('other')?'Other Patron':'Test Patron'},app_metadata:{provider:'email',providers:['email']}});
  const token=email=>{
    const exp=Math.floor(Date.now()/1000)+3600;
    const jwt=[Buffer.from('{"alg":"HS256","typ":"JWT"}').toString('base64url'),Buffer.from(JSON.stringify({sub:uid(email),exp,role:'authenticated'})).toString('base64url'),'test'].join('.');
    return {access_token:jwt,expires_in:3600,expires_at:exp,refresh_token:'fake-refresh',token_type:'bearer',user:user(email)};
  };
  await page.route('https://xdppczyeztarvralihtt.supabase.co/**',async route=>{
    const request=route.request(),url=request.url(),body=request.postDataJSON();
    state.requests.push({url,body,method:request.method()});
    let status=200,data=[];
    if(url.includes('/auth/v1/token')){state.email=body.email;data=token(body.email);}
    else if(url.includes('/auth/v1/user')) data={user:user(state.email)};
    else if(url.includes('/auth/')) data={};
    else if(url.includes('/rpc/is_store_admin')) data=state.email.startsWith('admin');
    else if(url.includes('/rest/v1/products')){
      if(state.catalogError){status=503;data={message:'Catalog offline'};}else data=state.emptyCatalog?[]:dbProducts;
    }
    else if(url.includes('/rest/v1/areas')) data=state.zoneActive?[{id:1,district:'Chennai',is_active:true}]:[];
    else if(url.includes('/rest/v1/profiles')){
      const email=state.email;
      state.profiles[email] ||= {...mockProfile,id:uid(email),full_name:email.startsWith('other')?'Other Patron':'Test Patron',address:email.startsWith('other')?{}:mockProfile.address};
      if(request.method()==='PATCH') state.profiles[email]={...state.profiles[email],...body};
      data=state.profiles[email];
    }
    else if(url.includes('/rest/v1/orders')) data=state.orders;
    else if(url.includes('/rpc/request_order_cancellation')){
      state.orders=state.orders.map(order=>({...order,cancellation_requested_at:new Date().toISOString(),cancellation_reason:body.reason}));data=null;
    }
    else if(url.includes('/rpc/')) data=null;
    await route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
  });
  const open=async path=>page.goto(`http://127.0.0.1:5184/#${path}`);
  const login=async email=>{await open('/login');await page.getByLabel('Email address',{exact:true}).fill(email);await page.getByLabel('Password',{exact:true}).fill('test-password');await page.getByRole('button',{name:'Sign in',exact:true}).click();await page.waitForURL(url=>url.hash===(email.startsWith('admin')?'#/admin':'#/'));};
  const logout=async()=>{await page.getByTitle('Royal Sanctuary Account').click();await page.getByRole('dialog').getByRole('button',{name:'Sign out',exact:true}).click();await page.waitForURL(url=>url.hash==='#/login');};
  return {page,state,open,login,logout,close:async()=>{await browser.close();server.kill();if(server.exitCode===null)await Promise.race([once(server,'exit'),new Promise(resolve=>setTimeout(resolve,2000))]);}};
}
