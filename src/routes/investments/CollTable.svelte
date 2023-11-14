<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from "svelte-headless-table";
	import { type Writable, writable } from "svelte/store";
	import { useQuery, useQueryClient } from "@sveltestack/svelte-query";
	import { axios_client, format_price } from "$lib";
	import { fetch_prices, type InvestmentType } from "./investment";
	import * as Table from "$lib/components/ui/table";
	import Gain from "./Gain.svelte";
	import Img from "./Img.svelte";
	import CollTableActions from "./CollTableActions.svelte";
	import { getContext } from "svelte";
	import { addTableFilter } from "svelte-headless-table/plugins";

	export let col_id: number;

	const invest_query = useQuery(["investments", col_id], async () => {
		const { data } = await axios_client.get<{ investments: InvestmentType[] }>(
			`/api/investment/all?col_id=${col_id}`
		);

		return data;
	});

	const query_client = useQueryClient();

	$: {
		if ($invest_query.isSuccess) {
			(async () => {
				for (let investment of $invest_query.data.investments) {
					await query_client.prefetchQuery({
						queryKey: investment.item,
						queryFn: async () => await fetch_prices(investment.item)
					});
				}
			})();
		}
	}

	const investments = writable($invest_query.data?.investments || []);
	$: $investments = $invest_query.data?.investments || [];

	const filter = getContext<Writable<string>>("filter");

	const table = createTable(investments, {
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase()),
			serverSide: false
		})
	});

	const columns = table.createColumns([
		table.column({
			accessor: ({ item }) => item,
			header: "",
			id: "image",
			cell: ({ value }) =>
				createRender(Img, {
					market_hash_name: value
				}),
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: "item",
			header: "Name"
		}),
		table.column({
			accessor: "amount",
			header: "Amount",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: (item) => item,
			header: "Cost (each)",
			cell: ({ value }) => format_price(value.cost, value.currency),
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: (item) => item,
			header: "Total cost",
			id: "total_cost",
			cell: ({ value }) =>
				createRender(Gain, {
					item: value
				}),
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: (item) => item,
			header: "Total worth",
			id: "total_worth",
			cell: ({ value }) =>
				createRender(Gain, {
					item: value,
					total: true
				}),
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: (item) => item,
			header: "Profit",
			id: "profit",
			cell: ({ value }) =>
				createRender(Gain, {
					item: value,
					profit: true
				}),
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: (item) => item,
			header: "Profit %",
			id: "profit_perc",
			cell: ({ value }) =>
				createRender(Gain, {
					item: value,
					percent: true
				}),
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: (item) => item,
			header: "",
			cell: ({ value }) =>
				createRender(CollTableActions, { id: value.inv_id, name: value.item, col_id })
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { filterValue } = pluginStates.filter;

	$: filterValue.set($filter);
</script>

<div class="rounded-md border-2 border-input mx-2">
	<Table.Root {...$tableAttrs}>
		<Table.Header class="border-b-2 border-input">
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row class="hover:bg-secondary/80">
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs} class="text-primary-foreground font-bold">
									<Render of={cell.render()} />
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs} class="border-input border-b-2 hover:bg-secondary/80">
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell
									{...attrs}
									class={cell.id === "image"
										? "min-w-[130px] w-[130px]"
										: cell.id === "item"
										? "min-w-[250px]"
										: ""}
								>
									<Render of={cell.render()} />
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
