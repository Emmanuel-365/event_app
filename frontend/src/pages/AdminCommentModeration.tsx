import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface Comment {
    id: number;
    content: string;
    user: {
        email: string;
    };
    event: {
        title: string;
    };
    createdAt: string;
    status: 'VISIBLE' | 'HIDDEN';
}

const AdminCommentModeration: React.FC = () => {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const commentsPerPage = 10;

    const fetchComments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${API_BASE_URL}/admin/comments`, {
                params: {
                    page: currentPage,
                    size: commentsPerPage,
                    sortBy: 'createdAt',
                    sortDir: 'desc'
                }
            });
            setComments(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch comments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [currentPage]);

    const handleToggleCommentStatus = async (commentId: number, currentStatus: 'VISIBLE' | 'HIDDEN') => {
        const newStatus = currentStatus === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE';
        if (window.confirm(`Are you sure you want to ${newStatus === 'HIDDEN' ? 'hide' : 'show'} this comment?`)) {
            try {
                await axios.put(`${API_BASE_URL}/admin/comments/${commentId}/status`, JSON.stringify(newStatus), {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                setMessage(`Comment status updated successfully! It is now ${newStatus}.`);
                fetchComments();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to update comment status.');
            }
        }
    };


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
        return <div className="text-center p-8">Loading comments...</div>;
    }

    if (error) {
        return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-4">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-6">Comment Moderation</h1>

            {message && <div className="bg-green-100 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-r-lg mb-4">{message}</div>}

            <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                        <thead className="bg-neutral-50 dark:bg-neutral-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Content</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Author</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Event</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                            {comments.map((comment) => (
                                <tr key={comment.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">{comment.id}</td>
                                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-300 max-w-xs truncate">{comment.content}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300">{comment.user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300">{comment.event.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${comment.status === 'VISIBLE' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'}`}>
                                            {comment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleToggleCommentStatus(comment.id, comment.status)}
                                            className={`text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300`}
                                        >
                                            {comment.status === 'VISIBLE' ? 'Hide' : 'Show'}
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
                            Showing {comments.length} of {comments.length} comments
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

export default AdminCommentModeration;