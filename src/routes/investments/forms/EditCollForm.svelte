<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Loader2 } from "lucide-svelte";
	import { collEditFormSchema, type CollEditFormSchema } from "../schema";
	import type { SuperValidated } from "sveltekit-superforms";
	import type { Collection } from "../investment";

	export let close_form: () => void;
	export let form: SuperValidated<CollEditFormSchema>;
	export let coll: Collection;
</script>

<Form.Root
	method="POST"
	action="?/coll_rename"
	{form}
	schema={collEditFormSchema}
	let:config
	let:message
	let:submitting
>
	{@const _ = message?.type === "success" && close_form()}

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
		<Form.Button>
			{#if submitting}
				<Loader2 class="animate-spin" />
			{:else}
				Rename
			{/if}
		</Form.Button>
	</Dialog.Footer>
</Form.Root>
