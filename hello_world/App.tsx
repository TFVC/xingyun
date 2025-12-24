
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
      { id: Date.now() + 1, type: 'system', content: 'CALORIES V2.0.0 - 与AI同行 (STATIC MODE)', timestamp: new Date().toLocaleTimeString() },
      { id: Date.now() + 2, type: 'system', content: '在一次高负荷运行中，系统出现了异常，导致时不时出现非预期结果。没人知道问题出在了哪里，而我们对系统的依赖，又不得不让系统继续运转下去。在与“新系统”磨合的过程中，人们总结了一套新的操作方法', timestamp: new Date().toLocaleTimeString() },
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
      <div className="flex-1 bg-blue-100 border border-blue-300 rounded-lg shadow-2xl shadow-blue-200/20 flex flex-col overflow-hidden">

        {/* Terminal Header */}
        <div className="bg-blue-100 px-4 py-2 flex items-center justify-between border-b border-blue-200/30">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-400/50"></div>
            <div className="w-3 h-3 rounded-full bg-blue-300/50"></div>
            <div className="w-3 h-3 rounded-full bg-blue-200/50"></div>
          </div>
          <div className="text-xs text-blue-700/70 font-bold tracking-widest uppercase">Calories Terminal</div>
          <button 
            onClick={clearTerminal}
            className="text-[10px] text-blue-900 hover:text-blue-500 transition-colors border border-blue-900 px-2 py-0.5 rounded"
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
                    /* 
                       改进点：
                       1. 使用 text-[1.4vw] 确保 66 个字符能塞进 100vw (100/66 ≈ 1.5)
                       2. 强制 whitespace-pre 杜绝自动换行
                       3. 使用 font-mono 确保等宽
                    */
                    <pre 
                      className="text-[1.35vw] sm:text-[1.2vw] md:text-[8px] lg:text-[10px] text-blue-600 leading-[1.1] whitespace-pre overflow-hidden select-none font-mono tracking-tighter sm:tracking-normal"
                      style={{ fontVariantLigatures: 'none' }}
                    >
                      {line.content}
                    </pre>
                  ) : (
                    <pre className="text-[10px] md:text-xs text-blue-600/80 whitespace-pre-wrap leading-tight font-mono">
                      {line.content}
                    </pre>
                  )}
                </div>
              )}
              {line.type === 'input' && (
                <div className="flex items-start space-x-2 font-mono">
                  <span className="text-blue-500 font-bold">$</span>
                  <span className="text-blue-400 text-sm md:text-base">{line.content.replace('> ', '')}</span>
                </div>
              )}
              {line.type === 'output' && (
                <div className="bg-blue-100/10 border-l-2 border-blue-500 p-3 my-2 text-blue-700 text-sm md:text-base italic leading-relaxed font-mono">
                  {line.content}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center space-x-2 text-green-500 px-1">
              <span className="w-2 h-5 bg-blue-500 cursor-blink"></span>
            </div>
          )}
        </div>

        {/* Options Grid */}
        <div className="p-4 bg-blue-50 border-t border-blue-300">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {DIFFICULTIES.map((item) => (
              <button
                key={item.id}
                onClick={() => handleDifficultyClick(item)}
                disabled={isTyping}
                className={`
                  text-left px-3 py-2 border border-blue-200/40 rounded 
                  text-xs hover:bg-blue-500/10 hover:border-blue-500/60
                  transition-all duration-200 group relative overflow-hidden font-mono
                  ${isTyping ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
                `}
              >
                <span className="text-blue-700 mr-1 group-hover:text-blue-400">#</span>
                <span className="text-blue-500/80 group-hover:text-blue-300">{item.label}</span>
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Command Line Input Simulation */}
        <div className="p-3 bg-gradient-to-r from-blue-50/80 via-white/20 to-blue-50/80 flex items-center space-x-2 text-sm font-mono">
          <span className="text-blue-500 font-bold">user@calories:~$</span>
          <div className="flex-1 flex items-center">
             <span className="text-blue-400/50 italic mr-2 text-xs md:text-sm">
               {isTyping ? "executing..." : "waiting for input..."}
             </span>
             {!isTyping && <span className="w-2 h-5 bg-blue-500 cursor-blink"></span>}
          </div>
        </div>
      </div>

      <footer className="mt-4 text-[10px] text-blue-700/50 flex flex-col md:flex-row justify-between items-center uppercase tracking-widest gap-2 font-mono">
        <div>STATUS: LOCAL_CORE // RESPONSIVE: ENABLED</div>
        <div>&copy; 2024 CALORIES - 极简主义能量站</div>
      </footer>
    </div>
  );
};

export default App;
