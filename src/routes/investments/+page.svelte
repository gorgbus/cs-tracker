<script lang="ts">
	import { useQuery, useQueryClient } from "@sveltestack/svelte-query";
	import { fetch_collections, type Collection } from "./investment";
	import * as Accordion from "$lib/components/ui/accordion";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as ContextMenu from "$lib/components/ui/context-menu";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import TableWrapper from "./TableWrapper.svelte";
	import CollForm from "./forms/CollForm.svelte";
	import EditCollForm from "./forms/EditCollForm.svelte";
	import type { PageData } from "./$types";
	import { cn } from "$lib/utils";
	import { buttonVariants } from "$lib/components/ui/button";
	import { axios_client } from "$lib";
	import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";

	const collections_query = useQuery("collections", fetch_collections);

	export let data: PageData;

	const query_client = useQueryClient();

	let open_create = false;
	let open_rename = false;
	let open = false;
	let coll: Collection;

	const close_form = () => {
		open_rename = false;
		open_create = false;

		(async () => {
			await query_client.invalidateQueries("collections");
		})();
	};

	const remove_coll = async () => {
		try {
			await axios_client.delete(`/api/investment/collection/${coll.col_id}`);

			await query_client.invalidateQueries("collections");
		} catch (err) {
			console.error(err);
		}
	};
</script>

<svelte:head>
	<title>Investments</title>
</svelte:head>

<div class="p-8 flex items-center justify-between pb-0">
	<h1 class="text-primary-foreground text-2xl font-semibold py-4">Your collections</h1>

	<Dialog.Root bind:open={open_create}>
		<Dialog.Trigger class={cn(buttonVariants({ variant: "outline" }), "mx-2")}
			>New collection</Dialog.Trigger
		>
		<Dialog.Content class="border-input">
			<Dialog.Header>
				<Dialog.Title>New collection</Dialog.Title>
				<Dialog.Description>Create new collection</Dialog.Description>
			</Dialog.Header>

			<CollForm form={data.coll_form} {close_form} />
		</Dialog.Content>
	</Dialog.Root>
</div>

<Dialog.Root bind:open={open_rename}>
	<Dialog.Content class="border-input">
		<Dialog.Header>
			<Dialog.Title>Rename collection</Dialog.Title>
			<Dialog.Description>Rename <strong>{coll.name}</strong></Dialog.Description>
		</Dialog.Header>

		<EditCollForm form={data.coll_edit_form} {coll} {close_form} />
	</Dialog.Content>
</Dialog.Root>

{#if $collections_query.isSuccess}
	{#each $collections_query.data.collections as collection}
		<Accordion.Root class="px-8 py-2">
			<Accordion.Item value={`${collection.col_id}`}>
				<ContextMenu.Root>
					<ContextMenu.Trigger>
						<Accordion.Trigger class="font-bold">{collection.name}</Accordion.Trigger>
					</ContextMenu.Trigger>
					<ContextMenu.Content>
						<ContextMenu.Group>
							<ContextMenu.Label>Actions</ContextMenu.Label>
							<ContextMenu.Item
								on:click={() => {
									open_rename = true;
									coll = collection;
								}}>Rename</ContextMenu.Item
							>
						</ContextMenu.Group>
						<ContextMenu.Separator />
						<ContextMenu.Item
							class="text-red-500 data-[highlighted]:bg-red-500 data-[highlighted]:text-primary-foreground"
							on:click={() => {
								open = true;
								coll = collection;
							}}>Remove</ContextMenu.Item
						>
					</ContextMenu.Content>
				</ContextMenu.Root>
				<Accordion.Content>
					<TableWrapper {collection} {data} />
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	{/each}
{:else}
	<Accordion.Root class="px-8 py-2">
		<Accordion.Item value="placeholder">
			<Accordion.Trigger disabled>
				<Skeleton class="h-5 w-40" />
			</Accordion.Trigger>
		</Accordion.Item>
	</Accordion.Root>

	<Accordion.Root class="px-8 py-2">
		<Accordion.Item value="placeholder">
			<Accordion.Trigger disabled>
				<Skeleton class="h-5 w-48" />
			</Accordion.Trigger>
		</Accordion.Item>
	</Accordion.Root>

	<Accordion.Root class="px-8 py-2">
		<Accordion.Item value="placeholder">
			<Accordion.Trigger disabled>
				<Skeleton class="h-5 w-40" />
			</Accordion.Trigger>
		</Accordion.Item>
	</Accordion.Root>
{/if}

<AlertDialog.Root bind:open>
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
