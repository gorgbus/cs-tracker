<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import * as Dialog from "$lib/components/ui/dialog";
	import { invFormSchema, type InvFormSchema } from "./schema";
	import type { SuperValidated } from "sveltekit-superforms";

	export let col_id: number;
	export let form: SuperValidated<InvFormSchema>;
</script>

<Form.Root
	method="POST"
	action={`?/inv_create&col_id=${col_id}`}
	{form}
	schema={invFormSchema}
	let:config
>
	<Form.Field {config} name="market_hash_name">
		<Form.Item>
			<Form.Label>Name</Form.Label>
			<Form.Input />
			<Form.Description>market hash name of the item</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="cost">
		<Form.Item>
			<Form.Label>Cost</Form.Label>
			<Form.NumberInput class="hide-arrows" step="0.01" />
			<Form.Description>cost per each item</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="amount">
		<Form.Item>
			<Form.Label>Amount</Form.Label>
			<Form.NumberInput class="hide-arrows" />
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
					<Form.SelectItem value="USD">$</Form.SelectItem>
					<Form.SelectItem value="EUR">€</Form.SelectItem>
					<Form.SelectItem value="CNY">¥</Form.SelectItem>
				</Form.SelectContent>
			</Form.Select>
			<Form.Description>the currency in which you purchased the item</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Dialog.Footer>
		<Form.Button>Add</Form.Button>
	</Dialog.Footer>
</Form.Root>
