import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import io from 'socket.io-client';
import { getGuestTickets, reset, updateTicketInList } from '../features/tickets/ticketSlice';
import GuestNav from '../components/GuestNav';

const socket = io('http://localhost:5000');

function Tickets() {
  const { tickets, isSuccess } = useSelector((state) => state.tickets);
  const dispatch = useDispatch();

  // This effect runs only ONCE to fetch data and set up listeners
  useEffect(() => {
    dispatch(getGuestTickets());

    socket.on('ticketUpdated', (updatedTicket) => {
      dispatch(updateTicketInList(updatedTicket));
    });

    return () => {
      socket.off('ticketUpdated');
      dispatch(reset());
    };
  }, [dispatch]); // This dependency array is stable and will not cause a loop

  // This separate effect runs only when the tickets array changes
  useEffect(() => {
    // Once tickets are loaded, join the socket room for each one
    if (tickets.length > 0) {
      tickets.forEach(ticket => {
        socket.emit('joinTicketRoom', ticket._id);
      });
    }
  }, [tickets]); // This ensures we only join rooms after tickets are fetched

  return (
    <>
      <section className='heading'>
        <h1>My Tickets</h1>
        <p>View your active and past support tickets.</p>
      </section>

      <GuestNav />

      <div className='dashboard-content'>
        <Outlet />
      </div>
    </>
  );
}

export default Tickets;