
<script lang="ts">
	import { browser } from '$app/environment';
	import 	{ sharedState, updateUser } from '$lib/sharedState.svelte';
    import { doc, setDoc } from "firebase/firestore";
   
	if (browser) {
		console.log("Shared state in editmyprofile:", sharedState);
	}

     	// Function to handle name change
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
					// You can include other fields here if you want to update them as well
				}, { merge: true });
				console.log("Bio updated in Firestore successfully");
			} catch (error) {
				console.error("Error updating bio in Firestore:", error);
			}
		}
	}



</script>


{#if sharedState.user.name.length > 0}
<h1>Edit my Profile</h1>
<h2>Profile Details</h2>
<p>Name:{sharedState.user.name}</p>
<p>Email:{sharedState.user.email}</p>
<img src={sharedState.user.photoURL} alt="User profile" />
<p>uid:{sharedState.user.uid}</p>
<p>bio:{sharedState.user.bio}</p>


<!--Change this to something for a profile that we would actually change unlike name, name is recieved from google sign in,
so it is constantly re updated-->
<h2>Create/Change Bio</h2>
<form on:submit={handleNameChange}>
  <label for="bio">New bio:</label>
  <input type="text" id="bio" name="bio" required>
  <button type="submit">Submit</button>
</form>

{:else}
	<h1>Not signed in</h1>
{/if}