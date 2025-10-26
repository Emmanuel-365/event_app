import axios from 'axios';

const API_URL = 'http://localhost:8080';

axios.defaults.withCredentials = true; // Important for sessions/cookies

export const login = async (credentials: any) => {
  const params = new URLSearchParams();
  params.append('username', credentials.email);
  params.append('password', credentials.password);

  return axios.post(`${API_URL}/login`, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export const logout = async () => {
  return axios.post(`${API_URL}/logout`);
};

export const getVisitorMe = async () => {
  return axios.get(`${API_URL}/visitor/me`);
};

export const getOrganizerMe = async () => {
  return axios.get(`${API_URL}/organizer/me`);
};
