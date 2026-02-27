import React, { useState, useEffect, useRef } from 'react';
import { ChevronsLeftRight, ArrowRight, Zap, Factory, Truck } from 'lucide-react';

interface ScenarioProps {
  before: {
    title: string;
    desc: string;
    image: string;
    icon: React.ElementType;
  };
  after: {
    title: string;
    desc: string;
    image: string;
    icon: React.ElementType;
  };
  theme: 'blue' | 'green' | 'purple';
}

const ComparisonSlider: React.FC<ScenarioProps> = ({ before, after, theme }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle drag logic with global event listeners
  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderPosition(percentage);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault(); // Prevent text selection
      handleMove(e.clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    };

    const onEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging]);

  const handleInteractionStart = () => {
    setIsDragging(true);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[500px] overflow-hidden rounded-2xl cursor-col-resize select-none shadow-2xl group"
      onMouseDown={handleInteractionStart}
      onTouchStart={handleInteractionStart}
    >
      {/* After Image (Background) - The Digital Future */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${after.image})` }}
      >
        {/* Removed backdrop-blur and reduced opacity for clarity */}
        <div className="absolute inset-0 bg-blue-900/30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-8 ml-[50%] transform translate-x-[-25%]">
             <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-xl">
                <after.icon className="w-12 h-12 mx-auto mb-4 text-cyan-300" />
                <h3 className="text-2xl font-bold mb-2">{after.title}</h3>
                <p className="text-sm opacity-90 max-w-xs mx-auto">{after.desc}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Before Image (Foreground) - Traditional Way */}
      <div 
        className="absolute inset-0 h-full overflow-hidden border-r-4 border-white shadow-2xl"
        style={{ width: `${sliderPosition}%` }}
      >
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${before.image})`,
            width: '100vw' // Ensure background stays fixed relative to viewport width concept
          }}
        >
          {/* Removed backdrop-blur and reduced opacity for clarity */}
          <div className="absolute inset-0 bg-gray-900/40"></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-full max-w-5xl mx-auto px-4 flex justify-start">
               {/* Adjust positioning to match the "After" side logic but mirrored */}
               <div className="w-1/2 flex justify-center">
                  <div className="text-center text-white px-8">
                    <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl">
                      <before.icon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-2xl font-bold mb-2">{before.title}</h3>
                      <p className="text-sm opacity-90 max-w-xs mx-auto">{before.desc}</p>
                    </div>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-transparent z-20 flex items-center justify-center pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transform -translate-x-1/2">
          <ChevronsLeftRight className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-6 left-6 z-20 bg-black/60 backdrop-blur text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border border-white/10">
        TRADITIONAL
      </div>
      <div className="absolute top-6 right-6 z-20 bg-primary/80 backdrop-blur text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border border-white/20">
        DIGITAL
      </div>
    </div>
  );
};

const Scenarios = () => {
  const scenarios = [
    {
      id: 1,
      theme: 'blue' as const,
      before: {
        title: "传统电网",
        desc: "单向输送，负荷预测难，容易造成能源浪费或供应不足。",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1600", // Industrial/Coal Plant
        icon: Factory
      },
      after: {
        title: "智能微网",
        desc: "AI实时调度，源网荷储协同，最大化消纳清洁能源。",
        image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=1600", // Wind Turbines/Green Energy
        icon: Zap
      }
    },
    {
      id: 2,
      theme: 'purple' as const,
      before: {
        title: "传统物流",
        desc: "空驶率高，纸质单据繁琐，运输路径缺乏优化。",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600", // Warehouse Boxes
        icon: Truck
      },
      after: {
        title: "智慧物流",
        desc: "大数据规划最优路径，电子面单，全链路低碳追踪。",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1600", // Data Dashboard/Tech
        icon: ArrowRight
      }
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-secondary uppercase bg-secondary/10 rounded-full mb-4">
            场景体验
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            看得见的改变
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            拖动滑块，亲身体验数字化技术如何将传统的“高耗能”场景转化为未来的“低碳”图景。
          </p>
        </div>

        <div className="space-y-24">
          {scenarios.map((scenario, index) => (
            <div key={scenario.id} className="max-w-5xl mx-auto">
              <ComparisonSlider {...scenario} />
              <div className="mt-8 text-center max-w-2xl mx-auto">
                 <h3 className="text-lg font-semibold text-gray-800 mb-2">
                   场景 #{index + 1}: {scenario.before.title} vs {scenario.after.title}
                 </h3>
                 <p className="text-gray-500 text-sm">
                   通过数字化改造，不仅提升了效率，更显著降低了碳排放。
                 </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scenarios;
