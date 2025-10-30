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

  const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-white";
  const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Event</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-100 border-red-400 text-red-700 px-4 py-2 rounded text-sm">{error}</div>}
          {message && <div className="bg-green-100 border-green-400 text-green-700 px-4 py-2 rounded text-sm">{message}</div>}

          <div>
            <label htmlFor="title" className={labelStyle}>Event Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={inputStyle} required />
          </div>

          <div>
            <label htmlFor="description" className={labelStyle}>Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={`${inputStyle} min-h-[100px]`} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="places" className={labelStyle}>Number of Places</label>
              <input type="number" id="places" name="places" value={formData.places} onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
              <label htmlFor="lieu" className={labelStyle}>Location</label>
              <input type="text" id="lieu" name="lieu" value={formData.lieu} onChange={handleChange} className={inputStyle} required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="debut" className={labelStyle}>Start Date</label>
              <input type="date" id="debut" name="debut" value={formData.debut} onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
              <label htmlFor="fin" className={labelStyle}>End Date</label>
              <input type="date" id="fin" name="fin" value={formData.fin} onChange={handleChange} className={inputStyle} required />
            </div>
          </div>

          <div>
            <label htmlFor="profil_url" className={labelStyle}>Event Profile URL (Optional)</label>
            <input type="text" id="profil_url" name="profil_url" placeholder="http://..." value={formData.profil_url} onChange={handleChange} className={inputStyle} />
          </div>

          <div className="flex justify-end">
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400" disabled={loading}>
              {loading ? 'Updating Event...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
