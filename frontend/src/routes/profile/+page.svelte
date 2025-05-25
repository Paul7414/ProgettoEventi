<script>
  import { authStore } from '$lib/authStore';
  import { goto } from '$app/navigation';
  
  function handleLogout() {
    authStore.logout();
    goto('/');
  }
</script>


<div class="profile-container">
  <div class="profile-card">
    <h1>Il tuo profilo</h1>
    
    {#if $authStore.user}
      <div class="user-info">
        <div class="avatar">
          <svg viewBox="0 0 24 24" class="avatar-icon">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
        </div>
        
        <div class="details">
          <h2>{$authStore.user.username}</h2>
          <p>Utente registrato</p>
        </div>
      </div>
      
      <button on:click={handleLogout} class="logout-button">
        Esci
      </button>
    {:else}
      <p>Non sei autenticato</p>
      <button on:click={() => navigate('/auth')} class="login-button">
        Accedi
      </button>
    {/if}
  </div>
</div>

<style>
  .profile-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 2rem;
    background: #f5f5f5;
  }
  
  .profile-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 500px;
    text-align: center;
  }
  
  h1 {
    margin-bottom: 2rem;
    color: #333;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    text-align: left;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    background: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .avatar-icon {
    width: 40px;
    height: 40px;
    fill: #666;
  }
  
  .details h2 {
    margin: 0;
    color: #222;
  }
  
  .details p {
    margin: 0.5rem 0 0;
    color: #666;
  }
  
  .logout-button, .login-button {
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
  
  .logout-button:hover, .login-button:hover {
    background: #d32f4b;
  }
</style>