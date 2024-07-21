import React from 'react';
import '../css/InfoDisplay.css';

const InfoDisplay: React.FC = () => {
  return (
    <div className="info-display">
      <span className="info-user"></span>
      <span className="info-module"></span>
    </div>
  );
}

export default InfoDisplay;
