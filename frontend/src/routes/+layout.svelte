<script>
	import '../app.css';
	import Navbar from '$lib/Navbar.svelte';
	let { children } = $props();
</script>


<Navbar />

{@render children()}
