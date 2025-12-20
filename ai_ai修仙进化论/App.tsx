
import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import ToolCard from './components/ToolCard';
import ActivationModal from './components/ActivationModal';
import { Role } from './types';
import { TOOLS_DATA } from './constants';

const App: React.FC = () => {
  const [isActivated, setIsActivated] = useState<boolean>(() => {
    return localStorage.getItem('ai_cultivation_activated') === 'true';
  });
  const [activeRole, setActiveRole] = useState<Role | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = useMemo(() => {
    return TOOLS_DATA.filter(tool => {
      const roleMatch = activeRole === 'all' || tool.roles.includes(activeRole);
      const searchMatch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase());
      return roleMatch && searchMatch;
    });
  }, [activeRole, searchTerm]);

  const handleActivate = (code: string) => {
    setIsActivated(true);
    localStorage.setItem('ai_cultivation_activated', 'true');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar isActivated={isActivated} onOpenModal={() => setIsModalOpen(true)} />

      <header className="relative py-6 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
            提升工程能力，步入<span className="text-indigo-600">AI修仙</span>之旅
          </h1>
          <p className="max-w-2xl mx-auto text-base text-slate-500 mb-6 leading-relaxed">
            汇聚实用工具，助力从科研到产业应用的关键职业
          </p>

          <div className="max-w-xl mx-auto relative">
            <input 
              type="text" 
              placeholder="搜索实用工具..."
              className="block w-full px-6 py-3 rounded-2xl border-none bg-white shadow-xl shadow-slate-200 focus:ring-2 focus:ring-slate-900 transition-all outline-none text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* 动态分类导航条：只要增加 Role 枚举，这里就会自动增加按钮 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sticky top-16 z-40 bg-slate-50/80 backdrop-blur-md py-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button 
            onClick={() => setActiveRole('all')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeRole === 'all' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
          >
            全部工具
          </button>
          {Object.values(Role).map((role) => (
            <button 
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeRole === role ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 flex-grow">
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-medium">未能寻得匹配的工具</p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700">AI修仙进化论 2025</span>
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="https://DMDII.TOP" target="_blank" className="hover:text-indigo-600 transition-colors">DMDII.TOP</a>
            <span className="flex items-center">构建美好 AI 世界</span>
          </div>
        </div>
      </footer>

      <ActivationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onActivate={handleActivate} 
      />
    </div>
  );
};

export default App;
