import React, { useEffect, useState } from 'react';
import { deleteEvent, getEventsByOrganizer } from '../services/eventService';
import { Link } from 'react-router-dom';

// Define the event type based on your data structure
interface Event {
  id: number;
  title: string;
  description: string;
  lieu: string;
  debut: string;
  fin: string;
  places: number;
}

const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await getEventsByOrganizer();
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          setEvents([]);
        }
      } catch (err) {
        setError('Could not fetch your events.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  const handleDelete = async (eventId: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(String(eventId));
        setEvents(events.filter(event => event.id !== eventId));
      } catch (err) {
        setError('Failed to delete the event.');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div>Loading your events...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h1>My Events</h1>
      {events.length === 0 ? (
        <p>You have not created any events yet. <Link to="/create-event">Create one now!</Link></p>
      ) : (
        <div className="list-group">
          {events.map(event => (
            <div key={event.id} className="list-group-item list-group-item-action flex-column align-items-start">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{event.title}</h5>
                <small>{new Date(event.debut).toLocaleDateString()}</small>
              </div>
              <p className="mb-1">{event.description.substring(0, 100)}...</p>
              <small>Location: {event.lieu} | Places: {event.places}</small>
              <div className="mt-3">
                <Link to={`/edit-event/${event.id}`} className="btn btn-secondary btn-sm me-2">Edit</Link>
                <button onClick={() => handleDelete(event.id)} className="btn btn-danger btn-sm me-2">Delete</button>
                <Link to={`/event-subscribers/${event.id}`} className="btn btn-info btn-sm">View Subscribers</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
