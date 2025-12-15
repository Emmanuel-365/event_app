import React from 'react';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    lieu: string;
    debut: string;
    fin: string;
    places: number;
    organizer_name: string;
    profil_url: string;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 border border-neutral-200 dark:border-neutral-700">
      <div className="relative">
        <img src={event.profil_url || 'https://via.placeholder.com/400x250'} className="w-full h-48 object-cover" alt={event.title} />
        <div className="absolute top-2 right-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          {new Date(event.debut).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-1">{event.organizer_name}</p>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 truncate">{event.title}</h3>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 h-12 overflow-hidden">{event.description}</p>
        
        <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span className="truncate">{event.lieu}</span>
        </div>

        <Link to={`/event/${event.id}`} className="inline-block w-full text-center bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-300">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
