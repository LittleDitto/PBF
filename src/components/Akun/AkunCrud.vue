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
        <div class="form-selection">
          <button @click="formType = 'create'">Create Akun</button>
          <button @click="formType = 'update'">Update Akun</button>
          <button @click="formType = 'read'">Read Akun</button>
        </div>

        <!-- Create Akun Form -->
        <div v-if="formType === 'create'" class="form-card">
          <h2>Create Akun</h2>
          <form @submit.prevent="handleCreateAkun">
            <label for="id_akun">ID Akun:</label>
            <input type="text" v-model="akun.id_akun" required />

            <label for="id_level_akses">Level Akses:</label>
              <select v-model="akun.id_level_akses" required>
                <option value="" disabled selected>Select level akses</option>
                  <option v-for="level in levelAksesList" :key="level.id_level_akses" :value="level.id_level_akses">
                    {{ level.hak_akses }} (Priority: {{ level.priority_akses }})
                  </option>
              </select>
            <label for="username">Username:</label>
            <input type="text" v-model="akun.username" required />

            <label for="password">Password:</label>
            <input type="password" v-model="akun.password" required />

            <button type="submit">Create</button>
          </form>
        </div>

        <!-- Update Akun Form -->
        <div v-if="formType === 'update'" class="form-card">
          <h2>Update Akun</h2>
          <form @submit.prevent="handleUpdateAkun">
            <label for="id_akun">ID Akun:</label>
            <input type="text" v-model="akun.id_akun" disabled />
            <label for="username">Username:</label>
            <input type="text" v-model="akun.username" required />
            <label for="password">Password:</label>
            <input type="password" v-model="akun.password" required />
            <button type="submit">Update</button>
          </form>
        </div>

        <!-- Read Akun -->
        <div v-if="formType === 'read'" class="card">
          <div v-if="akunList.length === 0">No accounts available.</div>
          <div v-for="account in akunList" :key="account.id_akun">
            <p>{{ account.username }}</p>
            <button @click="editAkun(account.id_akun)">Edit</button>
            <button @click="confirmDelete(account.id_akun)">Delete</button>
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
import { createAkun, getAllAkun, getAkun, updateAkun, deleteAkun } from '@/services/bloc/AkunApi';
import { getLevelAkses, getAllLevelAkses } from '@/services/bloc/LevelAksesApi';
import userInfo from '@/services/helpers/UserInfo';

export default {
  data() {
    return {
      dropdownVisible: false,
      formType: '',
      akun: { id_akun: '', username: '', password: '', id_level_akses: '' },
      akunList: [],
      loggedInUser: null,
      accessDetails: { hak_akses: '', priority_akses: '' },
      levelAksesList: [],
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
    async fetchLevelAksesList() {
      try {
        const levels = await getAllLevelAkses();
        this.levelAksesList = levels;
      } catch (error) {
        console.error('Error fetching level akses list:', error);
      }
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
        }
      }
    },
    async fetchAkunList() {
      try {
        const akun = await getAllAkun();
        this.akunList = akun;
      } catch (error) {
        console.error('Error fetching akun list:', error);
      }
    },
    async handleCreateAkun() {
      try {
        if (!this.akun.id_akun || !this.akun.id_level_akses || !this.akun.username || !this.akun.password) {
          alert('Please fill in all fields');
          return;
        }
        const response = await createAkun(this.akun);
        alert('Akun created successfully',response);
        this.fetchAkunList();
        this.formType = '';
        this.akun = { id_akun: '', id_level_akses: '', username: '', password: '' };
      } catch (error) {
        console.error('Error creating akun:', error);
        alert('Failed to create akun');
      }
    },
    async editAkun(id) {
      try {
        const accountData = await getAkun(id);
        if (accountData) {
          this.akun = { ...accountData };
          this.formType = 'update';
        }
      } catch (error) {
        console.error('Error fetching akun details:', error);
      }
    },
    async handleUpdateAkun() {
      try {
        const response = await updateAkun(this.akun.id_akun, this.akun);
        alert('Akun updated successfully',response);
        this.fetchAkunList();
        this.formType = '';
      } catch (error) {
        console.error('Error updating akun:', error);
      }
    },
    async deleteAkun(id) { 
      try { 
        await deleteAkun(id); 
        alert('Akun deleted successfully'); 
        this.fetchAkunList();
      } catch (error) {
        console.error(': Error deleting akun:', error); 
        alert('Failed to delete akun');
      } 
    }, 
    async confirmDelete(id) { 
      const confirmed = confirm('Are you sure you want to delete this akun?'); 
      if (confirmed) { 
        this.deleteAkun(id);
      }
    },
  },
  async mounted() { 
    await this.loadLoggedInUser(); 
    await this.fetchAkunList();
    await this.fetchLevelAksesList(); 
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
  right: 30px;
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