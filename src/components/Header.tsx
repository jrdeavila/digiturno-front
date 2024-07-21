import React from 'react';
import logo from '../img/logo.png';
import '../css/Header.css';

const Header: React.FC = () => {
  return (
    <div className="header">
      <img src={logo} alt="Logo" className="logo" />
      <p className="welcome-text"><strong>Bienvenido a tu Digiturno</strong></p>
    </div>
  );
}

export default Header;
