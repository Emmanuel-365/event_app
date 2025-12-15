import axios from 'axios';

const API_URL = 'http://localhost:8080/image';

interface ImageData {
  imageurl: string;
  id_event: number;
}

export const createImage = async (imageData: ImageData) => {
  return axios.post(API_URL, imageData);
};

export const deleteImage = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};
