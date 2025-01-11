import axios from 'axios';
import APIUrl from '@/services/helpers/APIUrl'; // Pastikan file ini merujuk ke lokasi yang tepat

// Fungsi untuk mengambil detail akun berdasarkan ID
export const getDetailAkun = async (userID) => {
  try {
    console.log("Received User ID:", userID);

    // Check if userID is valid
    if (!userID) {
      console.error("User ID tidak ditemukan");
      throw new Error('User ID tidak ditemukan');
    }

    // Construct the API URL
    const apiUrl = APIUrl.getDetailAkun(userID);
    console.log(`Constructed API URL: ${apiUrl}`);

    // Attempt to fetch data from the API
    const response = await axios.get(apiUrl);
    console.log('Received account data:', response.data);
    return response.data;

  } catch (error) {
    if (error.response) {
      console.error('API Error Response:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received from API:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }

    console.error(`Error fetching akun ID ${userID}:`, error);
    throw error;
  }
};

// Fungsi untuk membuat detail akun
export const createDetailAkun = async (detailAkun) => {
  try {
    const response = await axios.post(APIUrl.createDetailAkun, detailAkun);
    return response.data; // Mengembalikan response dari server
  } catch (error) {
    console.error('Error creating akun detail:', error);
    throw error;
  }
};

// Fungsi untuk memperbarui detail akun berdasarkan ID
export const updateDetailAkun = async (userID, detailAkun) => {
  try {
    const apiUrl = APIUrl.updateDetailAkun(userID); // Ambil URL API
    console.log('API URL:', apiUrl); // Debug URL yang digunakan

    const response = await axios.put(apiUrl, detailAkun); // Request ke API
    return response.data; // Mengembalikan response dari server
  } catch (error) {
    console.error(`Error updating akun detail for user ID ${userID}:`, error);
    throw error;
  }
};

// Fungsi untuk menghapus detail akun berdasarkan ID
export const deleteDetailAkun = async (userID) => {
  try {
    const response = await axios.delete(APIUrl.deleteDetailAkun(userID));
    return response.data; // Mengembalikan response dari server
  } catch (error) {
    console.error(`Error deleting akun detail for user ID ${userID}:`, error);
    throw error;
  }
};

// Fungsi untuk mengambil semua detail akun
export const getAllDetailAkun = async () => {
  try {
    const apiUrl = APIUrl.getAllDetailAkun(); // Ambil URL API
    console.log('API URL:', apiUrl); // Debug URL yang digunakan
    const response = await axios.get(apiUrl);

    // Ensure response.data is an array
    if (Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error('Unexpected response format:', response.data);
      return []; // Return an empty array if the response is not in the expected format
    }
  } catch (error) {
    console.error('Error fetching all akun details:', error);
    throw error; // Rethrow error to handle it where the function is called
  }
};

