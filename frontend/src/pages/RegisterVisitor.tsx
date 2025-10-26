import React, { useState } from 'react';
import { registerVisitor } from '../services/visitorService';

const RegisterVisitor: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    city: '',
    email: '',
    password: ''
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
      await registerVisitor(formData);
      setMessage('Registration successful! You can now log in.');
      setFormData({ name: '', surname: '', phone: '', city: '', email: '', password: '' }); // Reset form
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
            <h1 className="card-title text-center">Register as Visitor</h1>
            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}

              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" id="name" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="surname" className="form-label">Surname</label>
                <input type="text" id="surname" name="surname" placeholder="Surname" value={formData.surname} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input type="text" id="phone" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="city" className="form-label">City</label>
                <input type="text" id="city" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" id="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="form-control" required />
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

export default RegisterVisitor;