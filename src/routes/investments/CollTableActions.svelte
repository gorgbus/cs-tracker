<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { MoreHorizontal } from "lucide-svelte";
	import { axios_client } from "$lib";
	import { useQueryClient } from "@sveltestack/svelte-query";
	import type { PageData } from "./$types";
	import EditInvestmentForm from "./forms/EditInvestmentForm.svelte";
	import type { InvestmentType } from "./investment";
	import { superForm } from "sveltekit-superforms/client";

	export let investment: InvestmentType;

	let open_remove = false;

	const query_client = useQueryClient();

	const remove_item = async () => {
		try {
			await axios_client.delete(`/api/investment/${investment.inv_id}`);

			await query_client.invalidateQueries({
				queryKey: ["investments", investment.collection]
			});
		} catch (err) {
			console.error(err);
		}
	};

	export let data: PageData;

	const { message } = superForm(data.inv_edit_form);

	$: if ($message?.type === "success") {
		(async () => {
			await query_client.invalidateQueries({
				queryKey: ["investments", investment.collection]
			});

			$message = undefined;
		})();
	}
</script>

<AlertDialog.Root bind:open={open_remove}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action will remove <strong>{investment.item}</strong> from this collection
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action on:click={remove_item}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<Dialog.Root open={data.inv_edit_form.posted && false}>
	<DropdownMenu.Root>
		<DropdownMenu.Trigger asChild let:builder>
			<Button variant="ghost" builders={[builder]} size="icon" class="relative w-8 h-8 p-0">
				<span class="sr-only">Open menu</span>
				<MoreHorizontal class="w-4 h-4" />
			</Button>
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Actions</DropdownMenu.Label>
				<Dialog.Trigger class="w-full">
					<DropdownMenu.Item>Edit</DropdownMenu.Item>
				</Dialog.Trigger>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Item
				class="text-red-500 data-[highlighted]:bg-red-500 data-[highlighted]:text-primary-foreground"
				on:click={() => (open_remove = true)}>Remove</DropdownMenu.Item
			>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<Dialog.Content class="border-input">
		<Dialog.Header>
			<Dialog.Title>Edit investment</Dialog.Title>
			<Dialog.Description>Edit <strong>{investment.item}</strong></Dialog.Description>
		</Dialog.Header>

		<EditInvestmentForm form={data.inv_edit_form} {investment} />
	</Dialog.Content>
</Dialog.Root>
