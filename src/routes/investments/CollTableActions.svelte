<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import * as AlertDialog from "$lib/components/ui/alert-dialog";
	import { Button } from "$lib/components/ui/button";
	import { MoreHorizontal } from "lucide-svelte";
	import { axios_client } from "$lib";
	import { useQueryClient } from "@sveltestack/svelte-query";

	export let id: number;
	export let name: string;
	export let col_id: number;

	let open = false;

	const query_client = useQueryClient();

	const remove_item = async () => {
		try {
			await axios_client.delete(`/api/investment/${id}`);

			await query_client.invalidateQueries({
				queryKey: ["investments", col_id]
			});
		} catch (err) {
			console.error(err);
		}
	};
</script>

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
			<DropdownMenu.Item>Update</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			class="text-red-500 data-[highlighted]:bg-red-500 data-[highlighted]:text-primary-foreground"
			on:click={() => (open = !open)}>Remove</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<AlertDialog.Root {open} onOpenChange={(o) => (open = o ? o : false)}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure?</AlertDialog.Title>
			<AlertDialog.Description>
				This action will remove <strong>{name}</strong> from this collection
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action on:click={remove_item}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
