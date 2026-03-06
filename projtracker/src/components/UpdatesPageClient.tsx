"use client";

import { Navigation } from "@/components/Navigation";
import { UpdateCard } from "@/components/UpdateCard";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";

import { UpdateDetailModal } from "@/components/UpdateDetailModal";
import { Update } from "@/types";

interface UpdatesPageClientProps {
  updates: Update[];
}

export function UpdatesPageClient({ updates }: UpdatesPageClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);

  const filteredUpdates = updates.filter((update) => {
    const term = searchTerm.toLowerCase();
    return (
      update.date.toLowerCase().includes(term) ||
      update.title.toLowerCase().includes(term) ||
      update.description.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen swiss-grid font-sans">
      <Navigation />
      <main className="max-w-6xl mx-auto space-y-12 p-8 sm:p-20 pt-28">
        
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">双周进展详情</h1>
              <p className="text-muted-foreground max-w-2xl">
                这里记录了项目的每一次迭代与突破
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="按时间或内容搜索 (如 2026.01)..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Updates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUpdates.length > 0 ? (
            filteredUpdates.map((update, index) => (
              <UpdateCard 
                key={index}
                id={update.id}
                date={update.date}
                title={update.title}
                description={update.description}
                tags={update.tags}
                authors={update.authors}
                onClick={() => setSelectedUpdate(update)}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              没有找到匹配的进展记录
            </div>
          )}
        </div>
        
        <UpdateDetailModal 
          isOpen={!!selectedUpdate} 
          onClose={() => setSelectedUpdate(null)} 
          update={selectedUpdate} 
        />
      </main>
    </div>
  );
}
