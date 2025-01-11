// import baseUrl from './api'; // Mengimpor baseUrl dari api.js

const APIUrl = {
  AKUN: `http://127.0.0.1:8000/akun`, // URL dasar untuk endpoint akun
  
  // Metode untuk URL spesifik akun
  getAkun(id) {
    return `${this.AKUN}/get/${id}`;
  },
  
  updateAkun(id) {
    return `${this.AKUN}/update/${id}`;
  },
  
  getAllAkun() {
    return `${this.AKUN}/getAll`;
  },
  
  createAkun() {
    return `${this.AKUN}/create`;
  },
  
  deleteAkun(id) {
    return `${this.AKUN}/delete/${id}`;
  },
  
  LEVEL_AKSES: `http://127.0.0.1:8000/level-akses`, // URL dasar untuk endpoint level-akses
  
  // Metode untuk URL spesifik level akses
  getLevelAkses(id) {
    return `${this.LEVEL_AKSES}/get/${id}`;
  },
  
  updateLevel(id) {
    return `${this.LEVEL_AKSES}/update/${id}`;
  },
  
  getAllLevelAkses() {
    return `${this.LEVEL_AKSES}/getAll`;
  },
  
  createLevelAkses() {
    return `${this.LEVEL_AKSES}/create`;
  },
  
  deleteLevelAkses(id) {
    return `${this.LEVEL_AKSES}/delete/${id}`;
  },
  
  DETAIL_AKUN: `http://127.0.0.1:8000/detail-akun`, // URL dasar untuk endpoint detail-akun
  
  // Metode untuk URL spesifik detail akun
  getDetailAkun(id) {
    return `${this.DETAIL_AKUN}/get/${id}`;
  },
  
  updateDetailAkun(id) {
    return `${this.DETAIL_AKUN}/update/${id}`;
  },
  
  getAllDetailAkun() {
    return `${this.DETAIL_AKUN}/getAll`;
  },
  
  createDetailAkun() {
    return `${this.DETAIL_AKUN}/create`;
  },
  
  deleteDetailAkun(id) {
    return `${this.DETAIL_AKUN}/delete/${id}`;
  },
  
  AUTH: `http://127.0.0.1:8000/auth/token`, // URL dasar untuk endpoint auth
};

export default APIUrl;
