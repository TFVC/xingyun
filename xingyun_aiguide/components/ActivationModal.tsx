
import React, { useState } from 'react';

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: (code: string) => void;
}

const ActivationModal: React.FC<ActivationModalProps> = ({ isOpen, onClose, onActivate }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validateCode = (input: string) => {
    const regex = /^SN-\d{4}$/;
    if (!regex.test(input)) return false;
    const digits = input.split('-')[1].split('').map(Number);
    const sum = digits.reduce((a, b) => a + b, 0);
    return sum === 18; // SN-9900, SN-5544 等均有效
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCode(code)) {
      onActivate(code);
      onClose();
    } else {
      setError('激活码格式错误或已失效');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">激活会员</h3>
          <p className="text-slate-500 mt-2 text-sm">请输入您的序列号以开启 AI 修仙之旅</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">序列号 (SN-XXXX)</label>
            <input 
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="请输入激活码"
              className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-500' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-center tracking-widest font-mono text-lg`}
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg">
            立即激活
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          如需激活码，请关注 DMDII.TOP
        </p>
      </div>
    </div>
  );
};

export default ActivationModal;
