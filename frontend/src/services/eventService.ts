import axios from 'axios';

const API_URL = 'http://localhost:8080/event';

export const getAllEvents = async () => {
  return axios.get(API_URL);
};

export const createEvent = async (eventData: any) => {
  return axios.post(API_URL, eventData);
};

export const getEventById = async (id: string) => {
  return axios.get(`${API_URL}/${id}`);
};

export const getEventsByOrganizer = async () => {
  return axios.get(`${API_URL}/organizer/me`);
};

export const updateEvent = async (id: string, eventData: any) => {
  return axios.put(`${API_URL}/${id}`, eventData);
};

export const deleteEvent = async (id: string) => {
  return axios.delete(`${API_URL}/${id}`);
};
