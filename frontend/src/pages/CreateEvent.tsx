import React, { useState } from 'react';
import { createEvent } from '../services/eventService';
import { createTicketCategory } from '../services/ticketCategoryService';
import { createImage } from '../services/imageService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';

interface TicketCategory {
  intitule: string;
  prix: number;
}

const CreateEvent: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    places: '',
    lieu: '',
    debut: '',
    fin: '',
    profil_url: ''
  });
  
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>([]);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newTicket, setNewTicket] = useState({ intitule: '', prix: '' });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTicket({ ...newTicket, [e.target.name]: e.target.value });
  };
  
  const handleCoverImageUpload = (url: string) => {
    setFormData({ ...formData, profil_url: url });
  };

  const handleGalleryImageUpload = (url: string) => {
    setGalleryImages([...galleryImages, url]);
  };
  
  const removeGalleryImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const addTicketCategory = () => {
    if (newTicket.intitule && newTicket.prix) {
      setTicketCategories([...ticketCategories, { intitule: newTicket.intitule, prix: Number(newTicket.prix) }]);
      setNewTicket({ intitule: '', prix: '' });
    }
  };

  const removeTicketCategory = (index: number) => {
    setTicketCategories(ticketCategories.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in as an organizer to create an event.');
      return;
    }
    if (ticketCategories.length === 0) {
      setError('You must add at least one ticket category.');
      return;
    }
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const eventData = { ...formData, id_organizer: user.id };
      const eventResponse = await createEvent(eventData);
      const newEventId = eventResponse.data.id;

      await Promise.all([
        ...ticketCategories.map(ticket => 
          createTicketCategory({ ...ticket, id_event: newEventId })
        ),
        ...galleryImages.map(imageUrl => 
          createImage({ imageurl: imageUrl, id_event: newEventId })
        )
      ]);

      setMessage('Event, tickets and images created successfully! Redirecting...');
      setFormData({ title: '', description: '', places: '', lieu: '', debut: '', fin: '', profil_url: '' });
      setTicketCategories([]);
      setGalleryImages([]);
      setTimeout(() => navigate('/my-events'), 2000);
    } catch (err) {
      setError('Event creation failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "block w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
  const labelStyle = "block text-sm font-medium text-neutral-700 dark:text-neutral-300";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-neutral-800 shadow-xl rounded-2xl p-6 md:p-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-6">Create a New Event</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-r-lg">{error}</div>}
          {message && <div className="bg-green-100 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-r-lg">{message}</div>}

          <fieldset className="space-y-6">
            <legend className="text-xl font-semibold text-neutral-900 dark:text-white">Event Details</legend>
            <div>
              <label htmlFor="title" className={labelStyle}>Event Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={inputStyle} required />
            </div>
            <div>
              <label htmlFor="description" className={labelStyle}>Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={`${inputStyle} min-h-[120px]`} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="places" className={labelStyle}>Total Available Places</label>
                <input type="number" id="places" name="places" value={formData.places} onChange={handleChange} className={inputStyle} required />
              </div>
              <div>
                <label htmlFor="lieu" className={labelStyle}>Location</label>
                <input type="text" id="lieu" name="lieu" value={formData.lieu} onChange={handleChange} className={inputStyle} required />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="debut" className={labelStyle}>Start Date</label>
                <input type="date" id="debut" name="debut" value={formData.debut} onChange={handleChange} className={inputStyle} required />
              </div>
              <div>
                <label htmlFor="fin" className={labelStyle}>End Date</label>
                <input type="date" id="fin" name="fin" value={formData.fin} onChange={handleChange} className={inputStyle} required />
              </div>
            </div>
             <div>
              <label className={labelStyle}>Event Cover Image</label>
              {formData.profil_url && (
                <div className="mt-2">
                  <img src={formData.profil_url} alt="Cover" className="w-full h-auto max-h-60 object-cover rounded-md" />
                </div>
              )}
              <ImageUploader
                onUploadSuccess={handleCoverImageUpload}
                buttonText={formData.profil_url ? 'Change Cover Image' : 'Upload Cover Image'}
                className="mt-2"
              />
            </div>
          </fieldset>
          
           <fieldset className="space-y-4 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
            <legend className="text-lg font-medium text-neutral-900 dark:text-white px-2">Event Gallery</legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {galleryImages.map((url, index) => (
                <div key={index} className="relative group">
                  <img src={url} alt={`Gallery item ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <ImageUploader onUploadSuccess={handleGalleryImageUpload} buttonText="Add to Gallery" />
          </fieldset>


          <fieldset className="space-y-4 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
            <legend className="text-lg font-medium text-neutral-900 dark:text-white px-2">Ticket Categories</legend>
            {ticketCategories.length > 0 && (
              <ul className="space-y-2">
                {ticketCategories.map((ticket, index) => (
                  <li key={index} className="flex items-center justify-between bg-neutral-100 dark:bg-neutral-700/50 p-3 rounded-md">
                    <div>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{ticket.intitule}</span>
                        <span className="text-neutral-600 dark:text-neutral-400"> - {ticket.prix.toLocaleString('fr-FR')} CFA</span>
                    </div>
                    <button type="button" onClick={() => removeTicketCategory(index)} className="text-red-500 hover:text-red-700 font-semibold transition-colors">Remove</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 space-y-4 sm:space-y-0">
              <div className="flex-grow">
                <label htmlFor="intitule" className={labelStyle}>Ticket Name</label>
                <input type="text" id="intitule" name="intitule" value={newTicket.intitule} onChange={handleTicketChange} className={inputStyle} placeholder="e.g., VIP, Standard" />
              </div>
              <div className="flex-grow">
                <label htmlFor="prix" className={labelStyle}>Price (CFA)</label>
                <input type="number" id="prix" name="prix" value={newTicket.prix} onChange={handleTicketChange} className={inputStyle} placeholder="e.g., 5000" />
              </div>
              <button type="button" onClick={addTicketCategory} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">Add Ticket</button>
            </div>
          </fieldset>

          <div className="flex justify-end">
            <button type="submit" className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 transition-colors" disabled={loading}>
              {loading ? 'Creating Event...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;