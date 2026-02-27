import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Cpu, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full">
            数字技术赋能碳中和
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-gray-900">
            数碳未来 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              零碳视界
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            从<span className="font-bold text-gray-800">精准监测</span>碳排放，到利用AI<span className="font-bold text-gray-800">优化能源分配</span>。
            <br />
            我们致力于用数字化的智慧，通过全链路的数据闭环，助力实现真正的碳中和目标。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/interactive"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary rounded-full hover:bg-primary-dark transition-all shadow-lg hover:shadow-primary/30 group"
            >
              探索场景
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/knowledge"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
            >
              了解原理
            </Link>
          </div>
        </motion.div>

        {/* Floating Icons Animation */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 text-primary/20"
        >
          <Leaf size={64} />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 text-secondary/20"
        >
          <Cpu size={64} />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-1/3 right-1/3 text-accent/20"
        >
          <BarChart3 size={48} />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
