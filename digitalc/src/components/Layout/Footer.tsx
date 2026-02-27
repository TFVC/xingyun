import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Vision */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              数碳未来
            </h2>
            <p className="text-gray-400 mb-6 max-w-sm">
              数字技术赋能绿色未来。通过科技手段，推动碳中和目标的实现，共建可持续发展的地球家园。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速导航</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link to="/knowledge" className="text-gray-400 hover:text-primary transition-colors">
                  知识百科
                </Link>
              </li>
              <li>
                <Link to="/interactive" className="text-gray-400 hover:text-primary transition-colors">
                  场景体验
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} 数碳未来 (Digital Carbon Future). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
