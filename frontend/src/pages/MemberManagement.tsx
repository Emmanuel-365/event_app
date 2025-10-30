import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllMembers, createMember, updateMember, deleteMember } from '../services/memberService';

const MemberManagement: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [listError, setListError] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    role: 'COORGANISATEUR',
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [newRole, setNewRole] = useState('');

  const fetchMembers = async () => {
    try {
      const response = await getAllMembers();
      setMembers(response.data);
    } catch (err) {
      setListError('Could not fetch members.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setFormError('You must be logged in to add a member.');
      return;
    }
    setLoading(true);
    setFormMessage('');
    setFormError('');
    try {
      const memberData = { ...formData, id_organizer: user.id };
      await createMember(memberData);
      setFormMessage('Member added successfully!');
      setFormData({ name: '', surname: '', email: '', role: 'COORGANISATEUR' });
      fetchMembers();
    } catch (err) {
      setFormError('Failed to add member. The email might already exist.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (member: any) => {
    setEditingMember(member);
    setNewRole(member.role);
    setIsEditModalOpen(true);
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;
    try {
      await updateMember(editingMember.id, { ...editingMember, role: newRole });
      fetchMembers();
      setIsEditModalOpen(false);
      setEditingMember(null);
    } catch (err) {
      console.error('Failed to update member', err);
    }
  };

  const handleDeleteMember = async (memberId: number) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteMember(memberId);
        setMembers(members.filter(m => m.id !== memberId));
      } catch (err) {
        console.error('Failed to delete member', err);
      }
    }
  };

  const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-white";
  const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Member</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <div className="bg-red-100 border-red-400 text-red-700 px-4 py-2 rounded text-sm">{formError}</div>}
            {formMessage && <div className="bg-green-100 border-green-400 text-green-700 px-4 py-2 rounded text-sm">{formMessage}</div>}
            
            <div>
              <label htmlFor="name" className={labelStyle}>Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
              <label htmlFor="surname" className={labelStyle}>Surname</label>
              <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
              <label htmlFor="email" className={labelStyle}>Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
              <label htmlFor="role" className={labelStyle}>Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className={inputStyle}>
                <option value="COORGANISATEUR">Co-organizer</option>
                <option value="ADJOINT">Assistant</option>
                <option value="FONDATEUR">Founder</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400" disabled={loading}>
                {loading ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Member Management</h1>
        {listError && <div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded">{listError}</div>}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {members.length > 0 ? members.map(member => (
              <li key={member.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                  <div className="flex-1 mb-4 sm:mb-0">
                    <p className="text-md font-semibold text-gray-900 dark:text-white">{member.name} {member.surname}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{member.role}</p>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    <button onClick={() => openEditModal(member)} className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Edit</button>
                    <button onClick={() => handleDeleteMember(member.id)} className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Delete</button>
                  </div>
                </div>
              </li>
            )) : <p className="p-4 text-gray-500 dark:text-gray-400">No members found.</p>}
          </ul>
        </div>
      </div>

      {isEditModalOpen && editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Edit Member Role</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Editing role for: <strong className="font-semibold">{editingMember.name} {editingMember.surname}</strong></p>
            <select className={inputStyle} value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              <option value="COORGANISATEUR">Co-organizer</option>
              <option value="ADJOINT">Assistant</option>
              <option value="FONDATEUR">Founder</option>
            </select>
            <div className="mt-6 flex justify-end space-x-4">
              <button type="button" className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500" onClick={() => setIsEditModalOpen(false)}>Close</button>
              <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700" onClick={handleUpdateMember}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
