
import React, { useState, useEffect } from 'react';
import { AppView } from './types';
import IntroFrame from './components/IntroFrame';
import FormFrame from './components/FormFrame';
import AdminFrame from './components/AdminFrame';
import AdminLogin from './components/AdminLogin';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('intro');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Sync state with URL hash for better navigation feel
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppView;
      const validViews: AppView[] = ['intro', 'form', 'admin-login', 'admin-dashboard'];
      
      if (validViews.includes(hash)) {
        if (hash === 'admin-dashboard' && !isAdminAuthenticated) {
          setCurrentView('admin-login');
        } else {
          setCurrentView(hash);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Trigger on initial load
    handleHashChange();
    
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
    <div className="min-h-screen flex flex-col transition-all duration-300 antialiased">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/60 px-6 py-4 flex justify-between items-center shadow-sm">
        <div 
          className="flex items-center space-x-3 cursor-pointer group" 
          onClick={() => navigateTo('intro')}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="text-xl font-black text-gray-900 tracking-tight">CloudSubmit</span>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-4">
          <button 
            onClick={() => navigateTo('form')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${currentView === 'form' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            Submit Form
          </button>
          <button 
            onClick={() => navigateTo(isAdminAuthenticated ? 'admin-dashboard' : 'admin-login')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${currentView.includes('admin') ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            Admin Panel
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
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
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 text-center">
        <div className="flex justify-center space-x-2 items-center mb-2">
           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
           <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Global Sync Status: Operational</span>
        </div>
        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} CloudSubmit Pro. Protected Cloud Architecture.</p>
      </footer>
    </div>
  );
};

export default App;
