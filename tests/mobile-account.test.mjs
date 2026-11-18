import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { normalizeMobile } from '../src/lib/mobile.js';

test('mobile normalization rejects missing values and shares an identity across formats', () => {
  assert.equal(normalizeMobile('9876543210'), '+919876543210');
  assert.equal(normalizeMobile('+91 98765-43210'), '+919876543210');
  for (const value of ['', '123', 'abcdefghij', '1234567890']) {
    assert.throws(() => normalizeMobile(value), /valid/);
  }
});

test('mobile migration enforces signup, update uniqueness and reruns with legacy users', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      CREATE SCHEMA auth;
      CREATE TABLE auth.users(id uuid PRIMARY KEY, raw_user_meta_data jsonb);
      CREATE TABLE public.profiles(id uuid PRIMARY KEY REFERENCES auth.users(id), full_name text, phone text, role text);
      INSERT INTO auth.users VALUES ('00000000-0000-4000-8000-000000000001','{}');
      INSERT INTO profiles(id,phone) VALUES ('00000000-0000-4000-8000-000000000001','');
    `);
    const sql = await readFile(new URL('../sql/query 4.sql', import.meta.url), 'utf8');
    await db.exec(sql);
    await db.exec(sql);
    await db.exec(`CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`);
    const insert = (id, phone) => db.query(
      'INSERT INTO auth.users VALUES ($1,$2::jsonb)',
      [id, JSON.stringify({ phone, role: 'admin' })]);
    await assert.rejects(insert('00000000-0000-4000-8000-000000000002', ''), /valid/);
    await insert('00000000-0000-4000-8000-000000000002', '9876543210');
    await assert.rejects(insert('00000000-0000-4000-8000-000000000003', '+91 98765-43210'), /unique/);
    assert.equal((await db.query('SELECT count(*)::int AS count FROM auth.users')).rows[0].count, 2);
    assert.equal((await db.query("SELECT role FROM profiles WHERE phone IS NOT NULL")).rows[0].role, 'customer');
    await assert.rejects(db.exec("UPDATE profiles SET phone='9876543210' WHERE phone IS NULL"), /unique/);
    await assert.rejects(db.exec("UPDATE profiles SET phone='' WHERE phone IS NOT NULL"), /valid/);
    await db.exec(sql);
  } finally { await db.close(); }
});
