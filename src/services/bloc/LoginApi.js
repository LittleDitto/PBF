import axios from 'axios';
import userInfo from '../helpers/UserInfo';  // Mengimpor UserInfo.js
import APIUrl from '../helpers/APIUrl';  // Mengimpor APIUrl.js

async function login(username, password) {
  try {
    const response = await axios.post(APIUrl.AUTH, new URLSearchParams({
      username: username,
      password: password
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Header untuk form-urlencoded
      }
    });

    const token = response.data.access_token;
    const user = response.data.user;  // Mengambil info pengguna dan level akses

    // Log untuk memeriksa apakah id_level_akses ada di objek user
    console.log('User data received from API:', user); // Ini akan menunjukkan isi dari objek `user`
    // Log respons API untuk melihat seluruh data yang dikirimkan
    console.log('API response:', response.data);

    // Menyimpan token dan informasi pengguna
    userInfo.setToken(token);
    userInfo.setUserID(user.id_akun);  // Menyimpan ID akun
    userInfo.setUserInfo(user);  // Menyimpan info akun dan level akses
    userInfo.setLevelAkses(user.id_level_akses);  // Menyimpan level akses terpisah
    console.log(localStorage.getItem('userInfo'));


    console.log('Login berhasil');
    return user;
  } catch (error) {
    console.error('Login gagal:', error);
    throw new Error('Login failed');
  }
}
export default {
  login,
};