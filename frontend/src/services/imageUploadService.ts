import axios from 'axios';

const API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const UPLOAD_URL = 'https://api.imgbb.com/1/upload';

/**
 * Uploads an image file to ImgBB.
 * @param file The image file to upload.
 * @returns The URL of the uploaded image.
 * @throws Will throw an error if the upload fails or the API key is missing.
 */
export const uploadImage = async (file: File): Promise<string> => {
  if (!API_KEY) {
    throw new Error('ImgBB API key is not configured. Please set VITE_IMGBB_API_KEY in your .env file.');
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(UPLOAD_URL, formData, {
      params: {
        key: API_KEY,
      },
      withCredentials: false
    });

    if (response.data && response.data.success) {
      return response.data.data.url;
    } else {
      throw new Error('ImgBB upload failed: ' + (response.data?.error?.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error uploading to ImgBB:', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(`ImgBB API error: ${error.response.data?.error?.message || error.message}`);
    }
    throw new Error('Failed to upload image.');
  }
};
