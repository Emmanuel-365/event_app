import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService, getVisitorMe, getOrganizerMe } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const loginResponse = await loginService(formData);

      const redirectUrl = loginResponse.request.responseURL;
      let role = '';

      if (redirectUrl.includes('organizer')) {
        role = 'ORGANIZER';
      } else if (redirectUrl.includes('visitor')) {
        role = 'VISITOR';
      }

      if (role) {
        let userResponse;
        if (role === 'ORGANIZER') {
          userResponse = await getOrganizerMe();
        } else {
          userResponse = await getVisitorMe();
        }

        login({ ...userResponse.data, role: role });
        navigate('/'); // Redirect to home page
      } else {
        setError('Could not determine user role.');
      }

    } catch (err) {
      setError('Login failed. Please check your credentials.');
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
            <h1 className="card-title text-center">Login</h1>
            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" id="email" name="email" placeholder="Email" onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" id="password" name="password" placeholder="Password" onChange={handleChange} className="form-control" required />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;