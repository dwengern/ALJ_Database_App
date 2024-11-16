
<script lang=ts>
import 	{ sharedState, updateUser } from '$lib/sharedState.svelte';
import { NullUser } from '$lib/user-types';

</script>

{#if sharedState.user.name.length > 0}
	<p>Welcome, {sharedState.user.name}!</p>
    <h2>Profile Details</h2>
<p>Email:{sharedState.user.email}</p>
<p>Bio:{sharedState.user.bio}</p>
<img src={sharedState.user.photoURL} alt="User profile" />
{:else}
	<p>No user</p>
{/if}

