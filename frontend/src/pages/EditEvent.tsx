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
  event_name: string;
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
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    places: '',
    lieu: '',
    debut: '',
    fin: '',
    profil_url: ''
  });
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [newTicket, setNewTicket] = useState({ intitule: '', prix: '' });
  const [newImageUrl, setNewImageUrl] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        const response = await getEventById(id);
        const eventData = response.data;
        eventData.debut = new Date(eventData.debut).toISOString().split('T')[0];
        eventData.fin = new Date(eventData.fin).toISOString().split('T')[0];
        setFormData(eventData);
        if (eventData.ticketCategoryList) {
          setTicketCategories(eventData.ticketCategoryList);
        }
        if (eventData.images) {
          setImages(eventData.images);
        }
      } catch (err) {
        setError('Could not fetch event data.');
        console.error(err);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTicket({ ...newTicket, [e.target.name]: e.target.value });
  };

  const handleAddTicket = async () => {
    if (!id || !newTicket.intitule || !newTicket.prix) {
      setError('Please provide a name and price for the new ticket.');
      return;
    }
    try {
      const response = await createTicketCategory({
        intitule: newTicket.intitule,
        prix: Number(newTicket.prix),
        id_event: parseInt(id, 10)
      });
      setTicketCategories([...ticketCategories, response.data]);
      setNewTicket({ intitule: '', prix: '' });
    } catch (err) {
      setError('Failed to add ticket category.');
      console.error(err);
    }
  };

  const handleRemoveTicket = async (ticketId: number) => {
    if (window.confirm('Are you sure you want to delete this ticket category?')) {
      try {
        await deleteTicketCategory(ticketId);
        setTicketCategories(ticketCategories.filter(t => t.id !== ticketId));
      } catch (err) {
        setError('Failed to delete ticket category.');
        console.error(err);
      }
    }
  };

  const handleAddImage = async () => {
    if (!id || !newImageUrl) {
      setError('Please provide an image URL.');
      return;
    }
    try {
      const response = await createImage({
        imageurl: newImageUrl,
        id_event: parseInt(id, 10)
      });
      setImages([...images, response.data]);
      setNewImageUrl('');
    } catch (err) {
      setError('Failed to add image.');
      console.error(err);
    }
  };

  const handleRemoveImage = async (imageId: number) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage(imageId);
        setImages(images.filter(img => img.id !== imageId));
      } catch (err) {
        setError('Failed to delete image.');
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setMessage('');
    setError('');
    try {
      await updateEvent(id, formData);
      setMessage('Event details updated successfully!');
    } catch (err) {
      setError('Event update failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-white";
  const labelStyle = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 md:p-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Event</h1>
          <button onClick={() => navigate('/my-events')} className="mb-6 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700">
            Back to My Events
          </button>
        </div>
        
        {error && <div className="bg-red-100 border-red-400 text-red-700 px-4 py-2 rounded text-sm mb-4">{error}</div>}
        {message && <div className="bg-green-100 border-green-400 text-green-700 px-4 py-2 rounded text-sm mb-4">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Details Form */}
          <div>
            <label htmlFor="title" className={labelStyle}>Event Title</label>
            <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className={inputStyle} required />
          </div>
          <div>
            <label htmlFor="description" className={labelStyle}>Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} className={`${inputStyle} min-h-[100px]`} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="places" className={labelStyle}>Number of Places</label>
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
            <label htmlFor="profil_url" className={labelStyle}>Main Profile Image URL</label>
            <input type="text" id="profil_url" name="profil_url" placeholder="http://..." value={formData.profil_url} onChange={handleChange} className={inputStyle} />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400" disabled={loading}>
              {loading ? 'Saving...' : 'Save Event Details'}
            </button>
          </div>
        </form>

        {/* Image Gallery Management */}
        <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Event Gallery</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img src={image.imageurl} alt="Event" className="w-full h-32 object-cover rounded-md" />
                <button onClick={() => handleRemoveImage(image.id)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  X
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex-grow">
              <label htmlFor="newImageUrl" className={labelStyle}>New Image URL</label>
              <input type="text" id="newImageUrl" name="newImageUrl" value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} className={inputStyle} placeholder="http://..." />
            </div>
            <button type="button" onClick={handleAddImage} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">Add Image</button>
          </div>
        </div>

        {/* Ticket Category Management */}
        <div className="space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Manage Ticket Categories</h3>
          {ticketCategories.length > 0 && (
            <ul className="space-y-2">
              {ticketCategories.map((ticket) => (
                <li key={ticket.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                  <span className="text-gray-800 dark:text-gray-200">{ticket.intitule} - {ticket.prix} CFA</span>
                  <button type="button" onClick={() => handleRemoveTicket(ticket.id)} className="text-red-500 hover:text-red-700 text-sm font-semibold">Remove</button>
                </li>
              ))}
            </ul>
          )}
          <div className="flex items-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex-grow">
              <label htmlFor="intitule" className={labelStyle}>New Ticket Name</label>
              <input type="text" id="intitule" name="intitule" value={newTicket.intitule} onChange={handleTicketChange} className={inputStyle} placeholder="e.g., VIP, Standard" />
            </div>
            <div className="flex-grow">
              <label htmlFor="prix" className={labelStyle}>Price (CFA)</label>
              <input type="number" id="prix" name="prix" value={newTicket.prix} onChange={handleTicketChange} className={inputStyle} placeholder="e.g., 5000" />
            </div>
            <button type="button" onClick={handleAddTicket} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">Add Ticket</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
