import React, { useEffect, useState } from 'react';
import { getAllEvents } from '../services/eventService';
import EventCard from '../components/EventCard';

const Home: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          setEvents([]);
          setError('Could not fetch events. You might need to be logged in.');
        }
      } catch (err) {
        setError('Could not fetch events. You might need to be logged in.');
        console.error(err);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1>Upcoming Events</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {events.map(event => (
          <div className="col-md-4" key={event.id}>
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;