<script lang="ts">
	import { getFormField } from "formsnap";
	import type { HTMLInputAttributes } from "svelte/elements";
	import { Input, type InputEvents } from "$lib/components/ui/input";

	export let prefill: string | undefined = undefined;

	interface $$Props extends HTMLInputAttributes {
		prefill?: string;
	}
	type $$Events = InputEvents;

	const { attrStore, setValue } = getFormField();

	$: setValue(prefill);
</script>

<Input
	{...$attrStore}
	bind:value={prefill}
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
