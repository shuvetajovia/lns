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

**Fresh database:** create the existing owner account `admin@mothernature.in` through
Supabase Authentication, run `sql/setup-safe.sql`, then query 2, then query 3. Add real
products and delivery districts in the admin; a new database has no sample catalogue.

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
