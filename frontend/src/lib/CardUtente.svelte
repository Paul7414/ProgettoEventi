<script>
  import { API_URL } from '$lib/config';
  export let evento;
  import { goto } from '$app/navigation';
  import { eventoSelezionato } from '$lib/stores';
  
  // Funzione per formattare la data
  function formattaData(dataISO) {
    const data = new Date(dataISO);
    const options = { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return data.toLocaleDateString('it-IT', options);
  }
  
  // Funzione per formattare il prezzo
  function formattaPrezzo(prezzo) {
    return prezzo.toFixed(2).replace('.', ',');
  }
  
  // Funzione per eliminare l'evento (da implementare)
  async function eliminaEvento(titolo) {
    try {
        
        const response = await fetch(`${API_URL}/eventi/${evento.titolo}/${evento.descrizione}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            console.log('Evento eliminato con successo');
            // Aggiorna l'interfaccia utente o esegui altre azioni necessarie
            return true;
        } else {
            console.error('Errore durante l\'eliminazione dell\'evento:', response.statusText);
            return false;
        }
    } catch (err) {
        console.error('Errore durante la richiesta:', err);
        return false;
    }
    
}
  
  // Funzione per modificare l'evento (da implementare)
  function modificaEvento() {
    eventoSelezionato.set({
      titolo: evento.titolo,
      descrizione: evento.descrizione
    });
    
    // Naviga alla pagina di modifica
    goto('/modifica-evento');
  }
  
</script>

<div class="card">
  {#if evento.copertina}
    <div class="img-container">
      <img 
        src={evento.copertina} 
        alt={evento.titolo} 
        class="card-img"
        loading="lazy"
      />
      <div class="img-overlay" />
    </div>
  {/if}
  
  <div class="card-body">
    <div class="card-header">
      <h2>{evento.titolo}</h2>
      {#if evento.tipologia}
        <span class="event-type">{evento.tipologia}</span>
      {/if}
    </div>
    
    <p class="event-description">{evento.descrizione}</p>
    
    <div class="event-details">
      <div class="detail-item">
        <svg class="icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.32c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/></svg>
        <span>Solo {formattaPrezzo(evento.prezzo)} €</span>
      </div>
      
      <div class="detail-item">
        <svg class="icon" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
        <span>{formattaData(evento.data)}</span>
      </div>
      
      <div class="detail-item">
        <svg class="icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <span>{evento.luogo}</span>
      </div>
      
      {#if evento.organizzatore}
        <div class="detail-item">
          <svg class="icon" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          <span>{evento.organizzatore}</span>
        </div>
      {/if}
    </div>
    
    {#if evento.tags && evento.tags.length > 0}
      <div class="tags">
        {#each evento.tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    {/if}
    
    <div class="actions">
      <button class="action-button delete" on:click={eliminaEvento}>
        <svg viewBox="0 0 24 24" class="action-icon">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
      </button>
      <button class="action-button edit" on:click={modificaEvento}>
        <svg viewBox="0 0 24 24" class="action-icon">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
        </svg>
      </button>
    </div>
  </div>
</div>

<style>
  .card {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    width: 100%;
    height: 100%;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    overflow: hidden;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: white;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    border-color: #d1d1d1;
  }
  
  .img-container {
    position: relative;
    height: 180px;
    overflow: hidden;
  }
  
  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .img-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0,0,0,0.3), transparent 40%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .card:hover .card-img {
    transform: scale(1.05);
  }
  
  .card:hover .img-overlay {
    opacity: 1;
  }
  
  .card-body {
    padding: 1.5rem;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.8rem;
  }
  
  .card h2 {
    font-size: 1.3rem;
    margin: 0;
    color: #222;
    font-weight: 600;
    transition: color 0.3s ease;
  }
  
  .card:hover h2 {
    color: #d32f2f;
  }
  
  .event-type {
    font-size: 0.75rem;
    background: #f0f0f0;
    padding: 0.25rem 0.75rem;
    border-radius: 14px;
    font-weight: 500;
    color: #555;
  }
  
  .event-description {
    font-size: 0.95rem;
    color: #666;
    margin: 0.8rem 0;
    line-height: 1.4;
  }
  
  .event-details {
    margin: 1.2rem 0;
    font-size: 0.9rem;
  }
  
  .detail-item {
    display: flex;
    align-items: center;
    margin: 0.6rem 0;
    color: #555;
  }
  
  .icon {
    width: 18px;
    height: 18px;
    margin-right: 10px;
    fill: #d32f2f;
    opacity: 0.8;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1.2rem 0;
  }
  
  .tag {
    font-size: 0.7rem;
    background: #f5f5f5;
    padding: 0.3rem 0.8rem;
    border-radius: 14px;
    color: #666;
    transition: all 0.2s ease;
  }
  
  .card:hover .tag {
    background: #e0e0e0;
    color: #333;
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .action-button {
    flex: 1;
    padding: 0.7rem;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .action-button.delete {
    background-color: #f5f5f5;
    color: #d32f2f;
  }
  
  .action-button.edit {
    background-color: #f5f5f5;
    color: #1976d2;
  }
  
  .action-button.delete:hover {
    background-color: #d32f2f;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(210, 47, 47, 0.2);
  }
  
  .action-button.edit:hover {
    background-color: #1976d2;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(25, 118, 210, 0.2);
  }
  
  .action-icon {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
  
  /* Modifiche responsive */
  @media (max-width: 768px) {
    .card {
      max-width: 100%;
      margin: 0.5rem 0;
      border-radius: 8px;
    }
    
    .img-container {
      height: 150px;
    }
    
    .card-body {
      padding: 1rem;
    }
    
    .card h2 {
      font-size: 1.1rem;
    }
    
    .event-description {
      font-size: 0.85rem;
      margin: 0.5rem 0;
    }
    
    .event-details {
      margin: 0.8rem 0;
      font-size: 0.8rem;
    }
    
    .detail-item {
      margin: 0.4rem 0;
    }
    
    .icon {
      width: 16px;
      height: 16px;
    }
    
    .tags {
      margin: 0.8rem 0;
    }
    
    .action-button {
      padding: 0.6rem;
    }
  }
</style>