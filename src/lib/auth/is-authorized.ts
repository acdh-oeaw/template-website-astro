import { assert, includes } from "@acdh-oeaw/lib";
import type { AstroCookies } from "astro";
import { Octokit } from "octokit";
import * as v from "valibot";

import { env } from "@/config/env.config";

/** @see {@link https://docs.github.com/de/rest/collaborators/collaborators?apiVersion=2022-11-28#get-repository-permissions-for-a-user} */
const allowedRoles = ["push", "maintain", "admin"] as const;

const headers = { "X-GitHub-Api-Version": "2022-11-28" };

const AccessTokenInputSchema = v.pipe(v.string(), v.nonEmpty());

export async function isAuthorized(request: Request, cookies: AstroCookies): Promise<boolean> {
	try {
		if (request.headers.get("host")?.startsWith("127.0.0.1")) {
			return true;
		}

		const token = cookies.get("keystatic-gh-access-token");
		const auth = await v.parseAsync(AccessTokenInputSchema, token?.value);

		const owner = env.PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER;
		const repo = env.PUBLIC_KEYSTATIC_GITHUB_REPO_NAME;

		assert(owner, "Missing `PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER` environment variable.");
		assert(repo, "Missing `PUBLIC_KEYSTATIC_GITHUB_REPO_NAME` environment variable.");

		const octokit = new Octokit({ auth });

		const user = await octokit.request("GET /user", { headers });
		const username = user.data.login;

		const permission = await octokit.request(
			"GET /repos/{owner}/{repo}/collaborators/{username}/permission",
			{ owner, repo, username, headers },
		);
		const role = permission.data.permission;

		if (includes(allowedRoles, role)) {
			return true;
		}
	} catch {
		/** noop */
	}

	return false;
}
