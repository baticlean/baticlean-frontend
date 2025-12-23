// baticlean-frontend/src/App.jsx

import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useVersion } from './context/VersionContext.jsx';
import UpdateNotification from './components/UpdateNotification';
import UpdateCompleteModal from './components/UpdateCompleteModal';
import UpdatingScreen from './components/UpdatingScreen'; 
import SpecialWarning from './components/SpecialWarning.jsx';
import GlobalSocketListener from './components/GlobalSocketListener.jsx';

// Imports Routes & Pages
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
  const { 
    versionInfo, 
    confirmUpdate, 
    declineUpdate,
    isModalOpen, 
    isUpdateInProgress, 
    isPostUpdateLoading,
    showUpdateCompleteModal, 
    setShowUpdateCompleteModal 
  } = useVersion();
  
  const { token } = useSelector((state) => state.auth);

  // ✅ NETTOYAGE DE L'URL (On retire le ?upd=... pour garder une URL propre)
  useEffect(() => {
    if (window.location.search.includes('upd=')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // ✅ BLOCAGE DU RENDU PENDANT LE RIDEAU (Pour éviter les flashs d'anciens composants)
  if (isUpdateInProgress || isPostUpdateLoading) {
    return <UpdatingScreen open={true} />;
  }

  return (
    <>
      {token && <GlobalSocketListener />}
      
      <Outlet />

      <ToastContainer position="bottom-right" autoClose={4000} theme="colored" />
      <CookieConsent />
      
      <UpdateNotification
        open={isModalOpen}
        onClose={declineUpdate}
        onConfirm={confirmUpdate}
        versionInfo={versionInfo}
      />

      <UpdateCompleteModal 
        open={showUpdateCompleteModal} 
        onClose={() => setShowUpdateCompleteModal(false)} 
      />

      <SpecialWarning />
    </>
  );
};

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