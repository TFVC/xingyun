import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Leaf, Globe, Sun, Battery, Server, Cpu } from 'lucide-react';

const KnowledgeCard: React.FC<{
  title: string;
  category: string;
  desc: string;
  icon: React.ElementType;
}> = ({ title, category, desc, icon: Icon }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="p-3 bg-primary/10 rounded-lg text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-500 rounded-full uppercase tracking-wider">
        {category}
      </span>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
  </motion.div>
);

const Knowledge = () => {
  const items = [
    {
      title: "碳中和 (Carbon Neutrality)",
      category: "核心概念",
      desc: "指企业、团体或个人测算在一定时间内直接或间接产生的温室气体排放总量，通过植树造林、节能减排等形式，以抵消自身产生的二氧化碳排放量，实现二氧化碳“零排放”。",
      icon: Globe
    },
    {
      title: "碳达峰 (Carbon Peaking)",
      category: "核心概念",
      desc: "指二氧化碳排放量达到历史最高值，经历平台期进入峰值平台，随后平稳下降的过程。是碳排放由增转降的历史拐点。",
      icon: Sun
    },
    {
      title: "绿色算力",
      category: "数字技术",
      desc: "随着AI和大数据的爆发，数据中心成为能耗大户。绿色算力通过液冷技术、AI能效优化等手段，大幅降低PUE（电源使用效率），让每一比特数据的计算更环保。",
      icon: Cpu
    },
    {
      title: "虚拟电厂",
      category: "数字技术",
      desc: "不是真实的发电厂，而是一套能源管理系统。它将分散的充电桩、空调、储能电池聚合起来，像一个电厂一样参与电网调度，实现削峰填谷。",
      icon: Battery
    },
    {
      title: "数字孪生",
      category: "数字技术",
      desc: "在虚拟世界中构建一个与物理实体完全一样的“双胞胎”。通过在虚拟世界中模拟运行，找到最优的节能方案，再应用到现实工厂或城市中。",
      icon: Server
    },
    {
      title: "CCER (核证自愿减排量)",
      category: "市场机制",
      desc: "企业通过实施减排项目（如造林、光伏）产生的减排量，经过核证后可以作为商品在碳市场上交易，用于抵消其他企业的碳排放。",
      icon: Leaf
    }
  ];

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-primary uppercase bg-primary/10 rounded-full mb-4">
            知识百科
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            数字碳中和知识库
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            无需复杂数据，一分钟读懂核心概念与前沿技术。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {items.map((item, index) => (
            <KnowledgeCard key={index} {...item} />
          ))}
        </div>

        {/* Call to Action for Quiz */}
        <div className="mt-20 text-center">
           <div className="inline-block p-8 bg-gradient-to-r from-secondary to-primary rounded-2xl shadow-2xl text-white max-w-4xl mx-auto">
             <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-80" />
             <h2 className="text-2xl font-bold mb-4">学到了吗？来测测你的“碳商”！</h2>
             <p className="mb-6 opacity-90">参与互动问答，不仅能巩固知识，还能获得专属的“数字碳卫士”徽章。</p>
             <a href="/quiz" className="inline-block bg-white text-secondary font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors">
               开始挑战
             </a>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Knowledge;
