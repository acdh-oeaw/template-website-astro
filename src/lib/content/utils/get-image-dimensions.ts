import { join } from "node:path";

import { assert } from "@acdh-oeaw/lib";
import { imageSizeFromFile } from "image-size/fromFile";

const publicFolder = join(process.cwd(), "public");

export async function getImageDimensions(
	src: string,
): Promise<{ src: string; height: number; width: number }> {
	assert(src.startsWith("/"), "Only images in the public folder are supported.");

	const absoluteFilePath = join(publicFolder, src);
	const dimensions = await imageSizeFromFile(absoluteFilePath);

	return { ...dimensions, src };
}
