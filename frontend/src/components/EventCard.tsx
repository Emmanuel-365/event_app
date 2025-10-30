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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img src={event.profil_url || 'https://via.placeholder.com/300x200'} className="w-full h-48 object-cover" alt={event.title} />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">{event.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 h-20 overflow-hidden">{event.description}</p>
        <div className="text-xs text-gray-500 dark:text-gray-300 space-y-1 mb-4">
          <p className="truncate"><strong>Location:</strong> {event.lieu}</p>
          <p><strong>Date:</strong> {new Date(event.debut).toLocaleDateString()}</p>
          <p><strong>Organizer:</strong> {event.organizer_name}</p>
        </div>
        <Link to={`/event/${event.id}`} className="inline-block w-full text-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
