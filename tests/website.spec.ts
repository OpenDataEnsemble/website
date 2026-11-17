import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import {
  FORUM,
  GITHUB_CONTRIBUTING,
  GITHUB_ISSUES,
  GITHUB_WEBSITE_ISSUES,
  PUBLIC_SITE_URL,
} from '../src/site';

const screenshotDirectory = '.preview';

function at(path: string) {
  return new RegExp(`${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?$`);
}

test('loads the landing page without browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page).toHaveTitle('ODE · Open Data Ensemble');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Good data.From the field.Offline.',
  );
  await expect(
    page.getByRole('navigation', { name: 'Main navigation' }),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  mkdirSync(screenshotDirectory, { recursive: true });
  await page.screenshot({
    path: `${screenshotDirectory}/desktop.png`,
    fullPage: true,
  });
  await page.screenshot({ path: `${screenshotDirectory}/hero.png` });
  expect(errors).toEqual([]);
});

test('product tabs work with pointer and keyboard', async ({ page }) => {
  await page.goto('/#platform');
  await page.getByRole('tab', { name: '02 Synchronize' }).click();
  await expect(page.getByRole('tabpanel')).toContainText(
    'Get everyone on the same page.',
  );
  await expect(
    page.getByRole('tab', { name: '02 Synchronize' }),
  ).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tabpanel')).toContainText(
    'Make something of what you find.',
  );
  await expect(page.getByRole('tab', { name: '03 Explore' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.getByRole('tabpanel')).toContainText(
    'Out there is where it starts.',
  );
  await expect(page.getByRole('tab', { name: '01 Collect' })).toBeFocused();
});

test('demo completes the offline collection and simulated sync flow', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'See how it works' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Nothing is stored or sent to a server.');
  await page.getByLabel('Habitat type').selectOption('Wetland');
  await page
    .getByLabel('Field notes')
    .fill('A healthy wetland with new reeds.');
  await page.getByRole('button', { name: 'Save observation' }).click();
  await expect(page.getByRole('status')).toHaveText(
    '1 sample observation queued',
  );
  await expect(dialog).toContainText('Wetland');
  await page.getByRole('button', { name: 'Simulate going online' }).click();
  await expect(page.getByRole('status')).toHaveText(
    'Sync complete (simulated)',
  );
  await page.getByRole('button', { name: 'Try another observation' }).click();
  await expect(page.getByLabel('Habitat type')).toHaveValue('Wetland');
  await page.getByRole('button', { name: 'Close demo' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole('button', { name: 'See how it works' }),
  ).toBeFocused();
});

test('dialog closes with Escape and restores scrolling', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('button', { name: 'Try the offline field observation demo' })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(
    page.getByRole('button', {
      name: 'Try the offline field observation demo',
    }),
  ).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('FAQ answers expand and collapse', async ({ page }) => {
  await page.goto('/about');
  const question = page
    .locator('summary')
    .filter({ hasText: 'Does it really work without internet?' });
  await question.click();
  const answer = page.getByText('Yes. Formulus is offline-first:', {
    exact: false,
  });
  await expect(answer).toBeVisible();
  await question.click();
  await expect(answer).not.toBeVisible();
});

test('all internal navigation links have real targets', async ({ page }) => {
  await page.goto('/');
  const broken = await page
    .locator('a[href^="#"], a[href^="/#"]')
    .evaluateAll((anchors) =>
      anchors
        .map((anchor) => anchor.getAttribute('href')!)
        .filter((href) => {
          const id = href.split('#')[1];
          return id !== '' && !document.getElementById(id);
        }),
    );
  expect(broken).toEqual([]);
  await expect(
    page.getByRole('link', { name: 'Get started with ODE' }),
  ).toHaveAttribute(
    'href',
    'https://opendataensemble.org/docs/getting-started',
  );
  await expect(
    page.getByRole('link', { name: 'Get the latest release' }),
  ).toHaveAttribute('href', 'https://opendataensemble.org/downloads');
});

test('header, footer, and product links match the docs site', async ({
  page,
}) => {
  const origin = 'https://opendataensemble.org';
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(
    navigation.getByRole('link', { name: 'Documentation' }),
  ).toHaveAttribute('href', `${origin}/docs`);
  await expect(
    navigation.getByRole('link', { name: 'Downloads' }),
  ).toHaveAttribute('href', `${origin}/downloads`);
  await expect(
    page.getByRole('link', { name: 'Explore Formulus' }),
  ).toHaveAttribute('href', `${origin}/docs/reference/formulus`);
  await page.getByRole('tab', { name: '02 Synchronize' }).click();
  await expect(
    page.getByRole('link', { name: 'Explore Synkronus' }),
  ).toHaveAttribute('href', `${origin}/docs/reference/synkronus-server`);
  await page.getByRole('tab', { name: '03 Explore' }).click();
  await expect(
    page.getByRole('link', { name: 'Explore ODE Desktop' }),
  ).toHaveAttribute('href', `${origin}/docs/reference/ode-desktop`);
  await expect(
    page.getByRole('link', { name: 'Command-line tools' }),
  ).toHaveAttribute('href', `${origin}/docs/reference/synkronus-cli`);
  await expect(
    page.getByRole('link', { name: 'One shared API' }),
  ).toHaveAttribute(
    'href',
    `${origin}/docs/getting-started/architecture-overview`,
  );

  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('link', { name: 'Overview' })).toHaveAttribute(
    'href',
    `${origin}/docs`,
  );
  await expect(
    footer.getByRole('link', { name: 'Getting started' }),
  ).toHaveAttribute('href', `${origin}/docs/getting-started`);
  await expect(footer.getByRole('link', { name: 'Downloads' })).toHaveAttribute(
    'href',
    `${origin}/downloads`,
  );
  await expect(footer.getByRole('link', { name: 'Using ODE' })).toHaveAttribute(
    'href',
    `${origin}/docs/using`,
  );
  await expect(footer.getByRole('link', { name: 'Reference' })).toHaveAttribute(
    'href',
    `${origin}/docs/reference`,
  );
  await expect(footer.getByRole('link', { name: 'Forum' })).toHaveAttribute(
    'href',
    'https://forum.opendataensemble.org',
  );
  await expect(
    footer.getByRole('link', { name: 'Contribute' }),
  ).toHaveAttribute('href', GITHUB_CONTRIBUTING);
  await expect(footer.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/company/opendataensemble',
  );
  await expect(footer.getByRole('link', { name: 'TikTok' })).toHaveAttribute(
    'href',
    'https://www.tiktok.com/@opendataensemble',
  );
  const legal = footer.getByRole('navigation', { name: 'Legal' });
  await expect(legal.getByRole('link', { name: 'Privacy' })).toHaveAttribute(
    'href',
    `${origin}/docs/legal/formulus-privacy-policy`,
  );
  await expect(legal.getByRole('link', { name: 'Terms' })).toHaveAttribute(
    'href',
    `${origin}/docs/legal/formulus-terms`,
  );
  await expect(
    legal.getByRole('link', { name: 'Account deletion' }),
  ).toHaveAttribute('href', `${origin}/docs/legal/formulus-account-deletion`);
  await expect(legal.getByRole('link', { name: 'License' })).toHaveAttribute(
    'href',
    `${origin}/docs/legal/open-source-license`,
  );

  await page.goto('/about');
  await expect(
    page.getByRole('link', { name: /Formulus reference/ }),
  ).toHaveAttribute('href', `${origin}/docs/reference/formulus`);
  await expect(
    page.getByRole('link', { name: /Formplayer reference/ }),
  ).toHaveAttribute('href', `${origin}/docs/reference/formplayer`);
  await expect(
    page.getByRole('link', { name: /CLI reference/ }),
  ).toHaveAttribute('href', `${origin}/docs/reference/synkronus-cli`);

  await page.goto('/contact');
  await expect(
    page.getByRole('link', { name: /Ask on the forum/ }),
  ).toHaveAttribute('href', 'https://forum.opendataensemble.org');
  await expect(
    page.getByRole('link', { name: /Open an issue/ }),
  ).toHaveAttribute('href', GITHUB_ISSUES);
  await expect(
    page.getByRole('link', { name: /Help resources/ }),
  ).toHaveAttribute('href', `${origin}/docs/community/getting-help`);

  await page.goto('/community');
  await expect(
    page.getByRole('link', { name: /Good first issues/ }),
  ).toHaveAttribute(
    'href',
    `${GITHUB_WEBSITE_ISSUES}?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22`,
  );
  await expect(
    page.getByRole('link', { name: /Report an issue/ }),
  ).toHaveAttribute('href', GITHUB_ISSUES);
  await expect(
    page.getByRole('link', { name: /Read the contributing guide/ }),
  ).toHaveAttribute('href', GITHUB_CONTRIBUTING);
  await expect(
    page.getByRole('link', { name: /Browse examples/ }),
  ).toHaveAttribute('href', `${origin}/docs/community/examples`);
  await expect(
    page.getByRole('link', { name: /Development setup/ }),
  ).toHaveAttribute('href', `${origin}/docs/development/setup`);
});

test('contact form fills a mailto for general or security', async ({
  page,
}) => {
  await page.goto('/contact');
  const send = page.getByRole('link', { name: 'Send email' });
  await send.click();
  await expect(page.getByText('Add your name.')).toBeVisible();
  await expect(send).toHaveAttribute(
    'href',
    /^mailto:hello@opendataensemble\.org/,
  );

  await page.getByLabel('Name', { exact: true }).fill('Ada Okello');
  await page.getByLabel('Email', { exact: true }).fill('ada@example.org');
  await page.getByLabel('Organization').fill('Groundbreaker');
  await page
    .getByLabel('Message')
    .fill('I would like to try ODE in the field.');
  await expect(send).toHaveAttribute(
    'href',
    /mailto:hello@opendataensemble\.org\?subject=.*Ada%20Okello/,
  );
  await expect(send).toHaveAttribute('href', /ada%40example\.org/);
  await expect(send).toHaveAttribute('href', /Groundbreaker/);

  await page.getByRole('radio', { name: 'Security' }).click();
  const security = page.getByRole('link', { name: 'Email security' });
  await expect(security).toHaveAttribute(
    'href',
    /^mailto:security@opendataensemble\.org/,
  );
  await expect(security).toHaveAttribute('href', /Security%20report/);
  await expect(
    page.getByText('Opens a message to security@opendataensemble.org'),
  ).toBeVisible();

  await page.getByRole('radio', { name: 'General' }).click();
  await expect(page.getByRole('link', { name: 'Send email' })).toHaveAttribute(
    'href',
    /^mailto:hello@opendataensemble\.org/,
  );
});

const pages = [
  { name: 'About', path: '/about', heading: /Open tools for data/ },
  { name: 'Community', path: '/community', heading: /Good things happen/ },
  { name: 'Contact', path: '/contact', heading: /How to\s*reach us\./ },
];

test('404 page offers helpful recovery links', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist');

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole('heading', { level: 1, name: 'This page is not here.' }),
  ).toBeVisible();

  const main = page.getByRole('main');

  await expect(
    main.getByRole('link', { name: 'Back to the home page' }),
  ).toHaveAttribute('href', '/');

  await expect(
    main.getByRole('link', { name: 'Documentation' }),
  ).toHaveAttribute('href', 'https://opendataensemble.org/docs');
  await expect(
    main.getByRole('link', { name: 'Documentation' }),
  ).toHaveAttribute('target', '_blank');
  await expect(
    main.getByRole('link', { name: 'Documentation' }),
  ).toHaveAttribute('rel', 'noreferrer');

  await expect(main.getByRole('link', { name: 'Downloads' })).toHaveAttribute(
    'href',
    'https://opendataensemble.org/downloads',
  );
  await expect(main.getByRole('link', { name: 'Downloads' })).toHaveAttribute(
    'target',
    '_blank',
  );
  await expect(main.getByRole('link', { name: 'Downloads' })).toHaveAttribute(
    'rel',
    'noreferrer',
  );

  await expect(main.getByRole('link', { name: 'Community' })).toHaveAttribute(
    'href',
    '/community/',
  );
  const forum = main.getByRole('link', { name: 'Forum', exact: true });
  await expect(forum).toHaveAttribute('href', FORUM);
  await expect(forum).toHaveAttribute('target', '_blank');
  await expect(forum).toHaveAttribute('rel', 'noreferrer');
  await expect(main.getByRole('link', { name: 'Contact' })).toHaveAttribute(
    'href',
    '/contact/',
  );
});

test('each page has its own title and heading', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const { name, path, heading } of pages) {
    await page.goto(path);
    await expect(page).toHaveTitle(`${name} · ODE`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
  }
  expect(errors).toEqual([]);
});

test('top navigation and footer reach every page', async ({ page }) => {
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  const footer = page.getByRole('contentinfo');
  for (const { name, path } of pages) {
    await page.goto('/');
    await navigation.getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(at(path));
    await expect(
      navigation.getByRole('link', { name, exact: true }),
    ).toHaveAttribute('aria-current', 'page');
    await page.goto('/');
    await footer.getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(at(path));
  }
  await navigation.getByRole('link', { name: 'The platform' }).click();
  await expect(page).toHaveURL(/\/#platform$/);
});

test('community page links to the Kampala 2026 event story', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/community');
  const events = page.getByRole('region', { name: /Where the ensemble/ });
  await expect(events).toContainText('ODE Community Days');
  await expect(events).toContainText('Groundbreaker Talents');
  await events.getByRole('link', { name: 'Read the event story' }).click();
  await expect(page).toHaveURL(at('/community/kampala-2026'));
  await expect(page).toHaveTitle('ODE Community Days, Kampala 2026 · ODE');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /ODE Community Days\s*Kampala 2026\./,
  );
  await expect(
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'Community', exact: true }),
  ).toHaveAttribute('aria-current', 'true');
  await expect(
    page.getByRole('link', { name: /Visit Groundbreaker Talents/ }),
  ).toHaveAttribute('href', 'https://groundbreaker.org/');

  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((done) => setTimeout(done, 30));
    }
  });
  await page.waitForLoadState('networkidle');
  const broken = await page.locator('main img').evaluateAll((images) =>
    images
      .filter((image) => {
        const img = image as HTMLImageElement;
        return !img.complete || img.naturalWidth === 0 || !img.alt;
      })
      .map((image) => (image as HTMLImageElement).currentSrc),
  );
  expect(broken).toEqual([]);
  expect(errors).toEqual([]);
});

test('community photo wall filters, switches layout, and opens the viewer', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/community#photo-wall');
  const wall = page.getByRole('region', { name: /The whole day/ });
  const prints = wall.locator('.wall-prints > li');

  await expect(prints).toHaveCount(12);
  await wall.getByRole('button', { name: /Show all 55 photos/ }).click();
  await expect(prints).toHaveCount(55);

  await wall.getByRole('button', { name: /The ODE Lab/ }).click();
  await expect(prints).toHaveCount(12);
  await expect(
    wall.getByRole('button', { name: /The ODE Lab/ }),
  ).toHaveAttribute('aria-pressed', 'true');

  await wall.getByRole('button', { name: 'Contact sheet' }).click();
  await expect(wall.getByRole('button', { name: 'Shuffle' })).toBeDisabled();
  await expect(prints.first()).toContainText('07');

  const opener = wall.getByRole('button', { name: /^Open photo 1 of 12/ });
  await opener.click();
  const viewer = page.getByRole('dialog', { name: /ODE Community Days/ });
  await expect(viewer).toBeVisible();
  await expect(viewer.locator('.viewer-count')).toHaveText('01 / 12');
  await page.keyboard.press('ArrowRight');
  await expect(viewer.locator('.viewer-count')).toHaveText('02 / 12');
  await page.keyboard.press('End');
  await expect(viewer.locator('.viewer-count')).toHaveText('12 / 12');
  await page.keyboard.press('ArrowRight');
  await expect(viewer.locator('.viewer-count')).toHaveText('01 / 12');
  await viewer.getByRole('button', { name: /^Photo 5:/ }).click();
  await expect(viewer.locator('.viewer-count')).toHaveText('05 / 12');
  await viewer.getByRole('button', { name: 'Zoom' }).click();
  await expect(viewer.locator('.viewer-stage')).toHaveClass(/is-zoomed/);
  await expect
    .poll(() =>
      viewer
        .locator('.viewer-image')
        .evaluate((image) => (image as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);

  await page.keyboard.press('Escape');
  await expect(viewer).not.toBeVisible();
  await expect(opener).toBeFocused();
  expect(errors).toEqual([]);
});

test('event gallery photos open in the viewer', async ({ page }) => {
  await page.goto('/community/kampala-2026');
  const gallery = page.getByRole('region', { name: /Moments/ });
  await gallery.getByRole('button', { name: /^Open photo 3 of 11/ }).click();
  const viewer = page.getByRole('dialog');
  await expect(viewer.locator('.viewer-count')).toHaveText('03 / 11');
  await viewer.getByRole('button', { name: 'Close photo viewer' }).click();
  await expect(viewer).not.toBeVisible();
  await expect(
    gallery.getByRole('link', { name: /See all 55 photos/ }),
  ).toHaveAttribute('href', '/community/#photo-wall');
});

test('mobile navigation and demo are usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Main navigation' });
  await expect(navigation).not.toBeVisible();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(navigation).toBeVisible();
  await navigation.getByRole('link', { name: 'The platform' }).click();
  await expect(navigation).not.toBeVisible();
  await expect(page).toHaveURL(/#platform$/);
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  mkdirSync(screenshotDirectory, { recursive: true });
  await page.screenshot({
    path: `${screenshotDirectory}/mobile.png`,
    fullPage: true,
  });
  await page.getByRole('button', { name: 'See how it works' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Save observation' }).click();
  await expect(page.getByRole('status')).toHaveText(
    '1 sample observation queued',
  );
  await page.getByRole('button', { name: 'Close demo' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('layouts do not overflow at phone, tablet, or desktop widths', async ({
  page,
}) => {
  test.setTimeout(120000);
  for (const path of [
    '/',
    ...pages.map((entry) => entry.path),
    '/community/kampala-2026',
    '/this-page-does-not-exist',
  ]) {
    for (const width of [320, 375, 390, 680, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(
        dimensions.content,
        `Horizontal overflow on ${path} at ${width}px`,
      ).toBeLessThanOrEqual(dimensions.width);
    }
  }
});

test('robots and sitemap expose the public site routes', async ({
  request,
}) => {
  const basePath = (process.env.BASE_PATH ?? '').replace(/\/$/, '');

  const robotsResponse = await request.get(`${basePath}/robots.txt`);
  expect(robotsResponse.ok()).toBeTruthy();

  const robots = await robotsResponse.text();
  expect(robots).toContain('User-Agent: *');
  expect(robots).toContain('Allow: /');
  expect(robots).toContain(`Sitemap: ${PUBLIC_SITE_URL}/sitemap.xml`);

  const sitemapResponse = await request.get(`${basePath}/sitemap.xml`);
  expect(sitemapResponse.ok()).toBeTruthy();

  const sitemap = await sitemapResponse.text();
  const expectedUrls = [
    `${PUBLIC_SITE_URL}/`,
    `${PUBLIC_SITE_URL}/about/`,
    `${PUBLIC_SITE_URL}/community/`,
    `${PUBLIC_SITE_URL}/community/kampala-2026/`,
    `${PUBLIC_SITE_URL}/contact/`,
  ];

  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1],
  );
  expect(urls).toEqual(expectedUrls);
});

test('social previews share the static branded image', async ({
  page,
  request,
}) => {
  const imageUrl = 'https://opendataensemble.github.io/website/brand/og.png';

  for (const path of ['/', '/about/']) {
    await page.goto(path);
    const og = (property: string) =>
      page.locator(`meta[property="og:${property}"]`);
    const twitter = (name: string) =>
      page.locator(`meta[name="twitter:${name}"]`);

    await expect(og('image')).toHaveAttribute('content', imageUrl);
    await expect(og('image:width')).toHaveAttribute('content', '1200');
    await expect(og('image:height')).toHaveAttribute('content', '630');
    await expect(og('image:alt')).toHaveAttribute(
      'content',
      /Open Data Ensemble/,
    );
    await expect(twitter('card')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    await expect(twitter('image')).toHaveAttribute('content', imageUrl);
    for (const field of ['title', 'description', 'image:alt']) {
      await expect(twitter(field)).toHaveAttribute(
        'content',
        (await og(field).getAttribute('content'))!,
      );
    }
  }

  const response = await request.get('/brand/og.png');
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toContain('image/png');
  const image = await response.body();
  expect(image.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
  expect(image.readUInt32BE(16)).toBe(1200);
  expect(image.readUInt32BE(20)).toBe(630);
  expect(image.length).toBeLessThan(300_000);
});

test('favicon and touch icons export at their advertised URLs', async ({
  page,
  request,
}) => {
  const basePath = (process.env.BASE_PATH ?? '').replace(/\/$/, '');
  const icons = [
    {
      rel: 'icon',
      file: 'favicon.ico',
      type: 'image/x-icon',
      sizes: '16x16 32x32 48x48',
    },
    {
      rel: 'apple-touch-icon',
      file: 'apple-touch-icon.png',
      type: 'image/png',
      sizes: '180x180',
    },
  ];

  for (const path of ['/', '/about/']) {
    await page.goto(`${basePath}${path}`);
    for (const icon of icons) {
      const link = page.locator(`link[rel="${icon.rel}"]`);
      await expect(link).toHaveCount(1);
      await expect(link).toHaveAttribute('type', icon.type);
      await expect(link).toHaveAttribute('sizes', icon.sizes);
      const url = new URL((await link.getAttribute('href'))!, page.url());
      expect(url.origin).toBe(new URL(page.url()).origin);
      expect(url.pathname).toBe(`${basePath}/${icon.file}`);

      const response = await request.get(url.toString());
      expect(response.ok()).toBeTruthy();
      const body = await response.body();
      expect(body.length).toBeLessThan(32_000);
      if (icon.rel === 'icon') {
        expect(body.subarray(0, 4).toString('hex')).toBe('00000100');
        const count = body.readUInt16LE(4);
        expect(count).toBe(3);
        const sizes = Array.from({ length: count }, (_, index) => {
          const offset = 6 + index * 16;
          const width = body[offset] || 256;
          const height = body[offset + 1] || 256;
          expect(
            body.readUInt32LE(offset + 12) + body.readUInt32LE(offset + 8),
          ).toBeLessThanOrEqual(body.length);
          return `${width}x${height}`;
        });
        expect(sizes).toEqual(['16x16', '32x32', '48x48']);
      } else {
        expect(response.headers()['content-type']).toContain('image/png');
        expect(body.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
        expect(body.readUInt32BE(16)).toBe(180);
        expect(body.readUInt32BE(20)).toBe(180);
      }

      const decoded = await page.evaluate(async (src) => {
        const image = new Image();
        image.src = src;
        await image.decode();
        return { width: image.naturalWidth, height: image.naturalHeight };
      }, url.toString());
      expect(decoded).toEqual(
        icon.rel === 'icon'
          ? { width: 48, height: 48 }
          : { width: 180, height: 180 },
      );
    }
  }
});

test('testimonial dialog traps focus, locks scrolling, and restores its opener', async ({
  page,
}) => {
  await page.goto('/');
  const opener = page.getByRole('button', { name: 'Share Your Experience' });
  const dialog = page.getByRole('dialog', { name: 'Share Your Experience' });
  await opener.click();
  await expect(dialog).toBeVisible();
  expect(
    await dialog.evaluate(
      (element) =>
        element instanceof HTMLDialogElement &&
        element.open &&
        element.matches(':modal'),
    ),
  ).toBe(true);
  const close = dialog.getByRole('button', { name: 'Close form' });
  const submit = dialog.getByRole('button', { name: 'Submit Testimonial' });
  await expect(close).toBeFocused();
  // Chromium may visit browser chrome at a boundary (activeElement is body).
  // No background page control may receive focus, and traversal returns inside.
  const traverse = async (key: string) => {
    await page.keyboard.press(key);
    if (await page.evaluate(() => document.activeElement === document.body)) {
      await page.keyboard.press(key);
    }
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  };
  await traverse('Shift+Tab');
  await expect(submit).toBeFocused();
  await traverse('Tab');
  await expect(close).toBeFocused();
  for (let index = 0; index < 12; index++) {
    await traverse('Tab');
  }
  await opener.evaluate((element) => element.focus());
  expect(
    await dialog.evaluate((element) =>
      element.contains(document.activeElement),
    ),
  ).toBe(true);
  const scrollY = await page.evaluate(() => window.scrollY);
  await page.mouse.move(5, 5);
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  for (const name of ['Close form', 'Cancel']) {
    await opener.click();
    await dialog.getByRole('button', { name, exact: true }).click();
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();
  }
  await opener.click();
  await dialog.getByRole('heading').click();
  await expect(dialog).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test('testimonial dialog preserves validation, submission, and persistence', async ({
  page,
}) => {
  await page.goto('/');
  const opener = page.getByRole('button', { name: 'Share Your Experience' });
  const dialog = page.getByRole('dialog', { name: 'Share Your Experience' });
  await opener.click();
  await dialog.getByRole('button', { name: 'Submit Testimonial' }).click();
  for (const message of [
    'Name is required',
    'Email is required',
    'Quote is required',
  ]) {
    await expect(dialog.getByText(message, { exact: true })).toBeVisible();
  }
  await dialog.getByLabel('Name', { exact: false }).fill(' Ada Okello ');
  await dialog.getByLabel('Email').fill('ada@example.org');
  const quote = dialog.getByLabel('Your Experience');
  await quote.fill('x'.repeat(501));
  await expect(quote).toHaveValue('x'.repeat(500));
  await quote.fill(' Reliable observations from our field team. ');
  await dialog.getByRole('button', { name: 'Submit Testimonial' }).click();
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
  const card = page
    .locator('.testimonial-card')
    .filter({ hasText: 'Ada Okello' })
    .first();
  await expect(card).toContainText(
    'Reliable observations from our field team.',
  );
  await expect(card).toContainText('Team Member');
  await expect(card).toContainText('Community');
  await expect
    .poll(() =>
      page.evaluate(() =>
        JSON.parse(localStorage.getItem('ode-testimonials') || '[]').at(-1),
      ),
    )
    .toMatchObject({
      name: 'Ada Okello',
      role: 'Team Member',
      company: 'Community',
      quote: 'Reliable observations from our field team.',
      avatarUrl: '/brand/avatar.png',
    });
  await page.reload();
  await expect(card).toContainText(
    'Reliable observations from our field team.',
  );
});

test('testimonial dialog keeps optional details and uploaded photo', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Share Your Experience' }).click();
  const dialog = page.getByRole('dialog', { name: 'Share Your Experience' });
  await dialog.getByLabel('Name', { exact: false }).fill('Grace Nakiyemba');
  await dialog.getByLabel('Email').fill('grace@example.org');
  await dialog.getByLabel('Role', { exact: true }).fill('Field Researcher');
  await dialog.getByLabel('Organization').fill('Field Team');
  await dialog
    .getByLabel('Your Experience')
    .fill('Collecting observations offline.');
  const photo = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aFOsAAAAASUVORK5CYII=',
    'base64',
  );
  await dialog.locator('input[type="file"]').setInputFiles({
    name: 'avatar.png',
    mimeType: 'image/png',
    buffer: photo,
  });
  await expect(
    dialog.getByRole('img', { name: 'Profile preview' }),
  ).toHaveAttribute('src', /^data:image\/png;base64,/);
  await dialog.getByRole('button', { name: 'Submit Testimonial' }).click();
  await expect(dialog).not.toBeVisible();
  const card = page
    .locator('.testimonial-card')
    .filter({ hasText: 'Grace Nakiyemba' })
    .first();
  await expect(card).toContainText('Field Researcher');
  await expect(card).toContainText('Field Team');
  await expect(card).toContainText('Collecting observations offline.');
  await expect(card.locator('img')).toHaveAttribute(
    'src',
    `data:image/png;base64,${photo.toString('base64')}`,
  );
});
