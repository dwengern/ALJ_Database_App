<script lang="ts">
	import { collection, query, getDocs } from 'firebase/firestore';
	import {sharedState} from '$lib/sharedState.svelte';

	let data: any[] = [];

	async function doDumpData() {
		// example of getting documents from a collection
		if (!sharedState.db) {
			console.log('No db object');
			return;
		}
		const q = query(collection(sharedState.db, 'institutions'));
		// get all the documents from the institutions collection
		const querySnapshot = await getDocs(q);
		clearData();
		querySnapshot.forEach((doc) => {
			data.push(`key = ${doc.id}, value => ${JSON.stringify(doc.data())}`);
		});
	}

	function clearData() {
		data = [];
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

{#if sharedState.user.name.length > 0}
	<p>Welcome, {sharedState.user.name}!</p>
{:else}
	<p>No user logged in</p>
{/if}

<p>This is an update to the main page. 10/24 7:08 am</p>

<button onclick={doDumpData}>Dump Data</button>
<button onclick={clearData}>Clear Data</button>

<p></p>
<br />

{#if data.length > 0}
	{#each data as dataItem, i}
		<p>{dataItem}</p>
	{/each}
{:else}
	No data yet...
{/if}
