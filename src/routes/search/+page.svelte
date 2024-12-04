<script lang="ts">
	import { writable } from 'svelte/store';
	import { collection, query, where, getDocs } from 'firebase/firestore';
	import { sharedState } from '$lib/sharedState.svelte';

	let { db, auth } = sharedState;

	let searchQuery = '';
	let searchResults = writable<any[] | null>(null);
	let loading = writable(false);
	let errorMessage = writable('');

	$: {
		if (searchQuery.trim()) {
			loading.set(true);
			errorMessage.set('');
			searchChatsByShipName(searchQuery.trim())
				.then((results) => {
					if (results.length === 0) {
						searchResults.set(null);
						errorMessage.set(`No conversations found for ship "${searchQuery}".`);
					} else {
						searchResults.set(results);
						errorMessage.set('');
					}
				})
				.catch((error) => {
					console.error(error);
					errorMessage.set('An error occurred while searching. Please try again.');
					searchResults.set(null);
				})
				.finally(() => {
					loading.set(false);
				});
		} else {
			searchResults.set(null);
			errorMessage.set('');
		}
	}

	async function searchChatsByShipName(shipName: string) {
		if (!db) return [];

		const chatsRef = collection(db, 'chats');
		const q = query(chatsRef, where('shipName', '==', shipName));
		const querySnapshot = await getDocs(q);
		const chats = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));

		return chats;
	}
</script>

<style>
	.search-container {
		margin-bottom: 1.5rem;
		padding-top: 2rem;
		text-align: center;
	}

	.search-form {
		display: inline-flex;
		gap: 0.5rem;
	}

	.search-input {
		width: 300px;
		padding: 0.5rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.search-button {
		padding: 0.5rem 1rem;
		background-color: #007bff;
		color: #fff;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	.search-button:hover {
		background-color: #0056b3;
	}

	.results-container {
		margin-top: 2rem;
		padding: 1rem;
		text-align: center;
	}

	.results-table {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		border-collapse: collapse;
		margin-top: 1rem;
		margin-bottom: 2rem;
	}

	.results-table th,
	.results-table td {
		padding: 0.75rem;
		text-align: left;
		border: 1px solid #ddd;
	}

	.results-table th {
		background-color: #f8f9fa;
	}

	.alert-message {
		color: #dc3545;
		font-weight: bold;
		margin-top: 1rem;
	}

	.results-count {
		font-weight: bold;
		margin-top: 1rem;
	}
</style>

<div class="search-container">
	<form class="search-form" on:submit|preventDefault>
		<input
			type="text"
			id="query"
			class="search-input"
			placeholder="Enter ship name..."
			bind:value={searchQuery}
		/>
		<button type="submit" class="search-button">Search</button>
	</form>
</div>

<div class="results-container">
	<h2>Search Results for "{searchQuery}"</h2>

	{#if $loading}
		<p class="alert-message">Searching...</p>
	{:else if $errorMessage}
		<p class="alert-message">{$errorMessage}</p>
	{:else if $searchResults}
		<p class="results-count">{$searchResults.length} result(s) found</p>
		<table class="results-table">
			<thead>
				<tr>
					<th>Chat Name</th>
					<th>Ship Name</th>
					<th>Description</th>
					<th>Participants</th>
				</tr>
			</thead>
			<tbody>
				{#each $searchResults as chat}
					<tr>
						<td>{chat.name}</td>
						<td>{chat.shipName}</td>
						<td>{chat.description}</td>
						<td>{chat.participants?.join(', ') || 'None'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="alert-message">No results found for "{searchQuery}"</p>
	{/if}
</div>

