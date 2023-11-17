<script lang="ts">
	import { PUBLIC_API_URL } from "$env/static/public";
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";

	export let market_hash_name: string;

	let loaded = false;

	$: console.log(loaded);
</script>

<div class="relative">
	<img
		class={`w-24 h-[72px] z-0`}
		src={`${PUBLIC_API_URL}/api/icon/${market_hash_name}`}
		loading="lazy"
		alt=""
		on:load={() => (loaded = true)}
	/>

	<Skeleton class={`absolute top-0 left-0 z-10 w-24 h-[72px] ${loaded ? "hidden" : ""}`} />
</div>
