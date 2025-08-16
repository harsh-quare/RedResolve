import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom'; // Import Outlet
import io from 'socket.io-client';
import { getHotelTickets, reset, addNewTicketToList } from '../features/tickets/ticketSlice';
import DashboardNav from '../components/DashboardNav'; // Import the new nav

const socket = io('http://localhost:5000');

function HotelDashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // This effect now runs once to fetch all data and set up listeners
    dispatch(getHotelTickets());

    if (user && user.hotel) {
      socket.emit('joinHotelRoom', user.hotel);
    }

    socket.on('newTicketCreated', (newTicket) => {
      dispatch(addNewTicketToList(newTicket));
    });

    return () => {
      socket.off('newTicketCreated');
      dispatch(reset());
    };
  }, [dispatch, user]);

  return (
    <>
      <section className='heading'>
        <h1>Hotel Dashboard</h1>
        <p>Manage and respond to guest tickets.</p>
      </section>

      <DashboardNav />

      <div className='dashboard-content'>
        <Outlet /> {/* This will render the correct child page */}
      </div>
    </>
  );
}

export default HotelDashboard;