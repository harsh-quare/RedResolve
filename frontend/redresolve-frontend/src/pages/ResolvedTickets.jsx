import { useSelector } from 'react-redux';
import TicketItem from '../components/TicketItem';
import Spinner from '../components/Spinner';

function ResolvedTickets() {
  const { tickets, isLoading } = useSelector((state) => state.tickets);

  if (isLoading) {
    return <Spinner />;
  }

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === 'Resolved' || ticket.status === 'Closed'
  );

  return (
    <div className='ticket-list'>
      {resolvedTickets.length > 0 ? (
        resolvedTickets.map((ticket) => <TicketItem key={ticket._id} ticket={ticket} />)
      ) : (
        <p className='no-tickets-message'>No resolved tickets found.</p>
      )}
    </div>
  );
}

export default ResolvedTickets;