import React, { useEffect, useState } from 'react';
import { getAllEvents } from '../services/eventService';
import { getTrendingEvents, getBestOrganizerRecommendations } from '../services/statsService';
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
  const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [eventsRes, trendingRes, recommendedRes] = await Promise.all([
          getAllEvents(),
          getTrendingEvents(),
          getBestOrganizerRecommendations()
        ]);

        if (Array.isArray(eventsRes.data)) {
          setEvents(eventsRes.data);
        } else {
          setError(prev => prev + 'Could not fetch upcoming events. ');
        }

        if (Array.isArray(trendingRes.data)) {
          setTrendingEvents(trendingRes.data);
        }

        if (recommendedRes.data && Array.isArray(recommendedRes.data.evenementsRecommandes)) {
          setRecommendedEvents(recommendedRes.data.evenementsRecommandes);
        }

      } catch (err) {
        setError('Could not fetch some or all events. You might need to be logged in.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const renderEventSection = (title: string, eventList: Event[]) => (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      {eventList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventList.map(event => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No events found for this category.</p>
      )}
    </div>
  );

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading events...</p>
      ) : (
        <>
          {renderEventSection("Trending Events", trendingEvents)}
          {renderEventSection("Recommendations from Best Organizers", recommendedEvents)}
          {renderEventSection("Upcoming Events", events)}
        </>
      )}
    </div>
  );
};

export default Home;