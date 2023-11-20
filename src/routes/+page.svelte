<script lang="ts">
	import type { LayoutServerData } from "./$types";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	export let data: LayoutServerData;

	onMount(() => {
		if (data.user) goto("/investments");
	});
</script>

<div class="flex flex-col justify-center items-center text-center flex-auto text-2xl font-bold">
	Sign in <br />
	to see your investments
</div>
