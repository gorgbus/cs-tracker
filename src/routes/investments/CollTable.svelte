<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from "svelte-headless-table";
	import { type Writable, writable, type Unsubscriber } from "svelte/store";
	import { useQuery } from "@sveltestack/svelte-query";
	import { axios_client, Currencies, format_price, get_latest_price, type Rates } from "$lib";
	import {
		update_wrapper,
		type InvestmentType,
		type Prices,
		calc_perc_gain,
		convert_to_usd,
		compare_fn
	} from "./investment";
	import * as Table from "$lib/components/ui/table";
	import Gain from "./Gain.svelte";
	import Img from "$lib/components/Img.svelte";
	import CollTableActions from "./CollTableActions.svelte";
	import { getContext, onDestroy } from "svelte";
	import { addTableFilter, addSortBy } from "svelte-headless-table/plugins";
	import type { PageData } from "./$types";
	import { ArrowUpDown } from "lucide-svelte";
	import { Button } from "$lib/components/ui/button";

	export let col_id: number;
	export let data: PageData;

	const invest_query = useQuery(["investments", col_id], async () => {
		const { data } = await axios_client.get<{
			investments: {
				investment: InvestmentType;
				prices: Prices;
			}[];
		}>(`/api/investment/all?col_id=${col_id}`);

		return data;
	});

	const ex_rate_query = useQuery("exchange_rates", async () => {
		const { data } = await axios_client.get<Rates>("/api/currencies");

		return data;
	});

	let items: Writable<{ [key: number]: any }> = getContext("summary");
	let currency = getContext<Writable<Currencies>>("selected_currency");
	let market = getContext<Writable<"steam" | "buff163" | "skinport">>("selected_market");

	const investments = writable(
		($invest_query.isSuccess && $ex_rate_query.isSuccess && $invest_query.data.investments) || []
	);
	$: $investments =
		($invest_query.isSuccess && $ex_rate_query.isSuccess && $invest_query.data.investments) || [];

	let _market: Unsubscriber;

	_market = market.subscribe(() => {
		$investments =
			($invest_query.isSuccess && $ex_rate_query.isSuccess && $invest_query.data.investments) || [];
	});

	let _currency: Unsubscriber;

	_currency = currency.subscribe(() => {
		$investments =
			($invest_query.isSuccess && $ex_rate_query.isSuccess && $invest_query.data.investments) || [];
	});

	onDestroy(() => {
		_market();
		_currency();
	});

	const filter = getContext<Writable<string>>("filter");

	const table = createTable(investments, {
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase()),
			serverSide: false
		}),
		sort: addSortBy()
	});

	const columns = table.createColumns([
		table.column({
			accessor: ({ investment }) => investment.item,
			header: "",
			id: "image",
			cell: ({ value }) =>
				createRender(Img, {
					market_hash_name: value
				}),
			plugins: {
				filter: {
					exclude: true
				},
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: ({ investment }) => investment.item,
			header: "Name"
		}),
		table.column({
			accessor: ({ investment }) => investment.amount,
			header: "Amount",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ investment }) => investment,
			header: "Cost (each)",
			cell: ({ value }) => format_price(value.cost, value.currency),
			plugins: {
				filter: {
					exclude: true
				},
				sort: {
					compareFn: (left, right) => {
						const left_cost = convert_to_usd(left.cost, left.currency, $ex_rate_query.data!);
						const right_cost = convert_to_usd(right.cost, right.currency, $ex_rate_query.data!);

						if (left_cost < right_cost) return -1;
						else if (left_cost === right_cost) return 0;

						return 1;
					}
				}
			}
		}),
		table.column({
			accessor: (item) => item,
			header: "Total cost",
			id: "total_cost",
			cell: ({ value }) =>
				format_price(
					update_wrapper(items, "total_cost", value.investment, $currency, $ex_rate_query.data!),
					value.investment.currency
				),
			plugins: {
				filter: {
					exclude: true
				},
				sort: {
					compareFn: (left, right) =>
						compare_fn("total_cost", left, right, $ex_rate_query.data!, $market)
				}
			}
		}),
		table.column({
			accessor: (item) => item,
			header: "Total worth",
			id: "total_worth",
			cell: ({ value }) => {
				const latest_price = get_latest_price(value.prices, $market);

				const current_worth = update_wrapper(
					items,
					"current_worth",
					value.investment,
					$currency,
					$ex_rate_query.data!,
					latest_price
				);

				const total_cost = update_wrapper(
					items,
					"total_cost",
					value.investment,
					$currency,
					$ex_rate_query.data!
				);

				return createRender(Gain, {
					value: format_price(current_worth, value.investment.currency),
					profit: current_worth > total_cost
				});
			},
			plugins: {
				filter: {
					exclude: true
				},
				sort: {
					compareFn: (left, right) =>
						compare_fn("total_worth", left, right, $ex_rate_query.data!, $market)
				}
			}
		}),
		table.column({
			accessor: (item) => item,
			header: "Profit",
			id: "profit",
			cell: ({ value }) => {
				const latest_price = get_latest_price(value.prices, $market);

				let profit = update_wrapper(
					items,
					"profit",
					value.investment,
					$currency,
					$ex_rate_query.data!,
					latest_price
				);

				return createRender(Gain, {
					value: format_price(profit, value.investment.currency),
					profit: profit > 0
				});
			},
			plugins: {
				filter: {
					exclude: true
				},
				sort: {
					compareFn: (left, right) =>
						compare_fn("profit", left, right, $ex_rate_query.data!, $market)
				}
			}
		}),
		table.column({
			accessor: (item) => item,
			header: "Profit %",
			id: "profit_perc",
			cell: ({ value }) => {
				const latest_price = get_latest_price(value.prices, $market);

				const profit_perc = calc_perc_gain(
					value.investment.amount,
					latest_price,
					value.investment.cost,
					value.investment.currency,
					$ex_rate_query.data!
				);

				return createRender(Gain, {
					value: `${profit_perc}%`,
					profit: profit_perc > 0
				});
			},
			plugins: {
				filter: {
					exclude: true
				},
				sort: {
					compareFn: (left, right) =>
						compare_fn("profit_perc", left, right, $ex_rate_query.data!, $market)
				}
			}
		}),
		table.column({
			id: "actions",
			accessor: ({ investment }) => investment,
			header: "",
			cell: ({ value }) => createRender(CollTableActions, { investment: value, data }),
			plugins: {
				filter: {
					exclude: true
				},
				sort: {
					disable: true
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	const { filterValue } = pluginStates.filter;

	$: filterValue.set($filter);
</script>

<div class="rounded-md border-2 border-input mx-2">
	{#if $invest_query.isSuccess}
		<Table.Root {...$tableAttrs}>
			<Table.Header class="border-b-2 border-input">
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row class="hover:bg-secondary/80">
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs} class="text-primary-foreground font-bold">
										{#if cell.id === "image" || cell.id === "actions"}
											<Render of={cell.render()} />
										{:else}
											<Button variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												<ArrowUpDown class={"ml-2 h-4 w-4"} />
											</Button>
										{/if}
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
	{:else if $invest_query.isError}
		<div
			class="flex justify-center items-center text-primary-foreground text-xl font-semibold h-60 w-full"
		>
			Something went wrong
		</div>
	{:else}
		<div
			class="flex justify-center items-center text-primary-foreground text-xl font-semibold h-60 w-full"
		>
			Loading...
		</div>
	{/if}
</div>
