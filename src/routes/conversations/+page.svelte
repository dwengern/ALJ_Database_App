<script lang="ts">
    import { onMount } from 'svelte';
    import { doc, addDoc, getDoc, updateDoc, arrayUnion, collection } from 'firebase/firestore';
    import { sharedState } from '$lib/sharedState.svelte';

    let { db, auth } = sharedState;

    let searchChatId = '';
    let foundChat: { id: any; name?: any; shipName?: any; createdAt?: any; participants?: any } | null = null;
    let debounceTimer: NodeJS.Timeout | null = null;

    // Create a new chat using a popup
    async function createChat() {
        const newChatName = window.prompt("Enter the name for the new chat:");
        const newShipName = window.prompt("Enter the ship name for the new chat:");

        if (!newChatName?.trim() || !newShipName?.trim()) return;

        try {
            const chatRef = await addDoc(collection(db!, 'chats'), {
                name: newChatName,
                shipName: newShipName,
                createdAt: new Date(),
                participants: [],
            });
            console.log(`Created new chat with ID: ${chatRef.id}`);
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    }

    // Add a new participant to an existing chat using popups
    async function addParticipant() {
        const chatIdToJoin = window.prompt("Enter the chat ID to add a participant to:");
        const userIdToAdd = window.prompt("Enter the user ID to add as a participant:");

        if (!chatIdToJoin?.trim() || !userIdToAdd?.trim()) return;

        const chatRef = doc(db!, 'chats', chatIdToJoin);

        try {
            await updateDoc(chatRef, {
                participants: arrayUnion(userIdToAdd),
            });
            console.log(`Added user ${userIdToAdd} to chat ${chatIdToJoin}`);
        } catch (error) {
            console.error("Error adding participant:", error);
        }
    }

    // Search for a chat by its ID
    async function searchChatById() {
        if (!searchChatId.trim()) {
            foundChat = null;
            return;
        }

        const chatRef = doc(db!, 'chats', searchChatId);

        try {
            const chatDoc = await getDoc(chatRef);
            if (chatDoc.exists()) {
                foundChat = { id: chatDoc.id, ...chatDoc.data() };
            } else {
                foundChat = null;
            }
        } catch (error) {
            console.error("Error searching for chat:", error);
        }
    }

    // Watch `searchChatId` for changes and debounce the search
    $: if (searchChatId) {
        if (debounceTimer) clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            searchChatById();
        }, 300); // Delay of 300ms
    }
</script>

<h1 class="page-title">Chat Management</h1>

<div class="container">
    <div class="card">
        <h3>Create a New Chat</h3>
        <button class="action-button" on:click={createChat}>Create Chat</button>
    </div>

    <div class="card">
        <h3>Add a Participant to Chat</h3>
        <button class="action-button" on:click={addParticipant}>Add Participant</button>
    </div>

    <div class="card">
        <h3>Search for a Chat by ID</h3>
        <div class="search-container">
            <input
                type="text"
                class="search-input"
                bind:value={searchChatId}
                placeholder="Enter chat ID to search"
            />
        </div>
    </div>

    {#if foundChat}
        <div class="card">
            <h4>Chat Details</h4>
            <p><strong>ID:</strong> {foundChat.id}</p>
            <p><strong>Name:</strong> {foundChat.name}</p>
            <p><strong>Ship Name:</strong> {foundChat.shipName}</p>
            <p><strong>Created At:</strong> {new Date(foundChat.createdAt.seconds * 1000).toLocaleString()}</p>
            <p><strong>Participants:</strong> {foundChat.participants.join(', ')}</p>
        </div>
    {:else if searchChatId}
        <p class="alert-message">No chat found with the ID "{searchChatId}".</p>
    {/if}
</div>

<style>
    .page-title {
        text-align: center;
        margin: 1.5rem 0;
        color: #000000;
    }

    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 1rem;
    }

    .card {
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin: 1rem 0;
        padding: 1rem 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .card h3 {
        margin-top: 0;
        color: #343a40;
    }

    .action-button {
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 0.5rem;
    }

    .action-button:hover {
        background-color: #0056b3;
    }

    .search-container {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .search-input {
        flex: 1;
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .alert-message {
        color: #dc3545;
        font-weight: bold;
        margin-top: 1rem;
        text-align: center;
    }
</style>





