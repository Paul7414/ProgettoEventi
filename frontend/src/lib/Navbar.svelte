<script>
  import { authStore } from '$lib/authStore';
  import { goto } from '$app/navigation';
  
  let luogoSelezionato = "";
  let luoghiDisponibili = [
    "Milano", "Roma", "Torino", "Firenze", 
    "Napoli", "Bologna", "Venezia", "Palermo"
  ];
  
  function handleProfileClick() {
    $authStore.isAuthenticated ? goto('/profile') : goto('/auth');
  }
  
  function handleCalendarClick() {
    if ($authStore.isAuthenticated) {
      goto('/miei-eventi');
    } else {
      goto('/auth');
    }
  }
  
  function handleLogoClick() {
    goto('/');
  }
  
  function cercaEventi() {
    console.log("Cerca eventi a:", luogoSelezionato);
  }
</script>

<nav class="navbar">
  <div class="navbar-container">
    <div class="logo">
      <svg viewBox="0 0 24 24" class="logo-icon" on:click={handleLogoClick}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
      <span on:click={handleLogoClick}>Eventers</span>
    </div>
    
    
    
    <div class="profile-section">
      {#if $authStore.isAuthenticated}
        <button class="add-event-button" on:click={() => goto('/nuovo-evento')}>
          <svg viewBox="0 0 24 24" class="add-icon">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
        
        <button class="calendar-button" on:click={handleCalendarClick}>
          <svg viewBox="0 0 24 24" class="calendar-icon">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
          </svg>
        </button>
      {/if}
      
      <div class="profile-icon" on:click={handleProfileClick}>
        <svg viewBox="0 0 24 24" class="user-icon">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
        </svg>
        {#if $authStore.isAuthenticated}
          <span class="user-badge"><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#e3e3e3"><path d="M80-160v-100q0-33.67 17-62.33Q114-351 146.67-366q65-30 126.33-45.33 61.33-15.34 127-15.34 29.33 0 60.5 3.34Q491.67-420 523.33-412l-56 56q-17-2-33.5-3T400-360q-62.33 0-112.83 12.67-50.5 12.66-112.5 41.33-14.34 7-21.17 20-6.83 13-6.83 26v33.33h296L509.33-160H80Zm544 16L484-284l46.67-46.67L624-237.33l209.33-209.34L880-400 624-144ZM400-481.33q-66 0-109.67-43.67-43.66-43.67-43.66-109.67t43.66-109.66Q334-788 400-788t109.67 43.67q43.66 43.66 43.66 109.66T509.67-525Q466-481.33 400-481.33Zm42.67 254.66ZM400-548q37 0 61.83-24.83 24.84-24.84 24.84-61.84t-24.84-61.83Q437-721.33 400-721.33t-61.83 24.83q-24.84 24.83-24.84 61.83t24.84 61.84Q363-548 400-548Zm0-86.67Z"/></svg></span>
        {/if}
      </div>
    </div>
  </div>
</nav>

<style>
  .calendar-button {
    background: #4a80f0;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-right: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(74, 128, 240, 0.3);
  }

  .calendar-button:hover {
    background: #3a6fd8;
    transform: scale(1.1);
  }

  .calendar-icon {
    width: 20px;
    height: 20px;
    fill: white;
  }

  .add-event-button {
    background: #e94560;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-right: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 5px rgba(233, 69, 96, 0.3);
  }

  .add-event-button:hover {
    background: #d32f4b;
    transform: scale(1.1);
  }

  .add-icon {
    width: 24px;
    height: 24px;
    fill: white;
  }

  .user-badge {
    margin-left: 0.5rem;
    font-size: 0.9rem;
    font-weight: 500;
  }
  
  .navbar {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
    padding: 0.8rem 2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
  }
  
  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 1.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  
  .logo:hover {
    transform: scale(1.05);
  }
  
  .logo-icon {
    width: 28px;
    height: 28px;
    fill: #e94560;
  }
  
  .search-container {
    flex-grow: 1;
    max-width: 600px;
    margin: 0 2rem;
  }
  
  .search-box {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 30px;
    padding: 0.3rem;
    transition: all 0.3s ease;
    border: 1px solid transparent;
  }
  
  .search-box:focus-within {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.2);
  }
  
  .search-icon {
    width: 20px;
    height: 20px;
    fill: rgba(255, 255, 255, 0.7);
    margin-left: 0.8rem;
  }
  
  .search-input {
    flex-grow: 1;
    background: transparent;
    border: none;
    color: white;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    outline: none;
  }
  
  .search-input::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  .search-button {
    background: #e94560;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 0.6rem 1.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .search-button:hover {
    background: #d32f4b;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(233, 69, 96, 0.3);
  }
  
  .profile-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .profile-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .profile-icon:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
  
  .user-icon {
    width: 24px;
    height: 24px;
    fill: white;
  }
  
  @media (max-width: 768px) {
    .calendar-button {
      width: 36px;
      height: 36px;
      margin-right: 0.5rem;
    }
    
    .calendar-icon {
      width: 18px;
      height: 18px;
    }
    
    .add-event-button {
      width: 36px;
      height: 36px;
      margin-right: 0.5rem;
    }
    
    .add-icon {
      width: 20px;
      height: 20px;
    }
    
    .navbar {
      padding: 0.5rem 1rem;
    }
    
    .navbar-container {
      flex-wrap: wrap;
    }
    
    .logo {
      order: 1;
      font-size: 1.2rem;
      margin-right: auto;
    }
    
    .logo-icon {
      width: 24px;
      height: 24px;
    }
    
    .search-container {
      order: 3;
      width: 100%;
      margin: 0.5rem 0 0 0;
    }
    
    .profile-section {
      order: 2;
      margin-left: auto;
    }
    
    .profile-icon {
      width: 36px;
      height: 36px;
    }
    
    .user-icon {
      width: 20px;
      height: 20px;
    }
    
    .search-box {
      padding: 0.2rem;
    }
    
    .search-input {
      padding: 0.5rem;
      font-size: 0.9rem;
    }
    
    .search-button {
      padding: 0.4rem 1rem;
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 480px) {
    .logo span {
      display: none;
    }
    
    .search-icon {
      margin-left: 0.5rem;
    }
  }
</style>