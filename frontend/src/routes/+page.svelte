<script>
  import CardEvento from '$lib/CardEvento.svelte';
  import BottoniHome from '$lib/BottoniHome.svelte';
  
  export let data; // contiene { eventi }

  let filtroSelezionato = 'tutti';
  let eventiFiltrati = data.eventi;
  let isLoading = false;

  async function handleFiltroCambiato(tipo) {
    filtroSelezionato = filtroSelezionato === tipo ? 'tutti' : tipo;
    isLoading = true;
    
    try {
      if (filtroSelezionato === 'tutti') {
        eventiFiltrati = data.eventi;
      } else {
        const res = await fetch(`http://localhost:3000/eventi/${filtroSelezionato}`);
        eventiFiltrati = await res.json();
      }
    } catch (error) {
      console.error('Errore:', error);
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="grid-container">
  {#if isLoading}
    <div class="spinner-container">
      <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
    </div>
  {:else}
    {#each eventiFiltrati as evento}
      <CardEvento {evento} />
    {/each}
  {/if}
</div>

<BottoniHome
  filtroAttivo={filtroSelezionato} 
  onFiltroCambiato={handleFiltroCambiato} 
/>

<style>
.grid-container {
    display: grid;
    justify-content: center;
    gap: 1.5rem;
    padding: 1rem;
    
    /* Layout per desktop - 4 card per riga */
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    max-width: 1400px;
    margin: 0 auto;
  }
.spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px; /* Altezza fissa per mantenere il layout */
  }

  .spinner {
    width: 50px;
    height: 50px;
    animation: rotate 2s linear infinite;
  }

  .path {
    stroke: #d32f2f; /* Colore che matcha il tuo tema */
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
  /* Mobile - 1 card per riga */
  @media (max-width: 768px) {
    .grid-container {
      grid-template-columns: minmax(280px, 350px);
      justify-content: center;
    }
  }

  /* Tablet - 2 card per riga */
  @media (min-width: 769px) and (max-width: 1024px) {
    .grid-container {
      grid-template-columns: repeat(2, minmax(280px, 1fr));
    }
  }
</style>