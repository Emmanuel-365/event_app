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
  const [loading, setLoading] = useState(false);
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
    return <div>Loading...</div>; // We can replace this with a spinner later
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!event) {
    return <div>Event not found.</div>;
  }

  return (
    <div>
      <h1>{event.title}</h1>
      <img src={event.profil_url || 'https://via.placeholder.com/300'} className="img-fluid mb-3" alt={event.title} />
      <p>{event.description}</p>
      <p><strong>Location:</strong> {event.lieu}</p>
      <p><strong>Date:</strong> {event.debut} to {event.fin}</p>
      <p><strong>Available places:</strong> {event.places}</p>
      <p><strong>Organizer:</strong> {event.organizer_name}</p>

      {user && user.role === 'VISITOR' && (
        <div className="mt-4 card">
          <div className="card-body">
            <h5 className="card-title">Subscribe to this Event</h5>
            <form onSubmit={handleSubscription}>
              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}
              <div className="mb-3">
                <label htmlFor="ticketCategory" className="form-label">Ticket Category</label>
                <select 
                  id="ticketCategory" 
                  className="form-select" 
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
              <div className="mb-3">
                <label htmlFor="places" className="form-label">Number of Places</label>
                <input 
                  type="number" 
                  id="places" 
                  className="form-control" 
                  value={places} 
                  onChange={(e) => setPlaces(parseInt(e.target.value, 10))} 
                  min="1" 
                  required 
                />
              </div>
              <button type="submit" className="btn btn-success" disabled={submitting}>
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;