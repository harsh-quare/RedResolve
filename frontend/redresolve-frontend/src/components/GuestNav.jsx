import { NavLink } from 'react-router-dom';

function GuestNav() {
  return (
    <nav className='dashboard-nav'>
      <NavLink to='/tickets' end>Active Tickets</NavLink>
      <NavLink to='/tickets/past'>Past Tickets</NavLink>
    </nav>
  );
}

export default GuestNav;