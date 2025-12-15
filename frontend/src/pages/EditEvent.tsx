import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, updateEvent } from '../services/eventService';
import { createTicketCategory, deleteTicketCategory } from '../services/ticketCategoryService';
import { createImage, deleteImage } from '../services/imageService';

interface Image {
  id: number;
  imageurl: string;
}

interface TicketCategory {
  id: number;
  intitule: string;
  prix: number;
}

interface EventFormData {
  title: string;
  description: string;
  places: string;
  lieu: string;
  debut: string;
  fin: string;
  profil_url: string;
}

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<EventFormData | null>(null);
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  
  const [newTicket, setNewTicket] = useState({ intitule: '', prix: '' });
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingTicket, setDeletingTicket] = useState<TicketCategory | null>(null);
  const [deletingImage, setDeletingImage] = useState<Image | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await getEventById(id);
        const { ticketCategoryList, images, ...eventData } = response.data;
        eventData.debut = new Date(eventData.debut).toISOString().split('T')[0];
        eventData.fin = new Date(eventData.fin).toISOString().split('T')[0];
        setFormData(eventData);
        setTicketCategories(ticketCategoryList || []);
        setImages(images || []);
      } catch (err) {
        setError('Could not fetch event data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (formData) setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTicket({ ...newTicket, [e.target.name]: e.target.value });
  };

  const handleAddTicket = async () => {
    if (!id || !newTicket.intitule || !newTicket.prix) return;
    try {
      const response = await createTicketCategory({ intitule: newTicket.intitule, prix: Number(newTicket.prix), id_event: parseInt(id, 10) });
      setTicketCategories([...ticketCategories, response.data]);
      setNewTicket({ intitule: '', prix: '' });
    } catch (err) { console.error(err); }
  };

  const handleRemoveTicket = async () => {
    if (!deletingTicket) return;
    try {
      await deleteTicketCategory(deletingTicket.id);
      setTicketCategories(ticketCategories.filter(t => t.id !== deletingTicket.id));
      setDeletingTicket(null);
    } catch (err) { console.error(err); }
  };

  const handleAddImage = async () => {
    if (!id || !newImageUrl) return;
    try {
      const response = await createImage({ imageurl: newImageUrl, id_event: parseInt(id, 10) });
      setImages([...images, response.data]);
      setNewImageUrl('');
    } catch (err) { console.error(err); }
  };

  const handleRemoveImage = async () => {
    if (!deletingImage) return;
    try {
      await deleteImage(deletingImage.id);
      setImages(images.filter(img => img.id !== deletingImage.id));
      setDeletingImage(null);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !formData) return;
    setIsSubmitting(true);
    setMessage('');
    setError('');
    try {
      await updateEvent(id, formData);
      setMessage('Event details updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Event update failed. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = "block w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
  const labelStyle = "block text-sm font-medium text-neutral-700 dark:text-neutral-300";

  if (loading) return <div>Loading...</div>
  if (error) return <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg">{error}</div>;
  if (!formData) return <div>Event not found.</div>

  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">Edit Event</h1>
            <button onClick={() => navigate('/my-events')} className="inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-200 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to My Events
            </button>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-2xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-700">
            {message && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-r-lg mb-6">{message}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-8">
                <fieldset className="space-y-6">
                    <legend className="text-xl font-semibold text-neutral-900 dark:text-white">Event Details</legend>
                    <div><label htmlFor="title" className={labelStyle}>Event Title</label><input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={inputStyle} required /></div>
                    <div><label htmlFor="description" className={labelStyle}>Description</label><textarea id="description" name="description" value={formData.description} onChange={handleChange} className={`${inputStyle} min-h-[120px]`} required /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label htmlFor="places" className={labelStyle}>Number of Places</label><input type="number" id="places" name="places" value={formData.places} onChange={handleChange} className={inputStyle} required /></div>
                        <div><label htmlFor="lieu" className={labelStyle}>Location</label><input type="text" id="lieu" name="lieu" value={formData.lieu} onChange={handleChange} className={inputStyle} required /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label htmlFor="debut" className={labelStyle}>Start Date</label><input type="date" id="debut" name="debut" value={formData.debut} onChange={handleChange} className={inputStyle} required /></div>
                        <div><label htmlFor="fin" className={labelStyle}>End Date</label><input type="date" id="fin" name="fin" value={formData.fin} onChange={handleChange} className={inputStyle} required /></div>
                    </div>
                    <div><label htmlFor="profil_url" className={labelStyle}>Main Profile Image URL</label><input type="text" id="profil_url" name="profil_url" placeholder="https://..." value={formData.profil_url} onChange={handleChange} className={inputStyle} /></div>
                    <div className="flex justify-end">
                        <button type="submit" className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400" disabled={isSubmitting}>
                            {isSubmitting && <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path></svg>}
                            {isSubmitting ? 'Saving...' : 'Save Event Details'}
                        </button>
                    </div>
                </fieldset>
            </form>

            <hr className="my-8 border-neutral-200 dark:border-neutral-700" />

            <fieldset className="space-y-4">
                <legend className="text-xl font-semibold text-neutral-900 dark:text-white">Event Gallery</legend>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((image) => (
                    <div key={image.id} className="relative group"><img src={image.imageurl} alt="Event" className="w-full h-32 object-cover rounded-md" /><button onClick={() => setDeletingImage(image)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button></div>
                    ))}
                </div>
                <div className="flex items-end gap-4 pt-4">
                    <div className="flex-grow"><label htmlFor="newImageUrl" className={labelStyle}>New Image URL</label><input type="text" id="newImageUrl" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className={inputStyle} placeholder="https://..." /></div>
                    <button type="button" onClick={handleAddImage} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">Add Image</button>
                </div>
            </fieldset>

            <hr className="my-8 border-neutral-200 dark:border-neutral-700" />

            <fieldset className="space-y-4">
                <legend className="text-xl font-semibold text-neutral-900 dark:text-white">Ticket Categories</legend>
                <ul className="space-y-2">
                    {ticketCategories.map((ticket) => (
                    <li key={ticket.id} className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-700/50 p-3 rounded-md">
                        <div><span className="font-semibold text-neutral-800 dark:text-neutral-200">{ticket.intitule}</span><span className="text-neutral-600 dark:text-neutral-400"> - {ticket.prix.toLocaleString('fr-FR')} CFA</span></div>
                        <button type="button" onClick={() => setDeletingTicket(ticket)} className="text-red-500 hover:text-red-700 font-semibold">Remove</button>
                    </li>
                    ))}
                </ul>
                <div className="flex items-end gap-4 pt-4">
                    <div className="flex-grow"><label htmlFor="intitule" className={labelStyle}>New Ticket Name</label><input type="text" id="intitule" name="intitule" value={newTicket.intitule} onChange={handleTicketChange} className={inputStyle} placeholder="e.g., VIP" /></div>
                    <div className="flex-grow"><label htmlFor="prix" className={labelStyle}>Price (CFA)</label><input type="number" id="prix" name="prix" value={newTicket.prix} onChange={handleTicketChange} className={inputStyle} placeholder="e.g., 5000" /></div>
                    <button type="button" onClick={handleAddTicket} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">Add Ticket</button>
                </div>
            </fieldset>
        </div>

        {(deletingTicket || deletingImage) && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Confirm Deletion</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2">Are you sure you want to delete this item? This action cannot be undone.</p>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button type="button" className="px-4 py-2 text-sm font-medium rounded-md bg-neutral-100 dark:bg-neutral-700" onClick={() => { setDeletingTicket(null); setDeletingImage(null); }}>Cancel</button>
                        <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700" onClick={deletingTicket ? handleRemoveTicket : handleRemoveImage}>Delete</button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default EditEvent;
