import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAllMembers, createMember } from '../services/memberService';

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
    role: 'COORGANISATEUR', // Default role
  });

  const fetchMembers = async () => {
    try {
      const response = await getAllMembers();
      setMembers(response.data);
    } catch (err) {
      setListError('Could not fetch members.');
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
      setFormData({ name: '', surname: '', email: '', role: 'COORGANISATEUR' }); // Reset form
      fetchMembers(); // Refresh member list
    } catch (err) {
      setFormError('Failed to add member. The email might already exist.');
      console.error(err);
    } finally {
      setLoading(false);
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
          <li key={member.id} className="list-group-item">
            {member.name} {member.surname} ({member.email}) - {member.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberManagement;
