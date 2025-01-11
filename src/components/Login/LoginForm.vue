<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <label for="username">Username</label>
        <input type="text" v-model="username" required />
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
      <p class="error-message" v-if="errorMessage">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import loginService from '../../services/bloc/LoginApi';  // Mengimpor loginService
import userInfo from '../../services/helpers/UserInfo';  // Mengimpor UserInfo

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        // Memanggil login API
        await loginService.login(this.username, this.password);

        // Setelah login berhasil, cek token dan informasi akun
        const token = userInfo.getToken();
        const userInfoData = userInfo.getUserInfo();  // Mengambil data pengguna (username, level akses)

        if (token && userInfoData) {
          // Jika token dan userInfoData ada, login sukses
          console.log('Login berhasil');
          this.$router.push('/home');  // Arahkan ke halaman home atau dashboard
        } else {
          throw new Error('Token atau data pengguna tidak ditemukan');
        }
      } catch (error) {
        console.error('Error saat login:', error);
        this.errorMessage = error.message || 'Invalid username or password';  // Menampilkan pesan error
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}
</style>
