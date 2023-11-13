<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import * as Dialog from "$lib/components/ui/dialog";
	import { collFormSchema, type CollFormSchema } from "./schema";
	import type { SuperValidated } from "sveltekit-superforms";

	export let form: SuperValidated<CollFormSchema>;
</script>

<Form.Root method="POST" action="?/coll_create" {form} schema={collFormSchema} let:config>
	<Form.Field {config} name="name">
		<Form.Item>
			<Form.Label>Name</Form.Label>
			<Form.Input />
			<Form.Description>name of the collection</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Dialog.Footer>
		<Form.Button>Create</Form.Button>
	</Dialog.Footer>
</Form.Root>
