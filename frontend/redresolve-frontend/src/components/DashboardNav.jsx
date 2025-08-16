import { NavLink } from 'react-router-dom';

function DashboardNav() {
  return (
    <nav className='dashboard-nav'>
      <NavLink to='/dashboard' end>New Tickets</NavLink>
      <NavLink to='/dashboard/in-progress'>In Progress</NavLink>
      <NavLink to='/dashboard/resolved'>Resolved</NavLink>
    </nav>
  );
}

export default DashboardNav;