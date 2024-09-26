/* @jsxImportSource react */

import type { ReactNode } from "react";

export { Tweet as TweetPreview } from "@/components/tweet";
export { Video as VideoPreview } from "@/components/video";

interface FigurePreviewProps {
	/** @default "stretch" */
	alignment?: "center" | "stretch";
	alt?: string;
	children: ReactNode;
	src: string;
}

/**
 * Cannot use `Figure` directly as cms preview, because react server components are not supported.
 */
export function FigurePreview(props: FigurePreviewProps): ReactNode {
	const { alignment = "stretch", alt = "", children, src } = props;

	return (
		<figure>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img alt={alt} src={src} />
			<figcaption>{children}</figcaption>
		</figure>
	);
}
