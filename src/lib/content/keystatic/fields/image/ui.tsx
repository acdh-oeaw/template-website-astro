/** @jsxRuntime automatic  */
/** @jsxImportSource react */

/* eslint-disable react/jsx-no-literals */

"use client";

import { keyBy } from "@acdh-oeaw/lib";
import { ActionButton, Button, ButtonGroup } from "@keystar/ui/button";
import { Dialog, DialogTrigger } from "@keystar/ui/dialog";
import { FieldDescription, FieldLabel, FieldMessage } from "@keystar/ui/field";
import { Box, Flex } from "@keystar/ui/layout";
import { Content } from "@keystar/ui/slots";
import { Heading } from "@keystar/ui/typography";
import type { FormFieldInputProps } from "@keystatic/core";
import { type ReactNode, useEffect, useId, useReducer, useState } from "react";
import { GridList, GridListItem } from "react-aria-components";

function getFileInput(accept: string): Promise<File | undefined> {
	return new Promise((resolve) => {
		const input = document.createElement("input");
		input.type = "file";
		input.style.display = "none";
		input.accept = accept;
		// eslint-disable-next-line unicorn/prefer-add-event-listener
		input.onchange = () => {
			const file = input.files?.[0];
			if (file != null) {
				resolve(file);
			}
		};
		// eslint-disable-next-line unicorn/prefer-dom-node-append
		document.body.appendChild(input);
		input.click();
	});
}

export function ImageFieldInput(
	props: Readonly<
		FormFieldInputProps<{ key: string; width: number; height: number } | null> & {
			label: string;
			description: string | undefined;
			validation: { isRequired?: boolean } | undefined;
		}
	>,
): ReactNode {
	const { description, forceValidation, label, onChange, validation, value } = props;

	const labelId = useId();
	const descriptionId = useId();

	const [blurred, onBlur] = useReducer(() => {
		return true;
	}, false);

	const [preview, setPreview] = useState<string | null>(null);

	const [selected, setSelected] = useState<{ key: string; width: number; height: number } | null>(
		null,
	);
	const [isDialogOpen, setDialogOpen] = useState(false);

	useEffect(() => {
		if (value === null) {
			return;
		}

		let isCanceled = false;

		const getPreviewUrl = async () => {
			const response = await fetch("/api/assets/get-signed-url", {
				body: JSON.stringify({ key: value.key }),
				method: "post",
			});

			if (!response.ok) {
				setPreview(null);
			}

			const { url } = (await response.json()) as { url: string };

			if (!isCanceled) {
				setPreview(url);
			}
		};

		void getPreviewUrl();

		return () => {
			isCanceled = true;
		};
	}, [value]);

	return (
		<Flex
			aria-describedby={description != null ? descriptionId : undefined}
			aria-labelledby={labelId}
			direction="column"
			gap="medium"
			role="group"
		>
			<FieldLabel elementType="span" id={labelId} isRequired={validation?.isRequired}>
				{label}
			</FieldLabel>

			{description != null ? (
				<FieldDescription id={descriptionId}>{description}</FieldDescription>
			) : null}

			<ButtonGroup>
				<ActionButton
					// eslint-disable-next-line @typescript-eslint/no-misused-promises
					onPress={async () => {
						const file = await getFileInput("image/*");

						if (file == null) {
							return;
						}

						const formData = new FormData();
						formData.set("file", file);

						const response = await fetch("/api/assets/upload", { body: formData, method: "post" });
						const { key, width, height } = (await response.json()) as {
							key: string;
							width: number;
							height: number;
						};

						onChange({ key, width, height });
					}}
				>
					Upload
				</ActionButton>

				<ActionButton
					onPress={() => {
						onChange(null);
						onBlur();
					}}
					prominence="low"
				>
					Remove
				</ActionButton>

				<DialogTrigger isOpen={isDialogOpen} onOpenChange={setDialogOpen}>
					<ActionButton>Select image</ActionButton>

					{(close) => {
						return (
							<Dialog>
								<Heading>Images</Heading>
								<Content>
									<ImageGrid selected={selected} setSelected={setSelected} />
								</Content>
								<ButtonGroup>
									<Button onPress={close}>Cancel</Button>
									<Button
										onPress={() => {
											close();
											onChange(selected);
										}}
										prominence="high"
									>
										Select
									</Button>
								</ButtonGroup>
							</Dialog>
						);
					}}
				</DialogTrigger>
			</ButtonGroup>

			{preview != null ? (
				<Box
					alignSelf="start"
					backgroundColor="canvas"
					border="neutral"
					borderRadius="regular"
					padding="regular"
				>
					<img
						alt=""
						src={preview}
						style={{
							display: "block",
							maxHeight: 192,
							maxWidth: "100%",
						}}
					/>
				</Box>
			) : null}

			{(forceValidation || blurred) && validation?.isRequired && value === null ? (
				<FieldMessage>{label} is required</FieldMessage>
			) : null}
		</Flex>
	);
}

interface ImageGridProps {
	selected: { key: string; width: number; height: number } | null;
	setSelected: (selection: { key: string; width: number; height: number } | null) => void;
}

function ImageGrid(props: Readonly<ImageGridProps>): ReactNode {
	const { selected, setSelected } = props;

	const [images, setImages] = useState<
		Array<{ key: string; width: number; height: number; url: string }>
	>([]);

	useEffect(() => {
		let isCanceled = false;

		const getImages = async () => {
			const response = await fetch("/api/assets/images");
			const { images } = (await response.json()) as {
				images: Array<{ key: string; width: number; height: number; url: string }>;
			};

			if (!isCanceled) {
				setImages(images);
			}
		};

		void getImages();

		return () => {
			isCanceled = true;
		};
	}, []);

	const selectedKeys = selected ? new Set(selected.key) : undefined;
	const imagesByKey = keyBy(images, (image) => {
		return image.key;
	});

	return (
		<GridList
			className="grid grid-cols-3 gap-3 min-h-32"
			layout="grid"
			onSelectionChange={(selection) => {
				const key = Array.from(selection).at(0) as string | undefined;
				setSelected(key ? (imagesByKey[key] ?? null) : null);
			}}
			selectedKeys={selectedKeys}
			selectionMode="single"
		>
			{images.map((image) => {
				const { key, url } = image;

				return (
					<GridListItem
						key={key}
						className="outline-3 outline-offset-2 outline-transparent rounded-sm aria-selected:outline-black"
						id={key}
					>
						<img alt="" className="h-32 rounded-sm object-cover w-full" src={url} />
					</GridListItem>
				);
			})}
		</GridList>
	);
}
