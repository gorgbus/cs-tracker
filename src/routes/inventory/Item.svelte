<script lang="ts">
	import type { Item } from "$lib";

	export let item: Item;
</script>

<div class="w-40 h-48">
	<a
		href={`/inventory?item=${item.market_hash_name}`}
		class="h-40 w-40 flex items-center bg-secondary border-2 border-accent cursor-pointer hover:bg-secondary/80 transition-all"
	>
		<img
			src={`https://community.akamai.steamstatic.com/economy/image/${item.icon_url}/144fx144f`}
			alt={item.name}
		/>
	</a>

	<div class="h-8 w-full bg-secondary text-center">
		<span
			class="inline-block text-sm text-text font-semibold text-ellipsis overflow-hidden whitespace-nowrap w-36 mx-2 align-middle"
			>{item.name}</span
		>
	</div>
</div>
