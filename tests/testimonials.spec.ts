import { expect, test } from '@playwright/test';

test('reduced motion stops autoplay while previous and next still work', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/');
  const track = page.locator('.testimonials-track');
  await expect(track).toBeVisible();
  await page.getByRole('heading', { level: 1 }).hover();

  const initial = await track.evaluate((element) => element.style.transform);
  await page.clock.runFor(4000);
  await expect(track).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  expect(await track.evaluate((element) => element.style.transform)).toBe(
    initial,
  );

  await page.getByRole('button', { name: 'Previous testimonials' }).click();
  await expect(track).not.toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  const previous = await track.evaluate((element) => element.style.transform);
  await page.getByRole('heading', { level: 1 }).hover();
  await page.clock.runFor(4000);
  expect(await track.evaluate((element) => element.style.transform)).toBe(
    previous,
  );

  await page.getByRole('button', { name: 'Next testimonials' }).click();
  await expect(track).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
});

test('autoplay responds to motion preference changes without a reload', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.install();
  await page.goto('/');
  const track = page.locator('.testimonials-track');
  await expect(track).toBeVisible();
  await page.getByRole('heading', { level: 1 }).hover();
  const moving = await track.evaluate((element) => element.style.transform);
  await page.clock.runFor(1000);
  expect(await track.evaluate((element) => element.style.transform)).not.toBe(
    moving,
  );

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.runFor(100);
  const stopped = await track.evaluate((element) => element.style.transform);
  await page.clock.runFor(2000);
  expect(await track.evaluate((element) => element.style.transform)).toBe(
    stopped,
  );

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.runFor(1000);
  expect(await track.evaluate((element) => element.style.transform)).not.toBe(
    stopped,
  );
});
