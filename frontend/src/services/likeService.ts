
import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = API_BASE_URL;

export const likeEvent = async (eventId: string) => {
    const response = await axios.post(`${API_URL}/events/${eventId}/likes`);
    return response.data;
};

export const unlikeEvent = async (eventId: string) => {
    const response = await axios.delete(`${API_URL}/events/${eventId}/likes`);
    return response.data;
};

export const getLikeCount = async (eventId: string) => {
    const response = await axios.get(`${API_URL}/events/${eventId}/likes/count`);
    return response.data;
};

export const getLikeStatus = async (eventId: string) => {
    const response = await axios.get(`${API_URL}/events/${eventId}/likes/status`);
    return response.data;
};
