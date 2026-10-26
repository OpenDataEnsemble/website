import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';

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
    page.getByRole('link', { name: /Send an email/ }),
  ).toHaveAttribute('href', 'mailto:hello@opendataensemble.org');
  await expect(
    page.getByRole('link', { name: /Help resources/ }),
  ).toHaveAttribute('href', `${origin}/docs/community/getting-help`);

  await page.goto('/community');
  await expect(
    page.getByRole('link', { name: /Browse examples/ }),
  ).toHaveAttribute('href', `${origin}/docs/community/examples`);
  await expect(
    page.getByRole('link', { name: /Development setup/ }),
  ).toHaveAttribute('href', `${origin}/docs/development/setup`);
});

const pages = [
  { name: 'About', path: '/about', heading: /Open tools for data/ },
  { name: 'Community', path: '/community', heading: /Good things happen/ },
  { name: 'Contact', path: '/contact', heading: /How to\s*reach us\./ },
];

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
