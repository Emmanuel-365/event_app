import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEventStats } from '../services/statsService';

interface EventStats {
  eventId: number;
  eventTitle: string;
  totalSuccessfulSubscriptions: number;
  totalRevenue: number;
  maxCapacity: number;
  occupancyRate: number;
  categoryDistribution: {
    categoryIntitule: string;
    totalPlaces: number;
  }[];
}

const EventStats: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchStats = async () => {
        try {
          setLoading(true);
          const response = await getEventStats(id);
          setStats(response.data);
        } catch (err) {
          setError('Could not fetch statistics for this event.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading event statistics...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center p-8 text-gray-500 dark:text-gray-400">No statistics available for this event.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Statistics for: <span className="text-indigo-600 dark:text-indigo-400">{stats.eventTitle}</span></h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">A quick overview of your event's performance.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 text-center">
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{stats.totalRevenue.toLocaleString('fr-FR')} CFA</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 text-center">
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Tickets Sold</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalSuccessfulSubscriptions}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 text-center">
          <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">Occupancy Rate</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.occupancyRate}%</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ticket Sales by Category</h2>
        {stats.categoryDistribution.length > 0 ? (
          <ul className="space-y-3">
            {stats.categoryDistribution.map((cat, index) => (
              <li key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md flex justify-between items-center">
                <span className="font-semibold text-gray-800 dark:text-gray-200">{cat.categoryIntitule}</span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{cat.totalPlaces} sold</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No ticket sales data available.</p>
        )}
      </div>
    </div>
  );
};

export default EventStats;
