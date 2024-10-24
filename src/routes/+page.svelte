<script lang="ts">
    import {loadApp} from "$lib/firebase-client"
    import type {User} from "$lib/user-types"
    import {NullUser} from "$lib/user-types"
    import { browser } from '$app/environment';

    let user:User = $state(NullUser)

    function doLogin() {
        console.log("login")
    }

    function doLogout() {
        console.log("logout")
    }

    if (browser) {
        const {app, analytics} = loadApp()
        console.log("We have app")
    }

</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<p>This is an update to the main page. 10/24 7:08 am</p>

<p> User is Name:"{user.name}" with Email:"{user.email}"</p>

{#if browser}
    {#if user.name.length==0}
        <button onclick = {doLogin}>Google</button>
    {:else}
        <button onclick={doLogout}>Logout</button>
    {/if}

{/if}