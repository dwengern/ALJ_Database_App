<script lang="ts">
    import { onMount } from 'svelte';
    import { collection, doc, updateDoc, arrayUnion, onSnapshot, addDoc } from 'firebase/firestore';
    import { sharedState } from '$lib/sharedState.svelte';

    let { db, auth } = sharedState;

    let conversations: Array<{
        id: string;
        name: string;
        shipName: string;
        description: string;
        comments: string[];
        participants: string[];
        owner: string;
    }> = [];

    let newComment = '';
    let newParticipant = '';
    let currentUserId = '';
    let showModal = false;

    function loadConversations() {
        const chatsCollection = collection(db!, 'chats');
        onSnapshot(chatsCollection, snapshot => {
            conversations = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as typeof conversations;
        });
    }

    onMount(() => {
        if (auth?.currentUser) {
            currentUserId = auth.currentUser.uid;
        }
        loadConversations();
    });

    async function addComment(chatId: string) {
        if (!newComment.trim()) return;

        const chatRef = doc(db!, 'chats', chatId);

        try {
            await updateDoc(chatRef, {
                comments: arrayUnion(newComment),
            });
            newComment = ''; 
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }

    async function addParticipant(chatId: string) {
        if (!newParticipant.trim()) return;

        const chat = conversations.find(convo => convo.id === chatId);
        if (chat?.owner !== currentUserId) {
            alert('Only the chat owner can add participants.');
            return;
        }

        const chatRef = doc(db!, 'chats', chatId);

        try {
            await updateDoc(chatRef, {
                participants: arrayUnion(newParticipant),
            });
            newParticipant = ''; 
        } catch (error) {
            console.error("Error adding participant:", error);
        }
    }

    async function createChat(name: string, shipName: string, description: string) {
        try {
            await addDoc(collection(db!, 'chats'), {
                name,
                shipName,
                description,
                owner: currentUserId,
                participants: [],
                comments: [],
            });
        } catch (error) {
            console.error("Error creating chat:", error);
        }
    }
</script>

<h1 class="page-title">Chat Management</h1>

<div class="container">
    <button class="create-chat-button" on:click={() => (showModal = true)}>
        Create Chat
    </button>
</div>

<div class="conversations">
    {#if conversations.length}
        {#each conversations as conversation}
            <div class="conversation-card">
                <h3>{conversation.name}</h3>
                <p><strong>Ship:</strong> {conversation.shipName}</p>
                <p><strong>Description:</strong> {conversation.description}</p>
                <p><strong>Owner:</strong> {conversation.owner === currentUserId ? 'You' : conversation.owner}</p>

                <div class="comments-section">
                    <h4>Comments:</h4>
                    <ul>
                        {#each conversation.comments as comment}
                            <li>{comment}</li>
                        {/each}
                    </ul>
                    <input
                        type="text"
                        bind:value={newComment}
                        placeholder="Add a comment"
                    />
                    <button on:click={() => addComment(conversation.id)}>Add Comment</button>
                </div>

                {#if conversation.owner === currentUserId}
                    <div class="participants-section">
                        <h4>Participants:</h4>
                        <p>{conversation.participants.join(', ') || 'No participants yet'}</p>
                        <input
                            type="text"
                            bind:value={newParticipant}
                            placeholder="Add a participant"
                        />
                        <button on:click={() => addParticipant(conversation.id)}>Add Participant</button>
                    </div>
                {/if}
            </div>
        {/each}
    {:else}
        <p>No conversations found. Create a new one!</p>
    {/if}
</div>

<style>
    .page-title {
        text-align: center;
        margin: 1.5rem 0;
        color: #000000;
    }

    .container {
        text-align: center;
        margin: 2rem auto;
    }

    .create-chat-button {
        background-color: #007bff;
        color: #fff;
        border: none;
        padding: 0.75rem 1.5rem;
        font-size: 1.2rem;
        border-radius: 8px;
        cursor: pointer;
    }

    .create-chat-button:hover {
        background-color: #0056b3;
    }

    .conversations {
        max-width: 800px;
        margin: 2rem auto;
    }

    .conversation-card {
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px;
        margin: 1rem 0;
        padding: 1rem 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .conversation-card h3 {
        margin-top: 0;
        color: #343a40;
    }

    .comments-section, .participants-section {
        margin-top: 1rem;
    }

    .comments-section ul {
        list-style-type: none;
        padding: 0;
    }

    .comments-section li {
        background: #f8f9fa;
        margin: 0.25rem 0;
        padding: 0.5rem;
        border-radius: 4px;
    }

    input {
        width: calc(100% - 2rem);
        margin: 0.5rem 0;
        padding: 0.5rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        background-color: #28a745;
        color: #fff;
        border: none;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 0.5rem;
    }

    button:hover {
        background-color: #218838;
    }
</style>









