import { Link } from 'react-router-dom';
import { FaQuestionCircle, FaTicketAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // This redirect logic to handle hotel staff
    if (user && user.role === 'Hotel') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <>
      <section className='heading'>
        <h1>Welcome, {user ? user.name : 'Guest'}!</h1>
        <p>How can we help you today?</p>
      </section>

      <div className='home-options'>
        <Link to='/new-ticket' className='option-card'>
          <FaQuestionCircle size={40} />
          <h2>Create a New Ticket</h2>
          <p>Report a new issue or request service for your room.</p>
        </Link>

        <Link to='/tickets' className='option-card'>
          <FaTicketAlt size={40} />
          <h2>View My Tickets</h2>
          <p>Check the status of your existing tickets and messages.</p>
        </Link>
      </div>
    </>
  );
}

export default Home;