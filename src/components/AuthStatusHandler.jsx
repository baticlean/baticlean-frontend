import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const AuthStatusHandler = () => {
  const { user, justReactivated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    const currentPath = location.pathname;
    const userIsActive = user.status === 'active';
    const userIsAdmin = user.role === 'admin' || user.role === 'superAdmin';

    // Règle 1: Si un utilisateur n'est pas actif, il ne devrait pas être ici.
    // On le redirige vers la page de bannissement.
    if (!userIsActive) {
      navigate('/banned', { replace: true });
      return;
    }

    // Règle 2: Si un utilisateur est maintenant actif ET qu'il est sur la page de bannissement,
    // cela signifie qu'il vient d'être réactivé. On le redirige vers l'accueil.
    // Cette règle est importante pour sortir de la page /banned après réactivation.
    if (userIsActive && currentPath === '/banned') {
        navigate('/home', { replace: true });
        return;
    }

    // Règle 3: Si un non-admin essaie d'accéder à une page admin.
    if (currentPath.startsWith('/admin') && !userIsAdmin) {
      navigate('/home', { replace: true });
      return;
    }

  }, [user, justReactivated, navigate, location]);

  return <Outlet />;
};

export default AuthStatusHandler;