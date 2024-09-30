/* @jsxImportSource react */

import type { CalloutKind, GridLayout, VideoProvider } from "@/lib/keystatic/component-options";
import { createVideoUrl } from "@/lib/keystatic/create-video-url";
import { useObjectUrl, type UseObjectUrlParams } from "@acdh-oeaw/keystatic-lib/preview";
import { styles } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
import { Tweet as StaticTweet } from "react-tweet";

const calloutStyles = styles({
	base: "my-4 rounded-md border p-4 text-sm leading-relaxed [&>:first-child]:mt-0 [&>:last-child]:mb-0",
	variants: {
		kind: {
			caution: "",
			important: "",
			note: "",
			tip: "",
			warning: "",
		},
	},
	defaults: {
		kind: "note",
	},
});

interface CalloutPreviewProps {
	children: ReactNode;
	/** @default "note" */
	kind: CalloutKind;
	title?: string;
}

export function CalloutPreview(props: CalloutPreviewProps): ReactNode {
	const { children, kind, title } = props;

	return (
		<aside className={calloutStyles({ kind })}>
			{title ? <strong>{title}</strong> : null}
			{children}
		</aside>
	);
}

interface DisclosurePreviewProps {
	children: ReactNode;
	title: string;
}

export function DisclosurePreview(props: DisclosurePreviewProps): ReactNode {
	const { children, title } = props;

	return (
		<details>
			<summary>{title}</summary>
			{children}
		</details>
	);
}

interface EmbedPreviewProps {
	children?: ReactNode;
	src: string | null;
}

export function EmbedPreview(props: EmbedPreviewProps): ReactNode {
	const { children, src } = props;

	if (src == null) return null;

	return (
		<figure>
			<iframe
				allowFullScreen
				className="aspect-video w-full overflow-hidden rounded-md"
				src={src}
			/>
			{children ? <figcaption>{children}</figcaption> : null}
		</figure>
	);
}

interface FigurePreviewProps {
	/** @default "stretch" */
	alignment?: "center" | "stretch";
	alt?: string;
	children?: ReactNode;
	src: UseObjectUrlParams | null;
}

export function FigurePreview(props: FigurePreviewProps): ReactNode {
	const { alignment = "stretch", alt = "", children, src } = props;

	const url = useObjectUrl(src);

	if (url == null) return null;

	return (
		<figure>
			<img alt={alt} src={url} />
			{children ? <figcaption>{children}</figcaption> : null}
		</figure>
	);
}

interface GridPreviewProps {
	children: ReactNode;
	/** @default "two-columns" */
	layout: GridLayout;
}

export function GridPreview(props: GridPreviewProps): ReactNode {
	const { children, layout } = props;

	const gridStyles = styles({
		base: "grid content-start gap-8",
		variants: {
			layout: {
				"two-columns": "sm:grid-cols-2",
				"three-columns": "sm:grid-cols-3",
				"four-columns": "sm:grid-cols-4",
				"one-two-columns": "sm:grid-cols-[1fr_2fr]",
				"one-three-columns": "sm:grid-cols-[1fr_3fr]",
				"one-four-columns": "sm:grid-cols-[1fr_4fr]",
			},
		},
		defaults: {
			layout: "two-columns",
		},
	});

	return <div className={gridStyles({ layout })}>{children}</div>;
}

interface GridItemPreviewProps {
	children: ReactNode;
}

export function GridItemPreview(props: GridItemPreviewProps): ReactNode {
	const { children } = props;

	return <div>{children}</div>;
}

interface LinkButtonPreviewProps {
	children: ReactNode;
}

export function LinkButtonPreview(props: LinkButtonPreviewProps): ReactNode {
	const { children } = props;

	return <button type="button">{children}</button>;
}

interface TableOfContentsPreviewProps {
	title?: string;
}

export function TableOfContentsPreview(props: TableOfContentsPreviewProps): ReactNode {
	const { title = "Table of contents" } = props;

	return (
		<div>
			<strong>{title}</strong>
			<div>Will be generated at build time.</div>
		</div>
	);
}

interface TabsPreviewProps {
	children: ReactNode;
}

export function TabsPreview(props: TabsPreviewProps): ReactNode {
	const { children } = props;

	return <div>{children}</div>;
}

interface TabPreviewProps {
	children: ReactNode;
	title: string;
}

export function TabPreview(props: TabPreviewProps): ReactNode {
	const { children, title } = props;

	return <div>{children}</div>;
}

interface TweetPreviewProps {
	children?: ReactNode;
	id: string;
}

export function TweetPreview(props: TweetPreviewProps): ReactNode {
	const { children, id } = props;

	return (
		<figure>
			<StaticTweet id={id} />
			{children ? <figcaption>{children}</figcaption> : null}
		</figure>
	);
}

interface VideoPreviewProps {
	children?: ReactNode;
	id: string;
	provider: VideoProvider;
	startTime?: number | null;
}

export function VideoPreview(props: VideoPreviewProps): ReactNode {
	const { children, id, provider, startTime } = props;

	const href = String(createVideoUrl(provider, id, startTime));

	return (
		<figure>
			<iframe
				allowFullScreen
				className="aspect-video w-full overflow-hidden rounded-md"
				src={href}
			/>
			{children ? <figcaption>{children}</figcaption> : null}
		</figure>
	);
}
