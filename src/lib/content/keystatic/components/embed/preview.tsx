/** @jsxRuntime automatic  */
/** @jsxImportSource react */

import { NotEditable } from "@keystatic/core";
import type { ReactNode } from "react";

interface EmbedPreviewProps {
	children?: ReactNode;
	src: string | null;
}

export function EmbedPreview(props: Readonly<EmbedPreviewProps>): ReactNode {
	const { children, src } = props;

	return (
		<figure className="grid gap-y-2">
			<NotEditable>
				{src != null ? (
					// eslint-disable-next-line jsx-a11y/iframe-has-title, @eslint-react/dom/no-missing-iframe-sandbox
					<iframe
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen={true}
						className="aspect-square w-full overflow-hidden rounded-xs border border-stroke-weak"
						loading="lazy"
						src={src}
					/>
				) : null}
			</NotEditable>
			<figcaption className="text-sm">{children}</figcaption>
		</figure>
	);
}
