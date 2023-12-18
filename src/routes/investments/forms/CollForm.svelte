<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Loader2 } from "lucide-svelte";
	import { collFormSchema, type CollFormSchema } from "../schema";
	import type { SuperValidated } from "sveltekit-superforms";

	export let close_form: () => void;
	export let form: SuperValidated<CollFormSchema>;
</script>

<Form.Root
	method="POST"
	action="?/coll_create"
	{form}
	schema={collFormSchema}
	let:config
	let:message
	let:submitting
>
	{@const _ = message?.type === "success" && close_form()}

	<Form.Field {config} name="name">
		<Form.Item>
			<Form.Label>Name</Form.Label>
			<Form.Input />
			<Form.Description>name of the collection</Form.Description>
			<Form.Validation />
		</Form.Item>
	</Form.Field>

	<Dialog.Footer>
		<Form.Button>
			{#if submitting}
				<Loader2 class="animate-spin" />
			{:else}
				Create
			{/if}
		</Form.Button>
	</Dialog.Footer>
</Form.Root>
