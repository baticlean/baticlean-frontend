// src/components/CircularLoading.jsx
import React from 'react';
import './CircularLoading.css';

// Ce composant reçoit un message à afficher à côté du spinner
function CircularLoading({ message }) {
  return (
    <div className="loading-wrapper">
      <div className="spinner"></div>
      <span>{message}</span>
    </div>
  );
}

export default CircularLoading;