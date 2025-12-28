import ReactMarkdown from 'react-markdown';
import { X } from 'lucide-react';
import type { NavItem } from '../types';

interface ModalProps {
  item: NavItem | null;
  onClose: () => void;
}

export const Modal = ({ item, onClose }: ModalProps) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">{item.title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto prose prose-sm max-w-none">
          <ReactMarkdown 
            components={{
              a: ({ node, ...props }) => {
                void node;
                return <a {...props} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" />;
              }
            }}
           >
             {item.content || '暂无内容'}
           </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
