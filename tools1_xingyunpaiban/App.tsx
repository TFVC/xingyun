
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Copy, Sparkles, Layout, Type as TypeIcon, MessageSquare, ChevronRight, Wand2, Terminal, Palette, BookOpen, Coffee, Rocket, PenTool, Newspaper, Zap, AlignLeft, RefreshCw, ExternalLink, MousePointer2, ShieldCheck, Crown, Lock, Globe, FileText, Upload, Loader2 } from 'lucide-react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import PromptModal from './components/PromptModal';
import ActivationModal from './components/ActivationModal';
import { THEMES, INITIAL_CONTENT, DEFAULT_LEAD_IN, DEFAULT_OUTRO, LEAD_IN_TEMPLATES, OUTRO_TEMPLATES } from './constants';
import { Theme, GuideStyleId } from './types';
import mammoth from 'mammoth';

const getThemeIcon = (id: string) => {
  if (id.includes('cyber') || id.includes('neon')) return <Terminal className="w-4 h-4" />;
  if (id.includes('red') || id.includes('luxury')) return <Palette className="w-4 h-4" />;
  if (id.includes('magazine') || id.includes('rocket')) return <Rocket className="w-4 h-4" />;
  if (id.includes('paper') || id.includes('retro')) return <Newspaper className="w-4 h-4" />;
  if (id.includes('emerald') || id.includes('zen')) return <PenTool className="w-4 h-4" />;
  return <Layout className="w-4 h-4" />;
};

const App: React.FC = () => {
  const [content, setContent] = useState(INITIAL_CONTENT);
  const [leadIn, setLeadIn] = useState(DEFAULT_LEAD_IN);
  const [outro, setOutro] = useState(DEFAULT_OUTRO);
  const [leadInStyle, setLeadInStyle] = useState<GuideStyleId>('simple');
  const [outroStyle, setOutroStyle] = useState<GuideStyleId>('simple');
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('sn_activated_v3');
    if (saved === 'true') setIsActivated(true);
  }, []);

  const handleCopy = useCallback(async () => {
    const container = document.getElementById('wechat-copy-final-target');
    if (!container) return;
    try {
      const html = container.outerHTML;
      const type = 'text/html';
      const blob = new Blob([html], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      await navigator.clipboard.write(data);
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      const range = document.createRange();
      range.selectNode(container);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');
      window.getSelection()?.removeAllRanges();
      setCopyStatus('success');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  }, []);

  const handleOpenDeepSeek = () => {
    window.open('https://chat.deepseek.com', '_blank');
  };

  const onActivate = () => {
    setIsActivated(true);
    localStorage.setItem('sn_activated_v3', 'true');
  };

  const handleWordUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!isActivated) {
      setIsActivationModalOpen(true);
      event.target.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result.value) {
        setContent(result.value);
      }
    } catch (error) {
      console.error('Word Parsing Error:', error);
      alert('解析 Word 文档失败，请确保文件格式正确。');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="h-screen flex flex-col font-sans selection:bg-emerald-100 overflow-hidden">
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50 shrink-0">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-2.5 rounded-2xl shadow-xl shadow-slate-200">
              <RefreshCw className="text-white w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 leading-none tracking-tight">星云排版</h1>
                {isActivated && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full border border-amber-200">
                    <Crown className="w-2.5 h-2.5" /> VIP
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">
                By <a href="http://DMDII.TOP" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline inline-flex items-center gap-0.5">DMDII.TOP <ExternalLink className="w-2.5 h-2.5" /></a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isActivated ? (
              <button onClick={() => setIsActivationModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all">
                <ShieldCheck className="w-4 h-4" /> 会员激活
              </button>
            ) : (
              <div className="px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm border border-emerald-100 flex items-center gap-2">
                <Globe className="w-4 h-4" /> 会员状态：已激活
              </div>
            )}
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-3 px-10 py-3 rounded-2xl font-black transition-all shadow-2xl active:scale-95 ${
                copyStatus === 'success' 
                ? 'bg-emerald-500 text-white scale-105 shadow-emerald-100' 
                : 'bg-slate-900 hover:bg-black text-white'
              }`}
            >
              {copyStatus === 'success' ? '已复制 (含完整背景色)' : <><Copy className="w-4 h-4" /><span>一键复制全文</span></>}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Themes */}
        <aside className="w-80 border-r border-slate-200 bg-white p-6 flex flex-col overflow-y-auto shrink-0 scrollbar-thin scrollbar-thumb-slate-200">
          <div className="flex items-center gap-2 mb-4 text-slate-400">
            <TypeIcon className="w-4 h-4" />
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">精选视觉模板</h3>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => setCurrentTheme(theme)}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between group relative overflow-hidden ${
                  currentTheme.id === theme.id 
                  ? 'border-slate-900 bg-slate-50' 
                  : 'border-slate-50 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4 z-10">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-inner transition-transform group-hover:scale-110" style={{ backgroundColor: theme.primaryColor }}>
                    {getThemeIcon(theme.id)}
                  </div>
                  <div className="text-left">
                    <span className={`text-sm font-black block ${currentTheme.id === theme.id ? 'text-slate-900' : 'text-slate-600'}`}>
                      {theme.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{theme.headerLayout}</span>
                  </div>
                </div>
                {currentTheme.id === theme.id && <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mr-1" />}
              </button>
            ))}
          </div>
        </aside>

        {/* Center Section */}
        <section className="flex-1 p-6 flex flex-col gap-6 overflow-hidden bg-slate-50">
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <PenTool className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-wider">编辑区</span>
              </div>
              <div className="flex gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleWordUpload} 
                  accept=".doc,.docx" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
                    isActivated 
                    ? 'bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50' 
                    : 'bg-white text-slate-400 border border-slate-100'
                  }`}
                >
                  {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  导入 Word
                  {!isActivated && <Crown className="w-3 h-3 text-amber-400" />}
                </button>
              </div>
            </div>
            <Editor value={content} onChange={setContent} />
          </div>
          
          <div className="grid grid-cols-2 gap-4 h-44 shrink-0">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2 relative">
               <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2"><AlignLeft className="w-3 h-3"/>文前引导 (样式)</div>
                  <div className="flex gap-1 overflow-x-auto no-scrollbar max-w-[200px]">
                    {LEAD_IN_TEMPLATES.map(t => (
                      <button 
                        key={t.id} 
                        onClick={() => t.isPremium && !isActivated ? setIsActivationModalOpen(true) : setLeadInStyle(t.styleId)}
                        className={`px-2 py-1 rounded text-[9px] shrink-0 border transition-all ${leadInStyle === t.styleId ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'}`}
                      >
                        {t.isPremium && !isActivated ? <Lock className="w-2 h-2 inline mr-1"/> : ''}{t.name}
                      </button>
                    ))}
                  </div>
               </div>
               <textarea value={leadIn} onChange={(e)=>setLeadIn(e.target.value)} className="flex-1 text-xs p-2 bg-slate-50 rounded-xl resize-none outline-none focus:ring-1 ring-slate-200" placeholder="文前文案..." />
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2 relative">
               <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2"><AlignLeft className="w-3 h-3"/>文末引导 (样式)</div>
                  <div className="flex gap-1 overflow-x-auto no-scrollbar max-w-[200px]">
                    {OUTRO_TEMPLATES.map(t => (
                      <button 
                        key={t.id} 
                        onClick={() => t.isPremium && !isActivated ? setIsActivationModalOpen(true) : setOutroStyle(t.styleId)}
                        className={`px-2 py-1 rounded text-[9px] shrink-0 border transition-all ${outroStyle === t.styleId ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'}`}
                      >
                        {t.isPremium && !isActivated ? <Lock className="w-2 h-2 inline mr-1"/> : ''}{t.name}
                      </button>
                    ))}
                  </div>
               </div>
               <textarea value={outro} onChange={(e)=>setOutro(e.target.value)} className="flex-1 text-xs p-2 bg-slate-50 rounded-xl resize-none outline-none focus:ring-1 ring-slate-200" placeholder="文末文案..." />
            </div>
          </div>
        </section>

        {/* Right Section */}
        <aside className="w-[500px] border-l border-slate-200 bg-white p-6 flex flex-col gap-5 overflow-hidden shrink-0">
           <section className="space-y-3 shrink-0">
             <div className="flex gap-2.5">
                <button 
                  onClick={handleOpenDeepSeek}
                  className="flex-1 flex items-center gap-3 p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition-all group shadow-lg shadow-slate-200"
                >
                  <Wand2 className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform shrink-0" />
                  <div className="text-left">
                    <span className="text-xs font-black block leading-none">智能润色</span>
                    <span className="text-[9px] text-slate-400 uppercase mt-1 inline-block">DeepSeek</span>
                  </div>
                </button>
                <button 
                  onClick={() => setIsPromptModalOpen(true)}
                  className="flex-1 flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all group bg-white shadow-sm"
                >
                  <MousePointer2 className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform shrink-0" />
                  <div className="text-left">
                    <span className="text-xs font-black block leading-none text-slate-800">复制提示词</span>
                    <span className="text-[9px] text-slate-400 uppercase mt-1 inline-block">8大方案</span>
                  </div>
                </button>
             </div>
           </section>

           <div className="flex-1 min-h-0 overflow-hidden">
             <Preview 
                content={content} 
                leadIn={leadIn} 
                outro={outro} 
                leadInStyle={leadInStyle}
                outroStyle={outroStyle}
                theme={currentTheme} 
              />
           </div>
        </aside>
      </main>

      <PromptModal isOpen={isPromptModalOpen} onClose={() => setIsPromptModalOpen(false)} articleContent={content} />
      <ActivationModal isOpen={isActivationModalOpen} onClose={() => setIsActivationModalOpen(false)} onActivate={onActivate} />
    </div>
  );
};

export default App;
