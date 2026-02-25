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
      <div class="shared-main-area">
        <!-- Loading Indicator -->
        <div v-if="isLoading" class="shared-loading">Loading...</div>

        <!-- Buttons to choose form type -->
        <div class="shared-form-selection">
          <button @click="formType = 'create'">Create Level Akses</button>
          <button @click="formType = 'update'">Update Level Akses</button>
          <button @click="formType = 'read'">Read Level Akses</button>
        </div>

        <!-- Create Level Akses Form -->
        <div v-if="formType === 'create'" class="shared-form-card">
          <h2>Create Level Akses</h2>
          <form @submit.prevent="handleCreateLevelAkses">
            <label>ID Level Akses:</label>
            <input type="text" v-model="levelAkses.id_level_akses" required />

            <label>Hak Akses:</label>
            <input type="text" v-model="levelAkses.hak_akses" required />

            <label>Priority Akses:</label>
            <input type="text" v-model="levelAkses.priority_akses" required />

            <button type="submit">Create</button>
          </form>
        </div>

        <!-- Update Level Akses Form -->
        <div v-if="formType === 'update'" class="shared-form-card">
          <h2>Update Level Akses</h2>
          <form @submit.prevent="handleUpdateLevelAkses">
            <label>ID Level Akses:</label>
            <input type="text" v-model="levelAkses.id_level_akses" disabled />
            <label>Hak Akses:</label>
            <input type="text" v-model="levelAkses.hak_akses" required />
            <label>Priority Akses:</label>
            <input type="text" v-model="levelAkses.priority_akses" required />
            <button type="submit">Update</button>
          </form>
        </div>

        <!-- Read Level Akses -->
        <div v-if="formType === 'read'" class="shared-card">
          <div class="shared-card-body">
            <div v-if="levelAksesList.length === 0" class="shared-empty">No level akses available.</div>
            <div v-for="level in levelAksesList" :key="level.id_level_akses" class="shared-account-item">
              <p>{{ level.hak_akses }} (Priority: {{ level.priority_akses }})</p>
              <div>
                <button @click="editLevelAkses(level.id_level_akses)" class="edit-btn">Edit</button>
                <button @click="deleteLevelAkses(level.id_level_akses)" class="delete-btn">Delete</button>
              </div>
            </div>
          </div>
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
import { createLevelAkses, getAllLevelAkses, getLevelAkses, updateLevelAkses, deleteLevelAkses } from '@/services/bloc/LevelAksesApi';
import userInfo from '@/services/helpers/UserInfo';

export default {
  data() {
    return {
      dropdownVisible: false,
      formType: '',
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
    async handleCreateLevelAkses() {
      try {
        if (!this.levelAkses.id_level_akses || !this.levelAkses.hak_akses || !this.levelAkses.priority_akses) {
          alert('Please fill in all fields');
          return;
        }
        this.isLoading = true;
        const response = await createLevelAkses(this.levelAkses);
        alert('Level Akses created successfully');
        console.log('Level Akses created:', response);
        this.fetchLevelAksesList();
        this.formType = '';
        this.levelAkses = { id_level_akses: '', hak_akses: '', priority_akses: '' };
      } catch (error) {
        console.error('Error creating level akses:', error);
        alert('Failed to create level akses');
      } finally {
        this.isLoading = false;
      }
    },
    async editLevelAkses(id) {
      try {
        const levelData = await getLevelAkses(id);
        if (levelData) {
          this.levelAkses = { ...levelData };
          this.formType = 'update';
        } else {
          console.error('Level Akses not found');
        }
      } catch (error) {
        console.error('Error fetching level akses details:', error);
      }
    },
    async handleUpdateLevelAkses() {
      try {
        const response = await updateLevelAkses(this.levelAkses.id_level_akses, this.levelAkses);
        alert('Level Akses updated successfully');
        console.log('Level Akses updated:', response);
        this.fetchLevelAksesList();
        this.formType = '';
      } catch (error) {
        console.error('Error updating level akses:', error);
      }
    },
    async deleteLevelAkses(id) {
      try {
        await deleteLevelAkses(id);
        alert('Level Akses deleted successfully');
        this.fetchLevelAksesList();
      } catch (error) {
        console.error('Error deleting level akses:', error);
      }
    },
  },
  mounted() {
    this.loadLoggedInUser();
    this.fetchLevelAksesList();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeDropdownOutside);
  },
};
</script>

<style scoped>
.shared-main-area {
  flex: 1;
  background-color: rgb(243, 236, 227);
  border: #2563eb;
  border-radius: 18px;
  padding: 20px;
}
</style>
