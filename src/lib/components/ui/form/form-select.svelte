<script lang="ts">
	import * as Select from "$lib/components/ui/select";
	import { getFormField } from "formsnap";
	import type { Select as SelectPrimitive } from "bits-ui";
	import { onMount } from "svelte";

	interface $$Props extends SelectPrimitive.Props {
		prefill?: string;
	}
	const { setValue, name, value } = getFormField();
	export let onSelectedChange: $$Props["onSelectedChange"] = undefined;

	export let prefill: string | undefined = undefined;

	onMount(() => setValue(prefill));
</script>

<Select.Root
	onSelectedChange={(v) => {
		onSelectedChange?.(v);
		setValue(v ? v.value : undefined);
	}}
	{...$$restProps}
>
	<slot />
	<input hidden {name} value={$value} />
</Select.Root>
