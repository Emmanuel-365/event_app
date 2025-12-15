import axios from 'axios';

const API_URL = 'http://localhost:8080/api/stats';

export const getEventStats = async (eventId: string) => {
  return axios.get(`${API_URL}/events/${eventId}`);
};

export const getGlobalStatusStats = async () => {
  return axios.get(`${API_URL}/global/status`);
};

export const getLocationRecommendations = async (organizerId: number) => {
  return axios.get(`${API_URL}/recommendation/location/${organizerId}`);
};

export const getTimingRecommendations = async (organizerId: number) => {
  return axios.get(`${API_URL}/recommendation/timing/${organizerId}`);
};

export const getGeneralRecommendation = async (organizerId: number) => {
  return axios.get(`${API_URL}/recommendation/general/${organizerId}`);
};

export const getTrendingEvents = async () => {
  return axios.get(`${API_URL}/recommendation/trending`);
};

export const getBestOrganizerRecommendations = async () => {
  return axios.get(`${API_URL}/recommendation/best-organizer`);
};
