import api from '@/services/helpers/api';
import APIUrl from '@/services/helpers/APIUrl';

// Fungsi untuk mengambil level akses berdasarkan id_level_akses
export const getLevelAkses = async (id_level_akses) => {
  try {
    // Cek apakah id_level_akses sudah ada dan valid
    if (!id_level_akses) {
      console.error("ID Level Akses tidak ditemukan");
      throw new Error('ID Level Akses tidak ditemukan');
    }
    const response = await api.get(APIUrl.getLevelAkses(id_level_akses)); // Menggunakan id_level_akses langsung
    return response.data; // Mengembalikan data level akses yang didapat dari server
  } catch (error) {
    console.error('Error fetching level akses:', error);
    throw error;
  }
};

// Fungsi untuk membuat level akses baru
export const createLevelAkses = async (levelAkses) => {
  try {
    const response = await api.post(APIUrl.createLevelAkses(), levelAkses);
    return response.data; // Mengembalikan response dari server
  } catch (error) {
    console.error('Error creating level akses:', error);
    throw error;
  }
};

// Fungsi untuk memperbarui level akses berdasarkan id_level_akses
export const updateLevelAkses = async (id_level_akses, levelAkses) => {
  try {
    // Panggil API untuk memperbarui level akses berdasarkan id_level_akses
    const response = await api.put(APIUrl.updateLevel(id_level_akses), levelAkses);
    return response.data; // Mengembalikan response dari server
  } catch (error) {
    console.error('Error updating level akses:', error);
    throw error;
  }
};

// Fungsi untuk menghapus level akses berdasarkan id_level_akses
export const deleteLevelAkses = async (id_level_akses) => {
  try {
    // Panggil API untuk menghapus level akses berdasarkan id_level_akses
    const response = await api.delete(APIUrl.deleteLevelAkses(id_level_akses));
    return response.data; // Mengembalikan response dari server
  } catch (error) {
    console.error('Error deleting level akses:', error);
    throw error;
  }
};

// Fungsi untuk mengambil semua level akses
export const getAllLevelAkses = async () => {
  try {
    const response = await api.get(APIUrl.getAllLevelAkses());
    return response.data; // Mengembalikan daftar level akses
  } catch (error) {
    console.error('Error fetching all level akses:', error);
    throw error;
  }
};
