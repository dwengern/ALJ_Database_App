<script lang="ts">
	import { callSignInWithPopup, callSignOut } from '$lib/sign-in-popup'
	import { getAuth, onAuthStateChanged } from 'firebase/auth'
	import { browser } from '$app/environment'
	import { sharedState, updateUser } from '$lib/sharedState.svelte'
	import { NullUser } from '$lib/user-types'
	import { loadApp } from '$lib/firebase-client'
	import { doc, getDoc } from 'firebase/firestore'
	import Navbar from '$lib/Navbar.svelte';
    import Footer from '$lib/Footer.svelte';

	let { children } = $props()

	function doLogin() {
		if (!sharedState!.auth) {
			console.log('No auth object')
			return
		}
		callSignInWithPopup(sharedState!.auth)
	}

	function doLogout() {
		if (!sharedState!.auth) {
			console.log('No auth object')
			return
		}
		callSignOut(sharedState.auth)
	}

	if (browser) {
		console.log('Layout running in browser')
		$effect(() => {
			console.log('Layout effect')
			if (!sharedState.db) {
				const { db } = loadApp()
				sharedState.db = db
				sharedState.auth = getAuth()
				onAuthStateChanged(sharedState.auth, (user) => {
					console.log('User auth has changed...')
					if (user) {
						let g_user = {
							name: user.displayName!,
							email: user.email!,
							photoURL: user.photoURL!,
							uid: user.uid!
						} as any
						sharedState.user = g_user
						const docRef = doc(db, 'users', g_user.uid)
						const docSnap = getDoc(docRef)
							.then((doc) => {
								if (doc.exists()) {
									console.log('Document data:', doc.data())
									g_user.bio = doc.data().Bio
									g_user.interest = doc.data().interest
									g_user.institution = doc.data().institution
									console.log('User is logged in:', g_user)
									updateUser({
										name: user.displayName!,
										email: user.email!,
										photoURL: user.photoURL!,
										uid: user.uid!,
										bio: g_user.bio,
										interest: g_user.interest,
										institution: g_user.institution
									})
								} else {
									console.log('No such document!')
								}
							})
							.catch((error) => {
								console.log('Error getting document:', error)
							})
					} else {
						updateUser(NullUser)
					}
				})
			}
		})
	}
</script>

<Navbar />
{@render children()}
<Footer />
