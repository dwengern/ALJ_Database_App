<script lang="ts">
    import { onMount } from 'svelte'
    import { writable } from 'svelte/store'
    import { fetchCommunities, addCommunity, subscribeToCommunities, fetchCommunityById, deleteCommunityById } from '$lib/db-utils';
    import { showAlert } from '$lib/browser-utils'
    import { sharedState } from '$lib/sharedState.svelte'
    import type { Community } from '$lib/community-type'

    let { db, auth } = sharedState

    let isSignedIn: boolean
    let communities = writable<Community[]>([])
    let activeCommunity = writable<Community | null>(null)
    let loading = writable(true)
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
        let unsubscribe: (() => void) | undefined;

        try { 
            const unsubscribe = subscribeToCommunities((updated) => { 
                communities.set(updated)
                loading.set(false)
            })     
        } catch (err) { 
            console.error('Error when mounting: ', err)
        }

        return () => { 
            if (unsubscribe) unsubscribe()  
        }
    })
    
    async function createCommunity() { 
        if (!continentOfOrigin || !name) { 
            console.error('You need to provide at least a community name and continent.')
            return
        }

        try {             
            const newCommunity = {name, continentOfOrigin, countryOfOrigin, tribalNation, users: [sharedState.user.uid], commonAncestors}
            await addCommunity(newCommunity)

            resetInput()
        } catch (err) { 
            console.error('Error creating community: ', err)
        }
    }

    async function viewCommunity(commId?: string ) { 
        try { 
            if (!commId) { 
                console.error('Not a valid doc id')
                return 
            }

            const community = await fetchCommunityById(commId)
            if (community) { 
                activeCommunity.set(community)
                currentView = 'community'
            }    
            
        } catch (err) { 
            console.error('Error creating community: ', err)
        }
    }

    async function deleteCommunity(commId?: string) { 
        try { 
            if (!commId) { 
                console.error('Not a valid doc id')
                return 
            }
            
            await deleteCommunityById(commId)

            currentView = 'default'
        } catch (err) { 
            console.error('Error deleting community: ', err)
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

            {#if $loading} 
                <p>Loading...</p>
            {/if}

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

                <button on:click={() => deleteCommunity($activeCommunity.id)}>Delete</button>
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
        flex-direction: column;
    }

</style>
