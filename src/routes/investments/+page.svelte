<script lang="ts">
	import { useQuery, useQueryClient } from "@sveltestack/svelte-query";
	import { fetch_collections, type Collection } from "./investment";
	import * as Accordion from "$lib/components/ui/accordion";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as ContextMenu from "$lib/components/ui/context-menu";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import TableWrapper from "./TableWrapper.svelte";
	import CollForm from "./CollForm.svelte";
	import type { PageData } from "./$types";
	import { cn } from "$lib/utils";
	import { buttonVariants } from "$lib/components/ui/button";
	import { superForm } from "sveltekit-superforms/client";
	import { axios_client } from "$lib";

	const collections_query = useQuery("collections", fetch_collections);

	export let data: PageData;

	const { message } = superForm(data.coll_form);

	const query_client = useQueryClient();

	$: if ($message === "success") {
		(async () => {
			await query_client.invalidateQueries("collections");

			$message = undefined;
		})();
	}

	let open = false;
	let coll: Collection;

	const remove_coll = async () => {
		try {
			await axios_client.delete(`/api/investment/collection/${coll.col_id}`);

			await query_client.invalidateQueries("collections");
		} catch (err) {
			console.error(err);
		}
	};
</script>

<div class="p-8 flex items-center justify-between pb-0">
	<h1 class="text-primary-foreground text-2xl font-semibold py-4">Your collections</h1>

	<Dialog.Root open={data.coll_form.posted && false}>
		<Dialog.Trigger class={cn(buttonVariants({ variant: "outline" }), "mx-2")}
			>New collection</Dialog.Trigger
		>
		<Dialog.Content class="border-input">
			<Dialog.Header>
				<Dialog.Title>New collection</Dialog.Title>
				<Dialog.Description>Create new collection</Dialog.Description>
			</Dialog.Header>

			<CollForm form={data.coll_form} />
		</Dialog.Content>
	</Dialog.Root>
</div>

{#if $collections_query.isSuccess}
	{#each $collections_query.data.collections as collection}
		<ContextMenu.Root>
			<ContextMenu.Trigger>
				<Accordion.Root class="px-8 py-2">
					<Accordion.Item value={`${collection.col_id}`}>
						<Accordion.Trigger class="font-bold">{collection.name}</Accordion.Trigger>
						<Accordion.Content>
							<TableWrapper {collection} {data} />
						</Accordion.Content>
					</Accordion.Item>
				</Accordion.Root>
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Item
					class="text-red-500 data-[highlighted]:bg-red-500 data-[highlighted]:text-primary-foreground"
					on:click={() => {
						open = !open;
						coll = collection;
					}}>Remove</ContextMenu.Item
				>
			</ContextMenu.Content>
		</ContextMenu.Root>
	{/each}
{/if}

<AlertDialog.Root {open} onOpenChange={(o) => (open = o ? o : false)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action will remove collection <strong>{coll.name}</strong>
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action on:click={remove_coll}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
