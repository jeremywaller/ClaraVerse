import React, { useEffect, useState } from 'react';
import { LogIn, UserCircle, Shield, Info, Loader } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

interface LoginProps {
  redirectPath?: string;
}

const Login: React.FC<LoginProps> = ({ redirectPath = '/' }) => {
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isRedirecting) {
      setIsRedirecting(true);
      window.location.href = redirectPath;
    }
  }, [isAuthenticated, redirectPath, isRedirecting]);
  
  // Handle login button click
  const handleLogin = () => {
    login(redirectPath);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-sakura-50 dark:from-gray-900 dark:to-sakura-900/30 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-sakura-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-full p-3 sm:p-4 shadow-xl">
                <img 
                  src="/logo.png" 
                  alt="Clara Logo" 
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.style.display = 'none';
                  }}
                />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to Clara</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Sign in to access your private workspace</p>
        </div>
        
        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader className="w-10 h-10 text-sakura-500 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-300">Initializing authentication service...</p>
            </div>
          )}
          
          {/* Error state */}
          {error && !isLoading && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Authentication Error</h3>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Main content */}
          {!isLoading && !error && (
            <>
              <div className="space-y-6">
                {/* Features List */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-green-100 dark:bg-green-900/20 rounded-full text-green-600 dark:text-green-400">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Secure Authentication</h3>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Your data is protected with industry-standard protocols</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded-full text-blue-600 dark:text-blue-400">
                      <UserCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">User Management</h3>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Manage your profile and preferences across devices</p>
                    </div>
                  </div>
                </div>
                
                {/* Login Button */}
                <div className="pt-4">
                  <button
                    onClick={handleLogin}
                    className="w-full px-4 py-3 bg-sakura-500 hover:bg-sakura-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign in with Keycloak
                  </button>
                </div>
                
                {/* Additional info */}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
                  <p>By signing in, you agree to our terms of service and privacy policy.</p>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Need help? Contact your system administrator</p>
        </div>
      </div>
    </div>
  );
};

export default Login;