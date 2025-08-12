// src/hooks/useVersionCheck.js

import { useState, useEffect } from 'react';

const POLLING_INTERVAL = 1 * 60 * 1000; // 1 minutes

export function useVersionCheck() {
  const [versionInfo, setVersionInfo] = useState({ available: false, displayVersion: null });

  useEffect(() => {
    const currentVersion = document.querySelector('meta[name="app-version"]')?.content;
    
    if (!currentVersion) {
      console.warn("La balise meta 'app-version' est introuvable.");
      return;
    }

    const interval = setInterval(() => {
      const url = `/meta.json?t=${new Date().getTime()}`;

      fetch(url, { cache: 'no-store' })
        .then(res => res.json())
        .then(meta => {
          // ✅ La logique de détection utilise toujours la version complète et robuste
          if (meta.fullVersion !== currentVersion) {
            // ✅ Mais on ne stocke que la version destinée à l'affichage
            setVersionInfo({ available: true, displayVersion: meta.displayVersion });
            clearInterval(interval); 
          }
        })
        .catch(err => console.error("Erreur lors de la vérification de la version :", err));
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return versionInfo;
}