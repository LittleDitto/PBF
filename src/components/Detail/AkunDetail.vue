<template>
    <div class="app-container">
      <!-- Header -->
      <div class="header">
        <div>Menu</div>
        <div class="dropdown-container">
          <!-- Button to toggle dropdown -->
          <button @click="toggleDropdown" class="dropdown-btn">☰</button>
  
          <!-- Dropdown menu -->
          <div v-if="dropdownVisible" class="dropdown-menu">
            <button @click="goToFeature('/Akun')" class="dropdown-item">Akun</button>
            <button @click="goToAction('Another Action')" class="dropdown-item">Another</button>
            <button @click="logout" class="dropdown-item">Logout</button>
          </div>
        </div>
      </div>
  
      <!-- Main Content -->
      <div class="content">
        <!-- Detail Akun Form -->
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Detail Akun</h5>
            <form @submit.prevent="saveAkunDetails">
                <div v-for="(value, key) in filteredAkunDetails" :key="key" class="form-group">
                    <label :for="key">{{ formatLabel(key) }}</label>
                    <input 
                    v-model="akunDetails[key]" 
                    :id="key" 
                    :name="key" 
                    type="text" 
                    class="form-control"
                    />
                </div>
                <button type="submit">Save</button>
                </form>
          </div>
        </div>
  
        <!-- Sidebar (Status Pegawai) -->
        <div class="sidebar">
          <div>Status Pegawai</div>
          <div v-if="loggedInUser">
            <!-- Menampilkan username yang login -->
            <strong>{{ loggedInUser.username }}</strong>
  
            <!-- Menampilkan Hak Akses dan Priority Akses dari accessDetails -->
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
  import userInfo from '@/services/helpers/UserInfo';
  import { getLevelAkses } from '@/services/bloc/LevelAksesApi';
  import { getDetailAkun,createDetailAkun,updateDetailAkun } from '@/services/bloc/AkunDetailApi';
  //import { APIUrl } from '@/services/helpers/APIUrl'

  export default {
  data() {
    return {
      dropdownVisible: false,
      hiddenFields: ['id_detail', 'id_akun', 'id_level_akses', 'dibuat', '_id'],
      akunDetails: {
        id_detail: '',
        id_akun: '',
        nama_depan: '',
        nama_belakang: '',
        nik: '',
        tempat_lahir: '',
        tanggal_lahir: '',
        email: '',
        no_telepon: '',
        jenis_kelamin: '',
        agama: '',
        kewarganegaraan: '',
        provinsi: '',
        kabupaten: '',
        kecamatan: '',
        kelurahan: '',
        jalan: '',
        transportasi: '',
        id_level_akses: '',
      },
      loggedInUser: null,
      accessDetails: { hak_akses: '', priority_akses: '' },
    };
  },
  computed: {
    filteredAkunDetails() {
      return Object.keys(this.akunDetails)
        .filter(key => !this.hiddenFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = this.akunDetails[key];
          return obj;
        }, {});
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdownVisible = !this.dropdownVisible;
      document.addEventListener('click', this.closeDropdownOutside);
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
      this.loggedInUser = null;
      this.$router.push('/');
    },
    formatLabel(key) {
      return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },
    getInputType(key) {
      return key.includes('email') ? 'email' : key.includes('tanggal') ? 'date' : 'text';
    },
    isFieldRequired(key) {
      return ['nama_depan', 'email', 'no_telepon'].includes(key);
    },
    async saveAkunDetails() {
      try {
        if (!this.akunDetails.id_detail) {
          await this.createDetailAkun();
        } else {
          await this.editDetailAkun();
        }
      } catch (error) {
        console.error('Error saving account details:', error);
        alert('Failed to save account details.');
      }
    },
    async editDetailAkun() {
      try {
        const userID = userInfo.getUserID();
        if (!userID) {
          console.error('Error: User ID is missing.');
          return;
        }

        const accountDetails = await getDetailAkun(userID);
        if (!accountDetails) {
          console.error('Error: Account details not found.');
          return;
        }

        const response = await updateDetailAkun(userID, accountDetails);
        console.log('Account details updated:', response);
      } catch (error) {
        console.error('Error updating account details:', error);
      }
    },
    async createDetailAkun() {
      try {
        this.akunDetails.id_detail = this.akunDetails.id_akun;
        const response = await createDetailAkun(this.akunDetails);
        console.log('Account details created:', response.data);
      } catch (error) {
        console.error('Error creating account details:', error);
      }
    },
    async loadLoggedInUser() {
      const user = userInfo.getUserInfo();
      console.log('User Info:', user);
      if (user) {
        this.loggedInUser = user;
        const idLevelAkses = userInfo.getLevelAkses();
        console.log('ID Level Akses:', idLevelAkses);
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
    async loadAkunDetails() {
      try {
        const data = userInfo.getUserInfo();
        if (data) {
          this.akunDetails.id_akun = data.id_akun || '';
          this.akunDetails.id_level_akses = data.id_level_akses || '';
          const akunDetails = await getDetailAkun(data.id_akun);
          if (akunDetails) {
            Object.assign(this.akunDetails, akunDetails);
          } else {
            this.akunDetails.id_detail = this.akunDetails.id_akun;
          }
        } else {
          console.error('No user info found');
          this.akunDetails = { id_akun: '', id_detail: '', id_level_akses: '' };
        }
      } catch (error) {
        console.error('Error loading account details:', error);
        this.akunDetails = { id_akun: '', id_detail: '', id_level_akses: '' };
      }
    }
  },
  mounted() {
    this.loadLoggedInUser();
    this.loadAkunDetails();
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
  