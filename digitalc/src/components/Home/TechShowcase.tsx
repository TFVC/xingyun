import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Wifi, Link2, Database, Leaf } from 'lucide-react';

interface TechCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  detail: string;
  backTitle: string;
  color: string;
}

const TechCard: React.FC<TechCardProps> = ({ icon: Icon, title, description, detail, backTitle, color }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Extract color class for text and bg
  const textColor = color.split(' ')[1];
  const bgColor = color.split(' ')[0];

  return (
    <div
      className="relative w-full h-80 cursor-pointer perspective-1000 group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`w-full h-full relative transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 flex flex-col items-center justify-center text-center border border-gray-100">
          <div className={`p-4 rounded-full ${bgColor} bg-opacity-10 mb-6 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-8 h-8 ${textColor}`} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
          <div className="mt-auto text-xs text-gray-400 font-medium uppercase tracking-wider">
            悬停查看原理
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center text-center text-white rotate-y-180">
          <Leaf className="w-8 h-8 text-primary mb-4 animate-bounce" />
          <h4 className="text-lg font-bold mb-3">{backTitle}</h4>
          <p className="text-gray-300 text-sm leading-relaxed">
            {detail}
          </p>
        </div>

      </div>
    </div>
  );
};

const TechShowcase = () => {
  const technologies = [
    {
      icon: Cpu,
      title: "人工智能 (AI)",
      description: "通过算法优化能源调度，实现供需精准匹配。",
      detail: "AI算法可预测电网负荷，优化数据中心散热，减少无效能耗高达30%。",
      backTitle: "AI算法：电网负荷预测与能耗优化",
      color: "bg-blue-500 text-blue-500"
    },
    {
      icon: Wifi,
      title: "5G / 物联网",
      description: "万物互联，实时监控环境与能耗数据。",
      detail: "通过传感器网络实时监测工业排放，实现远程精准控制，降低运维碳足迹。",
      backTitle: "传感器网络：工业排放精准管控",
      color: "bg-purple-500 text-purple-500"
    },
    {
      icon: Link2,
      title: "区块链",
      description: "构建透明可信的碳交易与溯源体系。",
      detail: "利用不可篡改特性记录碳足迹，确保碳交易市场的数据真实性与透明度。",
      backTitle: "区块链：碳交易数据保真增信",
      color: "bg-indigo-500 text-indigo-500"
    },
    {
      icon: Database,
      title: "大数据",
      description: "挖掘数据价值，指导低碳决策。",
      detail: "分析海量环境数据，为城市规划和产业布局提供科学的低碳优化方案。",
      backTitle: "大数据：环境数据助力低碳规划",
      color: "bg-emerald-500 text-emerald-500"
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full mb-4">
            核心驱动力
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            数字技术如何赋能碳中和
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            四大核心数字技术正在重塑能源、工业与生活方式，成为实现“双碳”目标的关键驱动力。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {technologies.map((tech, index) => (
            <TechCard key={index} {...tech} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechShowcase;
