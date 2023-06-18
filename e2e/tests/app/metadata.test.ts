import { createUrl } from "@acdh-oeaw/lib";

import { locales } from "@/config/i18n.config";
import { expect, test } from "~/e2e/lib/test";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const baseUrl = process.env.PUBLIC_APP_BASE_URL!;

test("should set a canonical url", async ({ page }) => {
	for (const locale of locales) {
		await page.goto(`/${locale}/`);

		const canonicalUrl = page.locator('link[rel="canonical"]');
		await expect(canonicalUrl).toHaveAttribute(
			"href",
			String(createUrl({ baseUrl, pathname: `/${locale}/` })),
		);
	}
});

test("should set document title on not-found page", async ({ page }) => {
	await page.goto("/unknown/");
	await expect(page).toHaveTitle("Page not found | ACDH-CH Website");

	// TODO:
	// await page.goto("/de/unknown/");
	// await expect(page).toHaveTitle("Seite nicht gefunden | ACDH-CH Website");
});

test("should disallow indexing of not-found page", async ({ page }) => {
	for (const pathname of ["/unknown/", "/de/unknown/"]) {
		await page.goto(pathname);

		const ogTitle = page.locator('meta[name="robots"]');
		await expect(ogTitle).toHaveAttribute("content", "noindex");
	}
});

test.describe("should set page metadata", () => {
	test("static", async ({ page }) => {
		await page.goto("/en/");

		const ogType = page.locator('meta[property="og:type"]');
		await expect(ogType).toHaveAttribute("content", "website");

		const twCard = page.locator('meta[name="twitter:card"]');
		await expect(twCard).toHaveAttribute("content", "summary_large_image");

		const twCreator = page.locator('meta[name="twitter:creator"]');
		await expect(twCreator).toHaveAttribute("content", "@acdh_oeaw");

		const twSite = page.locator('meta[name="twitter:site"]');
		await expect(twSite).toHaveAttribute("content", "@acdh_oeaw");

		// const googleSiteVerification = page.locator('meta[name="google-site-verification"]');
		// await expect(googleSiteVerification).toHaveAttribute("content", "");
	});

	test("with en locale", async ({ page }) => {
		await page.goto("/en/");

		await expect(page).toHaveTitle("Home | ACDH-CH Website");

		const metaDescription = page.locator('meta[name="description"]');
		await expect(metaDescription).toHaveAttribute("content", "A project website.");

		const ogTitle = page.locator('meta[property="og:title"]');
		await expect(ogTitle).toHaveAttribute("content", "Home");

		const ogDescription = page.locator('meta[property="og:description"]');
		await expect(ogDescription).toHaveAttribute("content", "A project website.");

		const ogSiteName = page.locator('meta[property="og:site_name"]');
		await expect(ogSiteName).toHaveAttribute("content", "ACDH-CH Website");

		const ogUrl = page.locator('meta[property="og:url"]');
		await expect(ogUrl).toHaveAttribute(
			"content",
			String(createUrl({ baseUrl, pathname: "/en/" })),
		);

		const ogLocale = page.locator('meta[property="og:locale"]');
		await expect(ogLocale).toHaveAttribute("content", "en");
	});

	test("with de locale", async ({ page }) => {
		await page.goto("/de/");

		await expect(page).toHaveTitle("Startseite | ACDH-CH Website");

		const metaDescription = page.locator('meta[name="description"]');
		await expect(metaDescription).toHaveAttribute("content", "Eine Projekt-Website.");

		const ogTitle = page.locator('meta[property="og:title"]');
		await expect(ogTitle).toHaveAttribute("content", "Startseite");

		const ogDescription = page.locator('meta[property="og:description"]');
		await expect(ogDescription).toHaveAttribute("content", "Eine Projekt-Website.");

		const ogSiteName = page.locator('meta[property="og:site_name"]');
		await expect(ogSiteName).toHaveAttribute("content", "ACDH-CH Website");

		const ogUrl = page.locator('meta[property="og:url"]');
		await expect(ogUrl).toHaveAttribute(
			"content",
			String(createUrl({ baseUrl, pathname: "/de/" })),
		);

		const ogLocale = page.locator('meta[property="og:locale"]');
		await expect(ogLocale).toHaveAttribute("content", "de");
	});
});

test.describe("should add json+ld metadata", () => {
	test("with en locale", async ({ page }) => {
		await page.goto("/en/");

		const metadata = await page.locator('script[type="application/ld+json"]').textContent();
		// eslint-disable-next-line playwright/prefer-web-first-assertions
		expect(metadata).toBe(
			JSON.stringify({
				"@context": "https://schema.org",
				"@type": "WebSite",
				name: "ACDH-CH Website",
				description: "A project website.",
			}),
		);
	});

	test("with de locale", async ({ page }) => {
		await page.goto("/de/");

		const metadata = await page.locator('script[type="application/ld+json"]').textContent();
		// eslint-disable-next-line playwright/prefer-web-first-assertions
		expect(metadata).toBe(
			JSON.stringify({
				"@context": "https://schema.org",
				"@type": "WebSite",
				name: "ACDH-CH Website",
				description: "Eine Projekt-Website.",
			}),
		);
	});
});

test("should serve an open-graph image", async ({ request }) => {
	// TODO: opengraph image per locale
	const response = await request.get(`/opengraph-image.png`);
	const status = response.status();

	expect(status).toEqual(200);
});
