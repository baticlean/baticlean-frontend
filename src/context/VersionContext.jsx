// src/context/VersionContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// On crée le Context
const VersionContext = createContext();

// On crée un "hook" personnalisé pour l'utiliser facilement
export const useVersion = () => useContext(VersionContext);

// On crée le "Provider" qui contiendra toute notre logique
export function VersionProvider({ children }) {
  const [versionInfo, setVersionInfo] = useState({ available: false, displayVersion: null });
  const POLLING_INTERVAL = 2 * 60 * 1000; // 2 minutes

  const performCheck = useCallback(async () => {
    const currentVersion = document.querySelector('meta[name="app-version"]')?.content;
    if (!currentVersion) return;

    try {
      const url = `/meta.json?t=${new Date().getTime()}`;
      const response = await fetch(url, { cache: 'no-store' });
      const meta = await response.json();

      if (meta.fullVersion !== currentVersion) {
        setVersionInfo({ available: true, ...meta });
        return true; // Indique qu'une mise à jour a été trouvée
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la version :", error);
    }
    return false; // Pas de mise à jour
  }, []);

  // Le hook pour la vérification automatique
  useEffect(() => {
    const interval = setInterval(performCheck, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [performCheck]);

  // ✅ La nouvelle fonction pour la vérification manuelle
  const manualCheckForUpdate = async () => {
    const updateFound = await performCheck();
    if (!updateFound) {
      // Si aucune mise à jour n'est trouvée, on notifie l'utilisateur
      toast.success("Vous utilisez déjà la version la plus récente !");
    }
  };

  const value = {
    versionInfo,
    manualCheckForUpdate,
  };

  return (
    <VersionContext.Provider value={value}>
      {children}
    </VersionContext.Provider>
  );
}