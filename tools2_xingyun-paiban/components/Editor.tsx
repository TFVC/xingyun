
import React, { useRef } from 'react';
import { Heading1, Heading2, Heading3, Bold, Quote, List, Type } from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (val: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (prefix: string, suffix: string = '', isBlock: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = value.substring(start, end);

    if (isBlock) {
      // 块级元素处理：定位到当前行起始位置
      const beforeText = value.substring(0, start);
      const lineStart = beforeText.lastIndexOf('\n') + 1;
      
      const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart);
      onChange(newValue);

      // 恢复焦点并定位光标
      setTimeout(() => {
        textarea.focus();
        const newPos = end + prefix.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 0);
    } else {
      // 行内元素处理：包裹选中内容
      const newValue = value.substring(0, start) + prefix + selection + suffix + value.substring(end);
      onChange(newValue);

      // 恢复焦点并选中原来的文字
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      }, 0);
    }
  };

  const toolbarItems = [
    { label: '主标题', icon: <Heading1 className="w-3.5 h-3.5" />, action: () => applyFormat('# ', '', true) },
    { label: '子标题', icon: <Heading2 className="w-3.5 h-3.5" />, action: () => applyFormat('## ', '', true) },
    { label: '三级标题', icon: <Heading3 className="w-3.5 h-3.5" />, action: () => applyFormat('### ', '', true) },
    { label: '加粗', icon: <Bold className="w-3.5 h-3.5" />, action: () => applyFormat('**', '**', false) },
    { label: '引用', icon: <Quote className="w-3.5 h-3.5" />, action: () => applyFormat('> ', '', true) },
    { label: '列表', icon: <List className="w-3.5 h-3.5" />, action: () => applyFormat('1. ', '', true) },
  ];

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      {/* 增强型工具栏 */}
      <div className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-200 px-3 py-2 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
        {toolbarItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm border border-transparent hover:border-slate-100 transition-all shrink-0"
            title={item.label}
          >
            {item.icon}
            <span className="text-[11px] font-bold whitespace-nowrap">{item.label}</span>
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex gap-1 px-2">
          <div className="w-2 h-2 rounded-full bg-slate-200" />
          <div className="w-2 h-2 rounded-full bg-slate-200" />
        </div>
      </div>

      <textarea
        ref={textareaRef}
        className="flex-1 p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed text-slate-700 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 bg-transparent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="在这里输入内容，或使用上方工具栏快速排版..."
      />
    </div>
  );
};

export default Editor;
