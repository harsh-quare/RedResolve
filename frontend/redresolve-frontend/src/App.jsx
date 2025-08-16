import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NewTicket from './pages/NewTicket';
import Tickets from './pages/Tickets';
import TicketDetails from './pages/TicketDetails';
import HotelDashboard from './pages/HotelDashboard';
import OpenTickets from './pages/OpenTickets';
import InProgressTickets from './pages/InProgressTickets';
import ResolvedTickets from './pages/ResolvedTickets';
import ActiveTickets from './pages/ActiveTickets';
import PastTickets from './pages/PastTickets';

function App() {
  return (
    <>
      <Router>
        <div className='container'>
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />

            {/* Hotel Staff Private Routes */}
            <Route path='/dashboard' element={<PrivateRoute />}>
              <Route path='/dashboard' element={<HotelDashboard />}>
                {/* Child routes for the dashboard */}
                <Route index element={<OpenTickets />} /> {/* Default page */}
                <Route path='in-progress' element={<InProgressTickets />} />
                <Route path='resolved' element={<ResolvedTickets />} />
              </Route>
            </Route>

            {/* Guest Private Routes */}
            <Route path='/new-ticket' element={<PrivateRoute />}>
              <Route path='/new-ticket' element={<NewTicket />} />
            </Route>
            <Route path='/tickets' element={<PrivateRoute />}>
              <Route path='/tickets' element={<Tickets />}>
                {/* Child routes for the guest's tickets page */}
                <Route index element={<ActiveTickets />} /> {/* Default page */}
                <Route path='past' element={<PastTickets />} />
              </Route>
            </Route>
            <Route path='/ticket/:ticketId' element={<PrivateRoute />}>
                <Route path='/ticket/:ticketId' element={<TicketDetails />} />
            </Route>

            {/* Private Routes Wrapper */}
            <Route element={<PrivateRoute />}>
              <Route path='/new-ticket' element={<NewTicket />} />
              <Route path='/tickets' element={<Tickets />} />
              <Route path='/ticket/:ticketId' element={<TicketDetails />} />
              <Route path='/dashboard' element={<HotelDashboard />} />
            </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;