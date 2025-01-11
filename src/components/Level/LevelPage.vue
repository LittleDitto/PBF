<template>
    <div class="app-container">
      <!-- Header -->
      <div class="header">
        <div>Menu</div>
        <div class="dropdown-container">
          <button @click="toggleDropdown" class="dropdown-btn">☰</button>
          <div v-if="dropdownVisible" class="dropdown-menu">
            <button @click="goToFeature('/Akun')" class="dropdown-item">Akun</button>
            <button @click="goToAction('Another Action')" class="dropdown-item">Another</button>
            <button @click="logout" class="dropdown-item">Logout</button>
          </div>
        </div>
      </div>
  
      <!-- Main Content -->
      <div class="content">
        <div class="main-content">
          <!-- Loading Indicator -->
          <div v-if="isLoading">Loading...</div>
  
          <!-- Buttons to choose form type -->
          <div class="form-selection">
            <button @click="formType = 'create'">Create Level Akses</button>
            <button @click="formType = 'update'">Update Level Akses</button>
            <button @click="formType = 'read'">Read Level Akses</button>
          </div>
  
          <!-- Create Level Akses Form -->
          <div v-if="formType === 'create'" class="form-card">
            <h2>Create Level Akses</h2>
            <form @submit.prevent="handleCreateLevelAkses">
              <label for="id_level_akses">ID Level Akses:</label>
              <input type="text" v-model="levelAkses.id_level_akses" required />
  
              <label for="hak_akses">Hak Akses:</label>
              <input type="text" v-model="levelAkses.hak_akses" required />
  
              <label for="priority_akses">Priority Akses:</label>
              <input type="text" v-model="levelAkses.priority_akses" required />
  
              <button type="submit">Create</button>
            </form>
          </div>
  
          <!-- Update Level Akses Form -->
          <div v-if="formType === 'update'" class="form-card">
            <h2>Update Level Akses</h2>
            <form @submit.prevent="handleUpdateLevelAkses">
              <label for="id_level_akses">ID Level Akses:</label>
              <input type="text" v-model="levelAkses.id_level_akses" disabled />
              <label for="hak_akses">Hak Akses:</label>
              <input type="text" v-model="levelAkses.hak_akses" required />
              <label for="priority_akses">Priority Akses:</label>
              <input type="text" v-model="levelAkses.priority_akses" required />
              <button type="submit">Update</button>
            </form>
          </div>
  
          <!-- Read Level Akses -->
          <div v-if="formType === 'read'" class="card">
            <div v-if="levelAksesList.length === 0">No level akses available.</div>
            <div v-for="level in levelAksesList" :key="level.id_level_akses">
              <p>{{ level.hak_akses }} (Priority: {{ level.priority_akses }})</p>
              <button @click="editLevelAkses(level.id_level_akses)">Edit</button>
              <button @click="deleteLevelAkses(level.id_level_akses)">Delete</button>
            </div>
          </div>
        </div>
  
        <!-- Sidebar (Status Pegawai) -->
        <div class="sidebar">
          <div>Status Pegawai</div>
          <div v-if="loggedInUser">
            <strong>{{ loggedInUser.username }}</strong>
            <div>Hak Akses: {{ accessDetails.hak_akses || 'N/A' }}</div>
            <div>Priority Akses: {{ accessDetails.priority_akses || 'N/A' }}</div>
          </div>
          <div v-else>
            <span>Tidak ada pegawai yang login</span>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { createLevelAkses, getAllLevelAkses, getLevelAkses, updateLevelAkses, deleteLevelAkses } from '@/services/bloc/LevelAksesApi';
  import userInfo from '@/services/helpers/UserInfo';
  
  export default {
    data() {
      return {
        dropdownVisible: false,
        formType: '', // Holds the current form type (create, update, read)
        levelAkses: {
          id_level_akses: '',
          hak_akses: '',
          priority_akses: '',
        },
        levelAksesList: [],
        loggedInUser: null,
        accessDetails: { hak_akses: '', priority_akses: '' },
        isLoading: false,
      };
    },
    methods: {
      toggleDropdown() {
        this.dropdownVisible = !this.dropdownVisible;
      },
      goToFeature(route) {
        this.$router.push(route);
      },
      logout() {
        userInfo.logout();
        this.loggedInUser = null;
        this.$router.push('/');
      },
      async loadLoggedInUser() {
        const user = userInfo.getUserInfo();
        if (user) {
          this.loggedInUser = user;
          const idLevelAkses = userInfo.getLevelAkses();
          if (idLevelAkses) {
            try {
              const accessData = await getLevelAkses(idLevelAkses);
              this.accessDetails = accessData;
            } catch (error) {
              console.error("Error fetching access details:", error);
            }
          } else {
            console.error("id_level_akses is missing");
            this.accessDetails = { hak_akses: 'N/A', priority_akses: 'N/A' };
          }
        } else {
          console.error('User data not found in userInfo');
        }
      },
      // Fetch the list of level akses
      async fetchLevelAksesList() {
        try {
          console.log('Fetching level akses details...');
          const levelAkses = await getAllLevelAkses();
          this.levelAksesList = levelAkses;
          console.log('Fetched Level Akses Details:', levelAkses);
        } catch (error) {
          console.error('Error fetching level akses list:', error);
        }
      },
      // Handle level akses creation
      async handleCreateLevelAkses() {
        try {
          if (!this.levelAkses.id_level_akses || !this.levelAkses.hak_akses || !this.levelAkses.priority_akses) {
            alert('Please fill in all fields');
            return;
          }
  
          this.isLoading = true; // Indicate loading
  
          const response = await createLevelAkses(this.levelAkses); // Send data to API
  
          alert('Level Akses created successfully');
          console.log('Level Akses created:', response);
  
          this.fetchLevelAksesList(); // Refresh list after creation
  
          // Reset form
          this.formType = '';
          this.levelAkses = { id_level_akses: '', hak_akses: '', priority_akses: '' };
        } catch (error) {
          console.error('Error creating level akses:', error);
          alert('Failed to create level akses');
        } finally {
          this.isLoading = false;
        }
      },
      // Edit level akses by populating form with selected level's details
      async editLevelAkses(id) {
        try {
          const levelData = await getLevelAkses(id);
          if (levelData) {
            this.levelAkses = { ...levelData }; // Populate form with level data
            this.formType = 'update'; // Switch to update form
          } else {
            console.error('Level Akses not found');
          }
        } catch (error) {
          console.error('Error fetching level akses details:', error);
        }
      },
      // Handle level akses update
      async handleUpdateLevelAkses() {
        try {
          const response = await updateLevelAkses(this.levelAkses.id_level_akses, this.levelAkses);
          alert('Level Akses updated successfully');
          console.log('Level Akses updated:', response);
          this.fetchLevelAksesList(); // Refresh list after update
          this.formType = ''; // Reset form
        } catch (error) {
          console.error('Error updating level akses:', error);
        }
      },
      // Delete level akses
      async deleteLevelAkses(id) {
        try {
          await deleteLevelAkses(id);
          alert('Level Akses deleted successfully');
          this.fetchLevelAksesList(); // Refresh list after deletion
        } catch (error) {
          console.error('Error deleting level akses:', error);
        }
      },
    },
    mounted() {
      this.loadLoggedInUser();
      this.fetchLevelAksesList();
    },
  };
  </script>
<style lang="css" scoped>
/* App Container */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}

/* Body */
body {
  margin: 0;
  padding: 0;
}

/* Header */
.header {
  background-color: #1d4ed8;
  color: #d1d5db;
  font-size: 24px;
  font-weight: bold;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Dropdown */
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
  right: 0;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 150px;
  max-width: 200px;
  display: block;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dropdown-item {
  display: block;
  padding: 10px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #0dcfedbc;
  color: #1e3c7e;
}

/* Main Content Area */
.content {
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: 24px;
  padding: 24px;
}

.main-content {
  background-color: rgb(243, 236, 227);
  flex: 3;
  border: #2563eb;
  border-radius: 18px;
}

.form-selection {
  margin-top: 15px;
  margin-bottom: 24px;
}
button {
  border-radius: 10px;
  display: inline-block;
  margin-right: 10px;
}
.form-card {
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

form {
  display: flex;
  flex-direction: column;
}

form label {
  margin-top: 10px;
  font-weight: bold;
}

form input {
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

form button {
  padding: 12px;
  background-color: #1d4ed8;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

form button:hover {
  background-color: #2563eb;
}

/* Sidebar */
.sidebar {
  width: 25%;
  margin-left: 24px;
  padding: 12px;  /* Mengurangi padding */
  border: 2px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: sticky;
  top: 16px;
  max-height: 200px; /* Menetapkan tinggi maksimal jika perlu */
  overflow-y: auto; /* Menambahkan scroll jika kontennya melebihi tinggi */
}

.sidebar div:first-child {
  color: #374151;
  font-weight: bold;
  margin-bottom: 8px;  /* Mengurangi margin bawah */
  font-size: 16px;  /* Mengurangi ukuran font */
}

.sidebar div:last-child {
  color: #6b7280;
  font-size: 14px;  /* Mengurangi ukuran font */
}


/* Mobile responsiveness */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    margin-left: 0;
    margin-top: 16px;
  }

  .content {
    flex-direction: column;
  }

  .form-card {
    width: 100%;
    max-width: 100%;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>