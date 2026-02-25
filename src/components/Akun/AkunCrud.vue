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
        <div class="shared-form-selection">
          <button @click="formType = 'create'">Create Akun</button>
          <button @click="formType = 'update'">Update Akun</button>
          <button @click="formType = 'read'">Read Akun</button>
        </div>

        <!-- Create Akun Form -->
        <div v-if="formType === 'create'" class="shared-form-card">
          <h2>Create Akun</h2>
          <form @submit.prevent="handleCreateAkun">
            <label>ID Akun:</label>
            <input type="text" v-model="akun.id_akun" required />

            <label>Level Akses:</label>
            <select v-model="akun.id_level_akses" required>
              <option value="" disabled selected>Select level akses</option>
              <option v-for="level in levelAksesList" :key="level.id_level_akses" :value="level.id_level_akses">
                {{ level.hak_akses }} (Priority: {{ level.priority_akses }})
              </option>
            </select>
            <label>Username:</label>
            <input type="text" v-model="akun.username" required />

            <label>Password:</label>
            <input type="password" v-model="akun.password" required />

            <button type="submit">Create</button>
          </form>
        </div>

        <!-- Update Akun Form -->
        <div v-if="formType === 'update'" class="shared-form-card">
          <h2>Update Akun</h2>
          <form @submit.prevent="handleUpdateAkun">
            <label>ID Akun:</label>
            <input type="text" v-model="akun.id_akun" disabled />
            <label>Username:</label>
            <input type="text" v-model="akun.username" required />
            <label>Password:</label>
            <input type="password" v-model="akun.password" required />
            <button type="submit">Update</button>
          </form>
        </div>

        <!-- Read Akun -->
        <div v-if="formType === 'read'" class="shared-card">
          <div class="shared-card-body">
            <div v-if="akunList.length === 0" class="shared-empty">No accounts available.</div>
            <div v-for="account in akunList" :key="account.id_akun" class="shared-account-item">
              <p>{{ account.username }}</p>
              <div>
                <button @click="editAkun(account.id_akun)" class="edit-btn">Edit</button>
                <button @click="confirmDelete(account.id_akun)" class="delete-btn">Delete</button>
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
        alert('Akun created successfully');
        console.log('Akun created:', response);
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
        alert('Akun updated successfully');
        console.log('Akun updated:', response);
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
        console.error('Error deleting akun:', error); 
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
