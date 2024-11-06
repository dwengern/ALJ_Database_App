
<script lang=ts>
import 	{ sharedState, updateUser } from '$lib/sharedState.svelte';
import { NullUser } from '$lib/user-types';

</script>
<h1>{sharedState.user.name} User Profile</h1>

<h2>Profile Details</h2>
<p>Name:{sharedState.user.name}</p>
<p>Email:{sharedState.user.email}</p>
<img src={sharedState.user.photoURL} alt="User profile image" />

