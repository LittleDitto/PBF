<template>
    <div class="shared-page-container">
      <!-- Header -->
      <div class="shared-header">
        <div class="shared-header-title">Menu</div>
        <div class="shared-dropdown-container">
          <!-- Button to toggle dropdown -->
          <button @click="toggleDropdown" class="shared-dropdown-btn">☰</button>
  
          <!-- Dropdown menu -->
          <div v-if="dropdownVisible" class="shared-dropdown-menu" ref="dropdownMenu">
            <button @click="goToFeature('/Akun')" class="shared-dropdown-item">Akun</button>
            <button @click="goToAction('Another Action')" class="shared-dropdown-item">Another</button>
            <button @click="logout" class="shared-dropdown-item">Logout</button>
          </div>
        </div>
      </div>
  
      <!-- Main Content -->
      <div class="shared-content">
        <!-- Features Card -->
        <div class="shared-card">
          <div class="shared-card-body">
            <h5 class="shared-card-title">Akun</h5>
  
            <!-- Features Section with Scroll -->
            <div class="shared-features">
              <div
                v-for="(feature, index) in features"
                :key="index"
                @click="goToFeature(feature.route)"
                class="shared-feature-card"
              >
                {{ feature.name }}
              </div>
            </div>
          </div>
        </div>
  
        <!-- Sidebar (Status Pegawai) -->
        <div class="shared-sidebar">
            <div class="shared-sidebar-title">Status Pegawai</div>
            <div class="shared-sidebar-content" v-if="loggedInUser">
                <!-- Menampilkan username yang login -->
                <strong>{{ loggedInUser.username }}</strong>

                <!-- Menampilkan Hak Akses dan Priority Akses dari accessDetails -->
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

export default {
  data() {
    return {
      dropdownVisible: false,
      features: [
        { name: 'Detail', route: '/Detail' },
        { name: 'Akun Crud', route: '/AkunCrud' },
        { name: 'Level Page', route: '/LevelPage' },
        { name: 'See Detail', route: '/DetailLanjut' },
        { name: 'Fitur 5', route: '/feature5' },
        { name: 'Fitur 6', route: '/feature6' },
      ],
      loggedInUser: null,
      accessDetails: { hak_akses: '', priority_akses: '' },
    };
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
    }
  },
  mounted() {
    this.loadLoggedInUser();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdownOutside);
  },
};
</script>
