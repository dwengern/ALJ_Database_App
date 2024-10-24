<script lang="ts">
    import {loadApp} from "$lib/firebase-client"
    import type {User} from "$lib/user-types"
    import {NullUser} from "$lib/user-types"
    import { browser } from '$app/environment';
    import {callSignInWithPopup, callSignOut} from "$lib/sign-in-popup"
    import { collection, query, getDocs } from "firebase/firestore";

    let user:User = $state(NullUser)
    let db:any = null
    let data:string[] = $state([])

    function doLogin() {
        callSignInWithPopup(updateUser)
    }

    function updateUser({name, email, photoURL}:User):void{
        user = {name, email, photoURL}
    }

    function doLogout() {
        callSignOut(updateUser)
    }

    async function doDumpData() {
        // example of getting documents from a collection
        const q = query(collection(db, "institutions")); 
        // get all the documents from the institutions collection
        const querySnapshot = await getDocs(q)
        clearData()
        querySnapshot.forEach((doc) => {
          data.push(`key = ${doc.id}, value => ${JSON.stringify(doc.data())}`)
        })
    }

    function clearData() {
        data = []
    }

    if (browser) {
        ({db} = loadApp())
    }

</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<p>This is an update to the main page. 10/24 7:08 am</p>

{#if browser}
    {#if user.name.length==0}
        <button onclick = {doLogin}>Google</button>
    {:else}
        <p> User is Name:"{user.name}" with Email:"{user.email}" 
            <br/>
            <img alt="user thumb" src="{user.photoURL}"/></p>
        <button onclick={doLogout}>Logout</button>
    {/if}
    <button onclick={doDumpData}>Dump Data</button>
    <button onclick={clearData}>Clear Data</button>
{/if}

<p></p>
<br/>

{#if data.length>0}
{#each data as dataItem,i}
<p>{dataItem}</p>
{/each}
{:else}
No data yet...
{/if}
