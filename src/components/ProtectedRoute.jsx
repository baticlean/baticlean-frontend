import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import GlobalSocketListener from './GlobalSocketListener';

const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    // Redirige vers la page de connexion si pas de token
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si le token existe, on active le listener de sockets et on rend les routes enfants
  return (
    <>
      <GlobalSocketListener />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;