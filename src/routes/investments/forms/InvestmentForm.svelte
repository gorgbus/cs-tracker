<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Loader2 } from "lucide-svelte";
	import { invFormSchema, type InvFormSchema } from "../schema";
	import type { SuperValidated } from "sveltekit-superforms";
	import { currencies_list } from "$lib";

	export let close_form: () => void;
	export let col_id: number;
	export let form: SuperValidated<InvFormSchema>;
</script>

<Form.Root
	method="POST"
	action={`?/inv_create`}
	{form}
	schema={invFormSchema}
	let:config
	let:message
	let:submitting
>
	{@const _ = message?.type === "success" && close_form()}

	<Form.Field {config} name="col_id">
		<Form.Item class="hidden">
			<Form.NumberInput prefill={col_id} />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="market_hash_name" let:setValue let:value>
		<Form.Item>
			<Form.Label>Name</Form.Label>
			<!-- <Form.Input /> -->
			<Form.Combobox {value} {setValue} />
			<Form.Description>market hash name of the item</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="cost">
		<Form.Item>
			<Form.Label>Cost</Form.Label>
			<Form.NumberInput class="hide-arrows" step="0.01" prefill={0.01} />
			<Form.Description>cost per each item</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="amount">
		<Form.Item>
			<Form.Label>Amount</Form.Label>
			<Form.NumberInput class="hide-arrows" prefill={1} />
			<Form.Description>amount of items you want to add</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="currency">
		<Form.Item>
			<Form.Label>Currency</Form.Label>
			<Form.Select>
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
				Add
			{/if}
		</Form.Button>
	</Dialog.Footer>
</Form.Root>
