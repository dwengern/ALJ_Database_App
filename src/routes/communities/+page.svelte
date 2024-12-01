<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { doc, addDoc, getDoc, updateDoc, arrayUnion, collection } from 'firebase/firestore';
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

    function createCommunity() { 
        /*if (isSignedIn) { 
            window.prompt('got it!')
        } else { 
            window.prompt('You need to be signed in to do this.')
        }*/

        if (continentOfOrigin && name) { 
            users.push(sharedState.user.uid)
            const comm: Community = {continentOfOrigin, countryOfOrigin, tribalNation, name, users, commonAncestors}
            communities.update(cur => [...cur, comm])

            resetInput()
            currentView = 'community'
            
        } else { 
            window.alert('You at least need to enter the community name and continent.')
        }
    }

    const addEntry = (content: string) => {
        if (content.trim()) {
            commonAncestors = [...commonAncestors, content]
            resetContent();
        } else {
            window.alert('Ancestor name cannot be empty.');
        }
    };

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

    function viewCommunity(comm: Community) { 
        activeCommunity.set(comm)
        currentView = 'community'
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
            {#each $communities as comm}
                <button on:click = {() => viewCommunity(comm)}>{comm.name}</button>
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