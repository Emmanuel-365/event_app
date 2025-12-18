import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllMembers, createMember, updateMember, deleteMember } from '../services/memberService';

interface Member {
    id: number;
    name: string;
    surname: string;
    email: string;
    role: string;
}

const MemberManagement: React.FC = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [listError, setListError] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({ name: '', surname: '', email: '', role: 'COORGANISATEUR' });
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);

  const fetchMembers = async () => {
    try {
      setFetching(true);
      const response = await getAllMembers();
      setMembers(response.data);
    } catch (err) {
      setListError('Could not fetch members.');
      console.error(err);
    } finally {
      setFetching(false);
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
      await createMember({ ...formData, id_organizer: user.id });
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

  const handleUpdateMember = async () => {
    if (!editingMember) return;
    try {
      await updateMember(editingMember.id, { role: editingMember.role });
      fetchMembers();
      setEditingMember(null);
    } catch (err) {
      console.error('Failed to update member', err);
    }
  };

  const handleDeleteMember = async () => {
    if (!deletingMember) return;
    try {
      await deleteMember(deletingMember.id);
      setMembers(members.filter(m => m.id !== deletingMember.id));
      setDeletingMember(null);
    } catch (err) {
      console.error('Failed to delete member', err);
    }
  };

  const inputStyle = "block w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
  const labelStyle = "block text-sm font-medium text-neutral-700 dark:text-neutral-300";

  const getRoleBadge = (role: string) => {
    switch (role) {
        case 'FONDATEUR': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        case 'COORGANISATEUR': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        case 'ADJOINT': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        default: return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300';
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-8">Member Management</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">Add New Member</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {formError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-r-lg text-sm">{formError}</div>}
                    {formMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded-r-lg text-sm">{formMessage}</div>}
                    
                    <div><label htmlFor="name" className={labelStyle}>Name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={inputStyle} required /></div>
                    <div><label htmlFor="surname" className={labelStyle}>Surname</label><input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange} className={inputStyle} required /></div>
                    <div><label htmlFor="email" className={labelStyle}>Email</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={inputStyle} required /></div>
                    <div><label htmlFor="role" className={labelStyle}>Role</label><select id="role" name="role" value={formData.role} onChange={handleChange} className={inputStyle}><option value="COORGANISATEUR">Co-organizer</option><option value="ADJOINT">Assistant</option><option value="FONDATEUR">Founder</option></select></div>
                    
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400" disabled={loading}>
                            {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                            {loading ? 'Adding...' : 'Add Member'}
                        </button>
                    </div>
                </form>
                </div>
            </div>

            <div className="lg:col-span-2">
                {listError && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg mb-4">{listError}</div>}
                <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
                {fetching ? (
                    <div className="p-4 space-y-2 animate-pulse">
                        {[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-neutral-200 dark:bg-neutral-700 rounded-lg"></div>)}
                    </div>
                ) : members.length > 0 ? (
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                        <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Role</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                            {members.map(member => (
                            <tr key={member.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                                            <span className="font-bold text-primary-700 dark:text-primary-300">{(member.name || '?').charAt(0)}{(member.surname || '?').charAt(0)}</span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-neutral-900 dark:text-white">{member.name} {member.surname}</div>
                                            <div className="text-sm text-neutral-500 dark:text-neutral-400">{member.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(member.role)}`}>
                                        {member.role.charAt(0) + member.role.slice(1).toLowerCase().replace('_', '-')}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => setEditingMember(member)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-200 p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg></button>
                                    <button onClick={() => setDeletingMember(member)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 p-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center p-12">
                        <h3 className="text-lg font-medium text-neutral-800 dark:text-white">No members found</h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Add a member using the form to get started.</p>
                    </div>
                )}
                </div>
            </div>

            {editingMember && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">Edit Member Role</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4">Editing role for: <strong className="font-semibold">{editingMember.name} {editingMember.surname}</strong></p>
                    <select className={inputStyle} value={editingMember.role} onChange={(e) => setEditingMember({...editingMember, role: e.target.value})}>
                        <option value="COORGANISATEUR">Co-organizer</option><option value="ADJOINT">Assistant</option><option value="FONDATEUR">Founder</option>
                    </select>
                    <div className="mt-6 flex justify-end space-x-4">
                    <button type="button" className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-700 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-600" onClick={() => setEditingMember(null)}>Cancel</button>
                    <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700" onClick={handleUpdateMember}>Save Changes</button>
                    </div>
                </div>
                </div>
            )}

            {deletingMember && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Confirm Deletion</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">Are you sure you want to remove <strong className="font-semibold">{deletingMember.name} {deletingMember.surname}</strong> from your team?</p>
                    <div className="mt-6 flex justify-end space-x-4">
                    <button type="button" className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-700 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-600" onClick={() => setDeletingMember(null)}>Cancel</button>
                    <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700" onClick={handleDeleteMember}>Delete Member</button>
                    </div>
                </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default MemberManagement;
