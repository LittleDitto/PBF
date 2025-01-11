<template>
    <div class="app-container">
      <!-- Header -->
      <div class="header">
        <div>Menu</div>
        <div class="dropdown-container">
          <!-- Button to toggle dropdown -->
          <button @click="toggleDropdown" class="dropdown-btn">
            ☰
          </button>
  
          <!-- Dropdown menu -->
          <div v-if="dropdownVisible" class="dropdown-menu">
            <button @click="goToFeature('/Akun')" class="dropdown-item">Akun</button>
            <button @click="goToAction('Another Action')" class="dropdown-item">Another</button>
            <button @click="goToAction('Something else here')" class="dropdown-item">Logout</button>
          </div>
        </div>
      </div>
  
      <!-- Main Content -->
      <div class="content">
        <!-- Features Card -->
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Features</h5>
  
            <!-- Features Section with Scroll -->
            <div class="features">
              <div
                v-for="(feature, index) in features"
                :key="index"
                @click="goToFeature(feature.route)"
                class="feature-card"
              >
                {{ feature.name }}
              </div>
            </div>
          </div>
        </div>
  
        <!-- Sidebar (Status Pegawai) -->
        <div class="sidebar">
          <div>Status Pegawai</div>
          <div>Fix (tidak ikut terscroll)</div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dropdownVisible: false,
        features: [
          { name: 'Fitur 1', route: '/feature1' },
          { name: 'Fitur 2', route: '/feature2' },
          { name: 'Fitur 3', route: '/feature3' },
          { name: 'Fitur 4', route: '/feature4' },
          { name: 'Fitur 5', route: '/feature5' },
          { name: 'Fitur 6', route: '/feature6' },
          // Add more features as needed
        ],
      };
    },
    methods: {
      toggleDropdown() {
        this.dropdownVisible = !this.dropdownVisible;
      },
      goToFeature(route) {
        this.$router.push(route);
      },
      goToAction(action) {
        console.log(`Action selected: ${action}`);
      },
    },
  };
  </script>
  
  <style scoped>
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  body {
    background-color: #f9f9f9;
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
  
  .header {
    background-color: #1d4ed8;
    color: #d1d5db;
    font-size: 24px;
    font-weight: bold;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .dropdown-container {
    position: relative;
  }
  
  .dropdown-btn {
    background-color: transparent;
    border: none;
    color: #d1d5db;
    cursor: pointer;
    font-size: 20px;
  }
  
  .dropdown-menu {
    position: absolute;
    top: 40px;
    left: auto;
    right: 0;
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    min-width: 150px; /* Adjust as needed */
    max-width: calc(100vw - 20px); /* Ensure it doesn't go outside the viewport */
    display: block;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
}
    .dropdown-item:hover {
        background-color: #0dcfedbc; /* Warna latar saat hover */
        color: #1e3c7e; /* Warna teks saat hover */
}  

  .dropdown-item {
    display: block;
    width: 100%;
    padding: 10px;
    text-align: left;
    border: none;
    background: none;
    cursor: pointer;
  }
  
  .content {
    padding: 24px;
    display: flex;
  }
  
  .card {
    flex: 1;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    background-color: white;
  }
  
  .card-body {
    padding: 24px;
  }
  
  .card-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 16px;
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    max-height: 300px; /* Adjust height for scrolling */
    overflow-y: auto; /* Enable scrolling when the content overflows */
  }
  
  .feature-card {
    border: 2px solid #ef4444;
    padding: 24px;
    text-align: center;
    color: #6b7280;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
  
  .sidebar {
    width: 25%;
    margin-left: 24px;
    border: 2px solid #d1d5db;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    background-color: #f9fafb;
    position: sticky;
    top: 16px;
  }
  
  .sidebar div:first-child {
    color: #374151;
    margin-bottom: 16px;
  }
  
  .sidebar div:last-child {
    color: #6b7280;
  }
  </style>
  