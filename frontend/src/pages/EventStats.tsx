import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventStats } from '../services/statsService';

interface EventStatsData {
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

const StatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
    <div className="bg-white dark:bg-neutral-800 p-5 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-300 rounded-lg p-3">
                {icon}
            </div>
            <div className="ml-4">
                <h3 className="text-lg font-medium text-neutral-500 dark:text-neutral-400">{title}</h3>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{value}</p>
            </div>
        </div>
    </div>
);

const DonutChart = ({ percentage }: { percentage: number }) => {
    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-32 h-32">
            <svg height="120" width="120" className="transform -rotate-90">
                <circle className="text-neutral-200 dark:text-neutral-700" stroke="currentColor" strokeWidth="12" fill="transparent" r={radius} cx="60" cy="60" />
                <circle className="text-primary-500" stroke="currentColor" strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" fill="transparent" r={radius} cx="60" cy="60" />
            </svg>
            <span className="absolute text-2xl font-bold text-neutral-900 dark:text-white">{Math.round(percentage)}%</span>
        </div>
    );
};

const EventStats: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<EventStatsData | null>(null);
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
          setError('Could not fetch statistics for this event. Data may not be available yet.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }
  }, [id]);

  if (loading) {
    return (
        <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-10 bg-neutral-300 dark:bg-neutral-700 rounded-lg w-3/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="h-24 bg-neutral-300 dark:bg-neutral-700 rounded-xl"></div>
                <div className="h-24 bg-neutral-300 dark:bg-neutral-700 rounded-xl"></div>
                <div className="h-24 bg-neutral-300 dark:bg-neutral-700 rounded-xl"></div>
            </div>
            <div className="h-80 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
        </div>
    );
  }

  if (error) {
    return <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-r-lg">{error}</div>;
  }

  if (!stats) {
    return <div className="text-center p-8 text-neutral-500 dark:text-neutral-400">No statistics available for this event.</div>;
  }

  const maxCategoryPlaces = Math.max(...stats.categoryDistribution.map(c => c.totalPlaces), 0);

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">Event Statistics</h1>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1">Performance overview for <span className="font-semibold text-primary-600 dark:text-primary-400">{stats.eventTitle}</span></p>
            </div>
            <button onClick={() => navigate('/my-events')} className="inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-200 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back
            </button>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`${stats.totalRevenue.toLocaleString('fr-FR')} CFA`} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard title="Tickets Sold" value={stats.totalSuccessfulSubscriptions.toLocaleString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>} />
        <div className="bg-white dark:bg-neutral-800 p-5 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium text-neutral-500 dark:text-neutral-400 mb-2">Occupancy Rate</h3>
            <DonutChart percentage={stats.occupancyRate} />
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Ticket Sales by Category</h2>
        {stats.categoryDistribution.length > 0 ? (
          <ul className="space-y-4">
            {stats.categoryDistribution.map((cat, index) => (
              <li key={index}>
                <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">{cat.categoryIntitule}</span>
                    <span className="font-medium text-neutral-600 dark:text-neutral-400">{cat.totalPlaces} sold</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2.5">
                    <div className="bg-primary-500 h-2.5 rounded-full" style={{ width: `${(cat.totalPlaces / maxCategoryPlaces) * 100}%` }}></div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-500 dark:text-neutral-400 text-center py-8">No ticket sales data available for any category.</p>
        )}
      </div>
    </div>
  );
};

export default EventStats;
