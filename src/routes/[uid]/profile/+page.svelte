<script lang="ts">
	import { sharedState } from '$lib/sharedState.svelte';
	import { collection, getDocs, query, where, CollectionReference } from "firebase/firestore";
	import type { User } from '$lib/user-types';

	let searchName = ''; // Bind this to the input field for searching
	let userResult: User | null = null; // Store the found user data
	let errorMessage: string | null = null;


  
	// Search for a user by name
	async function searchUserByName(userName: string): Promise<void> {
		try {
			// Clear previous results
			userResult = null;
			errorMessage = null;

			// Access the Firestore "users" collection
			const usersCollectionRef = collection(sharedState.db!, 'users') as CollectionReference<User>;
			const q = query(usersCollectionRef, where("name", "==", userName));
			const querySnapshot = await getDocs(q);

			// Check if a user is found
			if (querySnapshot.empty) {
				errorMessage = `No user found with the name "${userName}".`;
				return;
			}

			// Assuming we only care about the first match
			userResult = querySnapshot.docs[0].data();
		} catch (error) {
			console.error("Error searching for user: ", error);
			errorMessage = "An error occurred while searching for the user.";
		}
	}
</script>

<style>
	/* Add some basic styling */
	.form-container {
		margin: 20px;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 5px;
	}

	.result-container {
		margin-top: 20px;
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 5px;
		background-color: #f9f9f9;
	}

	.error-message {
		color: red;
		margin-top: 10px;
	}
</style>

<div class="form-container">
	<h2>Search for a  User</h2>
	<form on:submit|preventDefault={() => searchUserByName(searchName)}>
		<label for="userName">Enter User Name:</label>
		<input
			type="text"
			id="userName"
			bind:value={searchName}
			placeholder="Enter the name of the user"
			required
		/>
		<button type="submit">Search</button>
	</form>

	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{/if}
</div>

{#if userResult}
	<div class="result-container">
		<h3>User Profile</h3>
		<p><strong>Name:</strong> {userResult.name}</p>
		<p><strong>Email:</strong> {userResult.email}</p>
		<p><strong>Institution:</strong> {userResult.institution}</p>
		<p><strong>Interest:</strong> {userResult.interest}</p>
		<p><strong>Bio:</strong> {userResult.bio}</p>
	</div>
{/if}


