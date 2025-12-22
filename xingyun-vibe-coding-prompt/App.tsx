
import React, { useState, useEffect, useCallback } from 'react';
import { VibeFormData } from './types';
import { DEFAULT_FORM_DATA, REQUIREMENT_OPTIONS, UI_STRINGS } from './constants';
import { generateVibePrompt } from './utils/promptGenerator';
import Notification from './components/Notification';

const App: React.FC = () => {
  const [formData, setFormData] = useState<VibeFormData>(DEFAULT_FORM_DATA);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string>('');

  const lang = formData.language;
  const t = UI_STRINGS[lang];

  const updatePrompt = useCallback(() => {
    setGeneratedPrompt(generateVibePrompt(formData));
  }, [formData]);

  useEffect(() => {
    updatePrompt();
  }, [updatePrompt]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleMembershipChange = (val: boolean) => {
    setFormData(prev => ({ ...prev, hasMembership: val }));
  };

  const handleColorToneChange = (val: 'dark' | 'light') => {
    setFormData(prev => ({ ...prev, colorTone: val }));
  };

  const toggleLanguage = () => {
    setFormData(prev => ({ ...prev, language: prev.language === 'zh' ? 'en' : 'zh' }));
  };

  const toggleRequirement = (id: string) => {
    setFormData(prev => {
      const list = [...prev.requirements];
      const index = list.indexOf(id);
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(id);
      }
      return { ...prev, requirements: list };
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setNotificationMsg(t.copySuccess);
      setShowNotification(true);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleReset = () => {
    if (window.confirm(t.resetConfirm)) {
      setFormData(DEFAULT_FORM_DATA);
      setNotificationMsg(t.resetSuccess);
      setShowNotification(true);
    }
  };

  return (
    <div className="min-h-screen text-slate-200 px-4 py-8 md:py-12 bg-[#0f172a]">
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10 shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white leading-none tracking-tight">星云VC啊</span>
              <span className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-wider">
                By <a href="https://www.dmdii.top" target="_blank" rel="noopener noreferrer" className="text-emerald-400">DMDII.TOP</a>
              </span>
            </div>
          </div>

          {/* Language Switcher */}
          <button 
            onClick={toggleLanguage}
            className="glass px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            {lang === 'zh' ? 'English' : '中文'}
          </button>
        </div>

        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 mb-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            {t.title} <span className="gradient-text">{t.subtitle}</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t.desc}</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form Section */}
          <section className="glass rounded-3xl p-6 md:p-8 space-y-8 overflow-hidden">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold">{t.configTitle}</h2>
            </div>

            <div className="space-y-6 max-h-[1200px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">{t.projectName}</label>
                  <input
                    type="text"
                    id="siteName"
                    value={formData.siteName}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">{t.brandName}</label>
                  <input
                    type="text"
                    id="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">{t.refLink}</label>
                <input
                  type="text"
                  id="brandLink"
                  value={formData.brandLink}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-400">{t.membership}</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMembershipChange(true)}
                      className={`flex-1 px-3 py-2 rounded-xl border transition-all text-xs flex items-center justify-center gap-2 ${formData.hasMembership ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                    >
                      {t.enabled}
                    </button>
                    <button
                      onClick={() => handleMembershipChange(false)}
                      className={`flex-1 px-3 py-2 rounded-xl border transition-all text-xs flex items-center justify-center gap-2 ${!formData.hasMembership ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                    >
                      {t.disabled}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-400">{t.colorTone}</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleColorToneChange('dark')}
                      className={`flex-1 px-3 py-2 rounded-xl border transition-all text-xs flex items-center justify-center gap-2 ${formData.colorTone === 'dark' ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                    >
                      {t.darkTone}
                    </button>
                    <button
                      onClick={() => handleColorToneChange('light')}
                      className={`flex-1 px-3 py-2 rounded-xl border transition-all text-xs flex items-center justify-center gap-2 ${formData.colorTone === 'light' ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                    >
                      {t.lightTone}
                    </button>
                  </div>
                </div>
              </div>

              {formData.hasMembership && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-sm font-medium text-slate-400">{t.memberFeatures}</label>
                  <input
                    type="text"
                    id="memberFeatures"
                    value={formData.memberFeatures}
                    onChange={handleInputChange}
                    placeholder={t.memberFeaturesPlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm mb-2"
                  />
                  <label className="text-sm font-medium text-slate-400">{t.securityRules}</label>
                  <textarea
                    id="passwordRules"
                    value={formData.passwordRules}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none text-sm"
                  />
                </div>
              )}

              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-slate-400">{t.additionalFeaturesTitle}</label>
                <textarea
                  id="additionalFeatures"
                  value={formData.additionalFeatures}
                  onChange={handleInputChange}
                  placeholder={t.additionalPlaceholder}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none text-sm"
                />
              </div>

              <div className="space-y-4 pt-2">
                <label className="text-sm font-medium text-slate-400">{t.featureConstraints}</label>
                <div className="grid grid-cols-1 gap-2">
                  {REQUIREMENT_OPTIONS.map(option => (
                    <button
                      key={option.id}
                      onClick={() => toggleRequirement(option.id)}
                      className={`text-left px-4 py-2.5 rounded-xl border transition-all flex items-center gap-3 ${formData.requirements.includes(option.id) ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-xs font-medium">{option.label[lang]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Preview Section */}
          <section className="space-y-6 sticky top-8">
            <div className="glass rounded-3xl overflow-hidden flex flex-col h-[750px]">
              <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <h2 className="text-lg font-semibold">{t.previewTitle}</h2>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40"></div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-slate-900/40 mono text-xs leading-relaxed text-slate-300 custom-scrollbar">
                <pre className="whitespace-pre-wrap">{generatedPrompt}</pre>
              </div>

              <div className="p-6 bg-white/5 border-t border-white/5 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCopy}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    {t.copyBtn}
                  </button>
                  <button
                    onClick={handleReset}
                    className="sm:w-28 bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 font-bold py-3.5 px-4 rounded-xl transition-all border border-white/5 flex items-center justify-center gap-2 text-sm"
                  >
                    {t.resetBtn}
                  </button>
                </div>
                <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest">
                  {t.footerBuilt}
                </p>
              </div>
            </div>
          </section>
        </main>

      </div>

      <Notification 
        message={notificationMsg} 
        isVisible={showNotification} 
        onClose={() => setShowNotification(false)} 
      />
    </div>
  );
};

export default App;
