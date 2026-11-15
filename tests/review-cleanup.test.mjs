import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('review cleanup archives legacy data, reruns safely and blocks unsupported claims', async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated;
      CREATE SCHEMA auth;
      CREATE TABLE auth.users(id uuid PRIMARY KEY);
      CREATE FUNCTION public.is_store_admin() RETURNS boolean LANGUAGE sql AS $$ SELECT true $$;`);
    await db.exec(await readFile(new URL('../sql/setup-safe.sql', import.meta.url), 'utf8'));
    await db.exec(`INSERT INTO public.products(id,name,price,category,category_id,image,rating,reviews_count)
      VALUES (1,'Rice',210,'Rice','rice','rice.jpg',4.9,148);
      INSERT INTO public.reviews(name,comment,verified) VALUES ('Seeded buyer','Sample review',true);
      GRANT ALL ON public.reviews, public.products TO authenticated;`);
    const migration = await readFile(new URL('../sql/query 5.sql', import.meta.url), 'utf8');
    await db.exec(migration);
    await db.exec(migration);
    assert.equal((await db.query('SELECT count(*)::int AS n FROM public.reviews')).rows[0].n, 0);
    assert.equal((await db.query('SELECT count(*)::int AS n FROM review_cleanup_archive.reviews')).rows[0].n, 1);
    assert.equal((await db.query("SELECT snapshot->>'reviews_count' AS n FROM review_cleanup_archive.product_ratings")).rows[0].n, '148');
    assert.deepEqual((await db.query('SELECT rating, reviews_count FROM public.products')).rows[0], {rating:null, reviews_count:0});
    await db.exec('SET ROLE authenticated');
    await assert.rejects(db.exec("INSERT INTO public.reviews(name) VALUES ('Fake buyer')"), /permission denied/);
    await assert.rejects(db.exec('SELECT * FROM review_cleanup_archive.reviews'), /permission denied/);
    await assert.rejects(db.exec('UPDATE public.products SET rating=4.8'), /product_reviews_disabled/);
    await db.exec("UPDATE public.products SET name='Updated rice' WHERE id=1");
    await db.exec('RESET ROLE; SET ROLE anon');
    await assert.rejects(db.exec('SELECT * FROM public.reviews'), /permission denied/);
  } finally { await db.close(); }
});
