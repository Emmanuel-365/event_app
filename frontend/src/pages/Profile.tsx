import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getVisitorMe, getOrganizerMe } from '../services/authService';
import { updateVisitor } from '../services/visitorService';
import { updateOrganizer } from '../services/organizerService';

const Profile: React.FC = () => {
  const { user, login } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const response = user.role === 'VISITOR' ? await getVisitorMe() : await getOrganizerMe();
        setProfileData(response.data);
      } catch (err) {
        setError('Could not fetch profile data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profileData) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      let updatedData;
      if (user.role === 'VISITOR') {
        updatedData = await updateVisitor(user.id, profileData);
      } else {
        updatedData = await updateOrganizer(user.id, profileData);
      }
      login({ ...user, ...updatedData.data }); // Update auth context
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError('Profile update failed.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-white";
  const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  if (loading) return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading profile...</div>;
  if (error) return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  if (!profileData) return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Could not load profile.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && <div className="bg-green-100 border-green-400 text-green-700 px-4 py-2 rounded text-sm">{message}</div>}
          
          {/* Common Fields */}
          <div>
            <label htmlFor="email" className={labelStyle}>Email</label>
            <input type="email" id="email" name="email" value={profileData.email || ''} onChange={handleChange} className={inputStyle} required />
          </div>
          <div>
            <label htmlFor="phone" className={labelStyle}>Phone</label>
            <input type="text" id="phone" name="phone" value={profileData.phone || ''} onChange={handleChange} className={inputStyle} required />
          </div>

          {/* Visitor Fields */}
          {user?.role === 'VISITOR' && (
            <>
              <div>
                <label htmlFor="name" className={labelStyle}>Name</label>
                <input type="text" id="name" name="name" value={profileData.name || ''} onChange={handleChange} className={inputStyle} required />
              </div>
              <div>
                <label htmlFor="surname" className={labelStyle}>Surname</label>
                <input type="text" id="surname" name="surname" value={profileData.surname || ''} onChange={handleChange} className={inputStyle} required />
              </div>
              <div>
                <label htmlFor="city" className={labelStyle}>City</label>
                <input type="text" id="city" name="city" value={profileData.city || ''} onChange={handleChange} className={inputStyle} required />
              </div>
            </>
          )}

          {/* Organizer Fields */}
          {user?.role === 'ORGANIZER' && (
            <>
              <div>
                <label htmlFor="name" className={labelStyle}>Organizer Name</label>
                <input type="text" id="name" name="name" value={profileData.name || ''} onChange={handleChange} className={inputStyle} required />
              </div>
              <div>
                <label htmlFor="annee_activite" className={labelStyle}>Years of Activity</label>
                <input type="number" id="annee_activite" name="annee_activite" value={profileData.annee_activite || ''} onChange={handleChange} className={inputStyle} required />
              </div>
              <hr className="border-gray-200 dark:border-gray-700"/>
              <p className="text-sm text-gray-500 dark:text-gray-400">Optional Information</p>
              <div>
                <label htmlFor="instagram_url" className={labelStyle}>Instagram URL</label>
                <input type="text" id="instagram_url" name="instagram_url" value={profileData.instagram_url || ''} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label htmlFor="facebook_url" className={labelStyle}>Facebook URL</label>
                <input type="text" id="facebook_url" name="facebook_url" value={profileData.facebook_url || ''} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label htmlFor="whatsapp_url" className={labelStyle}>WhatsApp URL</label>
                <input type="text" id="whatsapp_url" name="whatsapp_url" value={profileData.whatsapp_url || ''} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <label htmlFor="profil_url" className={labelStyle}>Profile URL</label>
                <input type="text" id="profil_url" name="profil_url" value={profileData.profil_url || ''} onChange={handleChange} className={inputStyle} />
              </div>
            </>
          )}

          <div className="flex justify-end">
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
