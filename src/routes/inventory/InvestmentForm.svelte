<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Loader2 } from "lucide-svelte";
	import { formSchema, type FormSchema } from "./schema";
	import type { SuperValidated } from "sveltekit-superforms";
	import type { Collection } from "../investments/investment";
	import { currencies_list, type Item } from "$lib";

	export let close_form: () => void;
	export let collections: Collection[];
	export let item: Item;
	export let form: SuperValidated<FormSchema>;
</script>

<Form.Root method="POST" {form} schema={formSchema} let:config let:message let:submitting>
	{@const _ = message?.type === "success" && close_form()}

	<Form.Field {config} name="market_hash_name">
		<Form.Item>
			<Form.Label>Name</Form.Label>
			<Form.Input prefill={item.market_hash_name} class="pointer-events-none" tabindex={-1} />
			<Form.Description>market hash name of the item</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="cost">
		<Form.Item>
			<Form.Label>Cost</Form.Label>
			<Form.NumberInput prefill={0.01} class="hide-arrows" step="0.01" />
			<Form.Description>cost per each item</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="amount">
		<Form.Item>
			<Form.Label>Amount</Form.Label>
			<Form.NumberInput prefill={1} class="hide-arrows" />
			<Form.Description>amount of items you want to add</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="currency">
		<Form.Item>
			<Form.Label>Currency</Form.Label>
			<Form.Select>
				<Form.SelectTrigger class="focus:outline-accent" placeholder="Select currency" />
				<Form.SelectContent class="border-input">
					{#each currencies_list as currency}
						<Form.SelectItem value={currency.value}>{currency.label}</Form.SelectItem>
					{/each}
				</Form.SelectContent>
			</Form.Select>
			<Form.Description>the currency in which you purchased the item</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="col_id">
		<Form.Item>
			<Form.Label>Collection</Form.Label>
			<Form.Select>
				<Form.SelectTrigger class="focus:outline-accent" placeholder="Select a collection" />
				<Form.SelectContent class="border-input">
					{#each collections as coll}
						<Form.SelectItem value={coll.col_id}>{coll.name}</Form.SelectItem>
					{/each}
				</Form.SelectContent>
			</Form.Select>
			<Form.Description>collection which this item will be added to</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Dialog.Footer>
		<Form.Button>
			{#if submitting}
				<Loader2 class="animate-spin" />
			{:else}
				Add
			{/if}
		</Form.Button>
	</Dialog.Footer>
</Form.Root>
