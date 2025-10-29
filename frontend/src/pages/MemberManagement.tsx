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

  // State for editing modal
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
      fetchMembers(); // Refresh list
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

  return (
    <div>
      <h1>Member Management</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New Member</h5>
          <form onSubmit={handleSubmit}>
            {formError && <div className="alert alert-danger">{formError}</div>}
            {formMessage && <div className="alert alert-success">{formMessage}</div>}

            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" id="name" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="surname" className="form-label">Surname</label>
              <input type="text" id="surname" name="surname" placeholder="Surname" value={formData.surname} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" id="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="role" className="form-label">Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className="form-select">
                <option value="COORGANISATEUR">Co-organizer</option>
                <option value="ADJOINT">Assistant</option>
                <option value="FONDATEUR">Founder</option>
              </select>
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Adding Member...' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <h5>Existing Members</h5>
      {listError && <div className="alert alert-danger">{listError}</div>}
      <ul className="list-group">
        {members.map(member => (
          <li key={member.id} className="list-group-item d-flex justify-content-between align-items-center">
            {member.name} {member.surname} ({member.email}) - {member.role}
            <div>
              <button className="btn btn-secondary btn-sm me-2" onClick={() => openEditModal(member)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDeleteMember(member.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {isEditModalOpen && editingMember && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Member Role</h5>
                <button type="button" className="btn-close" onClick={() => setIsEditModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <p>Editing role for: <strong>{editingMember.name} {editingMember.surname}</strong></p>
                <select className="form-select" value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                  <option value="COORGANISATEUR">Co-organizer</option>
                  <option value="ADJOINT">Assistant</option>
                  <option value="FONDATEUR">Founder</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateMember}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
