import axios from 'axios';

const API_URL = 'http://localhost:8080/organizer';

export const registerOrganizer = async (organizerData: any) => {
  return axios.post(`${API_URL}/register`, organizerData);
};
