<script lang="ts">
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { doc, addDoc, getDoc, updateDoc, arrayUnion, collection } from 'firebase/firestore';
    import { sharedState } from '$lib/sharedState.svelte';
    import type { Community } from '$lib/community-type';

    let { db, auth } = sharedState
    let isSignedIn: boolean
    let communities = writable<Community[] | null>([])

    let continent: string
    let country: string
    let tribe: string
    let name: string
    let users: string[] = []
    let ancestors: string[] = []  
    let content: string

    $: isSignedIn = signedIn()

    function signedIn(): boolean { 
        return sharedState.user.uid !== ''
    }

    function createCommunity() { 
        if (isSignedIn) { 
            window.prompt('got it!')
        } else { 
            window.prompt('You need to be signed in to do this.')
        }
    }

    //This part deals with the dynamic page 
    let hidden = true; 

    const toggleVisibility = () => { 
        hidden = !hidden
    }    

    const addEntry = (content: string) => { 
        let ancestorEntry = document.getElementById('ancestors') as HTMLDivElement | null 
        let ancestorInput = document.getElementById('ancestorInput') as HTMLInputElement | null
        if (ancestorEntry && ancestorInput) { 
            const newEntry = document.createElement('p')
            newEntry.innerText = content
            ancestorEntry.appendChild(newEntry)
            ancestors.push(content)

            resetInput()
        } else { 
            window.prompt('Whoops! that container does not exist.')
        }
    }

    const resetInput = () => {
        content = ''; // Reset the bound variable
    };
</script>

<div class="grid">
    <div class="list">
        <button class="add-comm" on:click={toggleVisibility}>Create New Community</button>
    </div>

    <div class="content">
        
        <div class="new-comm-form" style:display={hidden ? 'none' : 'flex'}>
            <label>
                Name of the Community: 
                <input type="text" bind:value={name}>
            </label>

            <label>
                Continent of Origin: 
                <input type="text" bind:value={continent}>
            </label>

            <label>
                Country of Origin: 
                <input type="text" bind:value={country}>
            </label>

            <label>
                Tribe: 
                <input type="text" bind:value={tribe}>
            </label>

            <label>
                Names of Common Ancestors:
                <input type="text" id="ancestorInput" bind:value={content}> 
                <button on:click={() => addEntry(content)}>Add New</button>
            </label>

            <div id="ancestors"></div>

            <button on:click={createCommunity}>submit</button>
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
        display: none; 
        flex-direction: column; 
    }
</style>