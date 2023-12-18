<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Loader2 } from "lucide-svelte";
	import { invEditFormSchema, type InvEditFormSchema } from "../schema";
	import type { SuperValidated } from "sveltekit-superforms";
	import type { InvestmentType } from "../investment";
	import { get_currency_symbol, currencies_list } from "$lib";

	export let close_form: () => void;
	export let investment: InvestmentType;
	export let form: SuperValidated<InvEditFormSchema>;

	let selected = {
		value: investment.currency,
		label: get_currency_symbol(investment.currency),
		disabled: false
	};
</script>

<Form.Root
	method="POST"
	action={`?/inv_edit`}
	{form}
	schema={invEditFormSchema}
	let:config
	let:message
	let:submitting
>
	{@const _ = message?.type === "success" && close_form()}

	<Form.Field {config} name="inv_id">
		<Form.Item class="hidden">
			<Form.NumberInput prefill={investment.inv_id} />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="col_id">
		<Form.Item class="hidden">
			<Form.NumberInput prefill={investment.collection} />
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="cost">
		<Form.Item>
			<Form.Label>Cost</Form.Label>
			<Form.NumberInput class="hide-arrows" step="0.01" prefill={investment.cost} />
			<Form.Description>cost per each item</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="amount">
		<Form.Item>
			<Form.Label>Amount</Form.Label>
			<Form.NumberInput class="hide-arrows" prefill={investment.amount} />
			<Form.Description>amount of items you want to add</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="currency">
		<Form.Item>
			<Form.Label>Currency</Form.Label>
			<Form.Select bind:selected prefill={investment.currency}>
				<Form.SelectTrigger class="focus:outline-accent" placeholder="Select a currency" />
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

	<Dialog.Footer>
		<Form.Button>
			{#if submitting}
				<Loader2 class="animate-spin" />
			{:else}
				Edit
			{/if}
		</Form.Button>
	</Dialog.Footer>
</Form.Root>
