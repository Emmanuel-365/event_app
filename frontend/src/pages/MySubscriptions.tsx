import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSubscriptionsByUser } from '../services/subscriptionService';

interface Subscription {
  id: number;
  event_id: number;
  event_name: string;
  event_debut: string;
  event_lieu: string;
  nom_ticket: string;
  places: number;
}

const MySubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await getSubscriptionsByUser();
        if (Array.isArray(response.data)) {
          setSubscriptions(response.data);
        }
      } catch (err) {
        setError('Could not fetch your subscriptions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) {
    return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading your subscriptions...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">My Subscriptions</h1>
      {subscriptions.length === 0 ? (
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow p-8">
          <p className="text-gray-500 dark:text-gray-400">You have not subscribed to any events yet.</p>
          <Link to="/" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:underline">Browse events</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map(sub => (
            <div key={sub.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="flex-grow mb-4 sm:mb-0">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{sub.event_name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(sub.event_debut).toLocaleDateString()} &middot; {sub.event_lieu}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Ticket: <span className="font-semibold">{sub.nom_ticket}</span> | Places: <span className="font-semibold">{sub.places}</span>
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link to={`/event/${sub.event_id}`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  View Event
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubscriptions;
