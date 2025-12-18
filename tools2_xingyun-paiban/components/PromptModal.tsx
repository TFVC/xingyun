
import React from 'react';
import { X, Copy, Zap, Flame, Target, BookOpen, Smile, ListChecks, Heart, Compass } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  articleContent: string;
}

const PROMPT_SCENARIOS = [
  {
    id: 'titles',
    name: '爆款标题',
    icon: <Flame className="w-4 h-4 text-orange-500" />,
    prompt: (content: string) => `你是一位爆款公众号小编，请根据以下文章内容，生成5个极具点击欲望、悬念感强、符合新媒体传播规律的标题，同时提供简要的起名逻辑说明：\n\n${content}`
  },
  {
    id: 'polish',
    name: '深度润色',
    icon: <Zap className="w-4 h-4 text-yellow-500" />,
    prompt: (content: string) => `请作为一名资深主编，对以下文章进行深度润色。要求：语言流畅、逻辑严密、修辞得当，修正语病并优化句式结构，同时严格保留原有的Markdown格式：\n\n${content}`
  },
  {
    id: 'emotion',
    name: '情感共鸣',
    icon: <Heart className="w-4 h-4 text-red-500" />,
    prompt: (content: string) => `请将以下内容改编为富有感染力的叙事风格，增加读者的代入感和情感共鸣，让文字更有温度，适合深夜或感性场景阅读：\n\n${content}`
  },
  {
    id: 'pro',
    name: '专业严谨',
    icon: <Target className="w-4 h-4 text-blue-500" />,
    prompt: (content: string) => `请将以下内容改写为更专业、商务、严谨的语调。要求：术语准确、论点清晰、去口语化，适合在正式行业报告或深度分析中使用：\n\n${content}`
  },
  {
    id: 'trendy',
    name: '网感重塑',
    icon: <Smile className="w-4 h-4 text-pink-500" />,
    prompt: (content: string) => `请用更有“网感”的语言重塑以下内容，加入适度的幽默感、流行梗和金句，让表达更有张力，吸引年轻人阅读：\n\n${content}`
  },
  {
    id: 'summary',
    name: '导读摘要',
    icon: <BookOpen className="w-4 h-4 text-purple-500" />,
    prompt: (content: string) => `请为以下文章撰写一段吸引人的微信导读摘要（120字以内）。要求：精准提炼核心价值点，设置悬念，激发用户点击正文的兴趣：\n\n${content}`
  },
  {
    id: 'structure',
    name: '结构重构',
    icon: <ListChecks className="w-4 h-4 text-emerald-500" />,
    prompt: (content: string) => `请根据以下内容提取核心观点，并将其重构为逻辑清晰的结构化列表（分点描述），增加文章的“骨架感”和易读性：\n\n${content}`
  },
  {
    id: 'xiaohongshu',
    name: '社交风格',
    icon: <Compass className="w-4 h-4 text-cyan-500" />,
    prompt: (content: string) => `请将以下内容转化为“小红书”风格。要求：语气亲切友好、多用表情符号(Emoji)、提取关键词标签，并针对手机屏幕优化排版布局：\n\n${content}`
  }
];

const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose, articleContent }) => {
  if (!isOpen) return null;

  const handleCopyPrompt = async (promptGenerator: (c: string) => string) => {
    const fullPrompt = promptGenerator(articleContent);
    await navigator.clipboard.writeText(fullPrompt);
    alert('提示词已复制到剪贴板，请前往 AI 对话框粘贴！');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-black text-slate-900">选择优化提示词</h2>
            <p className="text-xs text-slate-400 font-medium">点击复制后直接粘贴给 DeepSeek 即可</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {PROMPT_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleCopyPrompt(scenario.prompt)}
              className="group flex flex-col text-left p-4 rounded-2xl border border-slate-100 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-indigo-100 transition-all">
                  {scenario.icon}
                </div>
                <span className="font-bold text-slate-800">{scenario.name}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                {scenario.prompt('...')}
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy className="w-3 h-3" /> 一键复制提示词
              </div>
            </button>
          ))}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400">所有提示词均已针对 DeepSeek V3/R1 模型优化</p>
          <button 
            onClick={() => window.open('https://chat.deepseek.com', '_blank')}
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            前往 DeepSeek 官网 <Compass className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
