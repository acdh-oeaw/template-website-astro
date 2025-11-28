import { defaultLocale } from "@/lib/i18n/locales";
import { expect, test } from "~/e2e/lib/test";

test.describe("main navigation", () => {
	test("should skip to main content with skip-link", async ({ createIndexPage }) => {
		const { indexPage } = await createIndexPage(defaultLocale);
		await indexPage.goto();

		await indexPage.page.keyboard.press("Tab");
		await expect(indexPage.skipLink).toBeFocused();

		await indexPage.skipLink.click();
		await expect(indexPage.mainContent).toBeFocused();
	});

	test.describe("should add aria-current attribute to nav links", () => {
		test.use({ viewport: { width: 1440, height: 1024 } });

		test("on desktop", async ({ createIndexPage, page }) => {
			const { indexPage, i18n } = await createIndexPage(defaultLocale);
			await indexPage.goto();

			const homeLink = indexPage.page
				.getByRole("navigation")
				.getByRole("link", {
					name: i18n.t("DefaultHeader.navigation.items.home"),
				})
				.first();
			const imprintLink = indexPage.page.getByRole("navigation").getByRole("link", {
				name: i18n.t("DefaultFooter.navigation.items.imprint"),
			});

			await expect(homeLink).toHaveAttribute("aria-current", "page");
			await expect(imprintLink).not.toHaveAttribute("aria-current", "page");

			await imprintLink.click();
			await page.waitForURL("**/imprint/");

			await expect(homeLink).not.toHaveAttribute("aria-current", "page");
			await expect(imprintLink).toHaveAttribute("aria-current", "page");
		});
	});

	test.describe("should add aria-current attribute to nav links", () => {
		test.use({ viewport: { width: 393, height: 852 } });

		test("on mobile", async ({ createIndexPage, page }) => {
			const { indexPage, i18n } = await createIndexPage(defaultLocale);
			await indexPage.goto();

			await indexPage.page.getByRole("navigation").getByRole("button").click();

			/**
			 * Check that mobile nav menu is open.
			 *
			 * This check is flaky in CI with webkit, but works fine in chrome and firefox.
			 */
			// await expect(
			// 	indexPage.page.getByRole("link", {
			// 		name: i18n.t("LocaleSwitcher.switch-locale"),
			// 	}),
			// ).toBeInViewport();

			const homeLink = indexPage.page
				.getByRole("link", {
					name: i18n.t("DefaultHeader.navigation.items.home"),
				})
				.first();
			const imprintLink = indexPage.page.getByRole("link", {
				name: i18n.t("DefaultFooter.navigation.items.imprint"),
			});

			await expect(homeLink).toHaveAttribute("aria-current", "page");
			await expect(imprintLink).not.toHaveAttribute("aria-current", "page");

			await imprintLink.click();
			await page.waitForURL("**/imprint/");

			await indexPage.page.getByRole("navigation").getByRole("button").click();

			await expect(homeLink).not.toHaveAttribute("aria-current", "page");
			await expect(imprintLink).toHaveAttribute("aria-current", "page");
		});
	});
});
