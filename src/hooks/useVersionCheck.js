// baticlean-frontend/src/hooks/useVersionCheck.js

import { useState, useEffect, useCallback } from 'react';

const POLLING_INTERVAL = 1 * 60 * 1000; // 1 minute

export function useVersionCheck() {
  const [versionInfo, setVersionInfo] = useState({ available: false, displayVersion: null });
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  const [showUpdateCompleteModal, setShowUpdateCompleteModal] = useState(false);

  // 1. Vérification au chargement si on vient de finir une mise à jour
  useEffect(() => {
    const updateFlag = sessionStorage.getItem('pwaUpdateInProgress');
    if (updateFlag) {
      sessionStorage.removeItem('pwaUpdateInProgress');
      setShowUpdateCompleteModal(true);
    }
  }, []);

  // 2. Logique de vérification (comparaison meta vs meta.json)
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

  // 3. Logique de confirmation (La clé de la stabilité)
  const confirmUpdate = async () => {
    setIsUpdateInProgress(true);
    
    // On stocke les infos pour le prochain chargement
    sessionStorage.setItem('newAppVersion', versionInfo.displayVersion || 'Nouvelle');
    sessionStorage.setItem('pwaUpdateInProgress', 'true');

    try {
      // ✅ ON TUE LE SERVICE WORKER pour forcer le navigateur à reprendre le contrôle direct
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }
    } catch (error) {
      console.error("Erreur unregister SW:", error);
    }

    // On attend 1s pour laisser le temps au SW de se désactiver proprement
    setTimeout(() => {
      window.location.reload(true);
    }, 1000);
  };

  return {
    versionInfo,
    isUpdateInProgress,
    showUpdateCompleteModal,
    setShowUpdateCompleteModal,
    confirmUpdate,
    performCheck
  };
}