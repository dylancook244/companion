<script>
    let messages = [
        { sender: "AI", content: "Hello! Type a message in the chat to get started." }
    ];

    let newMessage = "";

    async function sendMessage() {
        if (newMessage.trim()) {
            messages = [...messages, { sender: "User", content: newMessage }];
            console.log("Sending message to backend:", newMessage);

            const response = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: newMessage })
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Received response from backend:", data.response);
                messages = [...messages, { sender: "AI", content: data.response }];
            } else {
                console.error("Error: Unable to connect to backend.");
                messages = [...messages, { sender: "AI", content: "Error: Unable to connect to AI." }];
            }

            newMessage = "";
        }
    }
</script>

<main>
    <div class="messages">
        {#each messages as message, i}
            <div class={`message ${message.sender === "AI" ? "ai" : "user"}`}>
                <strong>{message.sender}:</strong> {message.content}
            </div>
        {/each}
    </div>
</main>

<style>
    /* Make the main container take the full height of its parent */
    main {
        display: flex;
        flex-direction: column;
    }
    
    .messages {
		flex-grow: 1;
		padding: 1em;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		font-size: 1.2em; /* Increased font size for readability */
	}

	.message {
		padding: 0.5em 1em;
		border-radius: 20px;
		max-width: 80%; /* Adjusted for screen space */
	}

	.message.ai {
		background-color: #f0f0f0;
		align-self: flex-start;
	}

	.message.user {
		background-color: #ff3e00;
		color: white;
		align-self: flex-end;
	}
</style>