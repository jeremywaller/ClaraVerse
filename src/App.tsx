import React from 'react';
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import Debug from './components/Debug';
import Assistant from './components/Assistant';
import Onboarding from './components/Onboarding';
import Apps from './components/Apps';
import AppCreator from './components/AppCreator';
import AppRunner from './components/AppRunner';
import ImageGen from './components/ImageGen';
import Gallery from './components/Gallery';
import Help from './components/Help';
import N8N from './components/N8N';
import UIBuilder from './components/UIBuilder';
import UIProjectViewer from './components/UIProjectViewer';
import Servers from './components/Servers';
import Login from './components/Login';
import NodeRegistryDebug from './debug/NodeRegistryDebug';
import ToolbarDebug from './debug/ToolbarDebug';
import { db } from './db';
import { InterpreterProvider } from './contexts/InterpreterContext';
import { AuthProvider, useAuth } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';

/**
 * Main application content
 */
const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState(() => localStorage.getItem('activePage') || 'dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string } | null>(null);
  const { isAuthenticated, userInfo: authUserInfo, updateAuthenticatedUserInfo } = useAuth();

  // Check for user info in database and sync with authenticated user info
  useEffect(() => {
    const checkUserInfo = async () => {
      const info = await db.getPersonalInfo();
      
      // If authenticated, use that info and update the database
      if (isAuthenticated && authUserInfo) {
        setUserInfo({ name: authUserInfo.name || authUserInfo.username });
        setShowOnboarding(false);
        // Sync authenticated user info with database
        await updateAuthenticatedUserInfo();
      } 
      // If not authenticated but we have local user info, use that
      else if (info && info.name) {
        setShowOnboarding(false);
        setUserInfo({ name: info.name });
      } 
      // If no user info at all, show onboarding
      else {
        setShowOnboarding(true);
      }
    };
    
    checkUserInfo();
  }, [isAuthenticated, authUserInfo, updateAuthenticatedUserInfo]);

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    const info = await db.getPersonalInfo();
    if (info) {
      setUserInfo({ name: info.name });
    }
  };
  
  useEffect(() => {
    if (activePage === 'app-creator' || activePage === 'app-runner') {
      const appId = localStorage.getItem('current_app_id');
      
      if (activePage === 'app-runner' && !appId) {
        setActivePage('apps');
      }
    }
  }, [activePage]);

  useEffect(() => {
    console.log('Storing activePage:', activePage);
    localStorage.setItem('activePage', activePage);
  }, [activePage]);
  
  // Handle login page
  if (activePage === 'login') {
    return <Login />;
  }

  const renderContent = () => {
    if (activePage === 'assistant') {
      return (
        <ProtectedRoute>
          <Assistant onPageChange={setActivePage} />
        </ProtectedRoute>
      );
    }
    
    if (activePage === 'app-creator') {
      const appId = localStorage.getItem('current_app_id');
      return (
        <ProtectedRoute>
          <AppCreator onPageChange={setActivePage} appId={appId || undefined} />
        </ProtectedRoute>
      );
    }
    
    if (activePage === 'app-runner') {
      const appId = localStorage.getItem('current_app_id');
      if (appId) {
        return (
          <ProtectedRoute>
            <AppRunner appId={appId} onBack={() => setActivePage('apps')} />
          </ProtectedRoute>
        );
      } else {
        setActivePage('apps');
        return null;
      }
    }

    if (activePage === 'image-gen') {
      return (
        <ProtectedRoute>
          <ImageGen onPageChange={setActivePage} />
        </ProtectedRoute>
      );
    }

    if (activePage === 'gallery') {
      return (
        <ProtectedRoute>
          <Gallery onPageChange={setActivePage} />
        </ProtectedRoute>
      );
    }

    if (activePage === 'n8n') {
      return (
        <ProtectedRoute>
          <N8N onPageChange={setActivePage} />
        </ProtectedRoute>
      );
    }

    if (activePage === 'ui-builder') {
      return (
        <ProtectedRoute>
          <UIBuilder onPageChange={setActivePage} />
        </ProtectedRoute>
      );
    }

    if (activePage === 'ui-project-viewer') {
      return (
        <ProtectedRoute>
          <UIProjectViewer onPageChange={setActivePage} />
        </ProtectedRoute>
      );
    }
    
    if (activePage === 'servers') {
      return (
        <ProtectedRoute requiredRoles={['admin']}>
          <Servers onPageChange={setActivePage} />
        </ProtectedRoute>
      );
    }

    return (
      <div className="flex h-screen">
        <Sidebar activePage={activePage} onPageChange={setActivePage} />
        
        <div className="flex-1 flex flex-col">
          <Topbar userName={userInfo?.name} onPageChange={setActivePage} />
          
          <main className="flex-1 p-6 overflow-auto">
            {(() => {
              switch (activePage) {
                case 'settings':
                  return <Settings />;
                case 'debug':
                  return (
                    <ProtectedRoute requiredRoles={['admin']}>
                      <Debug />
                    </ProtectedRoute>
                  );
                case 'apps':
                  return <Apps onPageChange={setActivePage} />;
                case 'help':
                  return <Help />;
                case 'dashboard':
                default:
                  return <Dashboard onPageChange={setActivePage} />;
              }
            })()}
            {import.meta.env.DEV && (
              <ProtectedRoute requiredRoles={['admin']}>
                <NodeRegistryDebug />
                <ToolbarDebug />
              </ProtectedRoute>
            )}
          </main>
        </div>
      </div>
    );
  };

  // If onboarding is needed, show it (even if not authenticated)
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Otherwise, show the main content
  return renderContent();
};

/**
 * Main App component
 */
function App() {
  return (
    <AuthProvider>
      <InterpreterProvider onPageChange={() => {}}>
        <div className="min-h-screen bg-gradient-to-br from-white to-sakura-100 dark:from-gray-900 dark:to-sakura-100">
          <AppContent />
        </div>
      </InterpreterProvider>
    </AuthProvider>
  );
}

export default App;


