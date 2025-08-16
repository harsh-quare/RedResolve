import { Link } from 'react-router-dom';
import { FaUser, FaRegClock } from 'react-icons/fa';

function TicketItem({ ticket }) {
  return (
    <div className='ticket-card'>
      <div className='ticket-card-header'>
        <span className={`status status-${ticket.status.replace(/\s+/g, '-').toLowerCase()}`}>
          {ticket.status}
        </span>
        <span className='ticket-category'>{ticket.category}</span>
      </div>
      <div className='ticket-card-body'>
        <h3>Room {ticket.roomNumber}</h3>
        <p className='ticket-description-preview'>
          {ticket.description.substring(0, 100)}{ticket.description.length > 100 && '...'}
        </p>
      </div>
      <div className='ticket-card-footer'>
        <div className='guest-info'>
          <FaUser /> {ticket.guest?.name || 'Guest'}
        </div>
        <div className='time-info'>
          <FaRegClock /> {new Date(ticket.createdAt).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
        </div>
        <Link to={`/ticket/${ticket._id}`} className='btn btn-reverse btn-sm'>
          View Details
        </Link>
      </div>
    </div>
  );
}

export default TicketItem;