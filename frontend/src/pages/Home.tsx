import React, { useEffect, useState } from 'react';
import { getAllEvents } from '../services/eventService';
import EventCard from '../components/EventCard';

// Define a type for the event object for better type safety
interface Event {
  id: number;
  title: string;
  description: string;
  lieu: string;
  debut: string;
  fin: string;
  places: number;
  organizer_name: string;
  profil_url: string;
}

const Home: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Upcoming Events</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map(event => (
              <EventCard event={event} key={event.id} />
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">No events found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;