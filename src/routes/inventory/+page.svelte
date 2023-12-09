<script lang="ts">
	import { useQuery } from "@sveltestack/svelte-query";
	import { axios_client, type Inventory } from "$lib";
	import Item from "./Item.svelte";
	import { Input } from "$lib/components/ui/input";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Select from "$lib/components/ui/select";
	import InvestmentForm from "./InvestmentForm.svelte";
	import { type Item as ItemType, Currencies, Market } from "$lib";
	import type { PageData } from "./$types";
	import { fetch_collections } from "../investments/investment";
	import steam from "$lib/assets/steam.png";
	import buff163 from "$lib/assets/buff163.png";
	import skinport from "$lib/assets/skinport.webp";

	const query_result = useQuery<Inventory, Error>(
		"inventory",
		async () => {
			const { data } = await axios_client.get<Inventory>(`/api/inventory`);

			return data;
		},
		{
			cacheTime: 1000 * 60 * 30,
			refetchOnMount: false,
			refetchOnWindowFocus: false
		}
	);

	const collections_query = useQuery("collections", fetch_collections);

	let currency: { value: Currencies; label: string; disabled: boolean } = {
		value: Currencies.EUR,
		label: "€",
		disabled: false
	};

	let market: { value: Market; label: string; disabled: boolean } = {
		value: Market.STEAM,
		label: "Steam",
		disabled: false
	};

	let search: string = "";
	let open = false;
	let curr_item: ItemType;

	const close_form = () => (open = false);

	export let data: PageData;
</script>

<svelte:head>
	<title>Inventory</title>
</svelte:head>

<div class="w-full max-w-6xl m-auto p-4">
	<h1 class="text-primary-foreground text-2xl font-semibold py-4">
		Steam Inventory {#if $query_result.isSuccess}
			({$query_result.data.total_inventory_count})
		{/if}
	</h1>

	<div class="flex items-center justify-between">
		<Input class="w-96" placeholder="Search" type="text" bind:value={search} />

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

	<div
		class="overflow-auto overflow-x-hidden max-h-[1152px] min-h-[700px] bg-secondary/30 p-4 rounded-xl mt-4"
	>
		{#if $query_result.isSuccess && $collections_query.isSuccess}
			<div class="grid gap-2 grid-template justify-center content-center">
				{#each $query_result.data.items.filter((i) => i.market_hash_name
						.toLowerCase()
						.includes(search.toLowerCase())) as item}
					<Item
						{item}
						market={market.value}
						currency={currency.value}
						on:click={() => {
							open = true;
							curr_item = item;
						}}
					/>
				{/each}
			</div>
		{:else if $query_result.isLoading}
			<div
				class="flex justify-center items-center text-primary-foreground text-xl font-semibold mt-72"
			>
				Loading...
			</div>
		{:else if $query_result.isError}
			<div
				class="flex justify-center items-center text-primary-foreground text-xl font-semibold mt-72 text-center"
			>
				Something went wrong, try again.
				<br />Make sure your inventory is set to public
			</div>
		{/if}
	</div>
</div>

<Dialog.Root bind:open>
	<Dialog.Trigger />
	<Dialog.Content class="border-input">
		<Dialog.Header>
			<Dialog.Title>New investment</Dialog.Title>
			<Dialog.Description>Add a new investment</Dialog.Description>
		</Dialog.Header>

		{#if $collections_query.isSuccess}
			<InvestmentForm
				{close_form}
				item={curr_item}
				form={data.form}
				collections={$collections_query.data.collections}
			/>
		{/if}
	</Dialog.Content>
</Dialog.Root>
