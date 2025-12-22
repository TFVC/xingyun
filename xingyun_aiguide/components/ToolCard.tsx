
import React from 'react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <a 
      href={tool.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl p-5 border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 group-hover:scale-110 transition-transform duration-300">
          <img src={tool.icon} alt={tool.name} className="w-8 h-8 object-contain" />
        </div>
        <span className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
          {tool.tag}
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
        {tool.name}
      </h3>
      
      <p className="text-sm text-slate-500 leading-relaxed flex-grow">
        {tool.description}
      </p>
      
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {tool.roles.map((role, idx) => (
            <div 
              key={idx}
              className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-[10px] font-medium border border-indigo-100"
            >
              {role}
            </div>
          ))}
        </div>
        <div className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </a>
  );
};

export default ToolCard;
