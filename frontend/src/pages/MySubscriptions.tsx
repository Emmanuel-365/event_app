import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSubscriptionsByUser, deleteSubscription } from '../services/subscriptionService';
import { QRCodeCanvas } from 'qrcode.react';

interface Subscription {
  id: number;
  event_id: number;
  event_name: string;
  event_debut: string;
  event_lieu: string;
  nom_ticket: string;
  places: number;
  codeticket: string;
  event_profil_url: string; 
}

const MySubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState<number | null>(null);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const response = await getSubscriptionsByUser();
        setSubscriptions(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Could not fetch your subscriptions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleDelete = async (subscriptionId: number) => {
    try {
      await deleteSubscription(subscriptionId);
      setSubscriptions(subscriptions.filter(sub => sub.id !== subscriptionId));
    } catch (err) {
      setError('Failed to cancel the subscription.');
      console.error(err);
    } finally {
        setShowCancelModal(null);
    }
  };

  if (loading) {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="h-10 bg-neutral-300 dark:bg-neutral-700 rounded-lg w-1/3 mb-8 animate-pulse"></div>
            <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-36 bg-neutral-200 dark:bg-neutral-800 rounded-xl animate-pulse"></div>
                ))}
            </div>
        </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 mb-8">My Subscriptions</h1>
      {subscriptions.length === 0 ? (
        <div className="text-center bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-12 border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">No subscriptions yet</h3>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 mb-4">You haven't subscribed to any events. Time to explore!</p>
          <Link to="/" className="mt-4 inline-block text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {subscriptions.map(sub => (
            <div key={sub.id} className="bg-white dark:bg-neutral-800 shadow-lg hover:shadow-xl rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-5 border border-neutral-200 dark:border-neutral-700 transition-shadow">
              <img src={sub.event_profil_url || 'https://via.placeholder.com/150'} alt={sub.event_name} className="w-full sm:w-40 h-40 sm:h-28 object-cover rounded-lg" />
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{sub.event_name}</h2>
                <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400 gap-x-3 mt-1">
                    <span>{new Date(sub.event_debut).toLocaleDateString()}</span>
                    <span>&middot;</span>
                    <span>{sub.event_lieu}</span>
                </div>
                <div className="mt-2 inline-block bg-primary-100 text-primary-800 text-xs font-semibold px-2.5 py-1 rounded-full dark:bg-primary-900/50 dark:text-primary-300">
                  {sub.places} x {sub.nom_ticket}
                </div>
              </div>
              <div className="w-full sm:w-auto flex-shrink-0 flex sm:flex-col justify-end gap-2 mt-4 sm:mt-0">
                <button onClick={() => setSelectedSubscription(sub)} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 transition-colors">
                    Show Ticket
                </button>
                <button onClick={() => setShowCancelModal(sub.id)} className="inline-flex items-center justify-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Cancellation Modal */}
      {showCancelModal !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" aria-modal="true">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Cancel Subscription</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">Are you sure you want to cancel your subscription to this event? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end space-x-4">
              <button type="button" className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-700 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-600" onClick={() => setShowCancelModal(null)}>Keep Subscription</button>
              <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700" onClick={() => handleDelete(showCancelModal)}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal */}
      {selectedSubscription && (
         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setSelectedSubscription(null)}>
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl p-8 w-full max-w-sm mx-auto text-center" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400">EVENT TICKET</h2>
                <p className="text-sm text-neutral-500 mb-4">Present this QR code at the entrance</p>

                <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg inline-block">
                    <QRCodeCanvas value={selectedSubscription.codeticket} size={256} bgColor={"#ffffff"} fgColor={"#000000"} />
                </div>
                
                <div className="mt-6 text-left space-y-2">
                    <p className="text-lg font-bold text-neutral-800 dark:text-white">{selectedSubscription.event_name}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{new Date(selectedSubscription.event_debut).toLocaleString()}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{selectedSubscription.event_lieu}</p>
                    <hr className="my-2 border-neutral-200 dark:border-neutral-700"/>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300"><strong>Ticket:</strong> {selectedSubscription.nom_ticket}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300"><strong>Places:</strong> {selectedSubscription.places}</p>
                    <p className="text-sm font-mono p-2 bg-neutral-100 dark:bg-neutral-800 rounded-md text-neutral-700 dark:text-neutral-200 tracking-widest">{selectedSubscription.codeticket}</p>
                </div>

                <button onClick={() => setSelectedSubscription(null)} className="mt-6 w-full bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold py-2 px-4 rounded-lg hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors">
                    Close
                </button>
            </div>
         </div>
      )}
    </div>
  );
};

export default MySubscriptions;
