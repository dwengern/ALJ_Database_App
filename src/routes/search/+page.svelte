<script lang="ts">
	import { onMount } from 'svelte'
	import { searchShipByName } from '$lib/search-feature'
	import type { Voyage } from '$lib/voyage-type'

	let searchQuery = ''
	let searchResults: Voyage[] | null = null
	let loading = false
	let errorMessage = ''

	async function handleSearch() {
		if (!searchQuery.trim()) return
		loading = true
		errorMessage = ''
		try {
			searchResults = await searchShipByName(searchQuery.trim())
			if (!searchResults) {
				errorMessage = `No ship found with the name "${searchQuery}".`
			}
		} catch (error) {
			errorMessage = 'Error searching for ship. Please try again.'
			console.error(error)
		} finally {
			loading = false
		}
	}
</script>

<h1>Search</h1>
<input type="text" id="dbSearchBar" placeholder="Search" bind:value={searchQuery} />
<button on:click={handleSearch} disabled={loading}>
	{loading ? 'Searching...' : 'Search'}
</button>

{#if errorMessage}
	<p>{errorMessage}</p>
{/if}

{#if searchResults}
	<ul>
		{#each searchResults as ship}
			<li>
				<ul>
					{#each Object.entries(ship).sort( ([keyA], [keyB]) => keyA.localeCompare(keyB) ) as [key, value]}
						<li><strong>{key}:</strong> {value}</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
{/if}
