import React, { useState } from 'react';
import { registerOrganizer } from '../services/organizerService';

const RegisterOrganizer: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    instagram_url: '',
    facebook_url: '',
    whatsapp_url: '',
    profil_url: '',
    annee_activite: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await registerOrganizer(formData);
      setMessage('Registration successful! You can now log in.');
      setFormData({ name: '', email: '', phone: '', password: '', instagram_url: '', facebook_url: '', whatsapp_url: '', profil_url: '', annee_activite: '' });
    } catch (err) {
      setError('Registration failed. The email might already be in use.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body">
            <h1 className="card-title text-center">Register as Organizer</h1>
            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}

              <div className="mb-3">
                <label htmlFor="name" className="form-label">Organizer Name</label>
                <input type="text" id="name" name="name" placeholder="Organizer Name" value={formData.name} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input type="text" id="phone" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="annee_activite" className="form-label">Years of Activity</label>
                <input type="number" id="annee_activite" name="annee_activite" placeholder="Years of activity" value={formData.annee_activite} onChange={handleChange} className="form-control" required />
              </div>
              <hr />
              <p className="text-muted">Optional Information</p>
              <div className="mb-3">
                <label htmlFor="instagram_url" className="form-label">Instagram URL</label>
                <input type="text" id="instagram_url" name="instagram_url" placeholder="Instagram URL" value={formData.instagram_url} onChange={handleChange} className="form-control" />
              </div>
              <div className="mb-3">
                <label htmlFor="facebook_url" className="form-label">Facebook URL</label>
                <input type="text" id="facebook_url" name="facebook_url" placeholder="Facebook URL" value={formData.facebook_url} onChange={handleChange} className="form-control" />
              </div>
              <div className="mb-3">
                <label htmlFor="whatsapp_url" className="form-label">WhatsApp URL</label>
                <input type="text" id="whatsapp_url" name="whatsapp_url" placeholder="WhatsApp URL" value={formData.whatsapp_url} onChange={handleChange} className="form-control" />
              </div>
              <div className="mb-3">
                <label htmlFor="profil_url" className="form-label">Profile URL</label>
                <input type="text" id="profil_url" name="profil_url" placeholder="Profile URL" value={formData.profil_url} onChange={handleChange} className="form-control" />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterOrganizer;