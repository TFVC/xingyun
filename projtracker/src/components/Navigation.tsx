"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

const navItems = [
  { id: "overview", label: "项目规划" },
  { id: "milestones", label: "里程碑" },
  { id: "updates", label: "进展详情" },
  { id: "achievements", label: "成果" },
  { id: "team", label: "生产力" },
];

export function Navigation() {
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    setIsMobileMenuOpen(false); // Close menu on click
    if (element) {
      const offset = 80; // Height of sticky header + padding
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if we're at the bottom of the page
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50
      ) {
        setActiveSection(navItems[navItems.length - 1].id);
        return;
      }

      // Use a trigger point at 30% of viewport height
      const scrollPosition = window.scrollY + window.innerHeight * 0.3;
      let currentSection = "";

      // Find the last section whose top is above the trigger point
      for (const item of navItems) {
        const section = document.getElementById(item.id);
        if (section && section.offsetTop <= scrollPosition) {
          currentSection = item.id;
        }
      }

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b-2 border-black py-4 px-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="text-lg font-bold uppercase tracking-tighter group-hover:text-primary transition-colors">
            OPC项目实践 - 进展看板
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-muted/30 rounded-full border border-black/5">
             <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
             <span className="text-xs font-bold text-muted-foreground">正常推进中</span>
          </div>
        </div>
        
        <ul className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={cn(
                  "text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors relative",
                  activeSection === item.id ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary" />
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-1 hover:bg-muted/20 rounded"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 bg-white border-b-2 border-black shadow-xl animate-in slide-in-from-top-2 duration-200">
          <ul className="flex flex-col p-6 gap-6 items-center">
            {navItems.map((item) => (
              <li key={item.id} className="w-full text-center">
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "text-lg font-bold uppercase tracking-widest w-full py-2 hover:bg-muted/10 rounded transition-colors",
                    activeSection === item.id ? "text-primary" : "text-black"
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
