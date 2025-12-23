// baticlean-frontend/src/hooks/useVersionCheck.js

import { useState, useEffect, useCallback } from 'react';

const POLLING_INTERVAL = 1 * 60 * 1000; // 1 minute

export function useVersionCheck() {
  const [versionInfo, setVersionInfo] = useState({ available: false, displayVersion: null });
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  const [isPostUpdateLoading, setIsPostUpdateLoading] = useState(false); // ✅ Nouveau : Loader après reload
  const [showUpdateCompleteModal, setShowUpdateCompleteModal] = useState(false);

  // 1. Détection immédiate au démarrage
  useEffect(() => {
    const updateFlag = sessionStorage.getItem('pwaUpdateInProgress');
    if (updateFlag) {
      // ✅ ON ACTIVE LE LOADER TOUT DE SUITE
      setIsPostUpdateLoading(true);
      
      // ✅ ON ATTEND 3 SECONDES (comme demandé) pour masquer le flash blanc et charger le background
      const timer = setTimeout(() => {
        sessionStorage.removeItem('pwaUpdateInProgress');
        setIsPostUpdateLoading(false);
        setShowUpdateCompleteModal(true); // Puis on montre le modal de succès
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  // 2. Logique de vérification périodique
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

  // 3. Logique de déclenchement de la mise à jour
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
    isPostUpdateLoading, // ✅ On l'exporte pour App.jsx
    showUpdateCompleteModal,
    setShowUpdateCompleteModal,
    confirmUpdate,
    performCheck
  };
}