<script>
  // Accetta una prop per il filtro attivo e una funzione callback
  export let filtroAttivo = 'tutti';
  export let onFiltroCambiato = (tipo) => {};

  // Icone SVG per i bottoni
  const icone = {
    sport: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M162-520h114q-6-38-23-71t-43-59q-18 29-30.5 61.5T162-520Zm522 0h114q-5-36-17.5-68.5T750-650q-26 26-43 59t-23 71ZM210-310q26-26 43-59t23-71H162q5 36 17.5 68.5T210-310Zm540 0q18-29 30.5-61.5T798-440H684q6 38 23 71t43 59ZM358-520h82v-278q-53 8-98.5 29.5T260-712q39 38 64.5 86.5T358-520Zm162 0h82q8-57 33.5-105.5T700-712q-36-35-81.5-56.5T520-798v278Zm-80 358v-278h-82q-8 57-33.5 105.5T260-248q36 35 81.5 56.5T440-162Zm80 0q53-8 98.5-29.5T700-248q-39-38-64.5-86.5T602-440h-82v278Zm-40-318Zm0 400q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/></svg>`,
    tutti: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/></svg>`,
    festa: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m80-80 200-560 360 360L80-80Zm132-132 282-100-182-182-100 282Zm370-246-42-42 224-224q32-32 77-32t77 32l24 24-42 42-24-24q-14-14-35-14t-35 14L582-458ZM422-618l-42-42 24-24q14-14 14-34t-14-34l-26-26 42-42 26 26q32 32 32 76t-32 76l-24 24Zm80 80-42-42 144-144q14-14 14-35t-14-35l-64-64 42-42 64 64q32 32 32 77t-32 77L502-538Zm160 160-42-42 64-64q32-32 77-32t77 32l64 64-42 42-64-64q-14-14-35-14t-35 14l-64 64ZM212-212Z"/></svg>`,

  };
</script>

<div class="filtri-tipologia">
  {#each Object.entries(icone) as [tipo, icona]}
    <button
      class:filtro-attivo={filtroAttivo === tipo}
      on:click={() => onFiltroCambiato(tipo)}
      aria-label={`Filtra per ${tipo}`}
    >
      {@html icona}
      <span class="tooltip">{tipo}</span>
    </button>
  {/each}
</div>

<style>
  .filtri-tipologia {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 1.5rem;
    background: rgba(255, 255, 255, 0.9);
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    z-index: 1000;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .filtri-tipologia button {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    color: #555;
  }

  .filtri-tipologia button:hover {
    background: #e0e0e0;
    transform: translateY(-3px);
    color: #d32f2f;
  }

  .filtri-tipologia button.filtro-attivo {
    background: #d32f2f;
    color: white;
    box-shadow: 0 4px 12px rgba(210, 47, 47, 0.3);
  }

  .filtri-tipologia button.filtro-attivo:hover {
    background: #b71c1c;
    color: white;
  }

  .filtri-tipologia svg {
    width: 24px;
    height: 24px;
  }

  .tooltip {
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    font-size: 0.75rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
    white-space: nowrap;
  }

  .tooltip::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px 5px 0;
    border-style: solid;
    border-color: #333 transparent transparent;
  }

  .filtri-tipologia button:hover .tooltip {
    opacity: 1;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .filtri-tipologia {
      gap: 1rem;
      padding: 0.5rem 1rem;
      bottom: 1rem;
    }

    .filtri-tipologia button {
      width: 42px;
      height: 42px;
    }

    .filtri-tipologia svg {
      width: 20px;
      height: 20px;
    }
  }
</style>