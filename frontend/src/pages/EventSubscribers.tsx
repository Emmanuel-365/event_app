import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSubscriptionsByEvent } from '../services/subscriptionService';

interface Subscriber {
  id: number;
  visitor: {
    id: number;
    name: string;
    surname: string;
    email: string;
  };
  places: number;
}

const EventSubscribers: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchSubscribers = async () => {
      try {
        const response = await getSubscriptionsByEvent(id);
        if (Array.isArray(response.data)) {
          setSubscribers(response.data);
        }
      } catch (err) {
        setError('Could not fetch subscribers for this event.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [id]);

  if (loading) {
    return <div>Loading subscribers...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h1>Event Subscribers</h1>
      {subscribers.length === 0 ? (
        <p>There are no subscribers for this event yet.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Places Reserved</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map(sub => (
              <tr key={sub.id}>
                <td>{sub.visitor.name} {sub.visitor.surname}</td>
                <td>{sub.visitor.email}</td>
                <td>{sub.places}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventSubscribers;
