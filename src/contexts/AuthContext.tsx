import React, { createContext, useContext, useEffect, useState } from 'react';
import keycloak from '../keycloak';

interface AuthContextProps {
  initialized: boolean;
  authenticated: boolean;
  token?: string;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  initialized: false,
  authenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string>();

  useEffect(() => {
    keycloak.init({ onLoad: 'check-sso' }).then((auth) => {
      setAuthenticated(auth);
      setToken(keycloak.token ?? undefined);
      setInitialized(true);
    });
  }, []);

  const login = () => keycloak.login();
  const logout = () => keycloak.logout();

  return (
    <AuthContext.Provider value={{ initialized, authenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
