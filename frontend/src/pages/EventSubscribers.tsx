import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubscriptionsByEvent } from '../services/subscriptionService';

interface Subscriber {
  id: number;
  visitor: {
    id: number;
    name: string;
    surname: string;
    email: string;
  };
  places: number;
}

const EventSubscribers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        const response = await getSubscriptionsByEvent(id);
        setSubscribers(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Could not fetch subscribers for this event.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [id]);

  const { totalSubscribers, totalPlacesReserved } = useMemo(() => {
    return {
      totalSubscribers: subscribers.length,
      totalPlacesReserved: subscribers.reduce((sum, sub) => sum + sub.places, 0),
    };
  }, [subscribers]);

  if (loading) {
    return (
        <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-10 bg-neutral-300 dark:bg-neutral-700 rounded-lg w-1/2 mb-8"></div>
            <div className="h-24 bg-neutral-300 dark:bg-neutral-700 rounded-xl mb-6"></div>
            <div className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
        </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">Event Subscribers</h1>
        <button onClick={() => navigate('/my-events')} className="inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-200 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to My Events
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 text-center">
            <h3 className="text-lg font-semibold text-neutral-500 dark:text-neutral-400">Total Subscribers</h3>
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mt-1">{totalSubscribers}</p>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 text-center">
            <h3 className="text-lg font-semibold text-neutral-500 dark:text-neutral-400">Total Places Reserved</h3>
            <p className="text-4xl font-bold text-primary-600 dark:text-primary-400 mt-1">{totalPlacesReserved}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
        {subscribers.length === 0 ? (
          <div className="text-center p-12">
            <h3 className="text-lg font-medium text-neutral-800 dark:text-white">No subscribers yet</h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Share your event to get your first subscriber!</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <thead className="bg-neutral-50 dark:bg-neutral-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Places</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
              {subscribers.map(sub => (
                <tr key={sub.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
                            <span className="font-semibold text-neutral-600 dark:text-neutral-300">{(sub.visitor.name || '?').charAt(0)}{(sub.visitor.surname || '?').charAt(0)}</span>
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900 dark:text-white">{sub.visitor.name} {sub.visitor.surname}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">{sub.visitor.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-2.5 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300">
                        {sub.places}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EventSubscribers;
