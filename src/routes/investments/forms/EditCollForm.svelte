<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import * as Dialog from "$lib/components/ui/dialog";
	import { collEditFormSchema, type CollEditFormSchema } from "../schema";
	import type { SuperValidated } from "sveltekit-superforms";
	import type { Collection } from "../investment";

	export let form: SuperValidated<CollEditFormSchema>;
	export let coll: Collection;
</script>

<Form.Root method="POST" action="?/coll_rename" {form} schema={collEditFormSchema} let:config>
	<Form.Field {config} name="col_id">
		<Form.Item class="hidden">
			<Form.NumberInput prefill={coll.col_id} />
		</Form.Item>
	</Form.Field>

	<Form.Field {config} name="name">
		<Form.Item>
			<Form.Label>Name</Form.Label>
			<Form.Input prefill={coll.name} />
			<Form.Description>name of the collection</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Dialog.Footer>
		<Form.Button>Rename</Form.Button>
	</Dialog.Footer>
</Form.Root>
