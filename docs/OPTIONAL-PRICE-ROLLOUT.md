# Remove the monthly-price question

The website no longer collects or sends priceRange. The API normalizes absent/null price preferences to null and continues to reject invalid supplied values. Historical answers remain intact.

Production rollout order (target project nzhjnzovbxznzadtbzgm):

1. Apply supabase/migrations/20261003000200_optional_price.sql to the YummyFitWeb project. It only drops the price_range NOT NULL constraint; the allowed-value constraint and private permissions are preserved.
2. Redeploy yummyfit-web-api with the updated server/validation.mjs and handler (bundle with npm run build:edge). Retain the allowed GitHub Pages origin, server-only service credentials, and already-approved public signup JWT configuration.
3. Verify an intake with name, email, selectedPlan, policyVersion and marketingConsent, without priceRange, returns an accepted receipt and stores a null price_range.
4. Fast-forward master from the reviewed branch to publish GitHub Pages, then verify desktop/mobile signup.

Do not publish the frontend before the backend update: the previous production handler requires a price answer. Do not substitute a hidden default price.

For local SQLite/PostgreSQL hosting, npm run db:migrate applies migration 002. The SQLite migration rebuilds the intake table transactionally, preserving IDs and historical answers.
