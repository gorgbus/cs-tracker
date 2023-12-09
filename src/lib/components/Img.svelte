<script lang="ts">
	import { PUBLIC_API_URL } from "$env/static/public";
	import { cn } from "$lib/utils";
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";

	export let market_hash_name: string;

	export let sm: boolean = false;
	export let lg: boolean = false;

	let loaded = false;
</script>

<div class="relative">
	<img
		class={cn(sm ? "w-12 h-9" : lg ? "w-36 h-[108px]" : "w-24 h-[72px]", "z-0")}
		src={`${PUBLIC_API_URL}/api/icon/${market_hash_name}`}
		loading="lazy"
		alt=""
		on:load={() => (loaded = true)}
	/>

	<Skeleton
		class={cn(
			sm ? "w-12 h-9" : lg ? "w-36 h-[108px]" : "w-24 h-[72px]",
			`absolute top-0 left-0 z-10 ${loaded ? "hidden" : ""}`
		)}
	/>
</div>
