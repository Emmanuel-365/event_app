import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register, type RegisterData } from '../services/authService';

const Register: React.FC = () => {
  const initialFormData = {
    role: 'ROLE_VISITOR' as 'ROLE_VISITOR' | 'ROLE_ORGANIZER',
    name: '',
    email: '',
    phone: '',
    password: '',
    surname: '',
    city: '',
    annee_activite: '',
    instagram_url: '',
    facebook_url: '',
    whatsapp_url: '',
    profil_url: '',
  };

  const [formData, setFormData] = useState<Partial<RegisterData>>(initialFormData);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset fields when role changes
      ...(name === 'role' && {
        ...initialFormData,
        role: value as 'ROLE_VISITOR' | 'ROLE_ORGANIZER',
      })
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await register(formData as RegisterData);
      setMessage('Registration successful! You can now log in.');
      setFormData({ ...initialFormData, role: formData.role });
    } catch (err) {
      setError('Registration failed. The email might already be in use.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = "block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1";
  const inputStyle = "block w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm";

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-neutral-800 shadow-xl rounded-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 dark:text-white">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">{error}</div>}
          {message && <div className="bg-green-100 dark:bg-green-900/20 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">{message}</div>}

          <div className="space-y-4">
            <div>
              <label htmlFor="role" className={labelStyle}>I want to register as...</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className={inputStyle}>
                <option value="ROLE_VISITOR">A Visitor</option>
                <option value="ROLE_ORGANIZER">An Organizer</option>
              </select>
            </div>
            
            <hr className="border-neutral-200 dark:border-neutral-700" />

            {/* Common Fields */}
            <div>
                <label htmlFor="name" className={labelStyle}>{formData.role === 'ROLE_VISITOR' ? 'Name' : 'Organizer Name'}</label>
                <input id="name" name="name" type="text" required className={inputStyle} placeholder={formData.role === 'ROLE_VISITOR' ? 'John' : 'Awesome Events Inc.'} value={formData.name} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="email" className={labelStyle}>Email</label>
                <input id="email" name="email" type="email" required className={inputStyle} placeholder="you@example.com" value={formData.email} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="phone" className={labelStyle}>Phone</label>
                <input id="phone" name="phone" type="text" required className={inputStyle} placeholder="+123456789" value={formData.phone} onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="password" className={labelStyle}>Password</label>
                <input id="password" name="password" type="password" required className={inputStyle} placeholder="••••••••" value={formData.password} onChange={handleChange} />
            </div>

            {/* Visitor Fields */}
            {formData.role === 'ROLE_VISITOR' && (
              <>
                <div>
                    <label htmlFor="surname" className={labelStyle}>Surname</label>
                    <input id="surname" name="surname" type="text" required className={inputStyle} placeholder="Doe" value={formData.surname || ''} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="city" className={labelStyle}>City</label>
                    <input id="city" name="city" type="text" required className={inputStyle} placeholder="New York" value={formData.city || ''} onChange={handleChange} />
                </div>
              </>
            )}

            {/* Organizer Fields */}
            {formData.role === 'ROLE_ORGANIZER' && (
              <>
                <div>
                    <label htmlFor="annee_activite" className={labelStyle}>Years of Activity</label>
                    <input id="annee_activite" name="annee_activite" type="number" required className={inputStyle} placeholder="3" value={formData.annee_activite || ''} onChange={handleChange} />
                </div>
                <hr className="border-neutral-200 dark:border-neutral-700"/>
                <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">Social Links (Optional)</p>
                <div>
                    <label htmlFor="instagram_url" className={labelStyle}>Instagram URL</label>
                    <input id="instagram_url" name="instagram_url" type="text" className={inputStyle} placeholder="https://instagram.com/..." value={formData.instagram_url || ''} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="facebook_url" className={labelStyle}>Facebook URL</label>
                    <input id="facebook_url" name="facebook_url" type="text" className={inputStyle} placeholder="https://facebook.com/..." value={formData.facebook_url || ''} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="whatsapp_url" className={labelStyle}>WhatsApp Contact Link</label>
                    <input id="whatsapp_url" name="whatsapp_url" type="text" className={inputStyle} placeholder="https://wa.me/..." value={formData.whatsapp_url || ''} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="profil_url" className={labelStyle}>Profile/Website URL</label>
                    <input id="profil_url" name="profil_url" type="text" className={inputStyle} placeholder="https://your-website.com" value={formData.profil_url || ''} onChange={handleChange} />
                </div>
              </>
            )}
          </div>

          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 dark:disabled:bg-primary-800 transition-colors">
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
