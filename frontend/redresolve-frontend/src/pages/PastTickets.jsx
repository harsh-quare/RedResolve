import { useSelector } from 'react-redux';
import TicketItem from '../components/TicketItem';
import Spinner from '../components/Spinner';

function PastTickets() {
  const { tickets, isLoading } = useSelector((state) => state.tickets);

  if (isLoading) {
    return <Spinner />;
  }

  const pastTickets = tickets.filter(
    (ticket) => ticket.status === 'Resolved' || ticket.status === 'Closed'
  );

  return (
    <div className='ticket-list'>
      {pastTickets.length > 0 ? (
        pastTickets.map((ticket) => <TicketItem key={ticket._id} ticket={ticket} />)
      ) : (
        <p className='no-tickets-message'>You have no past tickets.</p>
      )}
    </div>
  );
}

export default PastTickets;