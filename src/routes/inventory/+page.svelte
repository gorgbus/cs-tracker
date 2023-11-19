<script lang="ts">
	import { useQuery } from "@sveltestack/svelte-query";
	import { axios_client, type Inventory } from "$lib";
	import Item from "./Item.svelte";
	import { Input } from "$lib/components/ui/input";
	import * as Dialog from "$lib/components/ui/dialog";
	import InvestmentForm from "./InvestmentForm.svelte";
	import type { PageData } from "./$types";
	import { fetch_collections } from "../investments/investment";

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

	let search: string = "";

	export let data: PageData;
</script>

<div class="max-w-6xl m-auto p-4">
	<h1 class="text-primary-foreground text-2xl font-semibold py-4">Steam Inventory</h1>

	<Input class="w-96" placeholder="Search" type="text" bind:value={search} />

	<div
		class="overflow-auto overflow-x-hidden max-h-[1152px] min-h-[700px] bg-secondary/30 p-4 rounded-xl mt-4"
	>
		{#if $query_result.isSuccess && $collections_query.isSuccess}
			<div class="grid gap-2 grid-template justify-center content-center">
				{#each $query_result.data.items.filter((i) => i.market_hash_name
						.toLowerCase()
						.includes(search.toLowerCase())) as item}
					<Dialog.Root open={data.form.posted && false}>
						<Dialog.Trigger>
							<Item {item} />
						</Dialog.Trigger>
						<Dialog.Content class="border-input">
							<Dialog.Header>
								<Dialog.Title>New investment</Dialog.Title>
								<Dialog.Description>Add a new investment</Dialog.Description>
							</Dialog.Header>

							{#if $collections_query.isSuccess}
								<InvestmentForm
									{item}
									form={data.form}
									collections={$collections_query.data.collections}
								/>
							{/if}
						</Dialog.Content>
					</Dialog.Root>
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
