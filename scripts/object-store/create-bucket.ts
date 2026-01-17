import { log } from "@acdh-oeaw/lib";

import { client } from "@/lib/object-store/client";

const bucketName = client.buckets.name;

async function main() {
	await client.buckets.create();

	log.success(`Successfully created "${bucketName}" bucket in object store.`);
}

main().catch((error: unknown) => {
	log.error(`Failed to create "${bucketName}" bucket in object store.\n`, error);
	process.exitCode = 1;
});
