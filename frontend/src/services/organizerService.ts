import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/profile/organizer`;

interface OrganizerData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  instagram_url?: string;
  facebook_url?: string;
  whatsapp_url?: string;
  profil_url?: string;
  annee_activite: string;
}

export const updateOrganizer = async (id: number, organizerData: Partial<OrganizerData>) => {
  return axios.put(`${API_URL}/${id}`, organizerData);
};
