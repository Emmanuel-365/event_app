import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGeneralRecommendation, getLocationRecommendations, getTimingRecommendations } from '../services/statsService';

interface GeneralRecommendation {
  meilleurMois: string;
  meilleurLieu: string;
  revenuMoyenMois: number;
  revenuMoyenLieu: number;
  recommandationGenerale: string;
}

interface LocationPerformance {
  lieu: string;
  averageRevenue: number;
}

interface TimingPerformance {
  month: number;
  averageRevenue: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [generalRec, setGeneralRec] = useState<GeneralRecommendation | null>(null);
  const [locationRecs, setLocationRecs] = useState<LocationPerformance[]>([]);
  const [timingRecs, setTimingRecs] = useState<TimingPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const [generalRes, locationRes, timingRes] = await Promise.all([
            getGeneralRecommendation(user.id),
            getLocationRecommendations(user.id),
            getTimingRecommendations(user.id)
          ]);
          setGeneralRec(generalRes.data);
          setLocationRecs(locationRes.data);
          setTimingRecs(timingRes.data);
        } catch (err) {
          setError('Could not fetch dashboard data. You may need more completed events to generate statistics.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const getMonthName = (monthNumber: number) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[monthNumber - 1];
  };

  if (loading) {
    return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Organizer Dashboard</h1>

      {generalRec && generalRec.recommandationGenerale && (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8 border-l-4 border-indigo-500">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Recommendation</h2>
          <p className="text-gray-700 dark:text-gray-300">{generalRec.recommandationGenerale}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Performing Locations</h2>
          {locationRecs.length > 0 ? (
            <ul className="space-y-3">
              {locationRecs.map((loc, index) => (
                <li key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md flex justify-between items-center">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{loc.lieu}</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">{loc.averageRevenue.toLocaleString('fr-FR')} CFA</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No location performance data available.</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Top Performing Months</h2>
          {timingRecs.length > 0 ? (
            <ul className="space-y-3">
              {timingRecs.map((time, index) => (
                <li key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md flex justify-between items-center">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{getMonthName(time.month)}</span>
                  <span className="text-green-600 dark:text-green-400 font-bold">{time.averageRevenue.toLocaleString('fr-FR')} CFA</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No timing performance data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
