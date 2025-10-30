import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchSubscribers = async () => {
      try {
        const response = await getSubscriptionsByEvent(id);
        if (Array.isArray(response.data)) {
          setSubscribers(response.data);
        }
      } catch (err) {
        setError('Could not fetch subscribers for this event.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [id]);

  if (loading) {
    return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading subscribers...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Event Subscribers</h1>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        {subscribers.length === 0 ? (
          <p className="p-6 text-gray-500 dark:text-gray-400">There are no subscribers for this event yet.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Places Reserved</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {subscribers.map(sub => (
                <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{sub.visitor.name} {sub.visitor.surname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{sub.visitor.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{sub.places}</td>
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
