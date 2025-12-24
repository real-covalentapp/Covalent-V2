
import React, { useState, useEffect } from 'react';
import { AppView } from './types';
import IntroFrame from './components/IntroFrame';
import FormFrame from './components/FormFrame';
import AdminFrame from './components/AdminFrame';
import AdminLogin from './components/AdminLogin';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('intro');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Simple hash routing for basic navigation support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppView;
      if (['intro', 'form', 'admin-login', 'admin-dashboard'].includes(hash)) {
        if (hash === 'admin-dashboard' && !isAdminAuthenticated) {
          setCurrentView('admin-login');
        } else {
          setCurrentView(hash);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAdminAuthenticated]);

  const navigateTo = (view: AppView) => {
    window.location.hash = view;
    setCurrentView(view);
  };

  const handleAdminLogin = (success: boolean) => {
    if (success) {
      setIsAdminAuthenticated(true);
      navigateTo('admin-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-all duration-300">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => navigateTo('intro')}
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">CloudSubmit</span>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={() => navigateTo('form')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${currentView === 'form' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
          >
            Submit Form
          </button>
          <button 
            onClick={() => navigateTo(isAdminAuthenticated ? 'admin-dashboard' : 'admin-login')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${currentView.includes('admin') ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
          >
            Admin Panel
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {currentView === 'intro' && (
          <IntroFrame onGetStarted={() => navigateTo('form')} />
        )}
        
        {currentView === 'form' && (
          <FormFrame onGoToAdmin={() => navigateTo('admin-login')} />
        )}
        
        {currentView === 'admin-login' && (
          <AdminLogin onLogin={handleAdminLogin} />
        )}
        
        {currentView === 'admin-dashboard' && (
          isAdminAuthenticated ? <AdminFrame /> : <AdminLogin onLogin={handleAdminLogin} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} CloudSubmit Pro. Built with Synced Persistence Logic.</p>
      </footer>
    </div>
  );
};

export default App;
