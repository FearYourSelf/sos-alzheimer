import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

interface NotificationContextType {
  showNotification: (message: string, type?: 'success' | 'info') => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info'; visible: boolean } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type, visible: true });
    
    // Auto hide after 3 seconds
    setTimeout(() => {
      setNotification(prev => prev ? { ...prev, visible: false } : null);
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Toast Component */}
      <div 
        className={`fixed bottom-6 right-4 z-[60] transition-all duration-500 ease-in-out transform ${
          notification?.visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        {notification && (
          <div className="bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 font-bold text-sm border border-slate-700 dark:border-slate-200">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-400 dark:text-green-600" />
            ) : (
              <Info className="w-5 h-5 text-blue-400 dark:text-blue-600" />
            )}
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(prev => prev ? { ...prev, visible: false } : null)}
              className="ml-2 opacity-70 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </NotificationContext.Provider>
  );
};