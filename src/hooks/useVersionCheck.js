// baticlean-frontend/src/hooks/useVersionCheck.js

import { useState, useEffect, useCallback } from 'react';

const POLLING_INTERVAL = 1 * 60 * 1000; // 1 minute

export function useVersionCheck() {
  const [versionInfo, setVersionInfo] = useState({ available: false, displayVersion: null });
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  
  // ✅ Initialisation synchrone pour capter le flag dès le millième de seconde
  const [isPostUpdateLoading, setIsPostUpdateLoading] = useState(() => {
    return !!sessionStorage.getItem('pwaUpdateInProgress');
  });
  
  const [showUpdateCompleteModal, setShowUpdateCompleteModal] = useState(false);

  // Gestion du rideau de travaux après le rechargement
  useEffect(() => {
    if (isPostUpdateLoading) {
      // ✅ ON PASSE À 30 SECONDES (30000ms) POUR ÊTRE SÛR QUE TOUT LE CACHE EST PRÊT
      const timer = setTimeout(() => {
        sessionStorage.removeItem('pwaUpdateInProgress');
        setIsPostUpdateLoading(false);
        setShowUpdateCompleteModal(true);
      }, 30000); 

      return () => clearTimeout(timer);
    }
  }, [isPostUpdateLoading]);

  // Vérification périodique (Inchangé)
  const performCheck = useCallback(async () => {
    const currentVersion = document.querySelector('meta[name="app-version"]')?.content;
    if (!currentVersion || versionInfo.available) return;

    try {
      const url = `/meta.json?t=${new Date().getTime()}`;
      const response = await fetch(url, { cache: 'no-store' });
      const meta = await response.json();
      
      if (meta.fullVersion !== currentVersion) {
        setVersionInfo({ available: true, ...meta });
        return true;
      }
    } catch (error) {
      console.error("Erreur version check:", error);
    }
    return false;
  }, [versionInfo.available]);

  useEffect(() => {
    const interval = setInterval(performCheck, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [performCheck]);

  // Lancement de la mise à jour
  const confirmUpdate = async () => {
    setIsUpdateInProgress(true);
    sessionStorage.setItem('newAppVersion', versionInfo.displayVersion || 'Nouvelle');
    sessionStorage.setItem('pwaUpdateInProgress', 'true');

    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }
    } catch (error) {
      console.error("Erreur unregister SW:", error);
    }

    setTimeout(() => {
      window.location.reload(true);
    }, 1000);
  };

  return {
    versionInfo,
    isUpdateInProgress,
    isPostUpdateLoading,
    showUpdateCompleteModal,
    setShowUpdateCompleteModal,
    confirmUpdate,
    performCheck
  };
}