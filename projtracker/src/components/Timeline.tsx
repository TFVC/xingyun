"use client";

import { motion } from "framer-motion";
import { Milestone } from "@/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock, ExternalLink } from "lucide-react";

export function Timeline({ items }: { items: Partial<Milestone>[] }) {
  return (
    <div className="relative border-l-2 border-black/10 pl-8 ml-2 space-y-12">
      {items.map((milestone, index) => {
        const isCompleted = milestone.status === "completed";
        const isInProgress = milestone.status === "in-progress";

        return (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {/* Dot Indicator */}
            <div
              className={cn(
                "absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-background transition-colors duration-300",
                isCompleted ? "bg-primary border-primary" : "bg-muted border-muted",
                isInProgress && "bg-background border-primary animate-pulse"
              )}
            >
              {isInProgress && (
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                {milestone.layer && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground border border-muted-foreground/20 whitespace-nowrap">
                    {milestone.layer}
                  </span>
                )}
                <h3 className={cn("text-xl font-bold", isCompleted ? "text-foreground" : "text-muted-foreground")}>
                  {milestone.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded whitespace-nowrap">
                <Clock className="w-4 h-4" />
                {milestone.date}
              </div>
            </div>
            
            <p className="text-muted-foreground max-w-2xl">
              {milestone.description}
            </p>

            {milestone.link && (
              <a 
                href={milestone.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
              >
                查看详情 <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {/* Status Badge */}
            <div className="mt-3">
              <span
                className={cn(
                  "text-xs uppercase tracking-widest font-bold px-2 py-1 rounded-full border",
                  isCompleted ? "bg-primary/10 text-primary border-primary/20" : 
                  isInProgress ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-muted text-muted-foreground border-transparent"
                )}
              >
                {milestone.status === "completed" ? "已发布" : 
                 milestone.status === "in-progress" ? "进行中" : 
                 milestone.status === "pending" ? "准备中" : milestone.status}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
