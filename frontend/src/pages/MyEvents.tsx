import React, { useEffect, useState } from 'react';
import { deleteEvent, getEventsByOrganizer } from '../services/eventService';
import { Link } from 'react-router-dom';

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
    return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading your events...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Events</h1>
        <Link to="/create-event" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Create New Event
        </Link>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <p className="text-gray-500 dark:text-gray-400">You have not created any events yet.</p>
          <Link to="/create-event" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">Create one now!</Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {events.map(event => (
              <li key={event.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                  <div className="flex-1 mb-4 sm:mb-0">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{event.description}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{event.lieu} &middot; {new Date(event.debut).toLocaleDateString()}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    <Link to={`/edit-event/${event.id}`} className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Edit</Link>
                    <button onClick={() => handleDelete(event.id)} className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
                    <Link to={`/event-subscribers/${event.id}`} className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Subscribers</Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
