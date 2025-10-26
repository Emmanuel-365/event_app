import axios from 'axios';

const API_URL = 'http://localhost:8080/visitor';

export const registerVisitor = async (visitorData: any) => {
  return axios.post(`${API_URL}/register`, visitorData);
};
