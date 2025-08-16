import { useSelector } from 'react-redux';
import TicketItem from '../components/TicketItem';
import Spinner from '../components/Spinner';

function InProgressTickets() {
  const { tickets, isLoading } = useSelector((state) => state.tickets);

  if (isLoading) {
    return <Spinner />;
  }

  const inProgressTickets = tickets.filter((ticket) => ticket.status === 'In Progress');

  return (
    <div className='ticket-list'>
      {inProgressTickets.length > 0 ? (
        inProgressTickets.map((ticket) => <TicketItem key={ticket._id} ticket={ticket} />)
      ) : (
        <p className='no-tickets-message'>No tickets are currently in progress.</p>
      )}
    </div>
  );
}

export default InProgressTickets;