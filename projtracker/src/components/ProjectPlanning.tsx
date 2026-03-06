import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ProjectPlanning() {
  const layers = [
    {
      level: "示范层",
      title: "红外测温产业",
      subtitle: "细分行业突破",
      desc: "在增量市场中获得突破，实现竞争前合作",
      bg: "bg-primary text-white",
      border: "border-primary",
    },
    {
      level: "行业层",
      title: "传感行业",
      subtitle: "基础行业赋能",
      desc: "资源协同与产业链整合，细化产业基础设施",
      bg: "bg-white text-black",
      border: "border-black",
    },
    {
      level: "基础层",
      title: "AI能力及协同环境",
      subtitle: "效率基础设施",
      desc: "构建数字化底座，提升全流程协作效率",
      bg: "bg-black text-white",
      border: "border-black",
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col w-full">
        {layers.map((layer, index) => (
          <div key={layer.level} className="flex flex-col items-center w-full">
            {/* Arrow Connector (except for top item) */}
            {index > 0 && (
              <div className="h-6 w-0.5 bg-black my-1.5 relative">
                 <div className="absolute -top-1 -left-[3px] w-2 h-2 border-t-2 border-r-2 border-black -rotate-45 transform origin-center" />
              </div>
            )}
            
            {/* Layer Box */}
            <div 
              className={`w-full p-5 border-2 ${layer.border} ${layer.bg} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-1 duration-300`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1 min-w-0">
                   <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-widest opacity-70">{layer.level}</span>
                      <div className={`h-px w-10 ${layer.bg.includes('bg-black') || layer.bg.includes('bg-primary') ? 'bg-white/30' : 'bg-black/30'}`}></div>
                      <span className={`px-1.5 py-[1px] text-[10px] font-bold uppercase tracking-wider border ${layer.bg.includes('bg-black') ? 'border-white text-white' : layer.bg.includes('bg-primary') ? 'border-white text-white' : 'border-black text-black'}`}>
                        {layer.subtitle}
                      </span>
                   </div>
                   <h3 className="text-xl font-bold uppercase tracking-tight leading-tight">{layer.title}</h3>
                </div>
                
                <div className={`md:w-1/3 text-xs font-medium leading-relaxed ${layer.bg.includes('bg-black') || layer.bg.includes('bg-primary') ? 'text-white' : 'text-black/70'}`}>
                  {layer.desc}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Visual Annotation */}
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="border-t border-black pt-1.5">
              <p className="text-[10px] font-mono uppercase text-muted-foreground">基础层</p>
          </div>
          <div className="border-t border-black pt-1.5">
              <p className="text-[10px] font-mono uppercase text-muted-foreground">行业层</p>
          </div>
          <div className="border-t border-black pt-1.5">
              <p className="text-[10px] font-mono uppercase text-muted-foreground">示范层</p>
          </div>
      </div>
    </div>
  );
}
