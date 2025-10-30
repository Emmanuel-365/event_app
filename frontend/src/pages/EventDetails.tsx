import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import { createSubscription } from '../services/subscriptionService';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [event, setEvent] = useState<any>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState('');
  const [places, setPlaces] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await getEventById(id);
          setEvent(response.data);
        } catch (err) {
          setError('Could not fetch event details.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvent();
  }, [id]);

  const handleSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !selectedTicket) {
      setError('Please select a ticket and ensure you are logged in.');
      return;
    }
    setSubmitting(true);
    setMessage('');
    setError('');
    try {
      const subscriptionData = {
        id_event: parseInt(id, 10),
        id_visitor: user.id,
        id_ticket: parseInt(selectedTicket, 10),
        places: places,
      };
      await createSubscription(subscriptionData);
      setMessage('Subscription successful! A confirmation has been sent to your email.');
    } catch (err) {
      setError('Subscription failed. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  }

  if (!event) {
    return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Event not found.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <img src={event.profil_url || 'https://via.placeholder.com/800x400'} className="w-full h-64 object-cover" alt={event.title} />
      <div className="p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{event.title}</h1>
        <div className="text-md text-gray-600 dark:text-gray-300 mb-6">
          <p>{event.description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-gray-700 dark:text-gray-200">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h2 className="font-bold text-lg mb-2">Details</h2>
            <p><strong>Location:</strong> {event.lieu}</p>
            <p><strong>Date:</strong> {new Date(event.debut).toLocaleDateString()} to {new Date(event.fin).toLocaleDateString()}</p>
            <p><strong>Available places:</strong> {event.places}</p>
            <p><strong>Organizer:</strong> {event.organizer_name}</p>
          </div>
          {user && user.role === 'VISITOR' && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h2 className="font-bold text-lg mb-2">Subscribe to this Event</h2>
              <form onSubmit={handleSubscription} className="space-y-4">
                {error && <div className="bg-red-100 border-red-400 text-red-700 px-4 py-2 rounded text-sm">{error}</div>}
                {message && <div className="bg-green-100 border-green-400 text-green-700 px-4 py-2 rounded text-sm">{message}</div>}
                <div>
                  <label htmlFor="ticketCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ticket Category</label>
                  <select 
                    id="ticketCategory" 
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={selectedTicket} 
                    onChange={(e) => setSelectedTicket(e.target.value)} 
                    required
                  >
                    <option value="">Select a ticket</option>
                    {event.ticketCategoryList && event.ticketCategoryList.map((ticket: any) => (
                      <option key={ticket.id} value={ticket.id}>
                        {ticket.intitule} - {ticket.prix} CFA
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="places" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Places</label>
                  <input 
                    type="number" 
                    id="places" 
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={places} 
                    onChange={(e) => setPlaces(parseInt(e.target.value, 10))} 
                    min="1" 
                    required 
                  />
                </div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400" disabled={submitting}>
                  {submitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;