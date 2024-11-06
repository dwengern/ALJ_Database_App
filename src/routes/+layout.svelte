
<script lang="ts">
	import { callSignInWithPopup, callSignOut } from '$lib/sign-in-popup';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { browser } from '$app/environment';
	import 	{ sharedState, updateUser } from '$lib/sharedState.svelte';
    import { NullUser } from '$lib/user-types';
    import { loadApp } from '$lib/firebase-client';

	let { children } = $props();

	function doLogin() {
        if (!sharedState!.auth) {
            console.log('No auth object');
            return;
        }
		callSignInWithPopup(sharedState!.auth);
	}

	function doLogout() {
        if (!sharedState!.auth) {
            console.log('No auth object');
            return;
        }
		callSignOut(sharedState.auth);
	}

	if (browser) {
        console.log("Layout running in browser")
        $effect(() => {
            console.log("Layout effect");
            if (!sharedState.db) {
                const { db } = loadApp();
                sharedState.db = db;
                sharedState.auth = getAuth();
                onAuthStateChanged(sharedState.auth, (user) => {
                    console.log('User auth has changed...');
                    if (user) {
                        updateUser({ name: user.displayName!, email: user.email!, photoURL: user.photoURL!,uid: user.uid!});
                    } else {
                        updateUser(NullUser);
                    }
                })
            }
        })
    }
</script>

<nav>
	<a href="/">
		Home
	</a>

	<a href="/search">
		Search
	</a>

    <a href="/editmyprofile">
		Edit My Profile
	</a>

    {#if browser}
        {#if sharedState.user.name.length == 0}
            <a href="#top" onclick={doLogin}>Sign In</a>
        {:else}
            (signed in as {sharedState.user.name})<a href="#top" onclick={doLogout}>Sign Out</a>
        {/if}
	{:else}
		No browser
    {/if}
</nav>

{@render children()}
