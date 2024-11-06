
<h1>Edit my Profile</h1>

<script lang="ts">
	import { callSignInWithPopup, callSignOut } from '$lib/sign-in-popup';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { browser } from '$app/environment';
	import 	{ sharedState, updateUser } from '$lib/sharedState.svelte';
    import { NullUser } from '$lib/user-types';
    import { loadApp } from '$lib/firebase-client';

       // Function to handle name change
       function handleNameChange(event: Event) {
        

        const form = event.target as HTMLFormElement;
        const newName = (form.querySelector('#username') as HTMLInputElement).value;

        // Update sharedState's user name
        if (newName) {
            sharedState.user.name = newName;
            updateUser(sharedState.user); // Optionally call a function to persist this change
        }
    }

</script>



<h2>Profile Details</h2>
<p>Name:{sharedState.user.name}</p>
<p>Email:{sharedState.user.email}</p>
<img src={sharedState.user.photoURL} alt="User profile image" />
<p>Community Name</p>


<!--CHange this to something for a profile that we would actually change-->
<h2>Change Name</h2>
<form on:submit={handleNameChange}>
  <label for="username">New name:</label>
  <input type="text" id="username" name="username" required>
  <button type="submit">Submit</button>
</form>