<script lang="ts">
	import "../app.css";
	import { PUBLIC_AUTH_URL, PUBLIC_REDIR_URI, PUBLIC_APP_ID } from "$env/static/public";
	import type { LayoutServerData } from "./$types";
	import { QueryClient, QueryClientProvider } from "@sveltestack/svelte-query";
	import * as Avatar from "$lib/components/ui/avatar";
	import * as Popover from "$lib/components/ui/popover";
	import LogoutIcon from "$lib/components/icons/LogoutIcon.svelte";

	let dropdown_menu = false;

	const queryClient = new QueryClient();

	export let data: LayoutServerData;
</script>

<svelte:head>
	<title>CS2 Skin Tracker</title>

	<meta property="og:title" content="CS2 Skin Tracker" />
	<meta property="og:description" content="Site to track value of your CS2 items" />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/favicon.png" />
</svelte:head>

<div class="bg-background h-[100vh] overflow-x-hidden overflow-auto">
	<div class="h-full flex flex-col">
		<QueryClientProvider client={queryClient}>
			<header class="flex-initial">
				<nav class="bg-secondary flex justify-between items-center">
					<button class="md:hidden ml-6" on:click={() => (dropdown_menu = !dropdown_menu)}>
						{#if !dropdown_menu}
							<svg
								stroke-width="0"
								viewBox="0 0 512 512"
								height="2em"
								width="2em"
								xmlns="http://www.w3.org/2000/svg"
								><path
									class="fill-text stroke-text"
									d="M32 96v64h448V96H32zm0 128v64h448v-64H32zm0 128v64h448v-64H32z"
								/></svg
							>
						{:else}
							<svg
								stroke-width="0"
								viewBox="0 0 512 512"
								height="2em"
								width="2em"
								xmlns="http://www.w3.org/2000/svg"
								><path
									class="fill-text stroke-text"
									d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"
								/></svg
							>
						{/if}
					</button>

					<ul class="text-primary-foreground font-semibold text-lg hidden md:block">
						<li class="float-left">
							<a
								href="/inventory"
								class="inline-block text-center hover:text-primary-foreground/70 transition-all py-2 px-4 rounded ml-4"
								>Inventory</a
							>
						</li>
						<li class="float-left">
							<a
								href="/investments"
								class="inline-block text-center hover:text-primary-foreground/70 transition-all py-2 px-4 rounded"
								>Investments</a
							>
						</li>
						<li class="float-left">
							<a
								href="https://github.com/gorgbus/cs-tracker"
								target="_blank"
								class="inline-block text-center hover:text-primary-foreground/70 transition-all py-2 px-4 rounded"
							>
								Github
							</a>
						</li>
					</ul>

					{#if data.user}
						<Popover.Root>
							<Popover.Trigger class="p-4 flex">
								<Avatar.Root>
									<Avatar.Image
										src={`https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/${
											data.user.steam.avatar.slice(0, 2) || ""
										}/${data.user.steam.avatar}.jpg`}
										alt="steam-avatar"
									/>
									<Avatar.Fallback>SA</Avatar.Fallback>
								</Avatar.Root>

								<span
									class="text-primary-foreground font-semibold pl-2 text-center align-bottom flex flex-col justify-center"
								>
									{data.user.steam.username}
								</span>
							</Popover.Trigger>

							<Popover.Content class="bg-secondary border-input text-primary-foreground w-48">
								<a
									class="hover:text-destructive transition-all w-full group flex items-center justify-between"
									href="/logout">Logout <LogoutIcon /></a
								>
							</Popover.Content>
						</Popover.Root>
					{:else}
						<a
							class="inline-block align-top p-4"
							href={`${PUBLIC_AUTH_URL}/api/auth/steam/${PUBLIC_APP_ID}/?redirect_uri=${PUBLIC_REDIR_URI}`}
						>
							<img
								src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_01.png"
								alt="steam-login"
							/>
						</a>
					{/if}
				</nav>
			</header>

			<slot />
		</QueryClientProvider>
	</div>
</div>
