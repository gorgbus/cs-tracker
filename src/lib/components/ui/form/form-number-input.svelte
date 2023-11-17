<script lang="ts">
	import { getFormField } from "formsnap";
	import type { HTMLInputAttributes } from "svelte/elements";
	import { Input, type InputEvents } from "$lib/components/ui/input";

	export let prefill: number | undefined = undefined;

	interface $$Props extends HTMLInputAttributes {
		prefill?: number;
	}
	type $$Events = InputEvents;

	const { attrStore, setValue } = getFormField();

	$: setValue(Number(prefill));
</script>

<Input
	{...$attrStore}
	bind:value={prefill}
	type="number"
	{...$$restProps}
	on:blur
	on:change
	on:click
	on:focus
	on:keydown
	on:keypress
	on:keyup
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:paste
	on:input
/>
