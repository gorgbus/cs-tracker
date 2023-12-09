<script lang="ts">
	import { useQuery } from "@sveltestack/svelte-query";
	import { fetch_prices, type InvestmentType } from "./investment";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import Decimal from "decimal.js";
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import {
		axios_client,
		format_price,
		get_latest_price,
		Currencies,
		type Rates,
		convert_price
	} from "$lib";

	export let percent = false;
	export let total = false;
	export let profit = false;

	export let item: InvestmentType;

	let items: Writable<{ [key: number]: any }> = getContext("summary");

	const query_result = useQuery(item.item, async () => await fetch_prices(item.item), {
		enabled: false
	});

	const ex_rate_query = useQuery("exchange_rates", async () => {
		const { data } = await axios_client.get<Rates>("/api/currencies");

		return data;
	});

	const update_items = (prop: string, value: number) => {
		items.update((obj) => {
			const prev = obj[item.inv_id] || {};

			obj[item.inv_id] = { ...prev, [prop]: value };

			return obj;
		});
	};

	const calc_total_cost = (amount: number, cost: number) => {
		const dec_amount = new Decimal(amount);

		return dec_amount.mul(cost).toDecimalPlaces(2).toNumber();
	};

	const calc_curr_worth = (amount: number, latest_price: number) => {
		const dec_amount = new Decimal(amount);

		return dec_amount.mul(latest_price).toDecimalPlaces(2);
	};

	const calc_gain = (amount: number, latest_price: number, cost: number) => {
		const current_worth = calc_curr_worth(amount, latest_price);
		const total_cost = calc_total_cost(amount, cost);

		return current_worth.minus(total_cost).toNumber();
	};

	const calc_perc_gain = (amount: number, latest_price: number, cost: number) => {
		const current_worth = calc_curr_worth(
			amount,
			convert_price(latest_price, item.currency, $ex_rate_query.data!)
		);
		const total_cost = calc_total_cost(amount, cost);

		return current_worth.minus(total_cost).div(total_cost).mul(100).round().toNumber();
	};

	const convert_to_usd = (price: number, currency: Currencies) => {
		switch (currency) {
			case "USD":
				return price;
			case "EUR":
				return new Decimal(price).div($ex_rate_query.data?.EUR!).toDecimalPlaces(2).toNumber();
			case "CNY":
				return new Decimal(price).div($ex_rate_query.data?.CNY!).toDecimalPlaces(2).toNumber();
		}

		return 0;
	};

	let currency = getContext<Writable<Currencies>>("selected_currency");
	let market = getContext<Writable<"steam" | "buff163" | "skinport">>("selected_market");

	const update_wrapper = (update: string, amount: number, latest_price = 0, cost = 0) => {
		switch (update) {
			case "total_cost": {
				const converted_cost = convert_to_usd(cost, item.currency);

				update_items(
					update,
					calc_total_cost(amount, convert_price(converted_cost, $currency, $ex_rate_query.data!))
				);

				return calc_total_cost(amount, cost);
			}
			case "current_worth": {
				const converted_latest_price = convert_price(latest_price, $currency, $ex_rate_query.data!);

				update_items(update, calc_curr_worth(amount, converted_latest_price).toNumber());

				return calc_curr_worth(
					amount,
					convert_price(latest_price, item.currency, $ex_rate_query.data!)
				).toNumber();
			}
			case "profit": {
				const converted_latest_price = convert_price(latest_price, $currency, $ex_rate_query.data!);
				const converted_cost = convert_to_usd(cost, item.currency);

				update_items(
					update,
					calc_gain(
						amount,
						converted_latest_price,
						convert_price(converted_cost, $currency, $ex_rate_query.data!)
					)
				);

				return calc_gain(
					amount,
					convert_price(latest_price, item.currency, $ex_rate_query.data!),
					cost
				);
			}
		}

		return 0;
	};

	let latest_price = 0;

	$: {
		const sel_market = $query_result.isSuccess && ($query_result.data[$market] as any);

		if (sel_market) latest_price = get_latest_price($query_result.data, $market);
		else latest_price = 0;
	}
</script>

{#if $query_result.isSuccess && $ex_rate_query.isSuccess}
	{#if percent}
		{@const result = calc_perc_gain(item.amount, latest_price, item.cost)}
		<span class={result > 0 ? "text-green-500" : "text-red-500"}>{result}%</span>
	{:else if total}
		{@const result = update_wrapper("current_worth", item.amount, latest_price)}
		<span>{format_price(result, item.currency)}</span>
	{:else if profit}
		{@const result = update_wrapper("profit", item.amount, latest_price, item.cost)}
		<span class={result > 0 ? "text-green-500" : "text-red-500"}
			>{format_price(result, item.currency)}</span
		>
	{:else}
		{@const result = update_wrapper("total_cost", item.amount, 0, item.cost)}
		<span>{format_price(result, item.currency)}</span>
	{/if}
{:else}
	<Skeleton class="w-12 h-4" />
{/if}
