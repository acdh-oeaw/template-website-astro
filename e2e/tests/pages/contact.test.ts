import { assert } from "@acdh-oeaw/lib";

import { subjectPrefix } from "@/config/email.config";
import { env } from "@/config/env.config";
import { defaultLocale, locales } from "@/lib/i18n/locales";
import { expect, test } from "~/e2e/lib/test";

test.describe("contact page", () => {
	test("should have document title", async ({ createContactPage }) => {
		for (const locale of locales) {
			const { i18n, contactPage } = await createContactPage(locale);
			await contactPage.goto();

			await expect(contactPage.page).toHaveTitle(
				[i18n.t("ContactPage.meta.title"), i18n.messages.metadata.title].join(" | "),
			);
		}
	});

	test("should not have any automatically detectable accessibility issues", async ({
		createAccessibilityScanner,
		createContactPage,
	}) => {
		for (const locale of locales) {
			const { contactPage } = await createContactPage(locale);
			await contactPage.goto();

			const { getViolations } = await createAccessibilityScanner();
			expect(await getViolations()).toEqual([]);
		}
	});

	// eslint-disable-next-line playwright/no-skipped-test
	test.describe.skip("should not have visible changes", () => {
		test.use({ colorScheme: "light" });

		test("in light mode", async ({ createContactPage }) => {
			for (const locale of locales) {
				const { contactPage } = await createContactPage(locale);
				await contactPage.goto();

				await expect(contactPage.page).toHaveScreenshot({ fullPage: true });
			}
		});
	});

	// eslint-disable-next-line playwright/no-skipped-test
	test.describe.skip("should not have visible changes", () => {
		test.use({ colorScheme: "dark" });

		test("in dark mode", async ({ createContactPage }) => {
			for (const locale of locales) {
				const { contactPage } = await createContactPage(locale);
				await contactPage.goto();

				await expect(contactPage.page).toHaveScreenshot({ fullPage: true });
			}
		});
	});

	test.describe("contact form", () => {
		// eslint-disable-next-line playwright/no-skipped-test
		test.skip(() => {
			return env.EMAIL_SERVICE_API_BASE_URL == null;
		}, "Email service disabled.");

		/** Run sequentially. */
		test.describe.configure({ mode: "default" });

		const POLL_INTERVAL_MS = 500;
		const POLL_TIMEOUT_MS = 10_000;

		test.beforeEach(async ({ createEmailService }) => {
			const emailService = createEmailService();
			await emailService.clear();
		});

		test("should send contact form submission via email", async ({
			createContactPage,
			createEmailService,
		}) => {
			const locale = defaultLocale;

			const emailService = createEmailService();

			const { contactPage, i18n } = await createContactPage(locale);
			await contactPage.goto();

			const name = "Firstname Lastname";
			const email = "user@example.com";
			const subject = "Testing form submission";
			const message = "Test message";

			await contactPage.form.name.fill(name);
			await contactPage.form.email.fill(email);
			await contactPage.form.subject.fill(subject);
			await contactPage.form.message.fill(message);
			await contactPage.form.submit.click();

			await expect(contactPage.page.getByRole("status")).toContainText(
				i18n.t("ContactPage.form.status.success"),
				{ timeout: 1000 },
			);

			await expect
				.poll(
					async () => {
						const data = await emailService.getMessages();
						return data.total;
					},
					{
						message: "Wait for at least one email to appear in Mailpit",
						intervals: [POLL_INTERVAL_MS],
						timeout: POLL_TIMEOUT_MS,
					},
				)
				.toBeGreaterThanOrEqual(1);

			const data = await emailService.getMessages();

			const [msg] = data.messages;
			expect(msg).toBeDefined();
			assert(msg);

			expect(msg.To[0]?.Address).toBe(env.EMAIL_ADDRESS);
			expect(msg.Subject).toBe([subjectPrefix, subject].join(" "));
			expect(msg.From.Address).toBe(email);
			expect(msg.From.Name).toBe(name);

			const { Text: text } = await emailService.getMessage(msg.ID);
			expect(text).toContain(message);
		});
	});
});
