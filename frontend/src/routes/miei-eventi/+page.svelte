<script>
  import CardUtente from '$lib/CardUtente.svelte';
  import { onMount } from 'svelte';
  import { authStore } from '$lib/authStore';
  
  export let data; // contiene { username }

  let eventiOrganizzatore = [];
  let isLoading = false;
  let error = null;

  // Funzione per ricaricare gli eventi dell'organizzatore
  async function caricaEventiOrganizzatore() {
    isLoading = true;
    error = null;
    
    try {

      const res = await fetch(`http://localhost:3000/eventi/organizzatore/${$authStore.user.username}`);
      if (!res.ok) throw new Error('Errore nel caricamento degli eventi');
      eventiOrganizzatore = await res.json();
    } catch (err) {
      console.error('Errore:', err);
      error = err.message;
    } finally {
      isLoading = false;
    }
  }

  // Carica gli eventi all'inizializzazione
  onMount(() => {
    caricaEventiOrganizzatore();
  });
</script>

<div class="header-organizzatore">
  <h2>Eventi di @{$authStore.user.username}</h2>
  <button on:click={caricaEventiOrganizzatore} class="refresh-button">
    Aggiorna
  </button>
</div>

<div class="grid-container">
  {#if isLoading}
    <div class="spinner-container">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
    </div>
  {:else if error}
    <div class="error-message">
      {error}
    </div>
  {:else if eventiOrganizzatore.length === 0}
    <div class="empty-message">
      Nessun evento trovato per questo organizzatore
    </div>
  {:else}
    {#each eventiOrganizzatore as evento}
      <CardUtente {evento} />
    {/each}
  {/if}
</div>

<style>
  /* Stili rimangono identici alla versione precedente */
  .header-organizzatore {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    margin-bottom: 1.5rem;
    max-width: 1400px;
    margin: 0 auto 1.5rem auto;
  }

  .refresh-button {
    padding: 0.5rem 1rem;
    background-color: #d32f2f;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .refresh-button:hover {
    background-color: #b71c1c;
  }

  .grid-container {
    display: grid;
    justify-content: center;
    gap: 1.5rem;
    padding: 1rem;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    max-width: 1400px;
    margin: 0 auto;
  }

  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    grid-column: 1 / -1;
  }

  .error-message, .empty-message {
    grid-column: 1 / -1;
    text-align: center;
    padding: 2rem;
    color: #d32f2f;
  }

  .empty-message {
    color: #666;
  }

  .spinner {
    width: 50px;
    height: 50px;
    animation: rotate 2s linear infinite;
  }

  .path {
    stroke: #d32f2f;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    .grid-container {
      grid-template-columns: minmax(280px, 350px);
    }
  }

  /* Tablet */
  @media (min-width: 769px) and (max-width: 1024px) {
    .grid-container {
      grid-template-columns: repeat(2, minmax(280px, 1fr));
    }
  }
</style>