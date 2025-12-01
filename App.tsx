
import React, { useState, useEffect } from 'react';
import { TabId } from './types';
import ProtocolTab from './components/ProtocolTab';
import DirectoryTab from './components/DirectoryTab';
import LegalTab from './components/LegalTab';
import StrategyTab from './components/StrategyTab';
import AITab from './components/AITab';
import PatientTab from './components/PatientTab';
import DiaryTab from './components/DiaryTab';
import { Moon, Sun, Phone, Heart } from 'lucide-react';
import { NotificationProvider } from './context/NotificationContext';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('protocol');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <NotificationProvider>
      <div className="min-h-screen flex flex-col font-sans bg-[#fdfbf7] dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300 pb-12">
        
        {/* Header - Pulsing only strictly on icon, less aggressive */}
        <header className="bg-red-800 text-white p-3 sticky top-0 z-50 shadow-xl flex justify-between items-center backdrop-blur-md bg-opacity-95 print:hidden">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <Heart className="w-6 h-6 fill-current animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">SOS Vovó</h1>
              <p className="text-[10px] opacity-80 uppercase tracking-wider hidden md:block">AJUDA E CUIDADOS COM A VÓ</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition text-sm" 
              title="Alternar Modo Escuro"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a 
              href="tel:192" 
              className="bg-white text-red-800 font-extrabold py-2 px-4 rounded-lg shadow hover:bg-red-50 transition text-sm flex items-center gap-2"
            >
              <Phone className="w-4 h-4" /> <span className="hidden md:inline">SAMU 192</span>
            </a>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 flex-grow max-w-6xl print:max-w-none print:p-0">
          
          {/* Navigation - Responsive Flex for more tabs */}
          <nav className="flex flex-wrap md:flex-nowrap gap-2 mb-6 bg-gray-100 dark:bg-slate-800 p-1.5 rounded-xl shadow-inner overflow-x-auto print:hidden">
            <TabButton 
              id="protocol" 
              label="1. Protocolo" 
              active={activeTab === 'protocol'} 
              onClick={() => setActiveTab('protocol')} 
            />
            <TabButton 
              id="patient" 
              label="2. Paciente" 
              active={activeTab === 'patient'} 
              onClick={() => setActiveTab('patient')} 
            />
             <TabButton 
              id="diary" 
              label="3. Diário" 
              active={activeTab === 'diary'} 
              onClick={() => setActiveTab('diary')} 
            />
            <TabButton 
              id="directory" 
              label="4. Contatos" 
              active={activeTab === 'directory'} 
              onClick={() => setActiveTab('directory')} 
            />
            <TabButton 
              id="legal" 
              label="5. Jurídico" 
              active={activeTab === 'legal'} 
              onClick={() => setActiveTab('legal')} 
            />
            <TabButton 
              id="strategy" 
              label="6. Custos" 
              active={activeTab === 'strategy'} 
              onClick={() => setActiveTab('strategy')} 
            />
            <TabButton 
              id="ai" 
              label="✨ IA" 
              active={activeTab === 'ai'} 
              onClick={() => setActiveTab('ai')} 
              isAi
            />
          </nav>

          {/* Content Area */}
          <div className="min-h-[400px]">
            {activeTab === 'protocol' && <ProtocolTab />}
            {activeTab === 'patient' && <PatientTab />}
            {activeTab === 'diary' && <DiaryTab />}
            {activeTab === 'directory' && <DirectoryTab />}
            {activeTab === 'legal' && <LegalTab />}
            {activeTab === 'strategy' && <StrategyTab />}
            {activeTab === 'ai' && <AITab />}
          </div>

        </main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 w-full p-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-slate-800 text-center text-xs text-gray-500 dark:text-gray-400 flex justify-center items-center gap-1.5 z-50 print:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
           <span>Com amor, do Igor pra Vovó</span>
           <Heart className="w-3 h-3 text-red-500 fill-current animate-pulse" />
           <span className="opacity-50 mx-1">|</span>
           <span>Powered by</span>
           <a href="https://fearyour.life/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">
             NSD-CORE/70B
           </a>
        </footer>
      </div>
    </NotificationProvider>
  );
};

interface TabButtonProps {
  id: string;
  label: string;
  active: boolean;
  onClick: () => void;
  isAi?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ label, active, onClick, isAi }) => {
  const baseClasses = "relative px-3 py-2.5 rounded-lg font-semibold text-xs md:text-sm transition-all duration-300 flex-grow md:flex-grow-0 flex items-center justify-center gap-2 whitespace-nowrap";
  
  const activeClasses = isAi 
    ? "bg-purple-600 text-white shadow-md ring-1 ring-purple-500" 
    : "bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-md ring-1 ring-black/5 dark:ring-white/10";
  
  const inactiveClasses = "text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-slate-700/50";

  return (
    <button 
      onClick={onClick} 
      className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    >
      <span className="relative z-10">{label}</span>
      {active && !isAi && (
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-t-full"></span>
      )}
    </button>
  );
};

export default App;
