<script lang="ts">
    let messages = [
        { sender: "AI", content: "Hello! How can I assist you today?" }
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
	<div class="chat-container">
		<div class="header">
			<h3>Companion</h3>
		</div>
		<div class="messages">
			{#each messages as message, i}
				<div class={`message ${message.sender === "AI" ? "ai" : "user"}`}>
					<strong>{message.sender}:</strong> {message.content}
				</div>
			{/each}
		</div>
		<div class="input-container">
			<input
				type="text"
				bind:value={newMessage}
				placeholder="Type your message..."
				on:keydown={(e) => e.key === "Enter" && sendMessage()}
			/>
			<button on:click={sendMessage}>Send</button>
		</div>
	</div>
</main>

<style>
	main {
		font-family: Arial, sans-serif;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background-color: #f5f5f5;
	}

	.chat-container {
		width: 100%;
		max-width: 1024px; /* Adjusted to fit the screen width */
		background-color: #ffffff;
		border-radius: 8px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		height: 100%; /* Fullscreen height */
		overflow: hidden;
	}

	.header {
		background-color: #ff3e00;
		color: white;
		text-align: center;
		font-size: 1.5em; /* Adjusted for readability */
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

	.input-container {
		display: flex;
		gap: 0.5em;
		padding: 1em;
		background-color: #f3f3f3;
	}

	input {
		flex-grow: 1;
		padding: 0.8em; /* Adjusted padding for touch input */
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1.2em; /* Adjusted font size for touch input */
	}

	button {
		background-color: #ff3e00;
		color: white;
		border: none;
		padding: 0.8em 1.5em;
		border-radius: 4px;
		cursor: pointer;
		font-size: 1.2em; /* Adjusted font size for touch */
	}

	button:hover {
		background-color: #e03300;
	}

	@media (min-width: 640px) {
		.chat-container {
			height: 90%;
		}
	}
</style>