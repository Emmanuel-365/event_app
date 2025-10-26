import React, { useState } from 'react';
import { createEvent } from '../services/eventService';
import { useAuth } from '../context/AuthContext';

const CreateEvent: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    places: '',
    lieu: '',
    debut: '',
    fin: '',
    profil_url: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in as an organizer to create an event.');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const eventData = { ...formData, id_organizer: user.id };
      await createEvent(eventData);
      setMessage('Event created successfully!');
      setFormData({ title: '', description: '', places: '', lieu: '', debut: '', fin: '', profil_url: '' }); // Reset form
    } catch (err) {
      setError('Event creation failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-body">
            <h1 className="card-title text-center">Create a New Event</h1>
            <form onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}

              <div className="mb-3">
                <label htmlFor="title" className="form-label">Event Title</label>
                <input type="text" id="title" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="form-control" required />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea id="description" name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="form-control" required />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="places" className="form-label">Number of Places</label>
                  <input type="number" id="places" name="places" placeholder="Number of places" value={formData.places} onChange={handleChange} className="form-control" required />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="lieu" className="form-label">Location</label>
                  <input type="text" id="lieu" name="lieu" placeholder="Location" value={formData.lieu} onChange={handleChange} className="form-control" required />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="debut" className="form-label">Start Date</label>
                  <input type="date" id="debut" name="debut" placeholder="Start Date" value={formData.debut} onChange={handleChange} className="form-control" required />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="fin" className="form-label">End Date</label>
                  <input type="date" id="fin" name="fin" placeholder="End Date" value={formData.fin} onChange={handleChange} className="form-control" required />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="profil_url" className="form-label">Event Profile URL (Optional)</label>
                <input type="text" id="profil_url" name="profil_url" placeholder="http://..." value={formData.profil_url} onChange={handleChange} className="form-control" />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Creating Event...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;