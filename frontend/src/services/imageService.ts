import axios from 'axios';
import { AUTH_BASE_URL } from '../config';

const API_URL = `${AUTH_BASE_URL}/image`;

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
