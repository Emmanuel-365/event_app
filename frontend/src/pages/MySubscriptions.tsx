import React, { useEffect, useState } from 'react';
import { getSubscriptionsByUser } from '../services/subscriptionService';

interface Subscription {
  id: number;
  event: {
    id: number;
    title: string;
    debut: string;
    lieu: string;
  };
  ticketCategory: {
    intitule: string;
  };
  places: number;
}

const MySubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await getSubscriptionsByUser();
        if (Array.isArray(response.data)) {
          setSubscriptions(response.data);
        }
      } catch (err) {
        setError('Could not fetch your subscriptions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  if (loading) {
    return <div>Loading your subscriptions...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h1>My Subscriptions</h1>
      {subscriptions.length === 0 ? (
        <p>You have not subscribed to any events yet.</p>
      ) : (
        <div className="list-group">
          {subscriptions.map(sub => (
            <div key={sub.id} className="list-group-item">
              <h5 className="mb-1">{sub.event.title}</h5>
              <p className="mb-1">
                Date: {new Date(sub.event.debut).toLocaleDateString()} | Location: {sub.event.lieu}
              </p>
              <p className="mb-1">
                Ticket: {sub.ticketCategory.intitule} | Places: {sub.places}
              </p>
              <a href={`/event/${sub.event.id}`} className="btn btn-primary btn-sm mt-2">View Event</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubscriptions;
