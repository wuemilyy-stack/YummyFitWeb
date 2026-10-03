import { test, expect } from '@playwright/test';
const base = process.env.E2E_SITE_BASE || '/';
const path = (value = '') => base + value;
test('unsubscribe deep link requires confirmation and survives reload',async({page})=>{
  let posts=0;
  await page.route('**/api/unsubscribe?*',async route=>{posts++;expect(route.request().method()).toBe('POST');await route.fulfill({status:200,body:'Unsubscribed'});});
  await page.goto(path('unsubscribe?token=11111111-1111-4111-8111-111111111111'));
  await expect(page.getByRole('heading',{name:'Unsubscribe from YummyFit emails'})).toBeVisible();
  await page.reload();expect(posts).toBe(0);
  await page.getByRole('button',{name:'Unsubscribe',exact:true}).click();
  await expect(page.getByRole('heading',{name:'You’re unsubscribed'})).toBeVisible();expect(posts).toBe(1);
});
test('unsubscribe failure stays actionable and invalid links cannot submit',async({page})=>{
  await page.route('**/api/unsubscribe?*',route=>route.fulfill({status:503,body:'Unavailable'}));
  await page.goto(path('unsubscribe?token=11111111-1111-4111-8111-111111111111'));
  await page.getByRole('button',{name:'Unsubscribe',exact:true}).click();
  await expect(page.getByRole('alert')).toBeVisible();await expect(page.getByRole('button',{name:'Unsubscribe',exact:true})).toBeEnabled();
  await page.goto(path('unsubscribe?token=bad'));await expect(page.getByRole('heading',{name:'Invalid unsubscribe link'})).toBeVisible();await expect(page.getByRole('button')).toHaveCount(0);
});
test('all rendered internal links target existing sections or distinct pages', async ({ page, request }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(path());
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByText('How much would you pay per month?', { exact: true })).toHaveCount(0);
  await expect(page.locator('input[name="priceRange"]')).toHaveCount(0);
  for (const selector of ['#waitlist h2', 'label[for="waitlist-name"]', 'label[for="waitlist-email"]']) {
    await expect(page.locator(selector)).toHaveCSS('color', 'rgb(255, 255, 255)');
  }
  await expect(page.locator('#waitlist button[type="submit"]')).toHaveCSS('color', 'rgb(20, 61, 43)');
  await expect(page.locator('#waitlist button[type="submit"]')).toHaveCSS('background-color', 'rgb(210, 243, 107)');
  await expect(page.getByRole('link', { name: 'Become a Founding Member', exact: true }).locator('..')).toHaveCSS('opacity', '1');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.screenshot({ path: testInfo.outputPath('homepage.png') });
  expect(errors).toEqual([]);
  const links = await page.locator('a[href]').evaluateAll(elements => elements.map(element => ({
    href: element.getAttribute('href')!, label: element.textContent?.trim(),
  })));
  for (const link of links) {
    expect(link.href).not.toBe('#');
    if (link.href.startsWith('https:') || link.href.startsWith('mailto:')) continue;
    const url = new URL(link.href, page.url());
    expect(url.pathname.startsWith(base)).toBeTruthy();
    if (url.pathname === base && url.hash) await expect(page.locator(url.hash)).toHaveCount(1);
    else if (['privacy', 'terms', 'cookies'].some(name => url.pathname === path(name)))
      expect((await request.get(url.href)).status()).toBe(200);
    else expect(url.pathname).toBe(base);
  }
  await expect(page.locator('a[href="https://twitter.com"], a[href="https://instagram.com"], a[href="https://linkedin.com"], a[href="https://github.com"], a[href="mailto:hello@yummyfit.app"]')).toHaveCount(0);
});
test('every conversion CTA reaches the waitlist and carries the selected plan', async ({ page }) => {
  for (const [label, plan] of [
    ['Join the Waitlist', ''], ['Become a Founding Member', 'founding'],
    ['Join Free Waitlist', 'free'], ['Join Premium Waitlist', 'premium'], ['Register Founding Interest', 'founding'],
  ]) {
    await page.goto(path());
    const locator = page.getByRole('link', { name: label, exact: true }).first();
    await locator.click();
    await expect(page).toHaveURL(new RegExp('#waitlist$'));
    await expect(page.getByRole('combobox', { name: 'Membership interest' })).toHaveValue(plan);
    await expect(page.getByRole('heading', { name: 'Join the YummyFit waitlist', exact: true })).toBeInViewport();
  }
});

test('founding deep link and reload reveal the form with founding selected', async ({ page }) => {
  await page.goto(path('?plan=founding#waitlist'));
  await expect(page.getByRole('combobox', { name: 'Membership interest' })).toHaveValue('founding');
  await expect(page.getByRole('heading', { name: 'Join the YummyFit waitlist', exact: true })).toBeInViewport();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Join the YummyFit waitlist', exact: true })).toBeInViewport();
  await expect(page.getByRole('combobox', { name: 'Membership interest' })).toHaveValue('founding');
});
test('navigation works at the current breakpoint and updates the URL hash', async ({ page }) => {
  await page.goto(path());
  const menu = page.getByRole('button', { name: 'Open menu' });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Features', exact: true }).click();
  await expect(page).toHaveURL(new RegExp('#features$'));
  await expect(page.locator('#features')).toBeInViewport();
  if (await menu.isVisible()) await expect(page.locator('#mobile-menu')).toHaveCount(0);
});
test('legal deep links and reloads render their own content; unknown routes are 404', async ({ page, request }) => {
  for (const [route, title] of [['privacy', 'Privacy Policy'], ['terms', 'Terms of Use'], ['cookies', 'Cookie Policy']]) {
    await page.goto(path(route)); await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await page.reload(); await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await page.getByRole('link', { name: 'Return to YummyFit', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(base.replace(/\//g, '\\/') + '$'));
  }
  const unknown = await page.goto(path('nonexistent')); expect(unknown?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  const api = await request.get(path('api/nonexistent')); expect(api.status()).toBe(404);
  expect(api.headers()['content-type']).toContain('application/json');
});
async function fillIntake(page: import('@playwright/test').Page) {
  await page.getByLabel('Name', { exact: true }).fill('Browser Test');
  await page.locator('#waitlist-email').fill(`browser-${crypto.randomUUID()}@example.com`);
}
test('valid intake is accepted by the real database-backed API', async ({ page }) => {
  await page.goto(path('?plan=premium#waitlist'));
  await fillIntake(page);
  const response = page.waitForResponse(result => result.url().endsWith('/api/intakes') && result.request().method() === 'POST');
  await page.locator('#waitlist').getByRole('button', { name: 'Join the Waitlist', exact: true }).click();
  expect((await response).status()).toBe(200);
  await expect(page.getByRole('status')).toContainText("You're on the list!");
  await expect(page.getByText('Check your inbox', { exact: false })).toHaveCount(0);
});
test('validation and database outage preserve input and never show success', async ({ page }) => {
  await page.goto(path('#waitlist'));
  await page.locator('#waitlist').getByRole('button', { name: 'Join the Waitlist', exact: true }).click();
  await expect(page.getByText('Enter a name of 1–120 characters.', { exact: true })).toBeVisible();
  await fillIntake(page);
  const before = await page.locator('#waitlist-email').inputValue();
  const keys: string[] = [];
  await page.route('**/api/intakes', async route => {
    keys.push(route.request().headers()['idempotency-key']);
    await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: { message: 'Database unavailable. Please try again.' } }) });
  });
  const button = page.locator('#waitlist').getByRole('button', { name: 'Join the Waitlist', exact: true });
  await button.click(); await expect(page.getByRole('alert')).toContainText('Database unavailable');
  await expect(page.locator('#waitlist-email')).toHaveValue(before);
  await button.click(); await expect.poll(() => keys.length).toBe(2);
  expect(keys[0]).toBe(keys[1]);
  await expect(page.getByText("You're on the list!", { exact: true })).toHaveCount(0);
});
test('newsletter validates consent and persists a valid subscription', async ({ page }) => {
  await page.goto(path('#contact'));
  await page.getByRole('button', { name: 'Subscribe', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('consent');
  await page.locator('#newsletter-email').fill(`news-${crypto.randomUUID()}@example.com`);
  await page.getByRole('checkbox', { name: /I want launch news/ }).check();
  await page.getByRole('button', { name: 'Subscribe', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('newsletter signup has been saved');
});
test('request timeout is recoverable without clearing signup data', async ({ page }) => {
  await page.goto(path('#waitlist')); await fillIntake(page);
  await page.route('**/api/intakes', async route => { await new Promise(resolve => setTimeout(resolve, 12000)); await route.abort().catch(() => {}); });
  await page.locator('#waitlist').getByRole('button', { name: 'Join the Waitlist', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('timed out', { timeout: 15000 });
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('Browser Test');
  await expect(page.locator('#waitlist').getByRole('button', { name: 'Join the Waitlist', exact: true })).toBeEnabled();
});
