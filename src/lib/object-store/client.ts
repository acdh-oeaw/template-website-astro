import * as path from "node:path";

import { assert } from "@acdh-oeaw/lib";
// import { Readable } from "node:stream";
// import type { ReadableStream } from "node:stream/web";
import {
	CreateBucketCommand,
	HeadObjectCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { imageDimensionsFromData } from "image-dimensions";
import { v7 as uuidv7 } from "uuid";

import { env } from "@/config/env.config";

type AssetPrefix = "documents" | "images";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createClient() {
	const store = new S3Client({
		credentials: {
			accessKeyId: env.S3_ACCESS_KEY,
			secretAccessKey: env.S3_SECRET_KEY,
		},
		endpoint: {
			url: new URL(`${env.S3_PROTOCOL}://${env.S3_HOST}:${String(env.S3_PORT)}`),
		},
		forcePathStyle: true,
		region: "auto",
	});

	const client = {
		assets: {
			async list({ prefix }: { prefix: AssetPrefix }) {
				const command = new ListObjectsV2Command({
					Bucket: env.S3_BUCKET_NAME,
					Prefix: prefix,
				});

				const result = await store.send(command);

				const total = result.KeyCount ?? 0;
				const objects = [];

				for (const item of result.Contents ?? []) {
					const key = item.Key!;

					const headCommand = new HeadObjectCommand({
						Bucket: env.S3_BUCKET_NAME,
						Key: key,
					});

					const metadata = await store.send(headCommand);

					objects.push({
						key,
						width: Number(metadata.Metadata!.width),
						height: Number(metadata.Metadata!.height),
					});
				}

				return { total, objects };
			},
			async upload({ file, prefix = "images" }: { file: File; prefix?: AssetPrefix | "images" }) {
				const key = `${prefix}/${uuidv7()}${path.extname(file.name)}`;

				const arrayBuffer = await file.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);

				// const stream = Readable.fromWeb(file.stream() as ReadableStream);
				// const size = file.size;

				const dimensions = imageDimensionsFromData(buffer);

				assert(dimensions);

				const command = new PutObjectCommand({
					Bucket: env.S3_BUCKET_NAME,
					Key: key,
					Body: buffer, // stream
					ContentType: file.type,
					Metadata: {
						width: String(dimensions.width),
						height: String(dimensions.height),
					},
				});

				await store.send(command);

				return { key, width: dimensions.width, height: dimensions.height };
			},
		},
		buckets: {
			async create() {
				const command = new CreateBucketCommand({
					Bucket: env.S3_BUCKET_NAME,
				});

				await store.send(command);
			},
			name: env.S3_BUCKET_NAME,
		},
	};

	return client;
}

export const client = createClient();
