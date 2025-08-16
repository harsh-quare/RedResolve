import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Spinner from './Spinner';

const PrivateRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);

  // Show a spinner while the auth state is loading
  if (isLoading) {
    return <Spinner />;
  }

  // If the user is logged in, render the child component via the Outlet.
  // Otherwise, redirect to the login page.
  return user ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;