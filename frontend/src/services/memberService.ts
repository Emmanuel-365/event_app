import axios from 'axios';

const API_URL = 'http://localhost:8080/member';

export const getAllMembers = async () => {
  return axios.get(API_URL);
};

export const createMember = async (memberData: any) => {
  return axios.post(API_URL, memberData);
};
