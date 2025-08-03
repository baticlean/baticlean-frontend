import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUserFromSocket } from '../redux/authSlice.js';
import { updateServiceFromSocket } from '../redux/serviceSlice.js';
import { updateBookingFromSocket } from '../redux/bookingSlice.js';
import { 
  connectSocket, disconnectSocket, addUserSocket, 
  onUserUpdate, offUserUpdate,
  onServiceUpdate, offServiceUpdate,
  onBookingUpdate, offBookingUpdate
} from '../socket/socket.js';
import RestoredAccountToast from './RestoredAccountToast.jsx';

export default function GlobalSocketListener() {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userStateRef = useRef(user);

  useEffect(() => {
    userStateRef.current = user;
  });

  useEffect(() => {
    if (token) {
      connectSocket();
      if (user?._id) addUserSocket(user._id);

      const handleUserUpdate = (data) => {
        const { user: updatedUser, newToken } = data;
        const oldState = userStateRef.current;
        
        if (updatedUser.status === 'active' && (oldState?.status === 'banned' || oldState?.status === 'suspended')) {
          toast(<RestoredAccountToast />, { toastId: 'account-restored-toast', autoClose: false, closeOnClick: false, draggable: false, closeButton: false, position: "top-center" });
        }
        
        if (updatedUser.role === 'admin' && oldState?.role === 'user') {
          toast.success('Félicitations, vous avez été promu Administrateur !');
        } else if (updatedUser.role === 'user' && oldState?.role === 'admin') {
          toast.warn('Vos droits d\'administrateur ont été révoqués.');
          if (location.pathname.startsWith('/admin')) {
            navigate('/home');
          }
        }
        dispatch(updateUserFromSocket({ user: updatedUser, newToken }));
      };

      const handleServiceUpdate = (updatedService) => dispatch(updateServiceFromSocket(updatedService));
      const handleBookingUpdate = (updatedBooking) => {
        toast.info(`Votre réservation pour "${updatedBooking.service?.title}" a été mise à jour : ${updatedBooking.status}`);
        dispatch(updateBookingFromSocket(updatedBooking));
      };

      onUserUpdate(handleUserUpdate);
      onServiceUpdate(handleServiceUpdate);
      onBookingUpdate(handleBookingUpdate);
    }
    return () => {
      if (token) {
        offUserUpdate();
        offServiceUpdate();
        offBookingUpdate();
        disconnectSocket();
      }
    };
  }, [token, user?._id, dispatch, navigate, location]);

  return null;
}