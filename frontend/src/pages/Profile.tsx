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

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!profileData) return <div>Could not load profile.</div>;

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-body">
            <h1 className="card-title text-center">My Profile</h1>
            <form onSubmit={handleSubmit}>
              {message && <div className="alert alert-success">{message}</div>}
              
              {/* Common Fields */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" name="email" value={profileData.email || ''} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input type="text" id="phone" name="phone" value={profileData.phone || ''} onChange={handleChange} className="form-control" required />
              </div>

              {/* Visitor Fields */}
              {user?.role === 'VISITOR' && (
                <>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" id="name" name="name" value={profileData.name || ''} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="surname" className="form-label">Surname</label>
                    <input type="text" id="surname" name="surname" value={profileData.surname || ''} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <input type="text" id="city" name="city" value={profileData.city || ''} onChange={handleChange} className="form-control" required />
                  </div>
                </>
              )}

              {/* Organizer Fields */}
              {user?.role === 'ORGANIZER' && (
                <>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Organizer Name</label>
                    <input type="text" id="name" name="name" value={profileData.name || ''} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="annee_activite" className="form-label">Years of Activity</label>
                    <input type="number" id="annee_activite" name="annee_activite" value={profileData.annee_activite || ''} onChange={handleChange} className="form-control" required />
                  </div>
                  <hr />
                  <p className="text-muted">Optional Information</p>
                  <div className="mb-3">
                    <label htmlFor="instagram_url" className="form-label">Instagram URL</label>
                    <input type="text" id="instagram_url" name="instagram_url" value={profileData.instagram_url || ''} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="facebook_url" className="form-label">Facebook URL</label>
                    <input type="text" id="facebook_url" name="facebook_url" value={profileData.facebook_url || ''} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="whatsapp_url" className="form-label">WhatsApp URL</label>
                    <input type="text" id="whatsapp_url" name="whatsapp_url" value={profileData.whatsapp_url || ''} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="profil_url" className="form-label">Profile URL</label>
                    <input type="text" id="profil_url" name="profil_url" value={profileData.profil_url || ''} onChange={handleChange} className="form-control" />
                  </div>
                </>
              )}

              <div className="d-grid">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
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
