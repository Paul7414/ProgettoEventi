import { writable } from 'svelte/store';
import { API_URL } from '$lib/config';
// Creo lo store base
const createAuthStore = () => {
    const { subscribe, set } = writable({
        isAuthenticated: false,
        user: null,
        token: null
    });

    // Inizializzo con i valori dal localStorage
    const init = () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            if (token && user) {
                set({ isAuthenticated: true, user, token });
            }
        }
    };

    // Metodi esposti
    return {
        subscribe,
        login: (token, user) => {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            set({ isAuthenticated: true, user, token });
        },
        logout: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ isAuthenticated: false, user: null, token: null });
        },
        init
    };
};

export const authStore = createAuthStore();

// Inizializzo appena lo store viene importato
authStore.init();