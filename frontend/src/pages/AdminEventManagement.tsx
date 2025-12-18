import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Event {
    id: number;
    title: string;
    organizerProfile: {
        name: string;
    };
    statut: string;
    featured: boolean;
    debut: string; // LocalDate is serialized as string
    // Add other event fields as needed
}

const AdminEventManagement: React.FC = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(0); // Backend is 0-indexed
    const [totalPages, setTotalPages] = useState(0);
    const eventsPerPage = 10;

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE_URL}/admin/events`, {
                params: {
                    page: currentPage,
                    size: eventsPerPage,
                    // Add other filter params here if backend supports
                }
            });
            setEvents(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch events.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [currentPage]); // Refetch when page changes

    const handleUpdateStatus = async (eventId: number, currentStatus: string) => {
        const newStatus = currentStatus === 'ACTIF' ? 'ANNULE' : 'ACTIF'; // Example toggle
        if (window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
            try {
                await axios.put(`${API_BASE_URL}/admin/events/${eventId}/status`, JSON.stringify(newStatus), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setMessage('Event status updated successfully!');
                fetchEvents();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to update event status.');
            }
        }
    };

    const handleToggleFeatured = async (eventId: number, currentFeatured: boolean) => {
        if (window.confirm(`Are you sure you want to ${currentFeatured ? 'unfeature' : 'feature'} this event?`)) {
            try {
                await axios.put(`${API_BASE_URL}/admin/events/${eventId}/featured`, !currentFeatured, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setMessage('Event featured status updated successfully!');
                fetchEvents();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to update event featured status.');
            }
        }
    };

    // Filter logic on frontend for now, ideal to push to backend
    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter ? event.statut === statusFilter : true)
    );

    if (!user || user.role !== 'ROLE_ADMIN') {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p className="mt-2 text-neutral-600 dark:text-neutral-300">You must be logged in as an administrator to access this page.</p>
                <Link to="/login" className="mt-4 inline-block text-primary-600 hover:underline">Login</Link>
            </div>
        );
    }

    if (loading) {
        return <div className="text-center p-8">Loading events...</div>;
    }

    if (error) {
        return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-4">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-6">Event Management</h1>

            {message && <div className="bg-green-100 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-r-lg mb-4">{message}</div>}

            <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                <div className="flex justify-between mb-4">
                    <input
                        type="text"
                        placeholder="Search by title"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-1/3 px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="block w-1/4 px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                        <option value="">All Statuses</option>
                        <option value="EN_ATTENTE">Pending</option>
                        <option value="ACTIF">Active</option>
                        <option value="ANNULE">Cancelled</option>
                        <option value="TERMINE">Finished</option>
                        <option value="PROCHAINEMENT">Upcoming</option>
                        <option value="EN_COURS">Ongoing</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                        <thead className="bg-neutral-50 dark:bg-neutral-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Title</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Organizer</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Featured</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                            {filteredEvents.map((event) => (
                                <tr key={event.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">{event.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300">{event.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300">{event.organizerProfile?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.statut === 'ACTIF' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'}`}>
                                            {event.statut}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.featured ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/20 dark:text-neutral-300'}`}>
                                            {event.featured ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleUpdateStatus(event.id, event.statut)}
                                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                        >
                                            {event.statut === 'ACTIF' ? 'Cancel' : 'Activate'}
                                        </button>
                                        <button
                                            onClick={() => handleToggleFeatured(event.id, event.featured)}
                                            className="ml-4 text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                                        >
                                            {event.featured ? 'Unfeature' : 'Feature'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-300">
                            Showing {filteredEvents.length} of {events.length} events
                        </p>
                    </div>
                    <div className="flex">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="relative inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage + 1 >= totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEventManagement;