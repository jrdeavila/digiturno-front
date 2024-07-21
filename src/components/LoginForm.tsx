import React, { useState } from 'react';
import InputField from './InputField';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import '../css/LoginForm.css';

interface LoginFormProps {
  onLogin: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === 'prueba' && password === '123') {
      onLogin();
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="form-container">
      {error && <p className="error-message">{error}</p>}
      <InputField icon={faUser} type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
      <InputField icon={faLock} type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="login-button" onClick={handleLogin}>Iniciar sesión</button>
      <div className="footer-text">© All rights reserved 2024</div>
    </div>
  );
}

export default LoginForm;
