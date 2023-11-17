<script lang="ts">
	import { getFormField } from "formsnap";
	import type { HTMLInputAttributes } from "svelte/elements";
	import { Input, type InputEvents } from "$lib/components/ui/input";
	import { onMount } from "svelte";

	export let prefill: string | undefined = undefined;

	interface $$Props extends HTMLInputAttributes {
		prefill?: string;
	}
	type $$Events = InputEvents;

	const { attrStore, value, setValue } = getFormField();

	onMount(() => {
		setValue(prefill);
	});
</script>

<Input
	{...$attrStore}
	bind:value={$value}
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
