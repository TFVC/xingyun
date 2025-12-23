
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DIFFICULTIES, SYSTEM_ASCII } from './constants';
import { TerminalLine, Difficulty } from './types';

const App: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    const welcomeLines: TerminalLine[] = [
      { id: Date.now(), type: 'system', content: SYSTEM_ASCII, timestamp: new Date().toLocaleTimeString() },
      { id: Date.now() + 1, type: 'system', content: 'CALORIES V1.0.0 - 人生能量补充终端 (STATIC MODE)', timestamp: new Date().toLocaleTimeString() },
      { id: Date.now() + 2, type: 'system', content: '系统就绪。请选择需要处理的困难模块：', timestamp: new Date().toLocaleTimeString() },
    ];
    setLines(welcomeLines);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const addLine = useCallback((type: 'input' | 'output' | 'system', content: string) => {
    setLines(prev => [...prev, {
      id: Date.now(),
      type,
      content,
      timestamp: new Date().toLocaleTimeString()
    }]);
  }, []);

  const handleDifficultyClick = async (item: Difficulty) => {
    if (isTyping) return;

    addLine('input', `> ${item.command}`);
    setIsTyping(true);

    const thinkingId = Date.now() + Math.random();
    setLines(prev => [...prev, { id: thinkingId, type: 'system', content: '正在检索核心能量数据库...', timestamp: new Date().toLocaleTimeString() }]);
    
    await new Promise(r => setTimeout(r, 600));

    setLines(prev => prev.filter(l => l.id !== thinkingId));
    
    const textToType = `[RESULT]: ${item.localResponse}`;
    
    for (let i = 0; i <= textToType.length; i++) {
      await new Promise(r => setTimeout(r, 15));
      const partialText = textToType.slice(0, i);
      setLines(prev => {
        const lastLine = prev[prev.length - 1];
        if (lastLine && lastLine.type === 'output') {
           const newLines = [...prev];
           newLines[newLines.length - 1] = { ...lastLine, content: partialText };
           return newLines;
        } else {
           return [...prev, { id: Date.now(), type: 'output', content: partialText, timestamp: new Date().toLocaleTimeString() }];
        }
      });
    }
    setIsTyping(false);
  };

  const clearTerminal = () => {
    setLines([{ id: Date.now(), type: 'system', content: 'Terminal Cleared. System Standby.', timestamp: new Date().toLocaleTimeString() }]);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col max-w-5xl mx-auto relative z-10">
      <div className="flex-1 bg-black/80 border border-green-900/50 rounded-lg shadow-2xl shadow-green-900/20 flex flex-col overflow-hidden backdrop-blur-sm">
        
        {/* Terminal Header */}
        <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-green-900/30">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
          <div className="text-xs text-green-700/70 font-bold tracking-widest">CALORIES-STATIC@CORE</div>
          <button 
            onClick={clearTerminal}
            className="text-[10px] text-green-900 hover:text-green-500 transition-colors border border-green-900 px-2 py-0.5 rounded"
          >
            CLEAR
          </button>
        </div>

        {/* Scrollable Output Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {lines.map((line) => (
            <div key={line.id} className="animate-in fade-in duration-300">
              {line.type === 'system' && (
                <div className="mb-2">
                  {line.content === SYSTEM_ASCII ? (
                    /* Special handling for ASCII Logo: responsive font size and no wrapping */
                    <pre className="text-[1.8vw] md:text-[10px] lg:text-[12px] text-green-500 leading-none whitespace-pre overflow-x-hidden select-none">
                      {line.content}
                    </pre>
                  ) : (
                    <pre className="text-[10px] md:text-xs text-green-600/80 whitespace-pre-wrap leading-tight">
                      {line.content}
                    </pre>
                  )}
                </div>
              )}
              {line.type === 'input' && (
                <div className="flex items-start space-x-2">
                  <span className="text-green-500 font-bold">$</span>
                  <span className="text-green-400 text-sm md:text-base">{line.content.replace('> ', '')}</span>
                </div>
              )}
              {line.type === 'output' && (
                <div className="bg-green-900/10 border-l-2 border-green-500 p-3 my-2 text-green-300 text-sm md:text-base italic leading-relaxed">
                  {line.content}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center space-x-2 text-green-500 px-1">
              <span className="w-2 h-5 bg-green-500 cursor-blink"></span>
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div className="p-4 bg-zinc-950/50 border-t border-green-900/30">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {DIFFICULTIES.map((item) => (
              <button
                key={item.id}
                onClick={() => handleDifficultyClick(item)}
                disabled={isTyping}
                className={`
                  text-left px-3 py-2 border border-green-900/40 rounded 
                  text-xs hover:bg-green-500/10 hover:border-green-500/60
                  transition-all duration-200 group relative overflow-hidden
                  ${isTyping ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
                `}
              >
                <span className="text-green-700 mr-1 group-hover:text-green-400">#</span>
                <span className="text-green-500/80 group-hover:text-green-300">{item.label}</span>
                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Command Line Input Simulation */}
        <div className="p-3 bg-black flex items-center space-x-2 text-sm">
          <span className="text-green-500 font-bold">calories@user:~$</span>
          <div className="flex-1 flex items-center">
             <span className="text-green-400/50 italic mr-2">
               {isTyping ? "executing..." : "waiting for input..."}
             </span>
             {!isTyping && <span className="w-2 h-5 bg-green-500 cursor-blink"></span>}
          </div>
        </div>
      </div>

      <footer className="mt-4 text-[10px] text-green-900/50 flex flex-col md:flex-row justify-between items-center uppercase tracking-widest gap-2">
        <div>STATUS: LOCAL_ONLY // MODE: STATIC // SPEED: ULTRA_FAST</div>
        <div>&copy; 2024 CALORIES - 极简主义人生补给站</div>
      </footer>
    </div>
  );
};

export default App;
