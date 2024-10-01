/* @jsxImportSource solid-js */

import { createUniqueId, type JSX } from "solid-js";

import { useToggleState } from "@/lib/ui/use-toggle-state";

interface SearchDialogProps {
	children: JSX.Element;
	label: JSX.Element;
}

export function SearchDialog(props: SearchDialogProps) {
	const state = useToggleState();
	const triggerId = createUniqueId();

	// TODO: focus trigger onClose`

	return (
		<div>
			<button id={triggerId} aria-haspopup="dialog" onClick={state.toggle} type="button">
				{props.label}
				{/* <Icon name="lucdide:search" /> */}
			</button>
			<dialog aria-labelledby={triggerId} open={state.isOpen} onClose={state.close}>
				{/* <header>
					<form method="dialog">
						<button type="submit">
							<Icon name="lucdide:x" />
						</button>
					</form>
				</header> */}
				{props.children}
			</dialog>
		</div>
	);
}
