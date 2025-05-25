// src/lib/stores.js
import { writable } from 'svelte/store';

export const authStore = writable(null);
export const eventoSelezionato = writable({
  titolo: '',
  descrizione: ''
});

// Aggiungi altri store se necessario