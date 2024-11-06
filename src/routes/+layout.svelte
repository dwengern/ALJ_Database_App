
<script lang="ts">
	import { browser } from '$app/environment';
	import 	{ sharedState, updateUser } from '$lib/sharedState.svelte';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { loadApp } from '$lib/firebase-client';
    import { NullUser } from '$lib/user-types';

    import Navbar from '$lib/Navbar.svelte';
    import Footer from '$lib/Footer.svelte';
    let { children } = $props();

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
                        updateUser({ name: user.displayName!, email: user.email!, photoURL: user.photoURL! });
                    } else {
                        updateUser(NullUser);
                    }
                })
            }
        })
    }
</script>

<Navbar />
{@render children()}
<Footer />
