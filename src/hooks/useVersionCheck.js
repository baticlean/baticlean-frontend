// src/context/VersionContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify'; // Assure-toi que toast est importé

const VersionContext = createContext();

export const useVersion = () => useContext(VersionContext);

export function VersionProvider({ children }) {
  const [versionInfo, setVersionInfo] = useState({ available: false, displayVersion: null });
  const POLLING_INTERVAL = 1 * 60 * 1000;

  const performCheck = useCallback(async () => {
    const currentVersion = document.querySelector('meta[name="app-version"]')?.content;
    if (!currentVersion) return false;

    try {
      const url = `/meta.json?t=${new Date().getTime()}`;
      const response = await fetch(url, { cache: 'no-store' });
      const meta = await response.json();

      if (meta.fullVersion !== currentVersion) {
        setVersionInfo({ available: true, ...meta });
        return true; // Mise à jour trouvée
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la version :", error);
    }
    return false; // Pas de mise à jour
  }, []);

  useEffect(() => {
    const interval = setInterval(performCheck, POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, [performCheck]);

  const manualCheckForUpdate = async () => {
    const updateFound = await performCheck();
    if (!updateFound) {
      toast.success("Vous utilisez déjà la version la dernière version de BATICLean !");
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