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
        <!-- Display list of Detail Akun -->
        <div v-if="detailAkunList.length > 0">
          <div v-for="(akun, index) in detailAkunList" :key="akun.id_akun" class="account-row">
            <div class="row">
              <div class="label">#</div>
              <div class="value">{{ index + 1 }}</div>
            </div>
            <div class="row">
              <div class="label">ID Detail</div>
              <div class="value">{{ akun.id_detail }}</div>
            </div>
            <div class="row">
              <div class="label">ID Akun</div>
              <div class="value">{{ akun.id_akun }}</div>
            </div>
            <div class="row">
              <div class="label">Nama Depan</div>
              <div class="value">{{ akun.nama_depan }}</div>
            </div>
            <div class="row">
              <div class="label">Nama Belakang</div>
              <div class="value">{{ akun.nama_belakang }}</div>
            </div>
            <div class="row">
              <div class="label">Email</div>
              <div class="value">{{ akun.email }}</div>
            </div>
            <div class="row">
              <div class="label">No Telepon</div>
              <div class="value">{{ akun.no_telepon }}</div>
            </div>
            <div class="row">
              <div class="label">Jenis Kelamin</div>
              <div class="value">{{ akun.jenis_kelamin }}</div>
            </div>
            <div class="row">
              <div class="label">Dibuat</div>
              <div class="value">{{ new Date(akun.dibuat).toLocaleString() }}</div>
            </div>
            <div class="actions">
              <button class="btn btn-danger" @click="deleteDetailAkun(akun.id_akun)">Delete</button>
            </div>
            <hr />
          </div>
        </div>
        <div v-else>
          <p>No account details available.</p>
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
import { getAllDetailAkun, deleteDetailAkun } from '@/services/bloc/AkunDetailApi';
import { getLevelAkses } from '@/services/bloc/LevelAksesApi';
import userInfo from '@/services/helpers/UserInfo';

export default {
  data() {
    return {
      dropdownVisible: false,
      detailAkunList: [], // Store list of account details
      loggedInUser: null,
      accessDetails: { hak_akses: '', priority_akses: '' },
    };
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
      if (this.dropdownVisible) {
        document.addEventListener('click', this.closeDropdownOutside);
      }
    },
    closeDropdownOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.dropdownVisible = false;
        document.removeEventListener('click', this.closeDropdownOutside);
      }
    },
    goToFeature(route) {
      this.$router.push(route);
    },
    goToAction(action) {
      console.log(`Action selected: ${action}`);
    },
    logout() {
      userInfo.logout();
      this.$router.push('/');
    },
    async loadLoggedInUser() {
        const user = userInfo.getUserInfo();
        //console.log('User Info:', user); // Debug user info  
        if (user) {
          this.loggedInUser = user;
          // Ambil level akses langsung dari userInfo
          const idLevelAkses = userInfo.getLevelAkses(); // Tidak perlu panggil getLevelAkses API di sini
          //console.log('ID Level Akses:', idLevelAkses); // Debug id_level_akses
          if (idLevelAkses) {
            try {
              // Ambil data level akses berdasarkan id_level_akses dari API
              const accessData = await getLevelAkses(idLevelAkses); // Panggil getLevelAkses dengan idLevelAkses
              this.accessDetails = accessData; // Simpan data akses
            } catch (error) {
              console.error("Error fetching access details:", error);
            }
          } else {
            console.error("id_level_akses is missing");
            this.accessDetails = { hak_akses: 'N/A', priority_akses: 'N/A' }; // Nilai default jika tidak ada
          }
        } else {
          console.error('User data not found in userInfo');
        }
      },
      async fetchDetailAkun() {
      try {
        const response = await getAllDetailAkun();
        console.log('Fetched data:', response); // Debugging
        this.detailAkunList = response; // Menyimpan data yang diambil ke detailAkunList
      } catch (error) {
        console.error('Failed to fetch detail akun:', error);
      }
    },
    async deleteDetailAkun(id) {
      try {
        const response = await deleteDetailAkun(id);
        console.log('Account deleted:', response);
        this.fetchDetailAkun();
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  },
  mounted() {
    this.loadLoggedInUser();
    this.fetchDetailAkun();
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
  background-color: rgb(255, 255, 255);
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 150px;
  max-width: calc(100vw - 20px);
  display: block;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 10px;
  color: #151515;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #0dcfedbc;
  color: #1e3c7e;
}

.content {
  padding: 24px;
  display: flex;
  flex-direction: column;
}

/* Table styling */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table th, table td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid #171616;
}

table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.table-container {
  border: 2px solid #151515;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
}

/* Row-based layout */
.account-row {
  padding: 15px;
  border: 1px solid #1e1d1d;
  margin-bottom: 10px;
}

.row {
  display: flex;
  margin-bottom: 8px;
  border: #151515;
}

.label {
  font-weight: bold;
  width: 150px;
}

.value {
  flex-grow: 1;
}

.actions {
  text-align: right;
}

button {
  padding: 8px 12px;
  background-color: #dc3545;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #c82333;
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
  max-height: 300px;
  overflow-y: auto;
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
  background-color: #678cb2;
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

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.akun-card {
  border: 1px solid #ddd;
  padding: 15px;
  width: 250px;
  border-radius: 8px;
}

.card-body {
  text-align: center;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
}

.card-text {
  font-size: 14px;
}

.btn-danger {
  background-color: #f44336;
  border: none;
  color: white;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 4px;
}

.btn-danger:hover {
  background-color: #c53030;
}

</style>
