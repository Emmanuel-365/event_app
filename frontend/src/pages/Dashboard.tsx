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
    const d = new Date();
    d.setMonth(monthNumber - 1);
    return d.toLocaleString('en-US', { month: 'long' });
  };

  const StatCard = ({ title, data, renderLabel, icon }: { title: string, data: {label: string, value: number}[], renderLabel: (label: string) => string, icon: React.ReactNode }) => {
    const maxValue = Math.max(...data.map(d => d.value), 0);
    return (
        <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center mb-4">
                {icon}
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white ml-3">{title}</h2>
            </div>
            {data.length > 0 ? (
                <ul className="space-y-4">
                {data.map((item, index) => (
                    <li key={index}>
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-semibold text-neutral-700 dark:text-neutral-300">{renderLabel(item.label)}</span>
                            <span className="font-bold text-primary-600 dark:text-primary-400">{item.value.toLocaleString('fr-FR')} CFA</span>
                        </div>
                        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                            <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${(item.value / maxValue) * 100}%` }}></div>
                        </div>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">No performance data available yet.</p>
            )}
        </div>
    );
  };

  if (loading) {
    return (
        <div className="max-w-7xl mx-auto animate-pulse">
            <div className="h-10 bg-neutral-300 dark:bg-neutral-700 rounded-lg w-1/3 mb-8"></div>
            <div className="h-32 bg-neutral-300 dark:bg-neutral-700 rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-64 bg-neutral-300 dark:bg-neutral-700 rounded-xl"></div>
                <div className="h-64 bg-neutral-300 dark:bg-neutral-700 rounded-xl"></div>
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-yellow-100 dark:bg-yellow-900/20 border-l-4 border-yellow-400 text-yellow-700 dark:text-yellow-300 p-4 rounded-r-lg">
            <p className="font-bold">Could not load data</p>
            <p>{error}</p>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-8">Organizer Dashboard</h1>

      {generalRec && generalRec.recommandationGenerale && (
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-700 dark:to-primary-800 text-white shadow-2xl rounded-xl p-8 mb-8">
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <div className="ml-4">
                    <h2 className="text-2xl font-bold mb-2">AI-Powered Recommendation</h2>
                    <p className="text-lg opacity-90">{generalRec.recommandationGenerale}</p>
                </div>
            </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StatCard 
            title="Top Performing Locations"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            data={locationRecs.map(l => ({ label: l.lieu, value: l.averageRevenue }))}
            renderLabel={(label) => label}
        />
        <StatCard 
            title="Top Performing Months"
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            data={timingRecs.map(t => ({ label: String(t.month), value: t.averageRevenue }))}
            renderLabel={(label) => getMonthName(Number(label))}
        />
      </div>
    </div>
  );
};

export default Dashboard;
