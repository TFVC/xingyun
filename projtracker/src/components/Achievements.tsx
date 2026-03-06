import { ArrowUpRight } from "lucide-react";
import { LayerGroup } from "@/types";

export function Achievements({ achievements }: { achievements: LayerGroup[] }) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-0 border-t-2 border-b-2 border-black/10">
      {achievements.map((layer, index) => (
        <div 
          key={layer.id} 
          className={`
            relative flex flex-col p-0 bg-white
            ${index !== achievements.length - 1 ? 'border-b md:border-b-0 md:border-r border-black/10' : ''}
          `}
        >
          {/* Compact Layer Header */}
          <div className={`
             px-4 py-3 flex items-center justify-between
             ${layer.headerStyle}
          `}>
             <div className="flex flex-col leading-none">
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-70 mb-1">{layer.levelName}</span>
                <h2 className="text-sm font-bold uppercase tracking-wide">
                  {layer.label}
                </h2>
             </div>
             {/* Decorative dot for visual balance */}
             <div className={`w-1.5 h-1.5 rounded-full opacity-50 ${layer.color === 'secondary' ? 'bg-primary' : 'bg-current'}`} />
          </div>

          {/* Index Navigation List */}
          <div className="flex-1 flex flex-col">
            {layer.items.map((item, i) => (
              <a 
                key={i} 
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block p-4 border-b border-black/5 last:border-0 hover:bg-muted/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <h4 className="font-bold text-sm text-foreground leading-tight pr-4 group-hover:text-primary transition-colors line-clamp-1">
                    {item.title}
                  </h4>
                  <ArrowUpRight 
                    size={14} 
                    className="text-muted-foreground opacity-30 transform transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100 group-hover:text-primary shrink-0" 
                  />
                </div>
                
                <p className="text-[11px] leading-relaxed line-clamp-2 text-muted-foreground group-hover:text-foreground transition-colors">
                  {item.desc}
                </p>

                {item.tags && item.tags.length > 0 && (
                   <div className="mt-2 flex flex-wrap gap-2">
                     {item.tags.map((tag, idx) => (
                       <span key={idx} className={`
                          inline-block text-[9px] font-bold uppercase px-1.5 py-0.5 border rounded-sm
                          ${layer.color === 'primary' ? 'border-primary/20 text-primary bg-primary/5' : 'border-border text-muted-foreground bg-muted/20'}
                        `}>
                          {tag}
                        </span>
                     ))}
                   </div>
                )}
              </a>
            ))}
          </div>
          
          {/* Decorative Number */}
          <div className="absolute bottom-0 right-0 p-3 opacity-[0.03] text-6xl font-black leading-none pointer-events-none select-none text-foreground">
            {3 - index}
          </div>
        </div>
      ))}
    </div>
  );
}
