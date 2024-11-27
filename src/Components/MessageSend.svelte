
<script>
    import { emit } from 'src/Components/eventBus.js'; // Adjust the path as needed

    let newMessage = "";

    function sendMessage() {
        if (newMessage.trim() !== "") {
            // Emit the message with the newMessage data
            emit("userMessage", newMessage);

            // Clear the input
            newMessage = "";
        }
    }

</script>

<main>
    <div class="content"> <!-- Optional: For other content above the input -->
        <!-- Your main content goes here -->
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
</main>

<style>
    /* Make the main container fill the viewport */
    main {
        display: flex;
        flex-direction: column;
        height: 100vh; /* Fullscreen height */
    }

    /* Content takes the remaining space */
    .content {
        flex-grow: 1; /* Expands to take up all available space */
        overflow-y: auto; /* Add scrolling if content overflows */
    }

    /* Input-container stays at the bottom */
    .input-container {
        display: flex;
        gap: 0.5em;
        padding: 1em;
        background-color: #f3f3f3;
        flex-shrink: 0; /* Prevents it from shrinking when space is limited */
    }

    input {
        flex-grow: 1;
        padding: 0.8em; /* Adjusted padding for touch input */
        border: 1px solid #ccc;
        border-radius: 10px;
        font-size: 1.2em; /* Adjusted font size for touch input */
    }

    button {
        background-color: #ff3e00;
        color: white;
        border: none;
        padding: 0.8em 1.5em;
        border-radius: 10px;
        cursor: pointer;
        font-size: 1.2em; /* Adjusted font size for touch */
    }

    button:hover {
        background-color: #e03300;
    }
</style>