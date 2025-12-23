// baticlean-frontend/src/context/VersionContext.jsx

import React, { createContext, useContext } from 'react';
import { useVersionCheck } from '../hooks/useVersionCheck';
import { toast } from 'react-toastify';

const VersionContext = createContext();

export const useVersion = () => useContext(VersionContext);

export function VersionProvider({ children }) {
  const versionLogic = useVersionCheck();

  const manualCheckForUpdate = async () => {
    const updateFound = await versionLogic.performCheck();
    if (!updateFound) {
      toast.success("BATIClean est déjà à jour !");
    }
  };

  const value = {
    ...versionLogic,
    manualCheckForUpdate,
  };

  return (
    <VersionContext.Provider value={value}>
      {children}
    </VersionContext.Provider>
  );
}