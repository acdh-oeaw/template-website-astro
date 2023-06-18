import { log } from "@acdh-oeaw/lib";
import { createEnv } from "@t3-oss/env-core";
import { loadEnv } from "vite";
import { z } from "zod";

const environment = loadEnv(import.meta.env.MODE, process.cwd(), "");

export const env = createEnv({
	clientPrefix: "PUBLIC_",
	shared: {
		NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
	},
	server: {
		ENV_VALIDATION: z.enum(["disabled", "enabled"]).optional(),
		KEYSTATIC_GITHUB_CLIENT_ID: z.string().min(1).optional(),
		KEYSTATIC_GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
		KEYSTATIC_SECRET: z.string().min(1).optional(),
	},
	client: {
		PUBLIC_APP_BASE_PATH: z.string().min(1).optional(),
		PUBLIC_APP_BASE_URL: z.string().url(),
		PUBLIC_BOTS: z.enum(["disabled", "enabled"]).optional(),
		PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().optional(),
		PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: z.string().min(1).optional(),
		PUBLIC_KEYSTATIC_GITHUB_REPO_NAME: z.string().min(1).optional(),
		PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER: z.string().min(1).optional(),
		PUBLIC_KEYSTATIC_MODE: z.enum(["github", "local"]).default("local"),
		PUBLIC_MATOMO_BASE_URL: z.string().url().optional(),
		PUBLIC_MATOMO_ID: z.coerce.number().int().positive().optional(),
		PUBLIC_REDMINE_ID: z.coerce.number().int().positive(),
	},
	runtimeEnv: environment,
	skipValidation: environment.ENV_VALIDATION === "disabled",
	onValidationError(validationError) {
		const message = "Invalid environment variables";
		log.error(`${message}:`, validationError.flatten().fieldErrors);
		const error = new Error(message);
		delete error.stack;
		throw error;
	},
});
