import React, { ReactNode, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import Login from '../components/Login';
import { Loader, Lock, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  fallback?: ReactNode;
}

/**
 * Protected Route Component
 * 
 * Ensures that users are authenticated before accessing protected content.
 * Optionally checks for specific roles.
 * 
 * @param children Content to render if authenticated and authorized
 * @param requiredRoles Optional array of roles the user must have
 * @param fallback Optional custom fallback component to render if not authorized
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [],
  fallback 
}) => {
  const { isAuthenticated, isLoading, userInfo, hasRole } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  
  // Check if the user has the required roles
  useEffect(() => {
    if (!isAuthenticated || !userInfo) {
      setIsAuthorized(false);
      return;
    }
    
    // If no specific roles are required, user just needs to be authenticated
    if (requiredRoles.length === 0) {
      setIsAuthorized(true);
      return;
    }
    
    // Check if user has any of the required roles
    const authorized = requiredRoles.some(role => hasRole(role));
    setIsAuthorized(authorized);
  }, [isAuthenticated, userInfo, requiredRoles, hasRole]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader className="w-12 h-12 text-sakura-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // Not authenticated - show login page
  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : <Login />;
  }
  
  // Authenticated but not authorized - show unauthorized message
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
          <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You don't have the required permissions to access this page.
          </p>
          <div className="flex justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Lock className="w-4 h-4" />
            <span>Required roles: {requiredRoles.join(', ')}</span>
          </div>
        </div>
      </div>
    );
  }
  
  // User is authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;