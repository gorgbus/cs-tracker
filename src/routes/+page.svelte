<script lang="ts">
	import type { LayoutServerData } from "./$types";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	export let data: LayoutServerData;

	onMount(() => {
		if (data.user) goto("/investments");
	});
</script>
