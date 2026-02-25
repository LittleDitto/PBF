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
      <!-- Detail Akun Form -->
      <div class="shared-card">
        <div class="shared-card-body">
          <h5 class="shared-card-title">Detail Akun</h5>
          <form @submit.prevent="saveAkunDetails">
            <div v-for="(value, key) in filteredAkunDetails" :key="key" class="shared-form-group">
              <label class="shared-form-label">{{ formatLabel(key) }}</label>
              <input v-model="akunDetails[key]" type="text" class="shared-form-input" />
            </div>
            <button type="submit" class="shared-btn shared-btn-primary">Save</button>
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
import userInfo from '@/services/helpers/UserInfo';
import { getLevelAkses } from '@/services/bloc/LevelAksesApi';
import { getDetailAkun, createDetailAkun, updateDetailAkun } from '@/services/bloc/AkunDetailApi';

export default {
  data() {
    return {
      dropdownVisible: false,
      akunDetails: {},
      loggedInUser: null,
      accessDetails: { hak_akses: '', priority_akses: '' },
    };
  },
  computed: {
    filteredAkunDetails() {
      const excludedKeys = ['id_akun', 'created_at', 'updated_at'];
      return Object.keys(this.akunDetails)
        .filter(key => !excludedKeys.includes(key))
        .reduce((obj, key) => {
          obj[key] = this.akunDetails[key];
          return obj;
        }, {});
    },
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
    async saveAkunDetails() {
      try {
        if (this.akunDetails && this.akunDetails.id_detail) {
          await updateDetailAkun(this.akunDetails.id_detail, this.akunDetails);
          alert('Detail Akun updated successfully');
        } else {
          await createDetailAkun(this.akunDetails);
          alert('Detail Akun created successfully');
        }
        this.loadAkunDetails();
      } catch (error) {
        console.error('Error saving akun details:', error);
        alert('Failed to save akun details');
      }
    },
    async loadAkunDetails() {
      try {
        const data = await getDetailAkun();
        this.akunDetails = data;
      } catch (error) {
        console.error('Error fetching akun details:', error);
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
  },
  mounted() {
    this.loadLoggedInUser();
    this.loadAkunDetails();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdownOutside);
  },
};
</script>
