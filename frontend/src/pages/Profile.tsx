import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../services/authService';
import { updateVisitor } from '../services/visitorService';
import { updateOrganizer } from '../services/organizerService';

interface ProfileData {
  email: string;
  phone: string;
  name: string;
  surname?: string;
  city?: string;
  annee_activite?: string;
  instagram_url?: string;
  facebook_url?: string;
  whatsapp_url?: string;
  profil_url?: string;
}

const Profile: React.FC = () => {
  const { user, login } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const response = await getMe();
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
    setProfileData({ ...profileData as ProfileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profileData) return;
    setUpdating(true);
    setError('');
    setMessage('');
    try {
      const response = user.role === 'ROLE_VISITOR'
        ? await updateVisitor(user.id, profileData)
        : await updateOrganizer(user.id, profileData);
      
      setProfileData(response.data);
      // Safely update auth context with only the necessary fields
      login({ id: user.id, email: response.data.email, role: user.role });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError('Profile update failed.');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const inputStyle = "block w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
  const labelStyle = "block text-sm font-medium text-neutral-700 dark:text-neutral-300";

  if (loading) {
    return (
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 animate-pulse">
            <div className="md:col-span-1 h-48 bg-neutral-300 dark:bg-neutral-700 rounded-xl"></div>
            <div className="md:col-span-2 h-96 bg-neutral-300 dark:bg-neutral-700 rounded-xl"></div>
        </div>
    );
  }
  
  if (error) return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg">{error}</div>;
  if (!profileData) return <div className="text-center p-8 text-neutral-500 dark:text-neutral-400">Could not load profile.</div>;

  return (
    <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-8">My Profile</h1>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-2xl p-6 text-center border border-neutral-200 dark:border-neutral-700">
                    <div className="w-24 h-24 rounded-full bg-primary-500 flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl text-white font-bold">{(profileData.name || '?').charAt(0).toUpperCase()}</span>
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{profileData.name} {profileData.surname || ''}</h2>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{profileData.email}</p>
                    <span className="mt-4 inline-block bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900/50 dark:text-primary-300">
                        {user?.role.replace('ROLE_', '').charAt(0) + user?.role.replace('ROLE_', '').slice(1).toLowerCase()}
                    </span>
                </div>
            </div>
            <div className="md:col-span-2">
                <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-2xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-700">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {message && <div className="bg-green-100 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-r-lg">{message}</div>}
                        
                        <fieldset className="space-y-6">
                            <legend className="text-xl font-semibold text-neutral-900 dark:text-white">Basic Information</legend>
                            {user?.role === 'ROLE_VISITOR' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div><label htmlFor="name" className={labelStyle}>Name</label><input type="text" id="name" name="name" value={profileData.name || ''} onChange={handleChange} className={inputStyle} required /></div>
                                    <div><label htmlFor="surname" className={labelStyle}>Surname</label><input type="text" id="surname" name="surname" value={profileData.surname || ''} onChange={handleChange} className={inputStyle} required /></div>
                                </div>
                            ) : (
                                <div><label htmlFor="name" className={labelStyle}>Organizer Name</label><input type="text" id="name" name="name" value={profileData.name || ''} onChange={handleChange} className={inputStyle} required /></div>
                            )}
                            <div><label htmlFor="email" className={labelStyle}>Email</label><input type="email" id="email" name="email" value={profileData.email || ''} onChange={handleChange} className={inputStyle} required /></div>
                            <div><label htmlFor="phone" className={labelStyle}>Phone</label><input type="text" id="phone" name="phone" value={profileData.phone || ''} onChange={handleChange} className={inputStyle} required /></div>
                            {user?.role === 'ROLE_VISITOR' && (
                                <div><label htmlFor="city" className={labelStyle}>City</label><input type="text" id="city" name="city" value={profileData.city || ''} onChange={handleChange} className={inputStyle} required /></div>
                            )}
                        </fieldset>

                        {user?.role === 'ROLE_ORGANIZER' && (
                            <fieldset className="space-y-6">
                                <legend className="text-xl font-semibold text-neutral-900 dark:text-white">Organizer Details</legend>
                                <div><label htmlFor="annee_activite" className={labelStyle}>Years of Activity</label><input type="number" id="annee_activite" name="annee_activite" value={profileData.annee_activite || ''} onChange={handleChange} className={inputStyle} required /></div>
                                <div><label htmlFor="profil_url" className={labelStyle}>Profile/Website URL</label><input type="text" id="profil_url" name="profil_url" value={profileData.profil_url || ''} onChange={handleChange} className={inputStyle} /></div>
                                <div><label htmlFor="instagram_url" className={labelStyle}>Instagram URL</label><input type="text" id="instagram_url" name="instagram_url" value={profileData.instagram_url || ''} onChange={handleChange} className={inputStyle} /></div>
                                <div><label htmlFor="facebook_url" className={labelStyle}>Facebook URL</label><input type="text" id="facebook_url" name="facebook_url" value={profileData.facebook_url || ''} onChange={handleChange} className={inputStyle} /></div>
                                <div><label htmlFor="whatsapp_url" className={labelStyle}>WhatsApp URL</label><input type="text" id="whatsapp_url" name="whatsapp_url" value={profileData.whatsapp_url || ''} onChange={handleChange} className={inputStyle} /></div>
                            </fieldset>
                        )}

                        <div className="flex justify-end">
                            <button type="submit" className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400" disabled={updating}>
                                {updating && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                                {updating ? 'Updating...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Profile;
