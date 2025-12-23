// baticlean-frontend/src/hooks/useVersionCheck.js

import { useState, useEffect, useCallback } from 'react';

const POLLING_INTERVAL = 1 * 60 * 1000; // 1 minute

export function useVersionCheck() {
  const [versionInfo, setVersionInfo] = useState({ available: false, displayVersion: null });
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  
  // ✅ CORRECTION CRITIQUE : On vérifie le flag SYNCHRONEMENT à l'initialisation
  const [isPostUpdateLoading, setIsPostUpdateLoading] = useState(() => {
    return !!sessionStorage.getItem('pwaUpdateInProgress');
  });
  
  const [showUpdateCompleteModal, setShowUpdateCompleteModal] = useState(false);

  // Gestion de la fin du chargement post-mise à jour
  useEffect(() => {
    if (isPostUpdateLoading) {
      const timer = setTimeout(() => {
        sessionStorage.removeItem('pwaUpdateInProgress');
        setIsPostUpdateLoading(false);
        setShowUpdateCompleteModal(true);
      }, 3000); // 3 secondes de sécurité pour charger les assets en cachette
      return () => clearTimeout(timer);
    }
  }, [isPostUpdateLoading]);

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