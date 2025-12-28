import { useState, useEffect, useMemo, useRef } from 'react';
import { Menu, X, Info, ChevronRight, ChevronDown, Search, ArrowUp, ArrowDown } from 'lucide-react';
import { categories } from './data';
import type { NavItem } from './types';
import { Card } from './components/Card';
import { Modal } from './components/Modal';
import clsx from 'clsx';

function App() {
  const [activeId, setActiveId] = useState(categories[0]?.id || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NavItem | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  // Ref for search input
  const searchInputRef = useRef<HTMLInputElement>(null);

  const computeSearchResults = (query: string): NavItem[] => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    const q = trimmed.toLowerCase();
    const results: NavItem[] = [];

    categories.forEach((cat) => {
      cat.items?.forEach((item) => {
        if (item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) {
          results.push(item);
        }
      });

      cat.subcategories?.forEach((sub) => {
        sub.items.forEach((item) => {
          if (item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)) {
            results.push(item);
          }
        });
      });
    });

    return results;
  };

  const searchResults = useMemo(() => computeSearchResults(searchQuery), [searchQuery]);

  // Handle Search Navigation
  const navigateSearch = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;
    
    let newIndex = direction === 'next' ? currentResultIndex + 1 : currentResultIndex - 1;
    
    if (newIndex >= searchResults.length) newIndex = 0;
    if (newIndex < 0) newIndex = searchResults.length - 1;
    
    setCurrentResultIndex(newIndex);
    scrollToItem(searchResults[newIndex].id);
  };

  const scrollToItem = (itemId: string) => {
    const element = document.getElementById(`card-${itemId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Toggle Category Expansion
  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => (prev.includes(catId) ? [] : [catId]));
  };

  // Handle card click
  const handleCardClick = (item: NavItem) => {
    if (item.type === 'link' && item.link) {
      window.open(item.link, '_blank');
    } else {
      setSelectedItem(item);
    }
  };

  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveId(id);
      setIsMobileMenuOpen(false);
    }
  };

  // Intersection Observer for scrollspy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );

    categories.forEach((cat) => {
      const element = document.getElementById(cat.id);
      if (element) observer.observe(element);
      
      cat.subcategories?.forEach(sub => {
        const subElement = document.getElementById(sub.id);
        if (subElement) observer.observe(subElement);
      });
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">传感产业地图</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-1">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Sidebar / Mobile Menu */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        <div className="p-4 border-b border-gray-100 hidden md:block flex-shrink-0">
          <h1 className="text-2xl font-bold text-gray-800">传感产业地图</h1>
          <p className="text-xs text-gray-500 mt-2">一站式产业资源导航</p>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
          <div className="relative group">
            <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="搜索厂商、芯片..." 
              value={searchQuery}
              onChange={(e) => {
                const nextQuery = e.target.value;
                const nextResults = computeSearchResults(nextQuery);
                setSearchQuery(nextQuery);
                setCurrentResultIndex(nextResults.length > 0 ? 0 : -1);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigateSearch('next');
                if (e.key === 'ArrowDown') { e.preventDefault(); navigateSearch('next'); }
                if (e.key === 'ArrowUp') { e.preventDefault(); navigateSearch('prev'); }
              }}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          
          {/* Search Navigation */}
          {searchResults.length > 0 && (
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 animate-in fade-in slide-in-from-top-1">
              <span>找到 {searchResults.length} 个结果</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">{currentResultIndex + 1}/{searchResults.length}</span>
                <div className="flex bg-white border border-gray-200 rounded-md overflow-hidden">
                  <button onClick={() => navigateSearch('prev')} className="p-1 hover:bg-gray-100 border-r border-gray-200">
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => navigateSearch('next')} className="p-1 hover:bg-gray-100">
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {categories.map((cat) => {
            const isExpanded = expandedCategories.includes(cat.id);
            const isActive = activeId === cat.id || cat.subcategories?.some(s => s.id === activeId);
            
            return (
              <div key={cat.id} className="space-y-1">
                <div 
                  className={clsx(
                    "w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between cursor-pointer select-none",
                    isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => {
                    toggleCategory(cat.id);
                    scrollToSection(cat.id);
                  }}
                >
                  <span>{cat.title}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(cat.id);
                    }}
                    className="p-1 hover:bg-black/5 rounded-full transition-colors"
                  >
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                </div>
                
                {/* Subcategories */}
                {isExpanded && cat.subcategories && (
                  <div className="ml-3 pl-3 border-l-2 border-gray-100 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    {cat.subcategories.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => scrollToSection(sub.id)}
                        className={clsx(
                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                          activeId === sub.id
                            ? "text-blue-600 bg-blue-50/50 font-medium"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        )}
                      >
                        {sub.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto flex-shrink-0">
          <a 
            href="https://ai.feishu.cn/docx/CO5udyr0SokanNxibaGcNchUnzh?from=from_copylink" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Info size={18} />
            关于我们
          </a>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen scroll-smooth">
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Info size={48} className="mb-4 text-gray-300" />
              <p className="text-lg">暂无数据</p>
              <p className="text-sm">请检查 src/data.md 文件</p>
            </div>
          ) : (
            categories.map((cat) => (
            <div key={cat.id} id={cat.id} className="scroll-mt-20 md:scroll-mt-8 space-y-6">
              {/* Category Header */}
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                <h2 className="text-xl font-bold text-gray-800">{cat.title}</h2>
              </div>

              {/* Direct Items (if any) */}
              {cat.items && cat.items.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {cat.items.map((item) => (
                    <Card 
                      key={item.id} 
                      item={item} 
                      onClick={handleCardClick}
                      highlighted={searchResults[currentResultIndex]?.id === item.id}
                    />
                  ))}
                </div>
              )}

              {/* Subcategories */}
              {cat.subcategories?.map(sub => (
                <div key={sub.id} id={sub.id} className="scroll-mt-24 md:scroll-mt-12">
                  <h3 className="text-base font-semibold text-gray-600 mb-4 flex items-center gap-2">
                    <ChevronRight size={16} className="text-gray-400" />
                    {sub.title}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                    {sub.items.map((item) => (
                      <Card 
                        key={item.id} 
                        item={item} 
                        onClick={handleCardClick}
                        highlighted={searchResults[currentResultIndex]?.id === item.id}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )))}
        </div>
      </main>

      {/* Modal */}
      <Modal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}

export default App;
