
import React, { useState } from 'react';
import { X, ShieldCheck, Zap, Lock } from 'lucide-react';

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: () => void;
}

const ActivationModal: React.FC<ActivationModalProps> = ({ isOpen, onClose, onActivate }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validateCode = () => {
    // 规则：SN-****，****为数字且和为18
    const regex = /^SN-(\d{4})$/;
    const match = code.trim().toUpperCase().match(regex);
    
    if (!match) {
      setError('激活码格式错误（需为 SN-XXXX）');
      return;
    }

    const digits = match[1];
    const sum = digits.split('').reduce((acc, d) => acc + parseInt(d), 0);
    
    if (sum !== 18) {
      setError('无效的激活码序列');
      return;
    }

    setError('');
    onActivate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden p-8 relative border border-slate-100">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors">
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
            <ShieldCheck className="w-10 h-10 text-emerald-600" />
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 mb-2">解锁会员权益</h2>
          <p className="text-slate-500 text-sm mb-8 px-4">
            激活后可解锁 10+ 种高点击率文前/文末引导模板，助你打造品牌化排版。
          </p>

          <div className="w-full space-y-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="请输入激活码 SN-****"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full p-5 bg-slate-50 border-2 ${error ? 'border-red-200 ring-red-50' : 'border-slate-100 focus:border-emerald-500'} rounded-2xl text-center font-mono text-lg font-bold outline-none transition-all placeholder:text-slate-300 tracking-widest`}
              />
              {error && <p className="text-red-500 text-[10px] font-bold mt-2 uppercase tracking-wider">{error}</p>}
            </div>

            <button 
              onClick={validateCode}
              className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              立即激活
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 w-full">
            <div className="flex items-center justify-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase">极速处理</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Lock className="w-5 h-5 text-indigo-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase">永久使用</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivationModal;
