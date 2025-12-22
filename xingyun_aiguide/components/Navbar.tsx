
import React from 'react';

interface NavbarProps {
  isActivated: boolean;
  onOpenModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isActivated, onOpenModal }) => {
  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-[#1a1f2e] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 4v6h-6" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 tracking-tight leading-none">AI修仙进化论</span>
              <div className="flex items-center text-xs text-slate-400 mt-1">
                <span>By</span>
                <a 
                  href="https://DMDII.TOP" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 text-[#10b981] font-semibold hover:underline flex items-center"
                >
                  DMDII.TOP
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* 
              会员功能入口 - 目前已隐藏
              如需开启，请将下面的 false 改为 true，或者直接移除该判断条件
            */}
            {false && (isActivated ? (
              <div className="flex items-center px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                会员已激活
              </div>
            ) : (
              <button 
                onClick={onOpenModal}
                className="flex items-center px-4 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all duration-200 text-sm font-medium shadow-md"
              >
                激活会员
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
