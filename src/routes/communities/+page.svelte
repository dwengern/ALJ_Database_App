<script lang="ts">
    import { onMount } from 'svelte';
    import { doc, addDoc, getDoc, updateDoc, arrayUnion, collection } from 'firebase/firestore';
    import { sharedState } from '$lib/sharedState.svelte';

    let { db, auth } = sharedState; 

    /*let isSignedIn: boolean

    $: isSignedIn = signedIn()

    function signedIn(): boolean { 
        return sharedState.user.uid !== ''
    }*/

    async function createCommunity() { 
        
    }

    //This part deals with the dynamic page 
    let hidden = true; 

    const toggleVisibility = () => { 
        hidden = !hidden
    }    
</script>

<div class="grid">
    <div class="list">
        <button class="add-comm" on:click={toggleVisibility}>Create New Community</button>
    </div>

    <div class="content">
        
        <div class="new-comm-form" style:display={hidden ? 'none' : 'flex'}>
            <label>
                Name of the Community: 
                <input type="text" id="community" name="community">
            </label>

            <label>
                Continent of Origin: 
                <input type="text" id="continent" name="continent">
            </label>

            <label>
                Country of Origin: 
                <input type="text" id="country" name="country">
            </label>

            <label>
                Tribe: 
                <input type="text" id="tribe" name="tribe">
            </label>

            <label>
                Names of Common Ancestors: 
                <button>Add New</button>
            </label>
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