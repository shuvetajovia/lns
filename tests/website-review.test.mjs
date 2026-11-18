import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { validateAddress, deliveryLocation } from '../src/lib/address.js';
const pins=JSON.parse(await readFile(new URL('../src/data/deliveryPincodes.json',import.meta.url),'utf8'));
test('PIN lookup and address matching reject mismatched and inactive delivery districts',()=>{
  assert.equal(deliveryLocation('627004',['Tirunelveli'],pins).district,'Tirunelveli');
  assert.throws(()=>validateAddress({doorNo:'1',street:'Street',pincode:'627004',district:'Chennai'},['Chennai','Tirunelveli'],pins),/belongs to Tirunelveli/);
  assert.throws(()=>validateAddress({pincode:'627004',district:'Tirunelveli'},['Chennai'],pins),/unavailable/);
  assert.equal(deliveryLocation('600001x',['Chennai'],pins).valid,false);
  validateAddress({},['Chennai'],pins);
});
test('review SQL is rerunnable, preserves legacy data and enforces address and verified-phone ownership',async()=>{
  const db=new PGlite();
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE SCHEMA auth;
      CREATE TABLE auth.users(id uuid PRIMARY KEY,phone text,phone_confirmed_at timestamptz);
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      CREATE TABLE public.profiles(id uuid PRIMARY KEY,address jsonb);
      CREATE TABLE public.areas(district text,is_active boolean);
      INSERT INTO auth.users VALUES('00000000-0000-4000-8000-000000000001','919876543210',now()),('00000000-0000-4000-8000-000000000002','919876543211',NULL);
      INSERT INTO areas VALUES('Chennai',true),('Tirunelveli',true);
      INSERT INTO profiles VALUES('00000000-0000-4000-8000-000000000001','{"pincode":"627004","district":"Chennai"}');
      GRANT SELECT,UPDATE ON profiles TO authenticated;`);
    const sql=await readFile(new URL('../sql/query 6.sql',import.meta.url),'utf8');
    assert.equal((await db.query("SELECT to_regprocedure('public.normalize_mobile(text)') AS helper")).rows[0].helper,null);
    await db.exec(sql); await db.exec(sql);
    assert.equal((await db.query("SELECT public.normalize_mobile('9876543210') AS phone")).rows[0].phone,'+919876543210');
    assert.equal((await db.query('SELECT address FROM profiles')).rows[0].address.district,'Chennai');
    const update=address=>db.query('UPDATE profiles SET address=$1::jsonb',[JSON.stringify(address)]);
    await assert.rejects(update({doorNo:'1',street:'Main',pincode:'627004',district:'Chennai'}),/belongs to Tirunelveli/);
    await update({doorNo:'1',street:'Main',pincode:'627004',district:'Tirunelveli',locality:'East',city:'Town'});
    await db.exec("UPDATE areas SET is_active=false WHERE district='Tirunelveli'");
    await assert.rejects(update({doorNo:'1',street:'Main',pincode:'627004',district:'Tirunelveli'}),/unavailable/);
    await assert.rejects(update({pincode:'999999',district:'Chennai'}),/unavailable/);
    await db.exec("SET ROLE authenticated; SELECT set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000001',false)");
    assert.equal((await db.query("SELECT is_my_phone_verified('+919876543210') AS ok")).rows[0].ok,true);
    assert.equal((await db.query("SELECT is_my_phone_verified('+919876543211') AS ok")).rows[0].ok,false);
    await assert.rejects(db.exec("INSERT INTO delivery_pincodes VALUES('999999','Chennai')"),/permission denied/);
    await db.exec('RESET ROLE; SET ROLE anon');
    await assert.rejects(db.query("SELECT is_my_phone_verified('+919876543210')"),/permission denied/);
  } finally { await db.close(); }
});
