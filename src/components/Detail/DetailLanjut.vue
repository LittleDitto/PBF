<template>
  <div class="shared-page-container">
    <!-- Header -->
    <div class="shared-header">
      <div class="shared-header-title">Menu</div>
      <div class="shared-dropdown-container">
        <button @click="toggleDropdown" class="shared-dropdown-btn">☰</button>
        <div v-if="dropdownVisible" class="shared-dropdown-menu" ref="dropdownMenu">
          <button @click="goToFeature('/Akun')" class="shared-dropdown-item">Akun</button>
          <button @click="goToAction('Another Action')" class="shared-dropdown-item">Another</button>
          <button @click="logout" class="shared-dropdown-item">Logout</button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="shared-content">
      <!-- Admin: Display list of all accounts -->
      <div class="shared-main-area" v-if="isAdmin && detailAkunList.length > 0">
        <h3>Daftar Akun</h3>
        <div v-for="(akun, index) in detailAkunList" :key="akun.id_akun" class="detail-account-row">
          <div class="detail-row">
            <div class="detail-label">#</div>
            <div class="detail-value">{{ index + 1 }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">ID Detail</div>
            <div class="detail-value">{{ akun.id_detail }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">ID Akun</div>
            <div class="detail-value">{{ akun.id_akun }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Nama Depan</div>
            <div class="detail-value">{{ akun.nama_depan }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Nama Belakang</div>
            <div class="detail-value">{{ akun.nama_belakang }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Email</div>
            <div class="detail-value">{{ akun.email }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">No Telepon</div>
            <div class="detail-value">{{ akun.no_telepon }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Jenis Kelamin</div>
            <div class="detail-value">{{ akun.jenis_kelamin }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Dibuat</div>
            <div class="detail-value">{{ new Date(akun.dibuat).toLocaleString() }}</div>
          </div>
          <div class="detail-actions">
            <button class="shared-btn shared-btn-primary" @click="editAkun(akun)">Edit</button>
            <button class="shared-btn shared-btn-danger" @click="deleteDetailAkun(akun.id_akun)">Delete</button>
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <div class="shared-card">
        <div class="shared-card-body">
          <h5 class="shared-card-title">{{ editMode ? 'Edit Akun' : 'Detail Akun' }}</h5>
          <form @submit.prevent="saveAkunDetails">
            <div v-for="(value, key) in filteredAkunDetails" :key="key" class="shared-form-group">
              <label class="shared-form-label">{{ formatLabel(key) }}</label>
              <input v-model="akunDetails[key]" type="text" class="shared-form-input" :placeholder="getPlaceholder(key)" />
            </div>
            <button type="submit" class="shared-btn shared-btn-success">{{ editMode ? 'Update' : 'Save' }}</button>
            <button v-if="editMode" type="button" class="shared-btn shared-btn-secondary" @click="cancelEdit">Cancel</button>
          </form>
        </div>
      </div>

      <!-- Sidebar (Status Pegawai) -->
      <div class="shared-sidebar">
        <div class="shared-sidebar-title">Status Pegawai</div>
        <div class="shared-sidebar-content" v-if="loggedInUser">
          <strong>{{ loggedInUser.username }}</strong>
          <div>Hak Akses: {{ accessDetails.hak_akses || 'N/A' }}</div>
          <div>Priority Akses: {{ accessDetails.priority_akses || 'N/A' }}</div>
        </div>
        <div class="shared-sidebar-content" v-else>
          <span>Tidak ada pegawai yang login</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllDetailAkun, getDetailAkun, createDetailAkun, updateDetailAkun, deleteDetailAkun } from '@/services/bloc/AkunDetailApi';
import { getLevelAkses } from '@/services/bloc/LevelAksesApi';
import userInfo from '@/services/helpers/UserInfo';

export default {
  data() {
    return {
      dropdownVisible: false,
      detailAkunList: [],
      loggedInUser: null,
      accessDetails: { hak_akses: '', priority_akses: '' },
      editMode: false,
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
    };
  },
  computed: {
    isAdmin() {
      return this.accessDetails.hak_akses === 'admin';
    },
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
      if (this.dropdownVisible) {
        this.$nextTick(() => {
          document.addEventListener('click', this.closeDropdownOutside);
        });
      }
    },
    closeDropdownOutside(event) {
      const dropdownMenu = this.$refs.dropdownMenu;
      if (dropdownMenu && !dropdownMenu.contains(event.target) && !event.target.closest('.shared-dropdown-btn')) {
        this.dropdownVisible = false;
        document.removeEventListener('click', this.closeDropdownOutside);
      }
    },
    goToFeature(route) {
      this.dropdownVisible = false;
      this.$router.push(route);
    },
    goToAction(action) {
      console.log(`Action selected: ${action}`);
      this.dropdownVisible = false;
    },
    logout() {
      userInfo.logout();
      this.loggedInUser = null;
      this.dropdownVisible = false;
      this.$router.push('/');
    },
    formatLabel(key) {
      return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },
    getPlaceholder(key) {
      const placeholders = {
        nama_depan: 'Masukkan nama depan',
        nama_belakang: 'Masukkan nama belakang',
        nik: 'Masukkan NIK',
        tempat_lahir: 'Masukkan tempat lahir',
        tanggal_lahir: 'Masukkan tanggal lahir',
        email: 'Masukkan email',
        no_telepon: 'Masukkan nomor telepon',
        jenis_kelamin: 'L/P',
        agama: 'Masukkan agama',
        kewarganegaraan: 'Masukkan kewarganegaraan',
        provinsi: 'Masukkan provinsi',
        kabupaten: 'Masukkan kabupaten',
        kecamatan: 'Masukkan kecamatan',
        kelurahan: 'Masukkan kelurahan',
        jalan: 'Masukkan jalan',
        transportasi: 'Masukkan transportasi',
      };
      return placeholders[key] || `Masukkan ${key}`;
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
            await this.loadUserDetails();
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
    async loadUserDetails() {
      try {
        const userID = userInfo.getUserID();
        if (userID) {
          const detailData = await getDetailAkun(userID);
          if (detailData) {
            Object.assign(this.akunDetails, detailData);
          } else {
            this.resetAkunDetails();
            this.akunDetails.id_akun = userID;
          }
        }
      } catch (error) {
        console.error('Error loading user details:', error);
        this.resetAkunDetails();
        this.akunDetails.id_akun = userInfo.getUserID();
      }
    },
    resetAkunDetails() {
      this.akunDetails = {
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
      };
    },
    async fetchDetailAkun() {
      try {
        const response = await getAllDetailAkun();
        this.detailAkunList = response;
      } catch (error) {
        console.error('Failed to fetch detail akun:', error);
      }
    },
    editAkun(akun) {
      Object.assign(this.akunDetails, akun);
      this.editMode = true;
    },
    cancelEdit() {
      this.editMode = false;
      this.loadUserDetails();
    },
    async saveAkunDetails() {
      try {
        if (!this.akunDetails.id_detail) {
          await createDetailAkun(this.akunDetails);
          alert('Akun details created successfully!');
        } else {
          await updateDetailAkun(this.akunDetails.id_akun, this.akunDetails);
          alert('Akun details updated successfully!');
        }
        this.editMode = false;
        if (this.isAdmin) {
          this.fetchDetailAkun();
        }
        await this.loadUserDetails();
      } catch (error) {
        console.error('Error saving account details:', error);
        alert('Failed to save account details.');
      }
    },
    async deleteDetailAkun(id) {
      if (!confirm('Are you sure you want to delete this account?')) return;
      try {
        await deleteDetailAkun(id);
        alert('Account deleted successfully!');
        this.fetchDetailAkun();
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account.');
      }
    }
  },
  mounted() {
    this.loadLoggedInUser();
    this.fetchDetailAkun();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdownOutside);
  },
};
</script>

<style scoped>
.shared-main-area {
  flex: 1;
  background-color: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
}

.detail-account-row {
  padding: 15px;
  border: 1px solid #e5e7eb;
  margin-bottom: 10px;
  border-radius: 8px;
}

.detail-row {
  display: flex;
  margin-bottom: 8px;
}

.detail-label {
  font-weight: bold;
  width: 150px;
  color: #374151;
}

.detail-value {
  flex-grow: 1;
  color: #6b7280;
}

.detail-actions {
  text-align: right;
  margin-top: 10px;
}
</style>
