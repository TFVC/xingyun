import type { NavItem } from '../types';
import { DynamicIcon } from './DynamicIcon';
import clsx from 'clsx';

interface CardProps {
  item: NavItem;
  onClick: (item: NavItem) => void;
  highlighted?: boolean;
}

export const Card = ({ item, onClick, highlighted }: CardProps) => {
  return (
    <div 
      id={`card-${item.id}`}
      onClick={() => onClick(item)}
      className={clsx(
        "bg-white p-3 rounded-lg shadow-sm border transition-all cursor-pointer h-full flex flex-col duration-300",
        highlighted 
          ? "border-yellow-400 ring-2 ring-yellow-400 shadow-md scale-105 z-10" 
          : "border-gray-100 hover:shadow-md hover:border-blue-200"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={clsx(
          "p-1.5 rounded-md flex-shrink-0 transition-colors",
          highlighted ? "bg-yellow-100 text-yellow-700" : "bg-blue-50 text-blue-600"
        )}>
          <DynamicIcon name={item.icon} size={18} />
        </div>
        <h3 className="font-medium text-gray-800 text-sm truncate">{item.title}</h3>
      </div>
      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed flex-1 whitespace-pre-line">
        {item.description}
      </p>
    </div>
  );
};
