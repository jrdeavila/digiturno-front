import React from 'react';
import Header from './Header';
import LoginForm from './LoginForm';
import '../css/LoginContainer.css';

interface LoginContainerProps {
  onLogin: () => void;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ onLogin }) => {
  return (
    <div className="login-container">
      <Header />
      <LoginForm onLogin={onLogin} />
    </div>
  );
}

export default LoginContainer;
