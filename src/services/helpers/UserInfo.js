const userInfo = {
  setToken(value) {
    localStorage.setItem("token", value);
  },

  getToken() {
    return localStorage.getItem("token");
  },

  setUserID(value) {
    localStorage.setItem("id_akun", value); // Menyimpan id_akun sebagai 'id_akun' di localStorage
  },

  getUserID() {
    return localStorage.getItem("id_akun"); // Mengambil id_akun dari localStorage
  },

  setUserInfo(value) {
    localStorage.setItem("userInfo", JSON.stringify(value)); // Menyimpan seluruh objek user
  },

  getUserInfo() {
    return JSON.parse(localStorage.getItem("userInfo")); // Mengambil seluruh objek user
  },

  setLevelAkses(levelAkses) {
    localStorage.setItem('levelAkses', JSON.stringify(levelAkses));
  },

  getLevelAkses() {
    const user = this.getUserInfo();
    if (user && user.level_akses) {
      return user.level_akses.id_level_akses;  // Ambil id_level_akses dari objek level_akses
    }
    return null;  // Jika level_akses tidak ada, kembalikan null
  },

  logout() {
    localStorage.clear(); // Menghapus semua data dari localStorage
  }
};

export default userInfo;
