import React from 'react';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          Join EventApp
        </h2>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Choose your role to get started.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Visitor Card */}
        <Link to="/register-visitor" className="block p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">As a Visitor</h3>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Browse and subscribe to the best events happening around you. Get your tickets in a few clicks.
          </p>
          <div className="mt-6">
            <span className="inline-block text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-3 rounded-md text-sm font-medium">
              Register as Visitor &rarr;
            </span>
          </div>
        </Link>

        {/* Organizer Card */}
        <Link to="/register-organizer" className="block p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">As an Organizer</h3>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Create, manage, and promote your events. Reach a wider audience and sell more tickets.
          </p>
          <div className="mt-6">
            <span className="inline-block text-white bg-gray-600 hover:bg-gray-700 px-5 py-3 rounded-md text-sm font-medium">
              Register as Organizer &rarr;
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Register;
