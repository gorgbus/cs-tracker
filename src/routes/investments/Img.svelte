<script lang="ts">
	import { PUBLIC_API_URL } from "$env/static/public";

	export let market_hash_name: string;
</script>

<img class="w-24 h-[72px]" src={`${PUBLIC_API_URL}/api/icon/${market_hash_name}`} alt="item-icon" />
