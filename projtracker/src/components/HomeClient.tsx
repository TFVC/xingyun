"use client";

import { Timeline } from "@/components/Timeline";
import { UpdateCard } from "@/components/UpdateCard";
import { TeamGrid } from "@/components/TeamGrid";
import { ProjectPlanning } from "@/components/ProjectPlanning";
import { Navigation } from "@/components/Navigation";
import { Achievements } from "@/components/Achievements";
import { UpdateDetailModal } from "@/components/UpdateDetailModal";
import { Update, Milestone, LayerGroup, TeamMember } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

interface HomeClientProps {
  milestones: Milestone[];
  updates: Update[];
  achievements: LayerGroup[];
  teamMembers: TeamMember[];
}

export function HomeClient({ milestones, updates, achievements, teamMembers }: HomeClientProps) {
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);

  return (
    <div className="min-h-screen swiss-grid font-sans">
      <Navigation />
      <main className="max-w-6xl mx-auto space-y-24 p-8 sm:p-20 pt-28">
        
        {/* Project Planning Visualization */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8" id="overview">
          <div className="md:col-span-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">项目规划</h2>
            <p className="text-xs text-muted-foreground leading-relaxed mt-4">
               从基础设施建设到细分行业突破，逐层赋能，构建产业协作新生态。
            </p>
          </div>
          <div className="md:col-span-9">
            <ProjectPlanning />
          </div>
        </section>

        {/* Timeline Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8" id="milestones">
          <div className="md:col-span-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">关键里程碑</h2>
          </div>
          <div className="md:col-span-9">
            <div className="relative max-h-[500px] overflow-y-auto pr-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40">
              <Timeline items={milestones} />
              
              {/* Fade Overlay at Bottom */}
              <div className="sticky bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Bi-weekly Updates Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8" id="updates">
          <div className="md:col-span-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">双周进展详情</h2>
            <Link 
              href="/updates" 
              className="inline-flex items-center text-xs font-medium text-primary hover:underline mt-4"
            >
              全屏查看
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="md:col-span-9">
            <div className="max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                {updates.map((update, index) => (
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
                ))}
              </div>
              
              {/* Fade Overlay at Bottom */}
              <div className="sticky bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8" id="achievements">
          <div className="md:col-span-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">阶段性成果</h2>
          </div>
          <div className="md:col-span-9">
            <Achievements achievements={achievements} />
          </div>
        </section>

        {/* Contributors Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-20" id="team">
          <div className="md:col-span-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">生产力</h2>
            <p className="text-xs text-muted-foreground">持续进化中</p>
          </div>
          <div className="md:col-span-9">
            <TeamGrid members={teamMembers} />
          </div>
        </section>
        
        <UpdateDetailModal 
          isOpen={!!selectedUpdate} 
          onClose={() => setSelectedUpdate(null)} 
          update={selectedUpdate} 
        />
      </main>
    </div>
  );
}
