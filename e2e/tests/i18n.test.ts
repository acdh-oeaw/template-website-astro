import { createUrl } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";
import { defaultLocale, locales } from "@/lib/i18n/locales";
import { expect, test } from "~/e2e/lib/test";

test.describe("i18n", () => {
	test.describe("should redirect root route to preferred locale", () => {
		test.use({ locale: "en-GB" });

		test("with default locale", async ({ page }) => {
			await page.goto("/");
			await expect(page).toHaveURL("/en");
		});
	});

	test.describe("should redirect root route to preferred locale", () => {
		test.use({ locale: "fr-CA" });

		test("with unsupported locale", async ({ page }) => {
			await page.goto("/");
			await expect(page).toHaveURL("/en");
		});
	});

	test("should display not-found page for unknown locale", async ({ createI18n, page }) => {
		const i18n = await createI18n(defaultLocale);
		const response = await page.goto("/unknown");
		expect(response?.status()).toBe(404);
		await expect(page.getByRole("heading", { name: i18n.t("NotFoundPage.title") })).toBeVisible();
	});

	test("should support switching locale", async ({ createI18n, createImprintPage, page }) => {
		// @ts-expect-error Single locale could be configured.
		// eslint-disable-next-line playwright/no-skipped-test, @typescript-eslint/no-unnecessary-condition
		test.skip(locales.length === 1, "Only single locale configured.");

		const { imprintPage, i18n: de } = await createImprintPage("de-AT");
		await imprintPage.goto();

		await expect(page).toHaveURL("/de/imprint");
		await expect(page.getByRole("heading", { name: de.t("ImprintPage.title") })).toBeVisible();
		await expect(page).toHaveTitle(
			[de.t("ImprintPage.title"), de.messages.metadata.title].join(" | "),
		);

		await page
			.getByRole("link", { name: de.t("LocaleSwitcher.switch-locale-to", { locale: "Englisch" }) })
			.click();
		const en = await createI18n("en-GB");

		await expect(page).toHaveURL("/en/imprint/");
		await expect(page.getByRole("heading", { name: en.t("ImprintPage.title") })).toBeVisible();
		await expect(page).toHaveTitle(
			[en.t("ImprintPage.title"), en.messages.metadata.title].join(" | "),
		);
	});

	test("should set `lang` attribute on `html` element", async ({ createIndexPage }) => {
		for (const locale of locales) {
			const { indexPage } = await createIndexPage(locale);
			await indexPage.goto();
			await expect(indexPage.page.locator("html")).toHaveAttribute("lang", locale);
		}
	});

	test("should set alternate links in link tags", async ({
		createIndexPage,
		createImprintPage,
	}) => {
		function createAbsoluteUrl(pathname: string) {
			return String(createUrl({ baseUrl: env.PUBLIC_APP_BASE_URL, pathname }));
		}

		for (const locale of locales) {
			const { indexPage } = await createIndexPage(locale);
			await indexPage.goto();

			const links = await indexPage.page
				.locator('link[rel="alternate"][hreflang]')
				.evaluateAll((elements) => {
					return elements.map((element) => {
						return element.outerHTML;
					});
				});

			expect(links).toEqual(
				expect.arrayContaining([
					`<link href="${createAbsoluteUrl(`/de/`)}" hreflang="de-AT" rel="alternate">`,
					`<link href="${createAbsoluteUrl(`/en/`)}" hreflang="en-GB" rel="alternate">`,
					`<link href="${createAbsoluteUrl(`/`)}" hreflang="x-default" rel="alternate">`,
				]),
			);
		}

		for (const locale of locales) {
			const { imprintPage } = await createImprintPage(locale);
			await imprintPage.goto();

			const links = await imprintPage.page
				.locator('link[rel="alternate"][hreflang]')
				.evaluateAll((elements) => {
					return elements.map((element) => {
						return element.outerHTML;
					});
				});

			expect(links).toEqual(
				expect.arrayContaining([
					`<link href="${createAbsoluteUrl(`/de/imprint/`)}" hreflang="de-AT" rel="alternate">`,
					`<link href="${createAbsoluteUrl(`/en/imprint/`)}" hreflang="en-GB" rel="alternate">`,
				]),
			);

			expect(links.join(",")).not.toContain("x-default");
		}
	});
});
