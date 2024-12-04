<script lang="ts">
	import { collection, query, getDocs } from 'firebase/firestore'
	import { sharedState } from '$lib/sharedState.svelte'
</script>

<h1>Welcome to the African Descendent Legacy Journal Project</h1>

{#if sharedState.user.name.length > 0}
	<p>Welcome, {sharedState.user.name}!</p>
{:else}
	<p>Please log in using your Google Account</p>
{/if}
