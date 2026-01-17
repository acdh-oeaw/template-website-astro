import type { Options } from "@imgproxy/imgproxy-js-core";
import { generateImageUrl } from "@imgproxy/imgproxy-node";

import { env } from "@/config/env.config";

function createClient() {
	const client = {
		urls: {
			generateSignedImageUrl({ key, options }: { key: string; options: Options }) {
				const url = generateImageUrl({
					endpoint: env.IMGPROXY_BASE_URL,
					key: env.IMGPROXY_KEY,
					options,
					salt: env.IMGPROXY_SALT,
					url: `s3://${env.S3_BUCKET_NAME}/${key}`,
				});

				return { url };
			},
		},
	};

	return client;
}

export const client = createClient();
