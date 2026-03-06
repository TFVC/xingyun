import { motion } from "framer-motion";
import { Calendar, Tag, ArrowRight } from "lucide-react";

interface UpdateCardProps {
  id: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
  authors: { name: string; avatar: string }[];
  type?: string;
  onClick?: () => void;
}

export function UpdateCard({ id, date, title, description, tags, authors, type = "bi-weekly", onClick }: UpdateCardProps) {
  return (
    <motion.div 
      layoutId={`card-${id}`}
      onClick={onClick}
      className={`group border border-border bg-card hover:border-primary/50 transition-colors duration-300 p-6 rounded-lg relative overflow-hidden flex flex-col h-full ${onClick ? 'cursor-pointer hover:shadow-lg transition-all' : ''}`}
      whileHover={{ y: -4 }}
    >
      {/* Swiss Style Decorative Bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-muted group-hover:bg-primary transition-colors duration-300" />
      
      <div className="pl-4 flex flex-col h-full">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground uppercase tracking-wider font-medium mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {date}
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1.5">
              {authors.map((author, i) => (
                <img 
                  key={i}
                  src={author.avatar} 
                  alt={author.name}
                  className="w-4 h-4 rounded-full border border-background"
                  title={author.name}
                />
              ))}
            </div>
            <span>{authors.map(a => a.name).join(", ")}</span>
          </div>
          <span className="text-border">|</span>
          <div className="px-2 py-0.5 bg-muted rounded text-[10px]">
            {type === 'bi-weekly' ? '双周进展' : type === 'release' ? '版本发布' : type}
          </div>
        </div>

        <div className="flex-grow">
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3">
            {description}
          </p>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-2">
            {tags.map((tag) => (
              <span key={tag} className="text-xs font-mono text-muted-foreground border border-border px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
          
          {/* Read More Link (Mock) */}
          <div className="pt-2 flex justify-end">
               <button className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                  查看详情 <ArrowRight className="w-4 h-4" />
               </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
