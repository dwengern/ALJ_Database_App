<script lang="ts">
    import {loadApp} from "$lib/firebase-client"
    import type {User} from "$lib/user-types"
    import {NullUser} from "$lib/user-types"
    import { browser } from '$app/environment';
    import {callSignInWithPopup} from "$lib/sign-in-popup"
    import { collection, query, where, getDocs } from "firebase/firestore";

    let user:User = $state(NullUser)
    let db:any = null
    let app:any = null
    let analytics:any = null

    function doLogin() {
        callSignInWithPopup()
    }

    function doLogout() {
        console.log("logout")
    }

    async function doDumpData() {
        const q = query(collection(db, "institutions"));
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data())
        })
    }

    if (browser) {
        const load = loadApp()
        app = load.app
        db = load.db
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
    <button onclick={doDumpData}>Dump Data</button>

{/if}