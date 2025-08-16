import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
import { getTicket, addMessage, reset, updateTicketStatus, setTicket, addNewMessage } from '../features/tickets/ticketSlice';
import Spinner from '../components/Spinner';

const socket = io('http://localhost:5000');

function TicketDetails() {
  const { ticket, isLoading, isError, message } = useSelector(
    (state) => state.tickets
  );
  const { user } = useSelector((state) => state.auth);

  const [messageText, setMessageText] = useState('');

  const dispatch = useDispatch();
  const { ticketId } = useParams();

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    socket.emit('joinTicketRoom', ticketId);

    socket.on('ticketUpdated', (updatedTicket) => {
      dispatch(setTicket(updatedTicket));
    });

    socket.on('messageReceived', (newMessage) => {
      dispatch(addNewMessage(newMessage));
    });

    dispatch(getTicket(ticketId));

    return () => {
      socket.off('ticketUpdated');
      socket.off('messageReceived');
      dispatch(reset());
    };
  }, [isError, message, ticketId, dispatch]);

  const onMessageSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim() === '') {
      toast.error('Message cannot be empty');
      return;
    }
    dispatch(addMessage({ ticketId, text: messageText }));
    setMessageText('');
  };

  const handleStatusUpdate = (newStatus) => {
    dispatch(updateTicketStatus({ ticketId, status: newStatus }));
    toast.success(`Ticket status updated to ${newStatus}`);
  };

  // This check is now more robust to prevent crashes during re-renders
  if (isLoading || !ticket?.status) {
    return <Spinner />;
  }

  return (
    <div className='ticket-page'>
      <header className='ticket-header'>
        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status.replace(/\s+/g, '-').toLowerCase()}`}>
            {ticket.status}
          </span>
        </h2>
        <h3>Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}</h3>
        <h3>Category: {ticket.category}</h3>
        <hr />
        <div className='ticket-desc'>
          <h3>Description of Issue</h3>
          <p>{ticket.description}</p>
        </div>

         {/* NEW: Display initial images if they exist */}
        {ticket.mediaUrls && ticket.mediaUrls.length > 0 && (
          <div className='ticket-images'>
            <h3>Guest Submitted Images:</h3>
            <div className='image-gallery'>
              {ticket.mediaUrls.map((url, index) => (
                <a key={index} href={url} target='_blank' rel='noopener noreferrer'>
                  <img src={url} alt={`Guest upload ${index + 1}`} />
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="messages">
        {/* Added a check for ticket.messages to prevent crash */}
        {ticket.messages && ticket.messages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${msg.senderType === 'Hotel' ? 'staff-message' : 'guest-message'}`}
          >
            {/* Added optional chaining to safely access sender name */}
            <h4>{msg.sender?.name || (msg.senderType === 'Hotel' ? 'Hotel Staff' : 'You')}</h4>
            <p>{msg.text}</p>
            {msg.mediaUrl && <img src={msg.mediaUrl} alt="Proof" style={{ width: '200px', borderRadius: '5px', marginTop: '10px' }} />}
            <div className="message-date">
              {new Date(msg.createdAt).toLocaleString('en-US')}
            </div>
          </div>
        ))}
      </div>

      {/* RESTORED: Hotel Staff Controls */}
      {user.role === 'Hotel' && ticket.status !== 'Closed' && (
        <div className="staff-controls">
          <h2>Staff Actions</h2>
          {ticket.status === 'Open' && (
            <button onClick={() => handleStatusUpdate('In Progress')} className="btn">
              Acknowledge & Mark "In Progress"
            </button>
          )}
          {ticket.status === 'In Progress' && (
            <button onClick={() => handleStatusUpdate('Resolved')} className="btn btn-success">
              Mark as Resolved
            </button>
          )}
        </div>
      )}

      {/* Conditionally render the message form */}
      {ticket.status !== 'Resolved' && ticket.status !== 'Closed' ? (
        <form onSubmit={onMessageSubmit} style={{ marginTop: '2rem' }}>
          <div className="form-group">
            <textarea
              name="message"
              id="message"
              className="form-control"
              placeholder='Add a message...'
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <button className="btn" type="submit">Send</button>
          </div>
        </form>
      ) : (
        <div className='ticket-closed-note'>
            <h3>This ticket is {ticket.status}.</h3>
            {user.role === 'Guest' && <p>If the issue is not resolved, you can reopen it from the main tickets page.</p>}
        </div>
      )}
    </div>
  );
}

export default TicketDetails;