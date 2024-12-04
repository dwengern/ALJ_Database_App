<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { doc, addDoc, getDoc, getDocs, updateDoc, arrayUnion, collection, onSnapshot } from 'firebase/firestore';
    import { sharedState } from '$lib/sharedState.svelte';
    import type { Community } from '$lib/community-type';

    let { db, auth } = sharedState

    let isSignedIn: boolean
    let communities = writable<Community[]>([])
    let activeCommunity = writable<Community | null>(null)
    let currentView: 'form' | 'community' | 'default' = 'default'

    let continentOfOrigin: string
    let countryOfOrigin: string 
    let tribalNation: string
    let name: string = ''
    let users: string[] = []
    let commonAncestors: string[] = []  
    let content: string = ''

    $: isSignedIn = signedIn()

    function signedIn(): boolean { 
        return sharedState.user.uid !== ''
    }

    onMount(() => {
        const commCollection = collection(sharedState.db!, 'communities')

        const unsubscribe = onSnapshot(commCollection, (snapshot) => { 
            const updated = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})) as Community[] 
            communities.set(updated)       
        })
        
        return () => unsubscribe()
    })
    
    /*function createCommunity() { 
        /*if (isSignedIn) { 
            window.prompt('got it!')
        } else { 
            window.prompt('You need to be signed in to do this.')
        }

        if (continentOfOrigin && name) { 
            users.push(sharedState.user.uid)
            const comm: Community = {continentOfOrigin, countryOfOrigin, tribalNation, name, users, commonAncestors}
            communities.update(cur => [...cur, comm])

            resetInput()
            currentView = 'community'
            
        } else { 
            window.alert('You at least need to enter the community name and continent.')
        }
    }*/

    async function createCommunity() { 
        if (!continentOfOrigin || !name) { 
            window.alert('You need to provide at least a community name and continent.')
            return
        }

        try { 
            const newCommunity = {name, continentOfOrigin, countryOfOrigin, tribalNation, users: [sharedState.user.uid], commonAncestors}
            const docRef = await addDoc(collection(sharedState.db!, 'communities'), newCommunity)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) { 
                const created = {id: docSnap.id, ...docSnap.data()}
                activeCommunity.set(created as Community)
                currentView = 'community'
            }

            resetInput()
        } catch (err) { 
            console.error('Error creating community: ', err)
            window.alert('Something went wrong. Please try again')
        }

        resetInput()
    }

    function viewCommunity(commId?: string ) { 
        if (commId) { 
            const commDoc = doc(sharedState.db!, 'communities', commId)

            const unsubscribe = onSnapshot(commDoc, (docSnap) => { 
                if (docSnap.exists()) { 
                    activeCommunity.set({id: docSnap.id, ...docSnap.data()} as Community)
                    currentView = 'community'
                } else { 
                    console.log('No such community')
                }
            })

            return () => unsubscribe()
        } else { 
            window.alert('Error in viewing community')
        }       
        
    }

    const addEntry = (content: string) => {
        if (content.trim()) {
            commonAncestors = [...commonAncestors, content]
            resetContent();
        } else {
            window.alert('Ancestor name cannot be empty.');
        }
    }

    const deleteEntry = (an: string) => { 
        const index = commonAncestors.indexOf(an)

        if (index > -1) { 
            commonAncestors.splice(index, 1)
            commonAncestors = [...commonAncestors]
        }
    }

    const resetInput = () => {
        content = '';
        countryOfOrigin = '';
        continentOfOrigin = '';
        tribalNation = '';
        name = '';
        commonAncestors = [];
    }

    const resetContent = () => {
        content = '';
    }

    const showForm = () => { 
        if (currentView === 'form') { 
            currentView = 'default'
        } else { 
            currentView = 'form'
        }
    }
</script>

<div class="grid">
    <div class="list">
        <button class="add-comm" on:click={showForm}>Create New Community</button>
        <div id="comm-list" class="comm-list">
            {#each $communities as comm (comm.id)}
                <button on:click = {() => viewCommunity(comm.id)}>{comm.name}</button>
            {/each}
        </div>
    </div>

    <div class="content">
        {#if currentView === 'form'}
            <div class="new-comm-form">
                <label>
                    Name of the Community: 
                    <input type="text" bind:value={name}>
                </label>

                <label>
                    Continent of Origin: 
                    <input type="text" bind:value={continentOfOrigin}>
                </label>

                <label>
                    Country of Origin: 
                    <input type="text" bind:value={countryOfOrigin}>
                </label>

                <label>
                    Tribe: 
                    <input type="text" bind:value={tribalNation}>
                </label>

                <label>
                    Names of Common Ancestors:
                    <input type="text" id="ancestorInput" bind:value={content}> 
                    <button on:click={() => addEntry(content)}>Add New</button>
                </label>

                <div id="ancestors">
                    {#each commonAncestors as ancestor}
                        <div>
                            <p>{ancestor}</p>
                            <button on:click={() => deleteEntry(ancestor)}>X</button>
                        </div>
                    {/each}
                </div>

                <button on:click={createCommunity}>submit</button>
            </div>
        {/if}

        {#if currentView === 'default'}
            <div>
                <h1>Default page</h1>
            </div>
        {/if}

        <div id="comm-info">
            {#if $activeCommunity && currentView === 'community'}
                <h2>{$activeCommunity.name}</h2>
                <p>Continent: {$activeCommunity.continentOfOrigin}</p>
                <p>Country: {$activeCommunity.countryOfOrigin}</p>
                <p>Tribe: {$activeCommunity.tribalNation}</p>
                <h3>Common Ancestors:</h3>
                <ul>
                    {#each $activeCommunity.commonAncestors as ancestor}
                        <li>{ancestor}</li>
                    {/each}
                </ul>
            {/if}
        </div>
    </div>
</div>

<style> 
    * { 
        box-sizing: border-box; 
        padding: 0;
        margin: 0; 
    }

    .grid { 
        display: grid; 
        grid-template-columns: 1fr 4fr; 
        gap: 10px; 
    }

    .content { 
        background-color: green; 
    }

    .add-comm { 
        width: 100%; 
        background-color: white; 
        border: none; 
        height: 30px; 
    }

    .add-comm:hover { 
        background-color: red; 
    }

    .add-comm:active { 
        background-color: pink; 
    }

    .new-comm-form { 
        display: flex; 
        flex-direction: column; 
    }

    .comm-list {
        display: flex; 
        --button-hover-bg: darkblue; 
    }

    

</style>
I want to replace the store and use the firebase to store and use data instead. How would I go about doing that?

