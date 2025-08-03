import React, { useEffect, useRef } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

// Slices & Socket
import { updateUserFromSocket } from './redux/authSlice.js';
import { updateServiceFromSocket } from './redux/serviceSlice.js';
import { updateBookingFromSocket } from './redux/bookingSlice.js';
import { 
  connectSocket, disconnectSocket, addUserSocket, 
  onUserUpdate, offUserUpdate,
  onServiceUpdate, offServiceUpdate,
  onBookingUpdate, offBookingUpdate
} from './socket/socket.js';

// Layout & Pages
import MainLayout from './layout/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import AdminServicesPage from './pages/AdminServicesPage.jsx';
import BannedPage from './pages/BannedPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MyBookingsPage from './pages/MyBookingsPage.jsx';
import AdminTicketsPage from './pages/AdminTicketsPage.jsx';
import AdminBookingsPage from './pages/AdminBookingsPage.jsx';
import AdminReclamationsPage from './pages/AdminReclamationsPage.jsx';
import SupportChatPage from './pages/SupportChatPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import RestoredAccountToast from './components/RestoredAccountToast.jsx';

// Composants
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Ce composant gère la logique d'arrière-plan pour un utilisateur connecté
const AuthLogicManager = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userStateRef = useRef(user);

  useEffect(() => {
    userStateRef.current = user;
  });

  // Ce `useEffect` surveille les changements de l'utilisateur et redirige si nécessaire
  useEffect(() => {
    if (user && user.status !== 'active') {
      navigate('/banned');
    }
  }, [user, navigate]);

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
        toast.info(`Votre réservation pour "${updatedBooking.service.title}" a été mise à jour : ${updatedBooking.status}`);
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

  if (!token) return <Navigate to="/" replace />;
  
  return <Outlet />;
};

const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? <Navigate to="/home" replace /> : children;
};

const router = createBrowserRouter([
  { path: "/", element: <PublicRoute><LandingPage /></PublicRoute> },
  { path: "/login", element: <PublicRoute><LoginPage /></PublicRoute> },
  { path: "/register", element: <PublicRoute><RegisterPage /></PublicRoute> },
  { path: "/banned", element: <BannedPage /> },
  { path: "/privacy", element: <PrivacyPolicyPage /> },
  { path: "/terms", element: <TermsPage /> },
  {
    path: "/",
    element: <AuthLogicManager />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "home", element: <HomePage /> },
          { path: "admin/users", element: <AdminUsersPage /> },
          { path: "admin/services", element: <AdminServicesPage /> },
          { path: "admin/tickets", element: <AdminTicketsPage /> },
          { path: "admin/bookings", element: <AdminBookingsPage /> },
          { path: "admin/reclamations", element: <AdminReclamationsPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "support-chat", element: <SupportChatPage /> },
          { path: "my-bookings", element: <MyBookingsPage /> },
        ]
      }
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        theme="colored"
      />
    </>
  );
}

export default App;