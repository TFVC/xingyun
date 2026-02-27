import React from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart2, CheckCircle2, ArrowRight } from 'lucide-react';

const ConceptStep: React.FC<{
  icon: React.ElementType;
  title: string;
  desc: string;
  delay: number;
}> = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="flex-1 text-center px-4"
  >
    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white shadow-lg flex items-center justify-center relative z-10">
      <Icon className="w-10 h-10 text-primary" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed text-sm">
      {desc}
    </p>
  </motion.div>
);

const CoreConcept = () => {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-secondary uppercase bg-secondary/10 rounded-full mb-4">
            核心机制
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            数字化如何实现碳中和？
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            从数据采集到智能决策，数字技术贯穿了碳管理的全生命周期。
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-gray-200 -z-0"></div>

          <div className="flex flex-col md:flex-row gap-12 md:gap-4 relative z-10">
            <ConceptStep 
              icon={Activity}
              title="1. 全链路监测"
              desc="利用物联网传感器和智能电表，实时采集工业、建筑、交通等场景的能耗与碳排放数据，让每一克碳排放都“有迹可循”。"
              delay={0}
            />
            
            <div className="hidden md:flex items-center justify-center text-gray-300">
              <ArrowRight className="w-6 h-6" />
            </div>

            <ConceptStep 
              icon={BarChart2}
              title="2. 智能化优化"
              desc="基于大数据分析与AI算法，精准预测能源需求，优化生产流程与能源调度，从源头上减少不必要的能源浪费。"
              delay={0.2}
            />

            <div className="hidden md:flex items-center justify-center text-gray-300">
              <ArrowRight className="w-6 h-6" />
            </div>

            <ConceptStep 
              icon={CheckCircle2}
              title="3. 碳中和闭环"
              desc="对于无法避免的碳排放，通过碳市场交易购买核证减排量（CCER）或通过植树造林等碳汇方式进行抵消，最终实现零碳目标。"
              delay={0.4}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreConcept;
