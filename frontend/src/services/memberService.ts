import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/member`;

interface MemberData {
    name: string;
    surname: string;
    email: string;
    role: string;
    id_organizer?: number;
}

export const getAllMembers = async () => {
  return axios.get(API_URL);
};

export const createMember = async (memberData: MemberData) => {
  return axios.post(API_URL, memberData);
};

export const updateMember = async (id: number, memberData: Partial<MemberData>) => {
  return axios.put(`${API_URL}/${id}`, memberData);
};

export const deleteMember = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};
