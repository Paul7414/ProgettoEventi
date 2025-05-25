<script>
  import { authStore } from '$lib/authStore';
  import { goto } from '$app/navigation';

  let isLogin = true;
  let username = '';
  let password = '';
  let error = '';
  let isLoading = false;

  async function handleSubmit() {
    isLoading = true;
    error = '';

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const response = await fetch(`http://localhost:3000/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore durante l\'operazione');
      }

      const data = await response.json();

      if (isLogin) {
        authStore.login(data.token, { username });
        goto('/');
      } else {
        // Switch to login after registration
        isLogin = true;
        error = 'Registrazione completata! Ora puoi fare il login.';
      }
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }
</script>



<div class="auth-container">
  <div class="auth-card">
    <h1>{isLogin ? 'Accedi' : 'Registrati'}</h1>
    
    {#if error}
      <div class="error-message">{error}</div>
    {/if}
    
    <form on:submit|preventDefault={handleSubmit}>
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          id="username" 
          type="text" 
          bind:value={username} 
          required
        />
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          id="password" 
          type="password" 
          bind:value={password} 
          required
        />
      </div>
      
      <button type="submit" disabled={isLoading}>
        {#if isLoading}
          <span class="spinner"></span>
        {:else}
          {isLogin ? 'Accedi' : 'Registrati'}
        {/if}
      </button>
    </form>
    
    <div class="switch-mode">
      {isLogin ? 'Non hai un account?' : 'Hai già un account?'}
      <button on:click={() => isLogin = !isLogin}>
        {isLogin ? 'Registrati' : 'Accedi'}
      </button>
    </div>
  </div>
</div>

<style>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    background: #f5f5f5;
  }
  
  .auth-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #555;
  }
  
  input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
  }
  
  button[type="submit"] {
    width: 100%;
    padding: 0.8rem;
    background: #e94560;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  button[type="submit"]:hover {
    background: #d32f4b;
  }
  
  button[type="submit"]:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .error-message {
    color: #d32f2f;
    background: #ffebee;
    padding: 0.8rem;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .switch-mode {
    text-align: center;
    margin-top: 1.5rem;
    color: #666;
  }
  
  .switch-mode button {
    background: none;
    border: none;
    color: #e94560;
    cursor: pointer;
    font-weight: 500;
    margin-left: 0.5rem;
  }
  
  .spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>