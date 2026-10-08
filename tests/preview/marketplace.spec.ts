import { test, expect, type Page } from "@playwright/test";
import { mkdirSync } from "node:fs";

// Next.js streams HTML before navigation becomes interactive. Await hydration
// before replacing a document so the suite does not race its outgoing render.
async function openPage(page: Page, path: string) {
  if (page.url() !== "about:blank")
    await expect(page.locator("#main-nav")).toHaveAttribute(
      "data-ready",
      "true",
    );
  await page.goto(path);
  await expect(page.locator("#main-nav")).toHaveAttribute("data-ready", "true");
}

// Use a demo build. These tests never publish listings or contact real hosts.
test.beforeEach(async ({ page }) => {
  mkdirSync("artifacts", { recursive: true });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`${page.url()}: ${e.message}`));
  (page as typeof page & { appErrors: string[] }).appErrors = errors;
});
test.afterEach(async ({ page }) => {
  expect((page as typeof page & { appErrors: string[] }).appErrors).toEqual([]);
});

test("desktop discovery: images, filters, saved homes and gallery", async ({
  page,
}) => {
  await openPage(page, "/en");
  await expect(page.getByRole("heading", { name: /New city/ })).toBeVisible();
  await expect(page.locator(".listing-card")).toHaveCount(4);
  await expect(page.locator(".hero-image")).toHaveJSProperty("complete", true);
  expect(
    await page
      .locator(".hero-image")
      .evaluate((el: HTMLImageElement) => el.naturalWidth),
  ).toBeGreaterThan(0);
  await page.screenshot({ path: "artifacts/home-desktop.png", fullPage: true });
  await page.getByRole("button", { name: "Save this home" }).first().click();
  await openPage(page, "/en/saved");
  await expect(page.locator(".listing-card")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".listing-card")).toHaveCount(1);
  await page.getByRole("button", { name: "Remove from saved" }).click();
  await expect(page.locator(".listing-card")).toHaveCount(0);
  await openPage(page, "/en/search");
  await expect(page.locator(".listing-card")).toHaveCount(8);
  await page
    .getByRole("combobox", { name: "Neighborhood", exact: true })
    .selectOption("kadikoy");
  await page.getByLabel("Maximum monthly rent (TRY)").fill("20000");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".listing-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "A little sunlight, a lot of home" }),
  ).toBeVisible();
  await openPage(page, "/en/search?sort=price-asc");
  await expect(page.locator(".listing-card")).toHaveCount(8);
  const prices = await page.locator(".card-price strong").allTextContents();
  const numeric = prices.map((p) => Number(p.replace(/[^\d]/g, "")));
  expect(numeric).toEqual([...numeric].sort((a, b) => a - b));
  await page.screenshot({
    path: "artifacts/search-desktop.png",
    fullPage: true,
  });
  // Restrict network interception to the map being tested. Global interception
  // disables the browser cache and changes every page's document-loading path.
  const tilePattern = /^https:\/\/[abc]\.tile\.openstreetmap\.org\//;
  await page.route(tilePattern, (route) => route.abort());
  await page.getByRole("button", { name: "Show map" }).click();
  await expect(page.locator(".leaflet-container")).toBeVisible();
  await expect(page.locator(".price-marker")).toHaveCount(8);
  await expect(page.locator(".map-unavailable")).toContainText(
    "Map details couldn't load.",
  );
  await page.getByRole("button", { name: "Show list" }).click();
  await page.unroute(tilePattern);
  await openPage(page, "/en/listings/moda-sunlight");
  await expect(
    page.getByRole("button", { name: "Message the host" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "All 3 photos" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Next photo" }).click();
  await expect(page.locator(".gallery-navigation")).toContainText("2 / 3");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.locator(".leaflet-container")).toBeVisible();
  await page.screenshot({
    path: "artifacts/listing-desktop.png",
    fullPage: true,
  });
});

test("mobile journey: navigation, localized search and no horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openPage(page, "/en");
  await expect(page.getByRole("heading", { name: /New city/ })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "artifacts/home-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Toggle menu" }).click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "TR", exact: true }).click();
  await expect(page).toHaveURL(/\/tr$/);
  await expect(
    page.getByRole("heading", { name: /Yeni bir şehir/ }),
  ).toBeVisible();
  await openPage(page, "/tr/search?district=kadikoy");
  await expect(page.locator(".listing-card")).toHaveCount(2);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Diğer filtreler" }).click();
  await expect(page.getByLabel("Faturalar dahil")).toBeVisible();
  await page.getByLabel("Faturalar dahil").check();
  await page.getByRole("button", { name: "Ara", exact: true }).click();
  await expect(page.locator(".listing-card")).toHaveCount(1);
  await openPage(page, "/en/listings/moda-sunlight");
  await expect(page.locator(".leaflet-container")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "artifacts/listing-mobile.png",
    fullPage: true,
  });
});

test("empty state, helpers and preview forms load without runtime errors", async ({
  page,
}) => {
  await openPage(page, "/en/search?maxRent=100");
  await expect(
    page.getByRole("heading", { name: "Let’s open up the search." }),
  ).toBeVisible();
  await openPage(page, "/en/search?minRent=50000&maxRent=100");
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "Maximum rent",
  );
  for (const route of [
    "/en/neighborhoods",
    "/tr/help",
    "/en/help/interest-request-flow",
    "/en/login",
    "/en/signup",
    "/en/messages",
    "/en/my-listings",
    "/en/admin",
    "/en/listings/new",
  ]) {
    await openPage(page, route);
    await expect(page.locator("main")).toBeVisible();
    await expect(
      page.getByText("A small detour.", { exact: true }),
    ).toHaveCount(0);
  }
  await expect(page.locator('button[type="submit"]')).toBeDisabled();
  await expect(page.locator(".leaflet-container")).toBeVisible();
  await page.screenshot({ path: "artifacts/host-form.png", fullPage: true });
  await openPage(page, "/en/listings/nonexistent");
  await expect(
    page.getByRole("heading", { name: "This door is closed for now." }),
  ).toBeVisible();
});
