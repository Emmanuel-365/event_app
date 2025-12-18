import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

interface AdminDashboardStatsDto {
    totalUsers: number;
    totalEvents: number;
    totalSubscriptions: number;
    totalRevenue: number;
}

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<AdminDashboardStatsDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/admin/stats/dashboard`);
                setStats(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch admin dashboard stats.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-4 animate-pulse">
                <div className="h-10 bg-neutral-300 dark:bg-neutral-700 rounded-lg w-1/3 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
                    <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
                    <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
                    <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-6">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats?.totalUsers || 0} />
                <StatCard title="Total Events" value={stats?.totalEvents || 0} />
                <StatCard title="Total Subscriptions" value={stats?.totalSubscriptions || 0} />
                <StatCard title="Total Revenue" value={stats?.totalRevenue || 0} currency="XAF" />
            </div>

            {/* TODO: Add charts and graphs here in subsequent steps */}
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: number;
    currency?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, currency }) => {
    return (
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-neutral-900 dark:text-white">
                {value.toLocaleString()} {currency}
            </p>
        </div>
    );
};

export default AdminDashboardPage;