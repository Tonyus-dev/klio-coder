import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Zap,
  Eye,
  Terminal,
  GitBranch,
  Database,
  Code,
  Settings,
  Menu,
  X
} from 'lucide-react';

import KlioChat from './components/KlioChat';
import PromptForgePanel from './components/PromptForgePanel';
import ReviewPanel from './components/ReviewPanel';
import DebugPanel from './components/DebugPanel';
import DecisionPanel from './components/DecisionPanel';
import TechnicalMemoryPanel from './components/TechnicalMemoryPanel';
import AppBuilderPanel from './components/AppBuilderPanel';
import SettingsPanel from './components/SettingsPanel';
import InstallPrompt from './components/InstallPrompt';

type TabType = 'klio' | 'promptforge' | 'review' | 'debug' | 'decision' | 'tech_memory' | 'app_builder' | 'settings';

export default function KlioDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('klio');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleNavigate = (e: any) => setActiveTab(e.detail);
    window.addEventListener('navigateTab', handleNavigate);

    return () => {
      window.removeEventListener('navigateTab', handleNavigate);
    };
  }, []);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchEndY(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX || !touchStartY || !touchEndY) return;
    
    const distanceX = touchStartX - touchEndX;
    const distanceY = touchStartY - touchEndY;
    
    // Check if the swipe is mostly horizontal
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
      const isLeftSwipe = distanceX > minSwipeDistance;
      const isRightSwipe = distanceX < -minSwipeDistance;

      if (isLeftSwipe) {
        // Implement swipe logic if needed
      }
      if (isRightSwipe) {
        // Implement swipe logic if needed
      }
    }
  };

  const tabs = [
    { id: 'klio', label: 'Klio Chat', icon: MessageSquare, category: 'Core' },
    { id: 'promptforge', label: 'PromptForge', icon: Zap, category: 'Core' },
    { id: 'review', label: 'Review', icon: Eye, category: 'Ferramentas' },
    { id: 'debug', label: 'Debug', icon: Terminal, category: 'Ferramentas' },
    { id: 'decision', label: 'Decisão', icon: GitBranch, category: 'Arquitetura' },
    { id: 'tech_memory', label: 'Memória Técnica', icon: Database, category: 'Arquitetura' },
    { id: 'app_builder', label: 'App Builder', icon: Code, category: 'Forja' },
    { id: 'settings', label: 'Configurações', icon: Settings, category: 'Sistema' },
  ] as const;

  return (
    <div className={`app-bg flex flex-col font-sans select-none antialiased text-[#F7EFE7] ${activeTab === 'klio' ? 'h-[100dvh] overflow-hidden' : 'min-h-[100dvh]'}`} id="main-app-container"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}>
      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 bg-[#06070A]/72 backdrop-blur-xl border-b border-[#FF4C1F]/18 px-4 py-2 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Mobile hamburger menu button */}
          <button 
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="lg:hidden p-1.5 rounded-xl bg-[#10131A] text-[#A89F96] hover:text-[#FF4C1F] border border-[#252936] transition-colors"
            title="Menu de Navegação"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4.5 h-4.5" />}
          </button>

          <div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden">
            <img 
              src="/brand/klio-apple.png" 
              alt="Maçã Klio" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.parentElement) e.currentTarget.parentElement.innerHTML = '🜂';
              }} 
            />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-widest uppercase text-[#F7EFE7] flex items-center gap-1.5 font-serif">
              KLIO 
            </h1>
            <p className="text-[8px] text-[#A89F96] font-bold uppercase tracking-widest hidden sm:block">MVP Técnico Privado</p>
          </div>
        </div>
      </header>

      {/* Main Content Layout with Sidebar for Desktop / Scroll Area for Mobile */}
      <div className={`grow min-h-0 flex flex-col lg:flex-row max-w-7xl w-full mx-auto px-4 relative ${activeTab === 'klio' ? 'py-3 gap-3' : 'py-6 gap-6'}`}>
        
        {/* Mobile Sidebar Overlay Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Dynamic Sidebar Navigation Panel */}
        <aside className={`fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto w-64 bg-[#06070A] lg:bg-[#0B0D12]/80 backdrop-blur-md border-r lg:border border-[#252936] p-4 flex flex-col gap-4 transition-transform duration-300 h-full lg:h-fit shrink-0 shadow-2xl lg:rounded-2xl lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex justify-between items-center lg:block pb-2 lg:pb-0">
            <div>
              <h2 className="text-lg font-bold tracking-tight font-serif text-[#F7EFE7]">KLIO</h2>
              <p className="text-[9px] text-[#A89F96] font-bold uppercase tracking-widest mt-0.5">PromptForge Station</p>
            </div>
            {/* Mobile Close Button */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-[#10131A] text-[#A89F96] hover:text-[#FF4C1F] border border-[#252936] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto no-scrollbar max-h-[75vh]">
            {['Core', 'Ferramentas', 'Arquitetura', 'Forja', 'Sistema'].map(category => {
              const categoryTabs = tabs.filter(t => t.category === category);
              if (categoryTabs.length === 0) return null;
              
              return (
                <div key={category} className="space-y-1">
                  <h4 className="text-[9px] font-black text-[#A89F96] uppercase tracking-wider pl-2 pb-1 border-b border-[#252936]/40">{category}</h4>
                  <div className="space-y-0.5 pt-1">
                    {categoryTabs.map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id as TabType);
                            setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isActive 
                              ? 'bg-[#FF4C1F]/10 text-[#F7EFE7] border border-[#FF4C1F]/25 shadow-[inset_3px_0_0_#FF4C1F]' 
                              : 'text-[#A89F96] hover:text-[#F7EFE7] hover:bg-[#10131A] border border-transparent'
                          }`}
                          id={`sidebar-tab-${tab.id}`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF4C1F]' : 'text-[#A89F96]/70'}`} />
                          <span className="font-mono text-[11px] font-bold">├─ {tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center Main Content Area */}
        <main className={`grow max-w-4xl w-full mx-auto flex flex-col min-w-0 ${activeTab === 'klio' ? 'min-h-0 overflow-y-auto no-scrollbar pb-0 pt-0' : 'pb-20 lg:pb-10'}`}>
          {activeTab === 'klio' && <KlioChat />}
          {activeTab === 'promptforge' && <PromptForgePanel />}
          {activeTab === 'review' && <ReviewPanel />}
          {activeTab === 'debug' && <DebugPanel />}
          {activeTab === 'decision' && <DecisionPanel />}
          {activeTab === 'tech_memory' && <TechnicalMemoryPanel />}
          {activeTab === 'app_builder' && <AppBuilderPanel />}
          {activeTab === 'settings' && <SettingsPanel />}
        </main>
      </div>

      {/* PWA Intelligent Installation Prompt */}
      <InstallPrompt />
    </div>
  );
}
