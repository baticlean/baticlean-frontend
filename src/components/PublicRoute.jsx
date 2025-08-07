import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const { token } = useSelector((state) => state.auth);

  if (token) {
    // Si l'utilisateur est connecté, on le redirige vers l'accueil
    return <Navigate to="/home" replace />;
  }

  // Sinon, on affiche la page publique demandée (Login, Register, etc.)
  return <Outlet />;
};

export default PublicRoute;