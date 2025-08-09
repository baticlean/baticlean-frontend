// Remplacez tout le contenu de votre fichier CircularLoading.jsx par ceci

import React from 'react';
import './CircularLoading.css';

// Ce composant reçoit un message optionnel à afficher à côté du spinner
function CircularLoading({ message }) {
  return (
    <div className="loading-wrapper">
      <div className="spinner"></div>
      {/* Le message ne s'affichera que si vous en passez un */}
      <span>{message || ''}</span>
    </div>
  );
}

export default CircularLoading;