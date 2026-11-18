# Mother Nature deployment readiness report

Requirements and delivery plan | 18 November 2026

Prepared for the store owner and delivery team

## Release recommendation

The updated storefront is ready for staging verification, but production readiness has not been established. Local UI improvements, automated checks and builds are complete. Hosted database migrations, real email and SMS delivery, release configuration and business approval remain open. The reported missing SQL helper has been fixed locally; a successful rerun in Supabase is still required.

Full online selling must remain disabled until a trusted server payment and order workflow is implemented and accepted. A limited account and catalogue launch can be considered first, provided the site clearly states that online orders are unavailable and the applicable launch blockers are closed.

## Decide the release scope

| Option | Included capability | Release condition |
| --- | --- | --- |
| Limited launch | Accounts, catalogue, search, wishlist, saved addresses and owner administration. No online order placement. | Owner approves the restricted scope and all applicable P0 items pass. |
| Transactional launch | Limited scope plus payment, verified order creation, fulfilment, cancellation and refunds. | Server payment work and real end-to-end acceptance are complete. |
| Desktop release | Packaged Electron admin application. | Separate installer, signing, distribution and target-device verification. Web admin can be used without this release. |

## Status and priorities

Local complete means implementation exists and relevant local checks passed; it does not mean deployed. Pending configuration requires hosted project or provider settings. Proposed means future work requiring prioritisation. Suggested owners are roles to assign, not commitments already made.

P0 blocks the selected release. P1 should be completed before full selling or explicitly deferred for a limited launch. P2 is a future enhancement. No launch date should be committed until owners and dependencies are confirmed.

## Immediate next actions

- Confirm launch scope, production hosting provider and final HTTPS domain.
- Back up the database, establish applied migration history and rerun corrected query 6.
- Configure auth emails and validate fresh confirmation and recovery links.
- Assign named owners to the pending-work register and retain one release checklist.

<!-- PAGE -->
# Website review requirement coverage

The twelve items from the supplied review are tracked below. Completed UI work still needs acceptance against the deployed environment. Evidence references appear on the final page.

| Review item | Current local result | Remaining acceptance |
| --- | --- | --- |
| 1 District dropdown | Account and checkout share a dropdown populated from active delivery districts. | Verify all approved districts from hosted areas data appear. |
| 2 Wishlist | Images, price, stock, product links, removal, cart or size selection, empty state and keyboard handling. | Check real products, unavailable items, persistence and mobile controls. |
| 3 Search visibility | Desktop header provides dedicated usable search width. | Inspect the deployed site at phone, tablet and desktop widths. |
| 4 Customer profile | Name, email and account type are labelled; profile navigation is clearer. | Confirm details and access after login and reload. |
| 5 PIN identification | Shared fields resolve deliverable PINs and show availability feedback. | Test active, inactive, unknown and incomplete PINs. |
| 6 Search results | Readable suggestions, no-match feedback and search-specific results heading. | Check real terms, Tamil names, filters and repeated searches. |
| 7 Address fields | Area or locality and village, town or city are stored in address JSON. | Confirm values persist after refresh and in checkout review. |
| 8 PIN district validation | Client validation and query 6 reject mismatches. Test covers 627004 with Chennai. | Apply corrected migration and prove hosted direct writes reject mismatches. |
| 9 Phone verification | SMS send, resend and phone-change OTP UI; server-derived verification check. | Configure provider and confirmations, enable flag and test real SMS. |
| 10 Confirmation visibility | Fixed toast and feedback beside Save; account notices use the toast. | Test while scrolled and with the phone keyboard open. |
| 11 Email links | Templates and production URL settings documented. | Apply hosted settings and test fresh emails. Live fix is not yet confirmed. |
| 12 Mobile search | Enter submits to results; results derive from URL parameters. | Repeat searches on the same route and test phone back navigation. |

## Completion evidence

Keep a screenshot or test record for each item, with the release commit and environment. Do not close email, SMS or SQL items solely because local mocked tests passed. State and country expansion is future work; current delivery coverage remains Tamil Nadu.

<!-- PAGE -->
# Technical launch blocker register

Close these items for the selected scope. A local build does not prove production permissions or external services work.

| ID and priority | Required work | Suggested owner | Completion evidence |
| --- | --- | --- | --- |
| T01 P0 | Choose host and canonical domain; resolve Vercel URL versus GitHub Pages workflow. | Owner and release engineer | Recorded domain and host; matching build and auth callback settings. |
| T02 P0 | Review backup and migration state; apply required migrations and corrected query 6. | Database administrator | Successful SQL log, hosted policy tests and recovery procedure. |
| T03 P0 | Configure confirmation, recovery, sender and SMTP. | Auth administrator | Fresh links work on final domain; expired links fail clearly; delivery verified. |
| T04 P0 | Review and commit all changes, including new SQL, components, templates and tests. | Developer | Named release commit; clean checkout builds and tests. |
| T05 P0 | Align payment badges, COD wording and customer promises with actual capability. | Developer and owner | No unsupported payment or service claim in released pages. |
| T06 P0 for selling | Implement trusted payment, order creation, webhook verification and refunds. | Backend developer | Payment acceptance matrix passes; orders and stock reconcile. |
| T07 P0 if OTP required | Configure real SMS, confirmations and delivery controls. | Auth administrator | Real-device success, invalid-code rejection and number-change checks. |
| T08 P0 | Complete hosted acceptance and rollback rehearsal. | QA and release engineer | Approved evidence, previous artifact and named go or no-go owner. |

## Evidence limits

Previous checks in this chat passed lint, nine unit or database tests, existing browser suites, the targeted website-review browser suite and both renderer builds. Browser auth and SMS responses were mocked; database tests used PGlite.

After the reported SQL failure, the targeted two-test file passed again with the mobile helper initially absent. None of these results confirms a production migration, real payment, SMS or SMTP delivery, or a packaged installer. Rerun the full release checks from the final committed version before deployment.

<!-- PAGE -->
# Business decisions and operational readiness

Approve commercial values and policies rather than treating current frontend constants as final business rules. The owner supplies decisions; the developer implements them; QA verifies the released result.

| ID | Decision or pending work | Required outcome |
| --- | --- | --- |
| B01 | Catalogue and inventory | Approve products, variants, weights, prices, stock, images, descriptions and image rights. Resolve incorrect or missing product imagery. |
| B02 | Delivery policy | Approve districts, courier coverage, fees, free-delivery threshold and service times. Validate the current 24 to 48 hour wording. |
| B03 | Commercial calculations | Confirm discounts, eligibility, taxes, rounding and invoices. Current NATURE10 and FIRSTHARVEST coupons and shipping amounts are client estimates. |
| B04 | Payment methods | Select provider and methods. Decide whether COD is offered; the existing footer badge does not implement COD. |
| B05 | Customer policies | Provide approved privacy, terms, cancellation, return, refund and shipping content, accessible links and support contacts. Arrange appropriate business review. |
| B06 | Support and fulfilment | Assign dispatch, address issues, cancellations, delivery failures and customer enquiries. Define response targets. |
| B07 | Customer access | Decide whether browsing requires login. Current storefront routes require authentication; public browsing and discovery need separate changes. |
| B08 | Verification policy | Decide whether SMS is optional, required before purchase, or required before account completion. Current verification is optional. |
| B09 | Accounts and assets | Confirm domain, hosting and Supabase access, provider billing, sender identities and actual social accounts. |

## Documentation cleanup

Update architecture.md and design.md to describe Supabase auth and data access, disabled payments, actual desktop behaviour and current storage. Their existing wording implies implemented Razorpay payments and legacy local vault storage. README.md is more current, but migration comments should be aligned with it.

Do not treat admin-portal/update_app.js as an automatic updater. It is an old source-editing script and is excluded from lint. Record any desktop-update strategy as new work.

<!-- PAGE -->
# Database migration and SQL recovery plan

## Resolve the reported missing function

Error 42883 occurred because public.normalize_mobile(text) was absent when query 6 created the phone verification function. The current sql/query 6.sql now creates the same normalisation helper before using it. A regression test starts without the helper and confirms migration and rerun success.

- Use the updated complete query 6 file, not a previously copied version.
- If SQL Editor remains in an aborted transaction, run ROLLBACK; first. Then rerun the whole file, not only the failing statement.
- A failed transaction is not a successful migration. Record the rerun result and verify the created objects.
- Query 4 is still required for mobile uniqueness and signup or profile enforcement. Installing only the helper does not install those rules.

## Migration order

Existing database: inspect applied schema changes, back up, rehearse on staging, then apply missing migrations in order. Fresh database: setup-safe.sql followed by queries 2, 3, 4, 5 and 6. Never run historical query1.sql on business data; it recreates tables and permissive policies.

| File | Purpose and migration consideration |
| --- | --- |
| setup-safe.sql | Fresh schema bootstrap; confirm the intended environment first. |
| query 2.sql | Owner registry, profiles and authenticated access. Assign the actual owner by user UUID. |
| query 3.sql | Order restrictions, inventory transitions, cancellation requests and newsletter consent. |
| query 4.sql | Normalises Indian mobiles and enforces uniqueness and signup rules. Existing invalid or duplicate values stop the transaction for correction. |
| query 5.sql | Archives legacy reviews and ratings, clears live review data and disables unsupported ratings. Preserve its private archive in backups. |
| query 6.sql | PIN mapping, address-write validation and current-user verification check. Now includes the normalisation helper. |

## Hosted verification

Check that to_regprocedure returns non-null for public.normalize_mobile(text) and public.is_my_phone_verified(text). Confirm delivery_pincodes exists, validate_profile_address is attached, and query 4 phone index and triggers are present. Test valid addresses, inactive districts and 627004 paired with Chennai. Prove a customer cannot change PIN data or read another account records.

Keep legacy address correction, duplicate-mobile cleanup and historical payment reconciliation explicit. Query 6 preserves old addresses and validates later address writes. Never guess paid or reserved-inventory states. Keep frontend PIN data and database mapping aligned when coverage changes.

<!-- PAGE -->
# Authentication email and SMS setup

## Email and owner access

- Confirm the final HTTPS site URL and base path. Match Supabase Site URL, allowed redirect URLs and VITE_SITE_URL. The documented domain is https://lns-dusky.vercel.app/; the owner must confirm it.
- Apply confirmation.html and recovery.html from supabase/templates to hosted email templates, retaining the ConfirmationURL link variable. Configure the password-changed notification. Editing config.toml alone does not update hosted settings.
- Configure production SMTP and sender-domain settings, provider limits and delivery monitoring. Keep provider secrets out of frontend variables.
- Request fresh signup and recovery emails. Test confirmation, login, reset, expired links and resend from a signed-out browser. Old emails may retain the previous localhost redirect.
- Assign the real owner through store_admin by UUID. Prove is_store_admin() controls privileges and user-editable metadata cannot grant admin access.

## Phone verification

Authenticated phone-change OTP and a Supabase Auth verification check are implemented behind VITE_PHONE_VERIFICATION_ENABLED. Saving a formatted mobile number does not prove ownership.

- Configure Phone authentication, SMS provider and phone confirmations. Set delivery destinations, rate limits, spending controls and provider sender arrangements.
- Apply query 6 before enabling the flag in a release build. Leave the flag false while service setup is incomplete.
- Test real delivery, valid code, wrong or expired code, resend delay, provider failure, number conflicts and changing the profile number after verification.
- If verification must block checkout or signup, enforce that rule on the trusted server and in the UI. The current optional UI does not enforce that business requirement.

## Environment configuration

| Setting | Required handling |
| --- | --- |
| VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY | Explicitly target the intended staging or production project. These are public browser values. |
| VITE_SITE_URL | Approved HTTPS callback including base path; also configure the desktop build. |
| VITE_PHONE_VERIFICATION_ENABLED | Enable only after hosted verification and real SMS tests pass. |
| Social account URLs | Use approved real accounts or leave blank. |
| Private service and provider keys | Store only in trusted server or provider secrets, never VITE variables or shared reports. |

Provider configuration references are listed in S9. Confirm settings in the actual hosted project before release.

<!-- PAGE -->
# Payment order and refund work package

Required for a transactional launch. Checkout currently saves addresses and retains carts; CloudService.addOrder deliberately rejects submissions. Database order rules are a foundation, not a complete payment integration.

## Required implementation

- P01 Provider setup: select the gateway, complete provider onboarding, supply test and live configuration securely, and approve payment methods, settlement and refund operations.
- P02 Trusted pricing: authenticate the customer on a server endpoint and recalculate product and variant prices, stock, delivery, shipping, coupons and taxes. Never trust browser totals or client success flags.
- P03 Order lifecycle: define pending, successful, failed, cancelled and expired payments. Create provider references and stable idempotency keys. Decide when stock is reserved or released; integrate existing triggers without deducting inventory twice.
- P04 Verification: verify signatures and webhooks on the server, validate amount and currency, deduplicate events and handle retries or out-of-order delivery. Create orders only through the trusted workflow.
- P05 Recovery: provide clear pending, failed and paid states and safe retry after interruption. Avoid duplicate orders, preserve carts on failure and clear them only after confirmed order creation.
- P06 Refunds: connect approved cancellation to provider refund requests, references and reconciliation. Current rules prevent paid-order cancellation until a verified refund is recorded.
- P07 Fulfilment: deliver receipts or invoices, dispatch information, tracking and notifications. Decide failed-delivery, partial-refund and stock-discrepancy procedures.

## Future database design

Proposed migrations should define payment attempts, provider order and transaction references, webhook receipts, idempotency constraints, refund records and audit history. Add provider-appropriate uniqueness and access rules. These are requirements, not schemas already delivered by query 6. Do not backfill historical paid status without evidence.

| Scenario | Required result |
| --- | --- |
| Successful payment and retry | One verified payment creates one order and one correct inventory movement. |
| Failure or abandonment | No false paid order; cart preserved and stock released according to policy. |
| Duplicate or reordered webhook | No duplicate order, refund or stock movement; reconciliation remains possible. |
| Price or stock change | Server rejects stale or tampered totals and insufficient stock. |
| Refund and cancellation | Provider receipt agrees with stored status; inventory restores exactly once where appropriate. |

<!-- PAGE -->
# Hosting build and deployment preparation

## Resolve hosting ownership

The repository has a GitHub Pages workflow triggered by main or master pushes and manual dispatch. Auth documentation refers to a Vercel domain. Choose the authoritative production host, align URLs and access, and decide which deployment mechanism remains active. Do not assume both have identical environment values.

## Prepare a reviewable release

- D01 Review all existing changes and new files. Include queries 4 and 6, shared address and OTP components, helpers, templates and new tests. Preserve unrelated user changes.
- D02 Commit the accepted release and record its identifier, changes, migration sequence and build configuration. Regenerate any source archive from that commit; the existing archive must not be assumed current.
- D03 Configure staging independently. Protect database copies and provider credentials; do not publish customer data in test artifacts.
- D04 Set approved environment values in the chosen hosting build. The GitHub workflow runs checks and builds but does not explicitly inject project-specific VITE values. Verify the final bundle targets the intended services.
- D05 Use Node 22.12 or newer and the lockfile. Run npm ci, npm run lint, npm test, npm run build and npm run build:admin. Install the test browser in CI as documented.
- D06 Publish the storefront dist output. Check HTTPS, domain routing, assets, reloads, HashRouter deep links and any subdirectory base path.
- D07 Establish branch and release protections appropriate to the team. A push may trigger deployment; complete release approval before pushing the accepted commit.

## Desktop release if required

The renderer build is verified locally. An installer release still needs target OS selection, versioning, signing and distribution decisions, packaging, install and uninstall checks, owner login, customer denial, external link handling and email callback testing. An actual auto-update channel requires separate work.

## Evidence pack

Retain the approved commit, test output, screenshots, migration logs, environment checklist without secrets, provider evidence, catalogue approval, deferred items and previous deploy artifact. Record who performed each step and when. Successful CI does not replace hosted acceptance.

<!-- PAGE -->
# Acceptance tests and launch gates

Run on staging and repeat the critical path on the final domain. Record result, environment, commit, tester, date and evidence. A blocked external service is not a passing test.

| Area | Required acceptance evidence |
| --- | --- |
| Authentication | Protected routes blocked while signed out; signup, confirmation, login, logout, reload and recovery work; expired links fail clearly. |
| Authorisation | Customer cannot access admin or another account; owner registry controls privileges; unauthorised direct writes fail. |
| Addresses | Valid PIN autofills district; wrong, inactive and unknown PINs fail; locality and city persist; direct mismatch writes fail. |
| Phone | Query 4 formatting and uniqueness hold; real OTP works if enabled; wrong codes fail; changed numbers lose verified status. |
| Search and wishlist | Mobile Enter and repeated searches work; useful no-result state; current saved-item availability and account separation. |
| Feedback and accessibility | Scrolled save feedback, keyboard access, focus order, labels, contrast, screen-reader feedback and reduced-motion review. |
| Devices | No overflow at 320, 390, 768, 1024, 1280 and 1440 pixels; real Android and iOS touch and keyboard testing. |
| Catalogue and outages | Correct data and stock; missing images handled; failed catalogue never substitutes sample stock; delivery failure blocks invalid saves. |
| Orders and payments | Limited launch cannot order; selling launch passes payment, retry, inventory, cancellation and refund matrix. |
| Content | Payment badges match capability; support and policy links work; claims approved; newsletter preference is not presented as campaign delivery. |
| Deployment | HTTPS, assets, deep links, configuration and final-domain callbacks pass; monitoring, backup and rollback evidence retained. |

## Go or no-go rule

Release only when applicable P0 items pass, no unresolved issue can expose customer data or misstate payment success, and the owner accepts documented deferrals. Keep paid checkout disabled until payment work is complete. Keep OTP off if SMS is unverified; if OTP is mandatory, defer launch instead.

Local tests provide useful regression evidence, but real provider delivery, production RLS and actual device behaviour require their own checks. Set a performance target on representative mobile connections and investigate missing assets or critical console errors before approval.

<!-- PAGE -->
# Deployment day and rollback runbook

## Before deployment

- 1 Confirm scope and approval. Freeze the commit, configuration and provider settings. Name the person authorised to stop release.
- 2 Verify a recent backup and previous frontend artifact. Record restore method and owner-approved recovery time and acceptable data-loss window.
- 3 Rehearse SQL on staging; resolve invalid mobiles and district data; verify tests target the intended services.
- 4 Schedule any needed maintenance window and support coverage. Record the sequence for schema, provider and catalogue changes.

## Controlled deployment sequence

- 5 Apply approved database migrations first and retain logs. Stop on errors; do not publish a frontend that depends on absent functions.
- 6 Apply hosted email, callback and SMS settings for the scope. Verify production build values and flags.
- 7 Build and deploy the approved commit. Confirm the host serves that version and no stale asset configuration remains.
- 8 Smoke test with designated accounts: login, catalogue, search, wishlist, address save, PIN checks and admin access. Request fresh confirmation and recovery emails.
- 9 If SMS is enabled, verify one controlled real delivery. If selling is enabled, complete provider-approved production validation and reconcile payment, order and refund results.
- 10 Announce availability only after checks pass. Record release time, operator, version and accepted limitations.

## Stop and rollback conditions

Stop for broken login or recovery, unauthorised access, failed required SQL, wrong prices or payment states, duplicate orders or stock movements, or sustained critical errors. Disable new order placement first if payment integrity is at risk. Restore the last verified frontend and its matching configuration.

Database rollback is separate. Prefer a reviewed forward fix for additive schema problems. Do not blindly reverse migrations or run query1.sql. Restoring a backup may overwrite new writes: pause affected workflows, preserve records, reconcile orders and payments, and get recovery approval. Query 5 archives old reviews but also clears live review and rating data.

## After deployment

Monitor auth, email, SMS and profile-save failures during the initial window. For selling, reconcile provider transactions, orders, inventory and refunds. Assign a next-business-day checkpoint and a first-week backlog review. These are proposed checkpoints to schedule, not existing appointments.

<!-- PAGE -->
# Future requirements and phased roadmap

Proposed work beyond the limited launch. Reprioritise after owner decisions and customer feedback. Payment integration becomes P0 if the first release must accept orders.

| Phase | Requirement | Definition of done |
| --- | --- | --- |
| Before selling | Payments, refunds, shipping and tax rules, invoices and fulfilment notifications. | Payment matrix passes; staff can reconcile and support a complete order. |
| P1 Operations | Monitoring, error reporting, restore exercises, support procedures and audit records. | Named responders, tested recovery and retained evidence. |
| P1 Catalogue | Image rights and optimisation, accurate claims, catalogue management and inventory reconciliation. | Approved catalogue, reliable assets and repeatable stock updates. |
| P1 Accounts | Public browsing decision, OTP policy and account support or deletion workflow. | Approved policy, data controls and validated customer flows. |
| P2 Customer experience | Multiple addresses, default address and server-synchronised cart or wishlist. | Account-owned records with access checks and cross-device behaviour. Current storage is browser-local by account. |
| P2 Reviews | Verified-purchase submission and moderation. | Order-linked eligibility, abuse controls and accurate aggregates; no seeded ratings. |
| P2 Communications | Newsletter campaigns and order or delivery notifications. | Provider, consent and unsubscribe handling, tracking and approved templates. |
| P2 Coverage | State and country fields, broader PIN coverage and regional shipping. | Approved data and matching client/server validation. Current scope is Tamil Nadu. |
| P2 Discovery | Public catalogue and SEO if approved, analytics with appropriate consent, performance and accessibility. | Measurable targets and validated public routes. |
| P2 Administration | Staff roles, exports, audit history and desktop distribution or updates. | Least-privilege design, supported workflows and tested distribution. |

## Future SQL requirements

Design separate migrations for multiple addresses, persisted carts and wishlists, order-linked reviews, staff roles, audit logs and payment records. Each needs ownership rules, constraints, indexes, legacy-data handling and tests. These future schemas are not delivered by query 6.

## Dependency order

Scope and ownership decisions precede provider and hosting setup. Migration and data validation precede hosted acceptance. Selling implementation precedes payment approval. Final acceptance and a rollback plan precede deployment. Later enhancements should not delay a limited release unless the owner explicitly makes them launch requirements.

<!-- PAGE -->
# Ownership evidence and final signoff

## Assign release responsibilities

| Role | Accountability | Assignment |
| --- | --- | --- |
| Business owner | Scope, catalogue, pricing, policies, providers and go or no-go. | Name and date to assign |
| Developer | Implementation, payment work, claims, SQL and documentation. | Name and date to assign |
| Database and auth administrator | Backup, SQL, owner access, email and SMS configuration. | Name and date to assign |
| QA lead | Acceptance evidence, real-device checks and regressions. | Name and date to assign |
| Release engineer | Domain, host, build, deployment, monitoring and rollback. | Name and date to assign |
| Operations and support | Fulfilment, enquiries, cancellations, refunds and incidents. | Name and date to assign |

## Source register

- S1 Supplied Website Review Suggestions and Improvements PDF: original twelve requirements.
- S2 README.md and this chat: implementation, previous local checks and reported SQL error.
- S3 src/App.jsx, ProtectedRoute.jsx and AuthContext.jsx: routes and authentication.
- S4 DeliveryFields.jsx, PhoneVerification.jsx, Navbar.jsx, WishlistDrawer.jsx, Toast.jsx and AccountPage.jsx: local review implementation.
- S5 sql/setup-safe.sql, queries 2 through 6 and tests/website-review.test.mjs: SQL behaviour and missing-helper regression.
- S6 CloudService.js, CheckoutPage.jsx, AdminOperations.jsx and ShopContext.jsx: order restrictions, financial states and client estimates.
- S7 .github/workflows/deploy.yml, package.json, vite.config.js, .env.example and admin-portal/package.json: builds and deployment.
- S8 Footer.jsx, architecture.md, design.md and admin-portal/update_app.js: remaining claims and outdated notes.
- S9 Official references: https://supabase.com/docs/guides/auth/redirect-urls and https://supabase.com/docs/guides/auth/phone-login.

Files are under D:\Mother Nature; component and page names refer to their corresponding src folders. Status date is 18 November 2026. Hosted migration completion and production configuration remain to be verified.

## Final approval record

Selected scope: ____________________  Release commit: ____________________

Production domain: ____________________  SQL evidence: ____________________

QA approval: ____________________  Owner approval: ____________________

Release operator: ____________________  Rollback owner: ____________________

Accepted deferrals and launch date: ______________________________________
