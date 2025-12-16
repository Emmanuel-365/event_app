import React, { useEffect, useState } from 'react';
import { getAllEvents } from '../services/eventService';
import { getTrendingEvents, getBestOrganizerRecommendations } from '../services/statsService';
import EventCard from '../components/EventCard';

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

const SkeletonCard = () => (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 animate-pulse">
      <div className="w-full h-48 bg-neutral-300 dark:bg-neutral-700"></div>
      <div className="p-4">
        <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-1/4 mb-2"></div>
        <div className="h-6 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
        <div className="h-12 bg-neutral-300 dark:bg-neutral-700 rounded mb-4"></div>
        <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-neutral-300 dark:bg-neutral-700 rounded-lg"></div>
      </div>
    </div>
);

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
          const adaptedTrendingEvents = trendingRes.data.map((trendingEvent: any) => ({
            ...trendingEvent,
            // Add default values for fields that are in Event but not in TrendingEventDTO
            description: `This event is currently trending! With an occupancy rate of ${(trendingEvent.occupancyRate * 100).toFixed(0)}%, it's one of the hottest tickets right now.`,
            debut: new Date().toISOString(),
            fin: new Date().toISOString(),
            organizer_name: "Popular Choice",
            profil_url: `https://picsum.photos/seed/${trendingEvent.id}/400/250`,
          }));
          setTrendingEvents(adaptedTrendingEvents);
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

  const renderEventSection = (title: string, eventList: Event[], isLoading: boolean) => (
    <div className="mb-16">
      <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-6">{title}</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : eventList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventList.map(event => (
            <EventCard event={event} key={event.id} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
            <p className="text-neutral-500 dark:text-neutral-400">No events found for this category at the moment.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-12">
        <div className="text-center py-16">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                Find Your Next <span className="text-primary-600">Experience</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-neutral-600 dark:text-neutral-400">
                Discover, book, and enjoy unforgettable events happening near you.
            </p>
        </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      )}
      
      <>
        {renderEventSection("Trending Events", trendingEvents, loading)}
        {renderEventSection("From Top Organizers", recommendedEvents, loading)}
        {renderEventSection("All Upcoming Events", events, loading)}
      </>
    </div>
  );
};

export default Home;