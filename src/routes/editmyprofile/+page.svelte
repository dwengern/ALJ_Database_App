<script lang="ts">
	import { browser } from '$app/environment';
	import { sharedState, updateUser } from '$lib/sharedState.svelte';
    import { doc, setDoc } from "firebase/firestore";

	if (browser) {
		console.log("Shared state in editmyprofile:", sharedState);
	}

	// Function to handle bio change
	async function handleNameChange(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const bio = (form.querySelector('#bio') as HTMLInputElement).value;

		// Update sharedState's bio
		if (bio && sharedState.user.uid) {
			sharedState.user.bio = bio;
			// Save the bio to Firestore
			if (!sharedState.db) {
				console.error("Firestore database not initialized");
				return;
			}
			try {
				await setDoc(doc(sharedState.db, "users", sharedState.user.uid), {
					Bio: bio,
				}, { merge: true });
				console.log("Bio updated in Firestore successfully");
			} catch (error) {
				console.error("Error updating bio in Firestore:", error);
			}
		}
	}

  // Function to handle interest change
	async function handleInterestChange(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const interest = (form.querySelector('#interest') as HTMLInputElement).value;

		// Update sharedState's interest
		if (interest && sharedState.user.uid) {
			sharedState.user.interest = interest;
			// Save the interest to Firestore
			if (!sharedState.db) {
				console.error("Firestore database not initialized");
				return;
			}
			try {
				await setDoc(doc(sharedState.db, "users", sharedState.user.uid), {
					interest: interest,
				}, { merge: true });
				console.log("interest updated in Firestore successfully");
			} catch (error) {
				console.error("Error updating bio in Firestore:", error);
			}
		}
	}
</script>

<style>
  .center-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 0 auto;
    padding: 20px;
    max-width: 600px;
    border: 1px solid #ccc; /* Optional: Add a border */
    border-radius: 10px;    /* Optional: Rounded corners */
    background-color: #f9f9f9; /* Optional: Light background */
  }
  img {
    max-width: 100px; /* Limit profile picture size */
    border-radius: 50%; /* Make it circular */
  }
  hr {
    width: 80%;
    margin: 20px 0;
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  input {
    margin: 10px 0;
    padding: 5px;
    width: 100%;
    max-width: 400px;
  }
  button {
    padding: 10px 20px;
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
</style>

{#if sharedState.user.name.length > 0}
<div class="center-container">
  <h1>Edit my Profile</h1>
  <h2>Profile Details</h2>
  <hr>
  <p><strong>Name:</strong> {sharedState.user.name}</p>
  <p><strong>Email:</strong> {sharedState.user.email}</p>
  <img src={sharedState.user.photoURL} alt="User profile" />
  <p><strong>Bio:</strong> {sharedState.user.bio}</p>
  <hr>
  <h3>Create/Change Bio</h3>
  <form on:submit={handleNameChange}>
    <label for="bio">New bio:</label>
    <input
      type="text"
      id="bio"
      name="bio"
      required
      value={sharedState.user.bio || ''}
    >
    <button type="submit">Submit</button>
  </form>
  <h3>Research Interests</h3>
  <form on:submit={handleInterestChange}>
    <label for="interest">add interests:</label>
    <input
      type="text"
      id="interest"
      name="interest"
      required
      value={sharedState.user.interest || ''}
    >
    <button type="submit">Submit</button>
  </form>
</div>
{:else}
<h1>Not signed in</h1>
{/if}
