import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventById } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import { createSubscription } from '../services/subscriptionService';

interface TicketCategory {
  id: number;
  intitule: string;
  prix: number;
}

interface Image {
    id: number;
    imageurl: string;
}

interface EventDetailsData {
  id: number;
  title: string;
  description: string;
  lieu: string;
  debut: string;
  fin: string;
  places: number;
  organizer_name: string;
  profil_url: string;
  ticketCategoryList: TicketCategory[];
  images: Image[];
}

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [event, setEvent] = useState<EventDetailsData | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchEvent = async () => {
      if (id) {
        setLoading(true);
        try {
          const response = await getEventById(id);
          setEvent(response.data);
          if (response.data.ticketCategoryList && response.data.ticketCategoryList.length > 0) {
            setSelectedTicket(String(response.data.ticketCategoryList[0].id));
          }
        } catch (err) {
          setError('Could not fetch event details.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !selectedTicket) {
      setError('Please select a ticket and ensure you are logged in.');
      return;
    }
    setSubmitting(true);
    setMessage('');
    setError('');
    try {
      const subscriptionData = {
        id_event: parseInt(id, 10),
        id_visitor: user.id,
        id_ticket: parseInt(selectedTicket, 10),
        places: quantity,
      };
      await createSubscription(subscriptionData);
      setMessage('Subscription successful! A confirmation has been sent to your email.');
    } catch (err) {
      setError('Subscription failed. The ticket may be sold out or an error occurred.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const InfoPill = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
    <div className="flex items-center text-sm text-neutral-700 dark:text-neutral-300">
        {icon}
        <span className="ml-2">{text}</span>
    </div>
  );

  if (loading) {
    return (
        <div className="max-w-6xl mx-auto p-4 animate-pulse">
            <div className="h-80 bg-neutral-300 dark:bg-neutral-700 rounded-2xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-12 bg-neutral-300 dark:bg-neutral-700 rounded-lg w-3/4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded-lg w-full"></div>
                        <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded-lg w-full"></div>
                        <div className="h-4 bg-neutral-300 dark:bg-neutral-700 rounded-lg w-2/3"></div>
                    </div>
                </div>
                <div className="h-96 bg-neutral-300 dark:bg-neutral-700 rounded-2xl"></div>
            </div>
        </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>;
  }

  if (!event) {
    return <div className="text-center p-8 text-neutral-500 dark:text-neutral-400">Event not found.</div>;
  }

  const selectedTicketDetails = event.ticketCategoryList.find(t => t.id === Number(selectedTicket));
  const totalPrice = selectedTicketDetails ? selectedTicketDetails.prix * quantity : 0;

  return (
    <div className="max-w-6xl mx-auto">
        <div className="w-full h-64 md:h-80 lg:h-96 bg-cover bg-center rounded-2xl mb-8" style={{ backgroundImage: `url(${event.profil_url || 'https://via.placeholder.com/1200x400'})` }}></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
                <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-white mb-4">{event.title}</h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
                    <InfoPill icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} text={event.organizer_name} />
                    <InfoPill icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} text={event.lieu} />
                    <InfoPill icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} text={`${new Date(event.debut).toLocaleDateString()}`} />
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300">
                    <p>{event.description}</p>
                </div>
                {event.images && event.images.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Gallery</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {event.images.map(img => <img key={img.id} src={img.imageurl} alt="Event gallery" className="rounded-lg object-cover aspect-square" />)}
                        </div>
                    </div>
                )}
            </div>

            <div className="lg:sticky top-24 self-start">
                <div className="bg-white dark:bg-neutral-800 shadow-2xl rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
                    <h2 className="font-bold text-xl mb-4 text-neutral-900 dark:text-white">Get Your Tickets</h2>
                    {user && user.role === 'ROLE_VISITOR' ? (
                        <form onSubmit={handleSubscription} className="space-y-4">
                            {message && <div className="bg-green-100 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-r-lg"><p className="font-bold">Success!</p><p>{message} You can view it in <Link to="/my-subscriptions" className="font-semibold underline">My Subscriptions</Link>.</p></div>}
                            {error && <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-r-lg"><p className="font-bold">Oops!</p><p>{error}</p></div>}
                            
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Select Ticket</label>
                                <div className="space-y-2">
                                    {event.ticketCategoryList.map((ticket) => (
                                        <label key={ticket.id} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedTicket === String(ticket.id) ? 'border-primary-500 ring-2 ring-primary-500' : 'border-neutral-300 dark:border-neutral-600'}`}>
                                            <div className="flex items-center">
                                                <input type="radio" name="ticket" value={ticket.id} checked={selectedTicket === String(ticket.id)} onChange={(e) => setSelectedTicket(e.target.value)} className="h-4 w-4 text-primary-600 border-neutral-300 focus:ring-primary-500" />
                                                <span className="ml-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">{ticket.intitule}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{ticket.prix.toLocaleString('fr-FR')} CFA</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Quantity</label>
                                <div className="flex items-center">
                                    <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 border border-neutral-300 dark:border-neutral-600 rounded-l-md">-</button>
                                    <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min="1" className="w-16 text-center border-t border-b border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800" />
                                    <button type="button" onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 border border-neutral-300 dark:border-neutral-600 rounded-r-md">+</button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                                <div className="flex justify-between items-center text-lg font-bold text-neutral-900 dark:text-white">
                                    <span>Total:</span>
                                    <span>{totalPrice.toLocaleString('fr-FR')} CFA</span>
                                </div>
                            </div>

                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 transition-colors" disabled={submitting || !!message}>
                                {submitting ? 'Processing...' : 'Subscribe Now'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center p-6 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg">
                            <p className="text-neutral-700 dark:text-neutral-300 mb-4">You must be logged in as a visitor to subscribe.</p>
                            <Link to="/login" state={{ from: `/event/${id}` }} className="font-semibold text-primary-600 hover:text-primary-500">
                                Login or Create an Account
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default EventDetails;