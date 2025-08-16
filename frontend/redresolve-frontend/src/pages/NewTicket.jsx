import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createTicket, reset } from '../features/tickets/ticketSlice';
import Spinner from '../components/Spinner';

function NewTicket() {
  const { user } = useSelector((state) => state.auth);
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.tickets
  );

  // Use the hotel ID from the user's booking, but ask for the room number
  const [hotel] = useState(user.currentBooking?.hotelId || '');
  const [roomNumber, setRoomNumber] = useState(''); // State for the user to input their room number
  
  const [category, setCategory] = useState('Room Amenity');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.currentBooking) {
        toast.error("You must be checked in to create a ticket.");
        navigate('/');
    }
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      dispatch(reset());
      toast.success('New ticket submitted successfully!');
      navigate('/tickets');
    }
  }, [dispatch, isError, isSuccess, navigate, message, user]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!roomNumber) {
        toast.error('Please enter your room number.');
        return;
    }
    const ticketData = { hotel, roomNumber, category, description, media };
    dispatch(createTicket(ticketData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className='heading'>
        <h1>Create New Ticket</h1>
        <p>Please describe the issue you are facing</p>
      </section>

      <div className="form-container">
        <form onSubmit={onSubmit}>
          {/* NEW: Room Number Input Field */}
          <div className='form-group'>
            <label htmlFor='roomNumber'>Room Number</label>
            <input
              type='text'
              name='roomNumber'
              id='roomNumber'
              className='form-control'
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder='e.g., 305'
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='category'>Problem Category</label>
            <select
              name='category'
              id='category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value='Room Amenity'>Room Amenity (AC, TV, etc.)</option>
              <option value='Housekeeping'>Housekeeping</option>
              <option value='Front Desk'>Front Desk Service</option>
              <option value='Security'>Security & Privacy</option>
              <option value='Other'>Other</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='description'>Description of the issue</label>
            <textarea
              name='description'
              id='description'
              className='form-control'
              placeholder='Please be as detailed as possible'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
            ></textarea>
          </div>
          <div className='form-group'>
            <label htmlFor='media'>Upload Photos or Video (Optional)</label>
            <input
              type='file'
              name='media'
              id='media'
              multiple
              onChange={(e) => setMedia(e.target.files)}
              className='form-control'
            />
          </div>
          <div className='form-group'>
            <button className='btn btn-block'>Submit Ticket</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default NewTicket;