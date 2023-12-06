<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import { Button } from "$lib/components/ui/button";
	import * as Popover from "$lib/components/ui/popover";
	import * as Command from "$lib/components/ui/command";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { cn } from "$lib/utils";
	import { tick } from "svelte";
	import { Check, ChevronsUpDown } from "lucide-svelte";
	import type { FieldValueSetter } from "formsnap/dist/internal";
	import { useQuery, useQueryClient } from "@sveltestack/svelte-query";
	import { axios_client } from "$lib";
	import Img from "$lib/components/Img.svelte";

	let suggestions_query = useQuery<{
		suggestions: {
			market_hash_name: string;
		}[];
	}>("suggestions", { enabled: false });

	let query_client = useQueryClient();

	let timeout: NodeJS.Timeout | undefined = undefined;
	let on_search = async (q: String) => {
		clearTimeout(timeout);

		if (q === undefined) return;

		timeout = setTimeout(() => {
			query_client.fetchQuery({
				queryKey: "suggestions",
				queryFn: async () => {
					let { data } = await axios_client.get(`/api/investment/suggestion?q=${q}`);

					return data;
				}
			});
		}, 1000);
	};

	let input_value: string;
	$: {
		(async () => {
			await on_search(input_value);
		})();
	}

	let open = false;

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	export let value: string;
	export let setValue: FieldValueSetter;
</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
		<Form.Control id={ids.trigger} let:attrs>
			<Button
				builders={[builder]}
				{...attrs}
				variant="outline"
				role="combobox"
				type="button"
				class={cn("w-full justify-between", !value && "text-muted-foreground")}
			>
				{$suggestions_query.data?.suggestions.find((m) => m.market_hash_name === value)
					?.market_hash_name ?? "Select item"}
				<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</Form.Control>
	</Popover.Trigger>
	<Popover.Content class="w-[calc(100%-48px)] p-0 border-input">
		<Command.Root shouldFilter={false}>
			<Command.Input bind:value={input_value} autofocus placeholder="Search item..." />
			<Command.Empty>No item found.</Command.Empty>
			{#if $suggestions_query.isSuccess}
				{#each $suggestions_query.data.suggestions as item}
					<Command.Item
						class="p-2 m-2"
						value={item.market_hash_name}
						onSelect={() => {
							setValue(item.market_hash_name);
							closeAndFocusTrigger(ids.trigger);
						}}
					>
						<Check
							class={cn("mr-2 h-4 w-4", item.market_hash_name !== value && "text-transparent")}
						/>

						<Img market_hash_name={item.market_hash_name} sm />

						<span class="ml-4 overflow-hidden whitespace-nowrap text-ellipsis"
							>{item.market_hash_name}</span
						>
					</Command.Item>
				{/each}
			{/if}
		</Command.Root>
	</Popover.Content>
</Popover.Root>
