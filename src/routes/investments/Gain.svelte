<script lang="ts">
	export let value: string;
	export let profit: boolean;
</script>

<span class={profit ? "text-green-500" : "text-red-500"}>{value}</span>
