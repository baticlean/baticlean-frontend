// src/hooks/useVersionCheck.js

import { useState, useEffect } from 'react';

const POLLING_INTERVAL = 2 * 60 * 1000; // 5 minutes

export function useVersionCheck() {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);

  useEffect(() => {
    // 1. Récupérer la version actuelle de l'app depuis la balise meta
    const currentVersion = document.querySelector('meta[name="app-version"]')?.content;
    
    if (!currentVersion) {
      console.warn("La balise meta 'app-version' n'a pas été trouvée.");
      return;
    }

    // 2. Mettre en place une vérification périodique
    const interval = setInterval(() => {
      // On utilise 'no-store' pour être sûr de ne pas récupérer une version en cache
      fetch('/meta.json', { cache: 'no-store' })
        .then(res => res.json())
        .then(meta => {
          if (meta.version !== currentVersion) {
            setNewVersionAvailable(true);
            // On arrête de vérifier une fois qu'on a trouvé une nouvelle version
            clearInterval(interval); 
          }
        })
        .catch(err => {
          console.error("Erreur lors de la vérification de la version :", err);
        });
    }, POLLING_INTERVAL);

    // 3. Nettoyer l'intervalle quand le composant est démonté
    return () => clearInterval(interval);
  }, []);

  return newVersionAvailable;
}