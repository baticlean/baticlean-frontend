// src/hooks/useVersionCheck.js

import { useState, useEffect } from 'react';

const POLLING_INTERVAL = 2 * 60 * 1000; // 2 minutes

export function useVersionCheck() {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);

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
          if (meta.version !== currentVersion) {
            setNewVersionAvailable(true);
            clearInterval(interval); 
          }
        })
        .catch(err => console.error("Erreur lors de la vérification de la version :", err));
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return newVersionAvailable;
}