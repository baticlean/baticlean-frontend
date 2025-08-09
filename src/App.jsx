// src/App.jsx

import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AuthStatusHandler from './components/AuthStatusHandler.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import PublicRoute from './components/PublicRoute.jsx';
import LoginTransition from './components/LoginTransition.jsx';

// NOUVEAU : On importe la bannière de cookies
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

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
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
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {/* NOUVEAU : On ajoute la bannière de cookies ici pour qu'elle soit visible partout */}
      <CookieConsent />
    </>
  );
}

export default App;