import axios from 'axios';

const API_URL = 'http://localhost:8080/api/profile';

// Define a generic profile data interface that can be extended
interface ProfileData {
    name?: string;
    phone?: string;
    // Visitor specific
    surname?: string;
    city?: string;
    // Organizer specific
    annee_activite?: number;
    instagram_url?: string;
    facebook_url?: string;
    whatsapp_url?: string;
    profil_url?: string;
}

export const updateProfile = async (profileData: ProfileData) => {
    // The backend will determine which profile to update based on the user's role
    return axios.put(`${API_URL}/me`, profileData);
};
