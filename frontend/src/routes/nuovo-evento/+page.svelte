<script>
  import { API_URL } from '$lib/config';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/authStore';

  // Stato del form
  let formData = {
    titolo: '',
    descrizione: '',
    data: '',
    orafine: '',
    luogo: '',
    prezzo: '',
    tipologia: 'concerto',
    tags: [],
    copertina: '',       // URL dell'immagine di copertina
    immagini: []         // Array di URL delle immagini
  };

  let currentTag = '';
  let isLoading = false;
  let error = null;
  let uploadingImage = false;
  let uploadProgress = 0;

  // Aggiungi tag
  function addTag() {
    if (currentTag && !formData.tags.includes(currentTag)) {
      formData.tags = [...formData.tags, currentTag];
      currentTag = '';
    }
  }

  // Rimuovi tag
  function removeTag(tag) {
    formData.tags = formData.tags.filter(t => t !== tag);
  }

  // Funzione per caricare un'immagine
  async function uploadImage(file) {
    uploadingImage = true;
    uploadProgress = 0;
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      return data.url; // URL dell'immagine caricata
    } catch (err) {
      error = err.message;
      return null;
    } finally {
      uploadingImage = false;
      uploadProgress = 0;
    }
  }

  // Gestione del caricamento della copertina
  async function handleCoverUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        formData.copertina = imageUrl;
      }
    }
  }

  // Gestione del caricamento delle immagini
  async function handleImagesUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      for (const file of files) {
        const imageUrl = await uploadImage(file);
        if (imageUrl) {
          formData.immagini = [...formData.immagini, imageUrl];
        }
      }
    }
  }

  // Rimuovi immagine dall'array
  async function removeImage(index, isCover = false) {
    try {
      const imageUrl = isCover ? formData.copertina : formData.immagini[index];
      const filename = imageUrl.split('/').pop();
      
      // Elimina l'immagine dal server
      const response = await fetch(`${API_URL}/upload/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Errore durante la rimozione dell\'immagine');
      }

      // Rimuovi l'URL dallo stato
      if (isCover) {
        formData.copertina = '';
      } else {
        formData.immagini = formData.immagini.filter((_, i) => i !== index);
      }
    } catch (err) {
      error = err.message;
    }
  }

  // Submit del form
  async function handleSubmit() {
    if (!$authStore.isAuthenticated) {
      error = 'Devi effettuare il login per creare un evento';
      return;
    }

    if (!formData.copertina) {
      error = 'Devi selezionare un\'immagine di copertina';
      return;
    }

    isLoading = true;
    error = null;

    try {
      // Converti il prezzo in numero
      const eventoDaInviare = {
        ...formData,
        prezzo: parseFloat(formData.prezzo),
        organizzatore: $authStore.user.username
      };

      const response = await fetch('${API_URL}/nuovo-evento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(eventoDaInviare)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore durante la creazione');
      }

      goto('/profile');
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="form-container">
  <h1>Crea un nuovo evento</h1>
  
  {#if error}
    <div class="error-message">{error}</div>
  {/if}

  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label>Organizzatore</label>
      <div class="organizzatore-value">
        {$authStore.user?.username || 'Non autenticato'}
      </div>
    </div>

    <div class="form-group">
      <label for="titolo">Titolo *</label>
      <input id="titolo" type="text" bind:value={formData.titolo} required>
    </div>

    <div class="form-group">
      <label for="copertina">Immagine di copertina *</label>
      <input 
        id="copertina" 
        type="file" 
        accept="image/jpeg, image/png, image/webp, image/gif" 
        on:change={handleCoverUpload}
        disabled={uploadingImage}
      >
      {#if uploadingImage && !formData.copertina}
        <div class="upload-progress">Caricamento in corso...</div>
      {:else if formData.copertina}
        <div class="image-preview-container">
          <img src={formData.copertina} alt="Anteprima copertina" class="image-preview">
          <button 
            type="button" 
            on:click={() => removeImage(0, true)} 
            class="remove-image"
            disabled={uploadingImage}
          >
            &times;
          </button>
        </div>
      {/if}
    </div>

    <div class="form-group">
      <label for="immagini">Altre immagini dell'evento</label>
      <input 
        id="immagini" 
        type="file" 
        accept="image/jpeg, image/png, image/webp, image/gif" 
        multiple 
        on:change={handleImagesUpload}
        disabled={uploadingImage}
      >
      {#if uploadingImage && formData.immagini.length === 0}
        <div class="upload-progress">Caricamento in corso...</div>
      {/if}
      
      <div class="images-list">
        {#each formData.immagini as image, index}
          <div class="image-item">
            <img src={image} alt="Immagine evento" class="image-preview">
            <button 
              type="button" 
              on:click={() => removeImage(index)} 
              class="remove-image"
              disabled={uploadingImage}
            >
              &times;
            </button>
          </div>
        {/each}
      </div>
    </div>

    <div class="form-group">
      <label for="descrizione">Descrizione *</label>
      <textarea id="descrizione" bind:value={formData.descrizione} rows="4" required></textarea>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="data">Data *</label>
        <input id="data" type="date" bind:value={formData.data} required>
      </div>

      <div class="form-group">
        <label for="orafine">Ora fine</label>
        <input id="orafine" type="time" bind:value={formData.orafine}>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="luogo">Luogo *</label>
        <input id="luogo" type="text" bind:value={formData.luogo} required>
      </div>

      <div class="form-group">
        <label for="prezzo">Prezzo (€) *</label>
        <input 
          id="prezzo" 
          type="number" 
          bind:value={formData.prezzo} 
          min="0" 
          step="0.01" 
          required
        >
      </div>
    </div>

    <div class="form-group">
      <label for="tipologia">Tipologia *</label>
      <select id="tipologia" bind:value={formData.tipologia}>
        <option value="concerto">Concerto</option>
        <option value="festa">Festa</option>
        <option value="teatro">Teatro</option>
        <option value="sport">Sport</option>
        <option value="altro">Altro</option>
      </select>
    </div>

    <div class="form-group">
      <label>Tags</label>
      <div class="tags-input">
        <input 
          type="text" 
          bind:value={currentTag} 
          on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder="Aggiungi tag e premi Invio"
          disabled={uploadingImage}
        >
        <button 
          type="button" 
          on:click={addTag} 
          class="add-tag-button"
          disabled={uploadingImage}
        >
          <svg viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
      </div>
      <div class="tags-list">
        {#each formData.tags as tag}
          <span class="tag">
            {tag}
            <button 
              type="button" 
              on:click={() => removeTag(tag)} 
              class="remove-tag"
              disabled={uploadingImage}
            >
              &times;
            </button>
          </span>
        {/each}
      </div>
    </div>

    <div class="form-actions">
      <button 
        type="button" 
        on:click={() => goto('/profile')} 
        class="cancel-button"
        disabled={isLoading || uploadingImage}
      >
        Annulla
      </button>
      <button 
        type="submit" 
        disabled={isLoading || uploadingImage || !formData.copertina} 
        class="submit-button"
      >
        {#if isLoading}
          <span class="spinner"></span>
        {:else}
          Crea Evento
        {/if}
      </button>
    </div>
  </form>
</div>

<style>
  .form-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  h1 {
    color: #1a1a2e;
    text-align: center;
    margin-bottom: 2rem;
  }

  .error-message {
    color: #d32f2f;
    background: #ffebee;
    padding: 0.8rem;
    border-radius: 4px;
    margin-bottom: 1.5rem;
    border-left: 4px solid #d32f2f;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .organizzatore-value {
    padding: 0.8rem;
    background: #f5f5f5;
    border-radius: 6px;
    color: #333;
    border: 1px solid #ddd;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }

  input, textarea, select {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  /* Stili per le immagini */
  .image-preview-container {
    position: relative;
    margin-top: 1rem;
    max-width: 300px;
  }

  .image-preview {
    width: 100%;
    border-radius: 6px;
    border: 1px solid #ddd;
  }

  .remove-image {
    position: absolute;
    top: -10px;
    right: -10px;
    background: #e94560;
    color: white;
    border: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
  }

  .remove-image:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .images-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .image-item {
    position: relative;
  }

  .upload-progress {
    margin-top: 0.5rem;
    color: #666;
    font-size: 0.9rem;
  }

  /* Stili per i tags */
  .tags-input {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .tags-input input {
    flex-grow: 1;
  }

  .add-tag-button {
    background: #e94560;
    border: none;
    border-radius: 6px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .add-tag-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .add-tag-button svg {
    width: 20px;
    height: 20px;
    fill: white;
  }

  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    background: #f0f0f0;
    padding: 0.4rem 0.8rem;
    border-radius: 20px;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .remove-tag {
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    font-size: 1.1rem;
    line-height: 1;
  }

  .remove-tag:disabled {
    cursor: not-allowed;
  }

  /* Stili per i pulsanti */
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }

  .cancel-button {
    background: #f0f0f0;
    color: #333;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
  }

  .cancel-button:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  .submit-button {
    background: #e94560;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .submit-button:hover:not(:disabled) {
    background: #d32f4b;
  }

  .submit-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
    }
    
    .form-container {
      padding: 1rem;
    }

    .images-list {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
  }
</style>