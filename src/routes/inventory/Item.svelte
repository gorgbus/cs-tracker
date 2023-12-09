<script lang="ts">
	import {
		type Item,
		type Currencies,
		format_price,
		get_latest_price,
		convert_price,
		axios_client,
		type Rates
	} from "$lib";
	import Img from "$lib/components/Img.svelte";
	import { PlusCircle } from "lucide-svelte";
	import type { HTMLDivAttributes } from "bits-ui/dist/internal";
	import { useQuery } from "@sveltestack/svelte-query";

	interface $$Props extends HTMLDivAttributes {
		item: Item;
		currency: Currencies;
		market: string;
	}

	export let item: Item;
	export let currency: Currencies;
	export let market: string;

	const ex_rate_query = useQuery("exchange_rates", async () => {
		const { data } = await axios_client.get<Rates>("/api/currencies");

		return data;
	});

	let price = format_price(0, currency);

	$: if ($ex_rate_query.isSuccess)
		price = format_price(
			convert_price(get_latest_price(item.prices, market), currency, $ex_rate_query.data),
			currency
		);
</script>

<button class="w-40 h-48" on:click>
	<div
		class="h-40 w-40 flex items-center justify-center border-2 rounded-t-md border-input cursor-pointer group relative"
	>
		<div
			class="absolute top-0 left-0 w-full h-full bg-secondary/80 opacity-0 group-hover:opacity-100 z-10 transition-all flex items-center justify-center"
		>
			<PlusCircle size={36} />
		</div>

		<span class="absolute bottom-1 left-1 z-0">{price}</span>

		<Img market_hash_name={item.market_hash_name} lg />
	</div>

	<div class="h-8 w-full bg-secondary text-center">
		<span
			class="inline-block text-sm text-text font-semibold text-ellipsis overflow-hidden whitespace-nowrap w-36 mx-2 align-middle"
			>{item.market_hash_name}</span
		>
	</div>
</button>
