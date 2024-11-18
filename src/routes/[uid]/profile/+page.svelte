<script lang="ts">
	import { sharedState, updateUser } from '$lib/sharedState.svelte';
	import { NullUser } from '$lib/user-types';
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
</style>

{#if sharedState.user.name.length > 0}
<div class="center-container">
  <h2>Profile Details</h2>
  <hr>
  <img src={sharedState.user.photoURL} alt="User profile" />
  <p><strong>{sharedState.user.name}</strong></p>
  <p><strong>Email:</strong> {sharedState.user.email}</p>
  <p><strong>Bio:</strong> {sharedState.user.bio}</p>
</div>
{:else}
<div class="center-container">
  <p>No user</p>
</div>
{/if}


