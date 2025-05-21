import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, LogIn, Shield } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

interface UserProfileButtonProps {
  userName: string;
  onPageChange: (page: string) => void;
}

const UserProfileButton: React.FC<UserProfileButtonProps> = ({
  userName,
  onPageChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, userInfo, logout, login } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsOpen(false);
    logout(window.location.origin);
  };

  const handleLogin = () => {
    setIsOpen(false);
    login(window.location.origin);
  };

  // Determine the display name (use authenticated user name if available)
  const displayName = isAuthenticated && userInfo ? 
    (userInfo.name || userInfo.username) : 
    userName || 'Profile';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-sakura-50 dark:hover:bg-sakura-100/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-sakura-100 dark:bg-sakura-100/10 flex items-center justify-center">
          <User className="w-5 h-5 text-sakura-500" />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {displayName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium text-gray-800 dark:text-gray-200">{displayName}</div>
            {isAuthenticated && userInfo?.email && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{userInfo.email}</div>
            )}
          </div>
          
          {/* Settings button - always visible */}
          <button
            onClick={() => {
              onPageChange('settings');
              setIsOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-sakura-50 dark:hover:bg-sakura-100/5"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          
          {/* User roles - only visible when authenticated */}
          {isAuthenticated && userInfo?.roles && userInfo.roles.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Shield className="w-3 h-3" />
                <span>Roles: {userInfo.roles.slice(0, 3).join(', ')}{userInfo.roles.length > 3 ? '...' : ''}</span>
              </div>
            </div>
          )}
          
          {/* Login/Logout button */}
          <div className="border-t border-gray-200 dark:border-gray-700 mt-1">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-sakura-600 dark:text-sakura-400 hover:bg-sakura-50 dark:hover:bg-sakura-900/10"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileButton; 