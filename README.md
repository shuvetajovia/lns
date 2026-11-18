# Mother Nature

React storefront and authenticated single-owner admin, with a shared Electron renderer.
Online payments are intentionally unavailable until the business supplies gateway details.
There is no demo payment success, fabricated order, or browser order insertion path.

## Run and verify

Use Node.js 22.12 or newer. Copy `.env.example` to `.env` and enter this project's
public Supabase settings. Never place private service-role or gateway secrets in Vite variables.
The existing project settings remain defaults for compatibility.

```powershell
npm ci
npm run dev
npm run lint
npm test
npm run build
npm run build:admin
```

Tests use mocked Supabase HTTP responses and a local PostgreSQL-compatible PGlite instance.
They never charge a card, change the hosted database, or send real emails.
Windows browser tests use installed Microsoft Edge. On Linux/macOS install Chromium
with `npx playwright install --with-deps chromium`. Override `BROWSER_CHANNEL` when needed.
The CI workflow runs lint, database/auth/customer/mobile tests and both renderer builds.

## Database installation

**Existing database:** back up first, then run `sql/query 2.sql` if it has not been applied,
followed by **`sql/query 3.sql`** in Supabase SQL Editor. Both migrations are rerunnable.
They preserve products, orders and users. Query 3 closes direct browser order writes,
secures role checks, adds newsletter consent and cancellation requests, and enforces
owner-only order transitions with atomic inventory restoration.

**Fresh database:** run `sql/setup-safe.sql`, query 2 and query 3 in order. All signups
start as customers. To assign the store owner, copy the intended user's UUID from
Supabase Authentication and run the following in the privileged SQL Editor after
replacing the placeholder. This also supports transferring ownership.

```sql
BEGIN;
INSERT INTO public.store_admin (user_id) VALUES ('<owner-user-uuid>'::uuid)
ON CONFLICT (singleton) DO UPDATE SET user_id = EXCLUDED.user_id;
UPDATE public.profiles SET role = CASE
  WHEN id = (SELECT user_id FROM public.store_admin) THEN 'admin' ELSE 'customer' END;
COMMIT;
```

**Password emails:** In hosted Supabase Authentication email templates, set Reset password
to the subject and HTML in `supabase/config.toml` and `supabase/templates/recovery.html`.
Enable the Password changed security notification and use the corresponding subject
and `supabase/templates/password_changed.html`. Configure the project's SMTP sender
for delivery to customer inboxes.

Do not run historical `sql/query1.sql` on business data: it deletes tables and restores
public policies. Historical SQL files are kept unchanged as requested. Use the safe
bootstrap and numbered migrations instead. The local database test checks migration
reruns, anonymous/customer access, stock restoration and cancellation rules.

Historical orders default to `payment_status = unverified` and `inventory_reserved = false`.
Reconcile these against real inventory and provider receipts before altering those flags.
No historical paid/refunded state is guessed. New server-created orders reserve stock
transactionally. Paid orders cannot be cancelled until a verified provider refund has
been recorded through a trusted server process. Payment/refund integration is deferred.

## Accounts and customer flows

- `/#/login`: one login; only `is_store_admin()` on the server determines the owner.
- `/#/register`: customer-only signup, with confirmation when enabled in Supabase.
- `/#/forgot-password`: password reset or confirmation-email resend.
- `/#/reset-password`: recovery link destination, password confirmation and sign-out.
- `/#/account`: database profile/address, own order history and cancellation requests.
- `/#/admin`: inventory, orders, active delivery districts and order status transitions.
- `/#/admin/operations`: verified revenue, cancellation requests, review moderation,
  and subscribed newsletter emails.

Configure Supabase Email/password auth and its Site URL/allowed redirect URLs for the
actual website/base path. Configure SMTP in Supabase for reliable production auth email.
Newsletter consent is stored per verified account, with unsubscribe in the account page;
newsletter campaign delivery requires an email provider and is not simulated.

Carts and wishlists are stored by account ID; legacy shared storage is deliberately not
imported. Profile/address data is stored in `profiles`. Empty/offline catalogue states
never substitute sample inventory. Active admin districts and the bundled Tamil Nadu
pincode subset govern delivery checks. Checkout saves valid addresses and preserves carts,
but never submits an order while payment processing is unavailable.

## Desktop admin

```powershell
cd admin-portal
npm ci
npm run build
npm run electron  # development: start npm run dev separately
npm run dist      # build and package
```

The desktop reuses the website's authenticated owner UI, financials, feedback, and service
layer. Customers are denied entry. A packaged app loads its bundled HTML; development
uses port 5180. Node integration is disabled, isolation/sandbox enabled, and external
navigation restricted. Set the public `VITE_SITE_URL` to the HTTPS website for recovery emails.
The packager override updates only vulnerable modern minimatch versions, preserving old APIs.

## Code and handoff

`src/context/AuthContext.jsx` owns auth; `src/CloudService.js` handles database errors;
`src/pages/AccountPage.jsx` provides customer features; `src/pages/AdminOperations.jsx`
provides owner reports; `sql/query 3.sql` contains the new database changes.
Run the migrations and configure auth emails before deploying these changes. Browser tests
validate UI behaviour and SQL tests validate local policies; hosted policies, SMTP delivery,
and packaged OS installers require their own deployment validation.

Legacy `public/data/orders.csv` and the unused OTP vault were moved to local-only
`data/legacy-private/` rather than publishing customer/order or obsolete OTP data.
These backups are ignored by Git and excluded from source archives. Root legacy CSV
APIs were removed; Vite development servers also deny requests for private legacy data.
The maintained delivery subset can be regenerated with `node scripts/generate-delivery-pincodes.mjs`
from the repository's postal CSV (Tamil Nadu state rows only, with district aliases normalized).

## Required mobile numbers

After query 3, run `sql/query 4.sql` in Supabase SQL Editor and deploy the updated
frontend. Apply query 4 last if replaying older migrations. Indian mobile numbers
are required for new accounts and profile saves. Ten-digit and +91 formats share
one unique database value. Existing blank numbers remain NULL until users supply
them. Invalid or duplicate existing numbers stop the migration transaction for
manual correction. SMS verification is available after the setup below.

## Website review updates (18 November 2026)

Run `sql/query 6.sql` after migrations 2, 3, 4 and 5. Query 6 is rerunnable,
loads the same PIN/district mapping as the storefront, and validates new address
writes against active delivery districts. It preserves existing addresses; invalid
legacy addresses must be corrected when saved. Locality and city use the existing
`profiles.address` JSON field, so no destructive address conversion is needed.
The migration also exposes an authenticated, current-user-only phone verification
check sourced from `auth.users`; browser metadata cannot mark a number verified.

### Fix the localhost email links in the hosted project

In Supabase Dashboard > Authentication > URL Configuration, set **Site URL** to
`https://lns-dusky.vercel.app/` and add that exact URL to **Redirect URLs**.
If deploying to another domain or a GitHub Pages subdirectory, use that actual URL
including its base path in both settings and in `VITE_SITE_URL` before building.
The checked-in TOML documents the current production domain; editing it alone does
not change hosted Supabase settings. Do not use a `/#/` route as the email callback:
Supabase consumes the auth callback before the HashRouter handles navigation.

Apply the confirmation and recovery HTML from `supabase/templates/` to the hosted
email templates. Keep `{{ .ConfirmationURL }}` as the link target. Configure SMTP,
then request **fresh** signup and recovery emails; old links may still contain the
old localhost redirect. Test both from a signed-out browser. Recovery should open
Set your password; confirmation should allow signing in to the storefront.
Reference: https://supabase.com/docs/guides/auth/redirect-urls

### Enable mobile OTP verification

Configure Supabase Authentication > Providers > Phone with a real SMS provider,
enable phone confirmations, and configure provider credentials, delivery regions,
rate limits and any required sender registration. Apply query 6, then set
`VITE_PHONE_VERIFICATION_ENABLED=true` and rebuild. Customers can send, resend and
verify a phone-change OTP under Account > Mobile verification. OTP delivery,
expiry and attempt limits are enforced by Supabase; the UI also has a resend delay.
Saving a formatted mobile number does not imply verified ownership. Verification
is optional while SMS delivery is disabled, and the UI states that it is unavailable.
Never disable phone confirmation and present automatic confirmation as OTP proof.
Reference: https://supabase.com/docs/guides/auth/phone-login

Local checks use mocked auth/SMS responses and PGlite. Hosted migration execution,
SMS delivery and hosted email URL configuration require project access; they are
not performed by the local test suite.


### Query 6 missing mobile helper error

If SQL Editor reports `42883: function public.normalize_mobile(text) does not exist`,
use the current complete `sql/query 6.sql`. It now creates the shared helper before
using it. Rerun the entire file, not just the failing statement. If the editor is
still in an aborted transaction, execute `ROLLBACK;` first. Query 4 remains required
for unique mobile numbers and signup/profile enforcement; the helper alone does
not install those rules. Check which migrations are present before launching.
