<script lang="ts">
	// import external files
	import Header from './Components/Header.svelte';
    import MessageBox from './Components/MessageBox.svelte';
    import MessageSend from './Components/MessageSend.svelte';


</script>

<main>
	<div class="chat-container">
		<Header />
		<MessageBox />
		<MessageSend />
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
		max-height: 600px;
		background-color: #ffffff;
		border-radius: 8px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		height: 100%; /* Fullscreen height */
		overflow: hidden;
	}
</style>