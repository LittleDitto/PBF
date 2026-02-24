import api from '@/services/helpers/api';
import APIUrl from '@/services/helpers/APIUrl';

// Fungsi untuk membuat akun baru
export const createAkun = async (akun) => {
  try {
    const response = await api.post(APIUrl.createAkun(), akun);
    return response.data;
  } catch (error) {
    console.error('Error creating akun:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan detail akun berdasarkan ID
export const getAkun = async (userData) => {
  try {
    const response = await api.get(APIUrl.getAkun(userData));
    return response.data;
  } catch (error) {
    console.error(`Error fetching akun with ID ${userData}:`, error);
    throw error;
  }
};

// Fungsi untuk memperbarui akun berdasarkan ID
export const updateAkun = async (userData, akun) => {
  try {
    const response = await api.put(APIUrl.updateAkun(userData), akun);
    return response.data;
  } catch (error) {
    console.error(`Error updating akun with ID ${userData}:`, error);
    throw error;
  }
};

// Fungsi untuk menghapus akun berdasarkan ID
export const deleteAkun = async (userData) => {
  try {
    const response = await api.delete(APIUrl.deleteAkun(userData));
    return response.data;
  } catch (error) {
    console.error(`Error deleting akun with ID ${userData}:`, error);
    throw error;
  }
};

// Fungsi untuk mendapatkan semua akun
export const getAllAkun = async () => {
  try {
    const response = await api.get(APIUrl.getAllAkun());
    return response.data;
  } catch (error) {
    console.error('Error fetching all akun:', error);
    throw error;
  }
};
