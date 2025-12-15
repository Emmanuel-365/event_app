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
  profil_url: string;
}

const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);

  const fetchMyEvents = async () => {
    try {
      const response = await getEventsByOrganizer();
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('Could not fetch your events.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleDelete = async (eventId: number) => {
    try {
      await deleteEvent(String(eventId));
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      setError('Failed to delete the event.');
      console.error(err);
    } finally {
        setShowDeleteModal(null);
    }
  };

  const ActionButton = ({ to, icon, children, className }: { to:string, icon: React.ReactNode, children: React.ReactNode, className?: string }) => (
    <Link to={to} className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${className}`}>
        {icon}
        <span className="hidden sm:inline">{children}</span>
    </Link>
  );

  if (loading) {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="h-10 bg-neutral-300 dark:bg-neutral-700 rounded-lg w-48 mb-6 animate-pulse"></div>
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse"></div>
                ))}
            </div>
        </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">My Events</h1>
        <Link to="/create-event" className="inline-flex items-center justify-center gap-2 py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Create New Event
        </Link>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-12 border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">No events yet</h3>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 mb-4">It looks like you haven't created any events. Let's change that!</p>
          <Link to="/create-event" className="mt-4 inline-block text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium">Create your first event</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <div key={event.id} className="bg-white dark:bg-neutral-800 shadow-md rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img src={event.profil_url || 'https://via.placeholder.com/150'} alt={event.title} className="w-full sm:w-32 h-32 sm:h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <p className="text-lg font-bold text-neutral-900 dark:text-white">{event.title}</p>
                  <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 gap-x-4">
                      <span>{event.lieu}</span>
                      <span>&middot;</span>
                      <span>{new Date(event.debut).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="w-full sm:w-auto flex items-center justify-end space-x-2">
                    <ActionButton to={`/edit-event/${event.id}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>} className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600">Edit</ActionButton>
                    <ActionButton to={`/event-stats/${event.id}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900">Stats</ActionButton>
                    <ActionButton to={`/event-subscribers/${event.id}`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900">Subscribers</ActionButton>
                    <button onClick={() => setShowDeleteModal(event.id)} className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        <span className="hidden sm:inline">Delete</span>
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" aria-modal="true">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Confirm Deletion</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">Are you sure you want to delete this event? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button type="button" className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-700 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-600" onClick={() => setShowDeleteModal(null)}>Cancel</button>
              <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700" onClick={() => handleDelete(showDeleteModal)}>Delete Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
