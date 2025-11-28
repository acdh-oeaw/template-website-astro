import * as fs from "node:fs/promises";
import * as path from "node:path";

import { log } from "@acdh-oeaw/lib";

async function generate() {
	for (const filePath of ["./content/en/metadata/index.json", "./messages/en.json"]) {
		const messagesPath = path.join(process.cwd(), filePath);
		const declarationPath = messagesPath.replace(/\.json$/, ".d.json.ts");

		const content = await fs.readFile(messagesPath, { encoding: "utf-8" });

		await fs.writeFile(
			declarationPath,
			`declare const messages: ${content.trim()};\nexport default messages;`,
			{ encoding: "utf-8" },
		);
	}

	log.success("Successfully generated types for i18n messages.");
}

generate().catch((error: unknown) => {
	log.error("Failed to generate types for i18n messages.\n", error);
	process.exitCode = 1;
});
