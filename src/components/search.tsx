/* @jsxImportSource solid-js */

import { useToggleState } from "@/lib/ui/use-toggle-state";
import { type JSX } from "solid-js";

interface SearchDialogProps {
	children: JSX.Element;
	label: JSX.Element;
}

export function SearchDialog(props: SearchDialogProps) {
	const state = useToggleState();

	return (
		<div>
			<button onClick={state.toggle}>{props.label}</button>
			<dialog open={state.isOpen} onClose={state.close}>
				<header>
					<form method="dialog">
						<button type="submit">Close</button>
					</form>
				</header>
				<div>{props.children}</div>
			</dialog>
		</div>
	);
}
