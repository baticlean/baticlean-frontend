// baticlean-frontend/src/hooks/useVersionCheck.js

import { useState, useEffect, useCallback } from 'react';

const POLLING_INTERVAL = 1 * 60 * 1000; // 1 minute

export function useVersionCheck() {
  const [versionInfo, setVersionInfo] = useState({ available: false, displayVersion: null });
  const [isUpdateInProgress, setIsUpdateInProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ✅ Vérification synchrone du flag de mise à jour
  const [isPostUpdateLoading, setIsPostUpdateLoading] = useState(() => {
    return !!sessionStorage.getItem('pwaUpdateInProgress');
  });
  
  const [showUpdateCompleteModal, setShowUpdateCompleteModal] = useState(false);

  // Gestion du rideau de travaux (30 secondes pour laisser le temps au SW de s'installer)
  useEffect(() => {
    if (isPostUpdateLoading) {
      const timer = setTimeout(() => {
        sessionStorage.removeItem('pwaUpdateInProgress');
        setIsPostUpdateLoading(false);
        setShowUpdateCompleteModal(true);
      }, 30000); 
      return () => clearTimeout(timer);
    }
  }, [isPostUpdateLoading]);

  // Vérification de version
  const performCheck = useCallback(async () => {
    const currentVersion = document.querySelector('meta[name="app-version"]')?.content;
    
    // ✅ Protection : On ne vérifie rien si on est déjà en train de charger/mettre à jour
    if (!currentVersion || versionInfo.available || isUpdateInProgress || isPostUpdateLoading) return;

    try {
      const url = `/meta.json?t=${new Date().getTime()}`;
      const response = await fetch(url, { cache: 'no-store' });
      const meta = await response.json();
      
      if (meta.fullVersion !== currentVersion) {
        setVersionInfo({ available: true, ...meta });
        setIsModalOpen(true);
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

  // ✅ LOGIQUE DE CONFIRMATION BLINDÉE
  const confirmUpdate = async () => {
    setIsModalOpen(false); 
    setIsUpdateInProgress(true);
    
    sessionStorage.setItem('newAppVersion', versionInfo.displayVersion || 'Nouvelle');
    sessionStorage.setItem('pwaUpdateInProgress', 'true');

    try {
      // 1. Désinscription des Service Workers
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      // 2. Nettoyage manuel des caches (Crucial pour éviter le loop)
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
    } catch (error) {
      console.error("Erreur nettoyage cache:", error);
    }

    // 3. ✅ RELOAD AVEC CACHE-BUSTING
    // On ajoute un paramètre unique à l'URL pour forcer le réseau à donner le NOUVEAU index.html
    setTimeout(() => {
      const separator = window.location.href.includes('?') ? '&' : '?';
      window.location.href = window.location.origin + window.location.pathname + separator + 'upd=' + Date.now();
    }, 1000);
  };

  const declineUpdate = () => {
    setIsModalOpen(false);
  };

  return {
    versionInfo,
    isUpdateInProgress,
    isPostUpdateLoading,
    isModalOpen,
    showUpdateCompleteModal,
    setShowUpdateCompleteModal,
    confirmUpdate,
    declineUpdate,
    performCheck
  };
}