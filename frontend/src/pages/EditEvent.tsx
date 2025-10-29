import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, updateEvent } from '../services/eventService';

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        const response = await getEventById(id);
        const eventData = response.data;
        // Format dates for input[type=date]
        eventData.debut = new Date(eventData.debut).toISOString().split('T')[0];
        eventData.fin = new Date(eventData.fin).toISOString().split('T')[0];
        setFormData(eventData);
      } catch (err) {
        setError('Could not fetch event data.');
        console.error(err);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setMessage('');
    setError('');
    try {
      await updateEvent(id, formData);
      setMessage('Event updated successfully!');
      setTimeout(() => navigate('/my-events'), 2000);
    } catch (err) {
      setError('Event update failed. Please try again.');
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
            <h1 className="card-title text-center">Edit Event</h1>
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
                  {loading ? 'Updating Event...' : 'Update Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
