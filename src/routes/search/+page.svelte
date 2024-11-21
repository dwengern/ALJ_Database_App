<script lang="ts">
	import { writable } from 'svelte/store';
	import { searchShipByName } from '$lib/search-feature';
	import type { Voyage } from '$lib/voyage-type';

	let searchQuery = '';
	let searchResults = writable<Voyage[] | null>(null);
	let loading = writable(false);
	let errorMessage = writable('');

	$: {
		if (searchQuery.trim()) {
			loading.set(true);
			errorMessage.set('');
			searchShipByName(searchQuery.trim())
				.then((results) => {
					const filteredResults = results?.filter((ship) =>
						ship.SHIPNAME.toLowerCase().startsWith(searchQuery.trim().toLowerCase())
					) || [];

					if (filteredResults.length === 0) {
						searchResults.set(null);
						errorMessage.set(`No ship found with the name "${searchQuery}".`);
					} else {
						searchResults.set(filteredResults);
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

	.results-table th, .results-table td {
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
					<th>Ship Name</th>
					<th>Captain</th>
					<th>Departure Date</th>
					<th>Arrival Port</th>
				</tr>
			</thead>
			<tbody>
				{#each $searchResults as ship}
					<tr>
						<td>{ship.SHIPNAME}</td>
						<td>{ship.CAPTAINA}</td>
						<td>{ship.DATEDEP}</td>
						<td>{ship.ARRPORT}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="alert-message">No results found for "{searchQuery}"</p>
	{/if}
</div>
