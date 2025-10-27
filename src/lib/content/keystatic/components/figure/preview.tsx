/** @jsxRuntime automatic  */
/** @jsxImportSource react */

import { useObjectUrl, type UseObjectUrlParams } from "@acdh-oeaw/keystatic-lib/preview";
import { NotEditable } from "@keystatic/core";
import cn from "clsx/lite";
import type { ReactNode } from "react";

import type { FigureAlignment } from "@/lib/content/options";

interface FigurePreviewProps {
	/** @default "stretch" */
	alignment?: FigureAlignment;
	alt?: string;
	children?: ReactNode;
	src: UseObjectUrlParams | null;
}

export function FigurePreview(props: Readonly<FigurePreviewProps>): ReactNode {
	const { alignment = "stretch", alt = "", children, src } = props;

	const url = useObjectUrl(src);

	return (
		<figure className={cn("grid gap-y-2", alignment === "center" ? "justify-center" : undefined)}>
			<NotEditable>
				{url != null ? (
					<img
						alt={alt}
						className="w-full overflow-hidden rounded-xs border border-stroke-weak"
						src={url}
					/>
				) : null}
			</NotEditable>
			<figcaption>{children}</figcaption>
		</figure>
	);
}
