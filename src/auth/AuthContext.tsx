import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import keycloakService from './KeycloakService';
import { db, PersonalInfo } from '../db';

// Define the shape of the context
interface AuthContextType {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  userInfo: {
    username: string;
    email: string;
    name: string;
    roles: string[];
  } | null;
  login: (redirectUri?: string) => void;
  logout: (redirectUri?: string) => void;
  hasRole: (role: string) => boolean;
  hasClientRole: (role: string) => boolean;
  updateAuthenticatedUserInfo: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isInitialized: false,
  isLoading: true,
  error: null,
  userInfo: null,
  login: () => {},
  logout: () => {},
  hasRole: () => false,
  hasClientRole: () => false,
  updateAuthenticatedUserInfo: async () => {},
});

// Create a provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<AuthContextType['userInfo']>(null);
  
  // Initialize Keycloak when the component mounts
  useEffect(() => {
    const initKeycloak = async () => {
      try {
        // Initialize Keycloak
        const authenticated = await keycloakService.init();
        setIsAuthenticated(authenticated);
        
        // If authenticated, get user info
        if (authenticated) {
          updateUserInfo();
        }
        
        setIsInitialized(true);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize Keycloak:', err);
        setError('Failed to initialize authentication service');
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    
    initKeycloak();
    
    // Cleanup function for token refresh interval
    return () => {
      // Additional cleanup if needed
    };
  }, []);
  
  // Get user info from Keycloak
  const updateUserInfo = async () => {
    if (!keycloakService.isAuthenticated()) {
      setUserInfo(null);
      return;
    }
    
    try {
      const username = keycloakService.getUsername();
      const email = keycloakService.getEmail();
      const name = keycloakService.getName();
      
      // Get roles from token
      const keycloak = keycloakService.getInstance();
      const roles = keycloak?.realmAccess?.roles || [];
      
      setUserInfo({
        username,
        email,
        name,
        roles,
      });
      
    } catch (err) {
      console.error('Failed to get user info:', err);
      setError('Failed to get user information');
    }
  };
  
  // Update user info in IndexedDB when authenticated
  const updateAuthenticatedUserInfo = async () => {
    if (!isAuthenticated || !userInfo) return;
    
    try {
      // Get existing personal info
      const existingInfo = await db.getPersonalInfo();
      
      // Create updated info
      const updatedInfo: PersonalInfo = {
        name: userInfo.name || existingInfo?.name || '',
        email: userInfo.email || existingInfo?.email || '',
        avatar_url: existingInfo?.avatar_url || '',
        timezone: existingInfo?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        theme_preference: existingInfo?.theme_preference || 'system',
      };
      
      // Update in the database
      await db.updatePersonalInfo(updatedInfo);
    } catch (err) {
      console.error('Failed to update user info in database:', err);
    }
  };
  
  // Login function
  const login = (redirectUri?: string) => {
    keycloakService.login(redirectUri);
  };
  
  // Logout function
  const logout = (redirectUri?: string) => {
    keycloakService.logout(redirectUri);
    setUserInfo(null);
    setIsAuthenticated(false);
  };
  
  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    return keycloakService.hasRole(role);
  };
  
  // Check if user has a specific client role
  const hasClientRole = (role: string): boolean => {
    return keycloakService.hasClientRole(role);
  };
  
  // Provide the context value
  const contextValue: AuthContextType = {
    isAuthenticated,
    isInitialized,
    isLoading,
    error,
    userInfo,
    login,
    logout,
    hasRole,
    hasClientRole,
    updateAuthenticatedUserInfo,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;