import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== 'ROLE_ADMIN') {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">You must be logged in as an administrator to access this page.</p>
        <Link to="/login" className="mt-4 inline-block text-primary-600 hover:underline">Login</Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-100 dark:bg-neutral-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-neutral-800 shadow-lg p-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-3">
              <Link
                to="/admin/dashboard"
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/admin/dashboard'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                Dashboard Overview
              </Link>
            </li>
            <li className="mb-3">
              <Link
                to="/admin/users"
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/admin/users'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292V15.708a4 4 0 010 5.292m0-10.584L2.94 4.876M9 10.605a4 4 0 01-2.94 4.876M9 10.605V15.708m0 0a4 4 0 012.94 4.876M12 4.354h.001M12 15.708h.001" /></svg>
                User Management
              </Link>
            </li>
            <li className="mb-3">
              <Link
                to="/admin/events"
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/admin/events'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h.01M13 11h.01M17 11h.01M9 15h.01M13 15h.01M17 15h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 002 2v14a2 2 0 002 2z" /></svg>
                Event Management
              </Link>
            </li>
            <li className="mb-3">
              <Link
                to="/admin/comments"
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === '/admin/comments'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10M14.5 19L17 21l2.5-2.5" /></svg>
                Comment Moderation
              </Link>
            </li>
            {/* TODO: Add links for Event Management, Content Moderation, etc. */}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet /> {/* This is where child routes will be rendered */}
      </main>
    </div>
  );
};

export default AdminDashboard;