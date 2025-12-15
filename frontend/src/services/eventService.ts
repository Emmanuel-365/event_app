import axios from 'axios';

const API_URL = 'http://localhost:8080/event';

interface EventData {
  title: string;
  description: string;
  places: string;
  lieu: string;
  debut: string;
  fin: string;
  id_organizer?: number;
  profil_url?: string;
}

export const getAllEvents = async () => {
  return axios.get(API_URL);
};

export const createEvent = async (eventData: EventData) => {
  return axios.post(API_URL, eventData);
};

export const getEventById = async (id: string) => {
  return axios.get(`${API_URL}/${id}`);
};

export const getEventsByOrganizer = async () => {
  return axios.get(`${API_URL}/organizer/me`);
};

export const updateEvent = async (id: string, eventData: Partial<EventData>) => {
  return axios.put(`${API_URL}/${id}`, eventData);
};

export const deleteEvent = async (id: string) => {
  return axios.delete(`${API_URL}/${id}`);
};
