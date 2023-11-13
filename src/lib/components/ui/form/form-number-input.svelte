<script lang="ts">
	import { getFormField } from "formsnap";
	import type { HTMLInputAttributes } from "svelte/elements";
	import { Input, type InputEvents } from "$lib/components/ui/input";
	import { onDestroy, onMount } from "svelte";

	type $$Props = HTMLInputAttributes;
	type $$Events = InputEvents;

	const { attrStore, value } = getFormField();

	let val_sub = () => {};

	onMount(() => {
		val_sub = value.subscribe((v) => value.set(Number(v)));
	});

	onDestroy(() => {
		val_sub();
	});
</script>

<Input
	{...$attrStore}
	bind:value={$value}
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
