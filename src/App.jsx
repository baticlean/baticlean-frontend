// baticlean/baticlean-frontend/baticlean-frontend-6de3eed10c580ff6c1f7931b4a6e09bd7c93a2e9/src/App.jsx

import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ✅ Import du hook PWA et du Loader
import { useRegisterSW } from 'virtual:pwa-register/react';
import FullScreenLoader from './components/FullScreenLoader.jsx';

import { useVersion } from './context/VersionContext.jsx';
import UpdateNotification from './components/UpdateNotification';
import SpecialWarning from './components/SpecialWarning.jsx';
import GlobalSocketListener from './components/GlobalSocketListener.jsx';

// ... (tous tes autres imports de pages et composants)
import AuthStatusHandler from './components/AuthStatusHandler.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import LoginTransition from './components/LoginTransition.jsx';
import CookieConsent from './components/CookieConsent.jsx';
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
import UserTicketsPage from './pages/UserTicketsPage.jsx';
import TemporaryLockPage from './pages/TemporaryLockPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import MaintenanceAdminPage from './pages/MaintenanceAdminPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

const AppRoot = () => {
  const { versionInfo } = useVersion();
  const { token } = useSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // ✅ État pour le loader "vrai"

  // ✅ Gestion PWA Native
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    // On déclenche le modal si version.json OU le Service Worker détectent une maj
    if (versionInfo.available || needRefresh) {
      setModalOpen(true);
    }
  }, [versionInfo, needRefresh]);

  const handleUpdate = () => {
    setIsUpdating(true); // ✅ On lance le chargement immédiatement
    setModalOpen(false);

    // Un petit délai pour s'assurer que l'utilisateur voit le loader et que c'est "propre"
    setTimeout(() => {
      if (needRefresh) {
        // ✅ La méthode propre de vite-plugin-pwa qui skipWaiting et reload
        updateServiceWorker(true); 
      } else {
        window.location.reload(true);
      }
    }, 1500);
  };

  return (
    <>
      {/* ✅ Le Loader s'affiche pendant la mise à jour */}
      {isUpdating && <FullScreenLoader message="Mise à jour de BATIClean en cours..." />}

      {token && <GlobalSocketListener />}
      
      <Outlet />

      <ToastContainer position="bottom-right" autoClose={4000} theme="colored" />
      <CookieConsent />
      
      <UpdateNotification
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleUpdate}
        versionInfo={versionInfo}
      />
      <SpecialWarning />
    </>
  );
};

// ... (ton router createBrowserRouter reste identique)
const router = createBrowserRouter([
  {
    element: <AppRoot />,
    children: [
      {
        path: '/',
        element: <PublicRoute />,
        children: [
          { index: true, element: <LandingPage /> },
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
          { path: 'temporary-lock', element: <TemporaryLockPage /> },
          { path: 'forgot-password', element: <ForgotPasswordPage /> },
          { path: 'reset-password/:token', element: <ResetPasswordPage /> },
        ],
      },
      { path: "/privacy", element: <PrivacyPolicyPage /> },
      { path: "/terms", element: <TermsPage /> },
      {
        path: '/',
        element: <ProtectedRoute />,
        children: [
          { path: 'banned', element: <BannedPage /> },
          { path: 'welcome', element: <LoginTransition /> },
          {
            element: <AuthStatusHandler />,
            children: [
              {
                element: <MainLayout />,
                children: [
                  { path: "home", element: <HomePage /> },
                  { path: "profile", element: <ProfilePage /> },
                  { path: "my-bookings", element: <MyBookingsPage /> },
                  { path: "my-tickets", element: <UserTicketsPage /> },
                  { path: "support-chat", element: <SupportChatPage /> },
                  { path: "admin/dashboard", element: <AdminDashboardPage /> },
                  { path: "admin/users", element: <AdminUsersPage /> },
                  { path: "admin/services", element: <AdminServicesPage /> },
                  { path: "admin/tickets", element: <AdminTicketsPage /> },
                  { path: "admin/bookings", element: <AdminBookingsPage /> },
                  { path: "admin/reclamations", element: <AdminReclamationsPage /> },
                  { path: "admin/maintenance", element: <MaintenanceAdminPage /> },
                ],
              },
            ],
          },
        ],
      },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;