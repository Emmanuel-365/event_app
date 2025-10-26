import React from 'react';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    lieu: string;
    debut: string;
    fin: string;
    places: number;
    organizer_name: string;
    profil_url: string;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="card mb-3">
      <img src={event.profil_url || 'https://via.placeholder.com/150'} className="card-img-top" alt={event.title} />
      <div className="card-body">
        <h5 className="card-title">{event.title}</h5>
        <p className="card-text">{event.description}</p>
        <p className="card-text"><small className="text-muted">Location: {event.lieu}</small></p>
        <p className="card-text"><small className="text-muted">From: {event.debut} To: {event.fin}</small></p>
        <p className="card-text"><small className="text-muted">Places: {event.places}</small></p>
        <p className="card-text"><small className="text-muted">Organizer: {event.organizer_name}</small></p>
        <a href={`/event/${event.id}`} className="btn btn-primary">View Details</a>
      </div>
    </div>
  );
};

export default EventCard;
