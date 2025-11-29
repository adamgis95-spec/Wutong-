
import React, { useState, useEffect } from 'react';
import { DailyView } from './components/DailyView';
import { StatsView } from './components/StatsView';
import { ReviewView } from './components/ReviewView';
import { AboutView } from './components/AboutView';
import { seedDataIfEmpty } from './services/storage';

type Tab = 'daily' | 'stats' | 'review' | 'about';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('daily');

  useEffect(() => {
    seedDataIfEmpty();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'daily': return <DailyView />;
      case 'stats': return <StatsView />;
      case 'review': return <ReviewView />;
      case 'about': return <AboutView />;
      default: return <DailyView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-indigo-100">
      
      {/* Top Header & Navigation */}
      <header className="bg-white sticky top-0 z-30 border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
            {/* Logo Area */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('about')}>
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                    L
                </div>
                <h1 className="text-lg font-bold tracking-tight text-gray-900 hidden sm:block">Loop 助手</h1>
            </div>

            {/* Desktop & Mobile Tab Navigation */}
            <nav className="flex items-center bg-gray-100/50 p-1 rounded-xl">
                <button 
                    onClick={() => setActiveTab('daily')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'daily' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    记录
                </button>
                <button 
                    onClick={() => setActiveTab('stats')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'stats' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    统计
                </button>
                <button 
                    onClick={() => setActiveTab('review')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'review' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    复盘
                </button>
                <button 
                    onClick={() => setActiveTab('about')}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'about' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    关于
                </button>
            </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-4 md:p-8 w-full">
        {renderContent()}
      </main>

    </div>
  );
};

export default App;
