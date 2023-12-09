<script lang="ts">
	import { writable } from "svelte/store";
	import CollTable from "./CollTable.svelte";
	import { setContext } from "svelte";
	import Decimal from "decimal.js";
	import Input from "$lib/components/ui/input/input.svelte";
	import * as Select from "$lib/components/ui/select";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Currencies, Market, format_price } from "$lib";
	import steam from "$lib/assets/steam.png";
	import buff163 from "$lib/assets/buff163.png";
	import skinport from "$lib/assets/skinport.webp";
	import { buttonVariants } from "$lib/components/ui/button";
	import { cn } from "$lib/utils";
	import type { Collection } from "./investment";
	import type { PageData } from "./$types";
	import InvestmentForm from "./forms/InvestmentForm.svelte";
	import { useQueryClient } from "@sveltestack/svelte-query";

	export let collection: Collection;

	let currency: { value: Currencies; label: string; disabled: boolean } = {
		value: Currencies.EUR,
		label: "€",
		disabled: false
	};

	let selected_currency = writable("USD");
	$: selected_currency.set(currency.value);

	setContext("selected_currency", selected_currency);

	let market: { value: Market; label: string; disabled: boolean } = {
		value: Market.STEAM,
		label: "Steam",
		disabled: false
	};

	let selected_market = writable("steam");
	$: selected_market.set(market.value);

	setContext("selected_market", selected_market);

	let items = writable<{
		[key: number]: {
			total_cost: number;
			current_worth: number;
			profit: number;
		};
	}>({});

	setContext("summary", items);

	let summary: {
		total_cost: Decimal;
		current_worth: Decimal;
		profit: Decimal;
	};

	$: {
		summary = {
			total_cost: new Decimal(0),
			current_worth: new Decimal(0),
			profit: new Decimal(0)
		};

		Object.values($items).forEach((item) => {
			summary = {
				total_cost: summary.total_cost.plus(item.total_cost),
				current_worth: summary.current_worth.plus(item.current_worth),
				profit: summary.profit.plus(item.profit)
			};
		});
	}

	let filter = writable<string>("");

	setContext("filter", filter);

	export let data: PageData;

	const query_client = useQueryClient();

	let open = false;

	const close_form = () => {
		open = false;

		(async () => {
			await query_client.invalidateQueries({
				queryKey: ["investments", collection.col_id]
			});
		})();
	};
</script>

<div class="flex items-center justify-end">
	<Dialog.Root bind:open>
		<Dialog.Trigger class={cn(buttonVariants({ variant: "outline" }), "mx-2")}
			>New investment</Dialog.Trigger
		>
		<Dialog.Content class="border-input">
			<Dialog.Header>
				<Dialog.Title>New investment</Dialog.Title>
				<Dialog.Description>Add a new investment</Dialog.Description>
			</Dialog.Header>

			<InvestmentForm form={data.inv_form} col_id={collection.col_id} {close_form} />
		</Dialog.Content>
	</Dialog.Root>
</div>

<div class="py-4 px-2 block xl:flex items-center justify-between border-0">
	<Input class="xl:w-96" placeholder="Search" type="text" bind:value={$filter} />

	<div class="my-4 xl:my-0 flex flex-col sm:flex-row xl:justify-center xl:block">
		<span
			class="text-primary-foreground font-bold p-2 px-4 my-2 sm:my-0 h-10 bg-secondary text-center rounded-md sm:inline-block border border-input"
			>Total cost: <span class="font-normal"
				>{format_price(summary.total_cost.toNumber(), currency.value)}</span
			></span
		>

		<span
			class="text-primary-foreground font-bold p-2 px-4 my-2 sm:my-0 h-10 text-center sm:mx-2 bg-secondary rounded-md sm:inline-block border border-input"
		>
			Current worth:
			<span
				class={`font-normal ${
					summary.current_worth.toNumber() > 0 ? "text-green-500" : "text-red-500"
				}`}
			>
				{format_price(summary.current_worth.toNumber(), currency.value)}
			</span>
		</span>

		<span
			class="text-primary-foreground font-bold p-2 px-4 my-2 sm:my-0 h-10 bg-secondary rounded-md text-center sm:inline-block border border-input"
		>
			Profit:
			<span
				class={`font-normal ${summary.profit.toNumber() > 0 ? "text-green-500" : "text-red-500"}`}
			>
				{format_price(summary.profit.toNumber(), currency.value)}
			</span>
		</span>
	</div>
	<div class="flex">
		<Select.Root bind:selected={currency}>
			<div class="inline-block">
				<Select.Trigger class="w-20 mr-2 focus:outline-accent">
					<Select.Value placeholder="$" />
				</Select.Trigger>
			</div>
			<Select.Content class="border-input">
				<Select.Item value={Currencies.USD}>$</Select.Item>
				<Select.Item value={Currencies.EUR}>€</Select.Item>
				<Select.Item value={Currencies.CNY}>¥</Select.Item>
			</Select.Content>
		</Select.Root>

		<Select.Root bind:selected={market}>
			<div class="inline-block">
				<Select.Trigger class="w-40 focus:outline-accent">
					<Select.Value placeholder="Steam" />
				</Select.Trigger>
			</div>
			<Select.Content class="border-input">
				<Select.Item value={Market.STEAM}>
					<div class="flex items-center">
						<img class="mr-2" height="16" width="16" src={steam} alt="steam-icon" />
						Steam
					</div>
				</Select.Item>
				<Select.Item value={Market.BUFF163}>
					<div class="flex items-center">
						<img class="mr-2" height="16" width="16" src={buff163} alt="buff-icon" />
						Buff163
					</div>
				</Select.Item>
				<Select.Item value={Market.SKINPORT}>
					<div class="flex items-center">
						<img class="mr-2" height="16" width="16" src={skinport} alt="skinport-icon" />
						Skinport
					</div>
				</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>
</div>

<CollTable {data} col_id={collection.col_id} />
