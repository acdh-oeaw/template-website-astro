/** @jsxRuntime automatic  */
/** @jsxImportSource react */

import type { BasicFormField } from "@keystatic/core";
import * as v from "valibot";

import { ImageFieldInput } from "@/lib/content/keystatic/fields/image/ui";

const Schema = v.object({
	key: v.string(),
	width: v.number(),
	height: v.number(),
});

export function image({
	description,
	label,
	validation,
}: {
	description?: string;
	label: string;
	validation?: { isRequired?: boolean };
}): BasicFormField<{ key: string; width: number; height: number } | null> {
	return {
		kind: "form",
		label,
		// eslint-disable-next-line @eslint-react/prefer-read-only-props
		Input(props) {
			return (
				<ImageFieldInput
					{...props}
					description={description}
					label={label}
					validation={validation}
				/>
			);
		},
		defaultValue() {
			return null;
		},
		parse(value) {
			if (value === undefined) {
				return null;
			}

			return v.parse(Schema, value);
		},
		validate(value) {
			if (value === null && validation?.isRequired) {
				throw new TypeError(`${label} is required`);
			}

			return value;
		},
		serialize(value) {
			return { value: value ?? undefined };
		},
		reader: {
			parse(value) {
				if (value === undefined) {
					if (validation?.isRequired) {
						throw new TypeError(`${label} is required`);
					}

					return null;
				}

				return v.parse(Schema, value);
			},
		},
	};
}
