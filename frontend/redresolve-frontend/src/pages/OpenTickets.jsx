import { useSelector } from 'react-redux';
import TicketItem from '../components/TicketItem';
import Spinner from '../components/Spinner';

function OpenTickets() {
  const { tickets, isLoading } = useSelector((state) => state.tickets);

  if (isLoading) {
    return <Spinner />;
  }

  const openTickets = tickets.filter((ticket) => ticket.status === 'Open');

  return (
    <div className='ticket-list'>
      {openTickets.length > 0 ? (
        openTickets.map((ticket) => <TicketItem key={ticket._id} ticket={ticket} />)
      ) : (
        <p className='no-tickets-message'>No new tickets found.</p>
      )}
    </div>
  );
}

export default OpenTickets;