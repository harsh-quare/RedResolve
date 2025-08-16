import { useSelector } from 'react-redux';
import TicketItem from '../components/TicketItem';
import Spinner from '../components/Spinner';

function ActiveTickets() {
  const { tickets, isLoading } = useSelector((state) => state.tickets);

  if (isLoading) {
    return <Spinner />;
  }

  const activeTickets = tickets
    .filter((ticket) => ticket.status === 'Open' || ticket.status === 'In Progress')
    .sort((a, b) => {
      // This will place 'In Progress' tickets before 'Open' tickets
      if (a.status === 'In Progress' && b.status !== 'In Progress') return -1;
      if (a.status !== 'In Progress' && b.status === 'In Progress') return 1;
      return 0; // Keep original order for tickets with the same status
    });

  return (
    <div className='ticket-list'>
      {activeTickets.length > 0 ? (
        activeTickets.map((ticket) => <TicketItem key={ticket._id} ticket={ticket} />)
      ) : (
        <p className='no-tickets-message'>You have no active tickets.</p>
      )}
    </div>
  );
}

export default ActiveTickets;