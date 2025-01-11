import axios from 'axios';
import APIUrl from '@/services/helpers/APIUrl'; // Pastikan file ini merujuk ke lokasi yang tepat

// Fungsi untuk membuat akun baru
export const createAkun = async (akun) => {
  try {
    const response = await axios.post(APIUrl.createAkun(), akun);
    return response.data;
  } catch (error) {
    console.error('Error creating akun:', error);
    throw error;
  }
};

// Fungsi untuk mendapatkan detail akun berdasarkan ID
export const getAkun = async (userData) => {
  try {
    const response = await axios.get(APIUrl.getAkun(userData));
    return response.data;
  } catch (error) {
    console.error(`Error fetching akun with ID ${userData}:`, error);
    throw error;
  }
};

// Fungsi untuk memperbarui akun berdasarkan ID
export const updateAkun = async (userData, akun) => {
  try {
    const response = await axios.put(APIUrl.updateAkun(userData), akun);
    return response.data;
  } catch (error) {
    console.error(`Error updating akun with ID ${userData}:`, error);
    throw error;
  }
};

// Fungsi untuk menghapus akun berdasarkan ID
export const deleteAkun = async (userData) => {
  try {
    const response = await axios.delete(APIUrl.deleteAkun(userData));
    return response.data;
  } catch (error) {
    console.error(`Error deleting akun with ID ${userData}:`, error);
    throw error;
  }
};

// Fungsi untuk mendapatkan semua akun
export const getAllAkun = async () => {
  try {
    const response = await axios.get(APIUrl.getAllAkun());
    return response.data;
  } catch (error) {
    console.error('Error fetching all akun:', error);
    throw error;
  }
};
