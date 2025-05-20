import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { authenticated, login, logout } = useAuth();

  if (!authenticated) {
    return (
      <button className="p-2" onClick={login}>
        Login
      </button>
    );
  }

  return (
    <button className="p-2" onClick={logout}>
      Logout
    </button>
  );
};

export default Login;
