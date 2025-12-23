// baticlean-frontend/src/hooks/useVersionCheck.js

import { useState, useEffect, useCallback } from 'react';

const POLLING_INTERVAL = 1 * 60 * 1000; // 1 minute

export function useVersionCheck() {
  const [versionInfo, setVersionInfo] = useState({ available: false, displayVersion: null });
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ On gère l'ouverture ici
  
  const [isPostUpdateLoading, setIsPostUpdateLoading] = useState(() => {
    return !!sessionStorage.getItem('pwaUpdateInProgress');
  });
  
  const [showUpdateCompleteModal, setShowUpdateCompleteModal] = useState(false);

  useEffect(() => {
    if (isPostUpdateLoading) {
      const timer = setTimeout(() => {
        sessionStorage.removeItem('pwaUpdateInProgress');
        setIsPostUpdateLoading(false);
        setShowUpdateCompleteModal(true);
      }, 30000); // Garde les 30s de sécurité
      return () => clearTimeout(timer);
    }
  }, [isPostUpdateLoading]);

  const performCheck = useCallback(async () => {
    const currentVersion = document.querySelector('meta[name="app-version"]')?.content;
    
    // ✅ NE PAS VÉRIFIER si on est déjà en train de mettre à jour ou si le modal est déjà ouvert
    if (!currentVersion || versionInfo.available || isUpdateInProgress || isPostUpdateLoading) return;

    try {
      const url = `/meta.json?t=${new Date().getTime()}`;
      const response = await fetch(url, { cache: 'no-store' });
      const meta = await response.json();
      
      if (meta.fullVersion !== currentVersion) {
        setVersionInfo({ available: true, ...meta });
        setIsModalOpen(true); // ✅ Ouvre le modal automatiquement ici
        return true;
      }
    } catch (error) {
      console.error("Erreur version check:", error);
    }
    return false;
  }, [versionInfo.available, isUpdateInProgress, isPostUpdateLoading]);

  useEffect(() => {
    const interval = setInterval(performCheck, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [performCheck]);

  const confirmUpdate = async () => {
    setIsModalOpen(false); // ✅ FERME IMMÉDIATEMENT LE MODAL pour éviter la régression
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

  const declineUpdate = () => {
    setIsModalOpen(false);
  };

  return {
    versionInfo,
    isUpdateInProgress,
    isPostUpdateLoading,
    isModalOpen, // ✅ Exporté
    showUpdateCompleteModal,
    setShowUpdateCompleteModal,
    confirmUpdate,
    declineUpdate, // ✅ Exporté
    performCheck
  };
}