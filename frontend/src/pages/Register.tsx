import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register, RegisterData } from '../services/authService';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<Partial<RegisterData>>({
    role: 'ROLE_VISITOR',
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await register(formData as RegisterData);
      setMessage('Registration successful! You can now log in.');
      // Reset form could be more sophisticated, but this is fine for now
      setFormData({ role: formData.role, name: '', email: '', phone: '', password: '' });
    } catch (err) {
      setError('Registration failed. The email might already be in use.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
          {message && <div className="bg-green-100 border-green-400 text-green-700 px-4 py-3 rounded">{message}</div>}

          <div className="space-y-4">
            <div>
              <label htmlFor="role" className="sr-only">Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className={inputStyle}>
                <option value="ROLE_VISITOR">Register as a Visitor</option>
                <option value="ROLE_ORGANIZER">Register as an Organizer</option>
              </select>
            </div>
            
            {/* Common Fields */}
            <input name="name" type="text" required className={inputStyle} placeholder={formData.role === 'ROLE_VISITOR' ? 'Name' : 'Organizer Name'} value={formData.name} onChange={handleChange} />
            <input name="email" type="email" required className={inputStyle} placeholder="Email address" value={formData.email} onChange={handleChange} />
            <input name="phone" type="text" required className={inputStyle} placeholder="Phone" value={formData.phone} onChange={handleChange} />
            <input name="password" type="password" required className={inputStyle} placeholder="Password" value={formData.password} onChange={handleChange} />

            {/* Visitor Fields */}
            {formData.role === 'ROLE_VISITOR' && (
              <>
                <input name="surname" type="text" required className={inputStyle} placeholder="Surname" value={formData.surname || ''} onChange={handleChange} />
                <input name="city" type="text" required className={inputStyle} placeholder="City" value={formData.city || ''} onChange={handleChange} />
              </>
            )}

            {/* Organizer Fields */}
            {formData.role === 'ROLE_ORGANIZER' && (
              <>
                <input name="annee_activite" type="number" required className={inputStyle} placeholder="Years of Activity" value={formData.annee_activite || ''} onChange={handleChange} />
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">Optional Information</p>
                <input name="instagram_url" type="text" className={inputStyle} placeholder="Instagram URL" value={formData.instagram_url || ''} onChange={handleChange} />
                <input name="facebook_url" type="text" className={inputStyle} placeholder="Facebook URL" value={formData.facebook_url || ''} onChange={handleChange} />
                <input name="whatsapp_url" type="text" className={inputStyle} placeholder="WhatsApp URL" value={formData.whatsapp_url || ''} onChange={handleChange} />
                <input name="profil_url" type="text" className={inputStyle} placeholder="Profile URL" value={formData.profil_url || ''} onChange={handleChange} />
              </>
            )}
          </div>

          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
          <div className="text-sm text-center">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
