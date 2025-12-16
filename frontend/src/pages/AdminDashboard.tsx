import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllUsers, updateUserRole, deleteUser, type User } from '../services/adminService';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ROLE_ADMIN') {
      fetchUsers();
    }
  }, [user]);

  const handleChangeRole = async (userId: number, newRole: string) => {
    if (!user || user.id === userId) {
        setMessage("Admin cannot change their own role or delete their own account for security reasons.");
        return;
    }
    try {
      await updateUserRole(userId, newRole as User['role']);
      setMessage('User role updated successfully!');
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!user || user.id === userId) {
        setMessage("Admin cannot change their own role or delete their own account for security reasons.");
        return;
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setMessage('User deleted successfully!');
        fetchUsers(); // Refresh the list
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete user.');
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
    return <div className="text-center p-8">Loading users...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-6">Admin Dashboard</h1>

      {message && <div className="bg-green-100 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-r-lg mb-4">{message}</div>}
      {error && <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-r-lg mb-4">{error}</div>}

      <div className="bg-white dark:bg-neutral-800 shadow-lg rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">{u.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300">
                  <select
                    value={u.role}
                    onChange={(e) => handleChangeRole(u.id, e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-neutral-700 dark:text-white"
                  >
                    <option value="ROLE_VISITOR">Visitor</option>
                    <option value="ROLE_ORGANIZER">Organizer</option>
                    <option value="ROLE_ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
