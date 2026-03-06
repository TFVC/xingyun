import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Tag } from "lucide-react";
import { Update } from "@/types";

interface UpdateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  update: Update | null;
}

export function UpdateDetailModal({ isOpen, onClose, update }: UpdateDetailModalProps) {
  if (!isOpen || !update) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />
          
          {/* Modal Content */}
          <motion.div
            layoutId={`card-${update.id}`}
            className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-50 flex flex-col bg-background shadow-lg border rounded-lg w-[90%] max-w-lg max-h-[85vh]"
          >
            {/* Header */}
            <div className="relative p-4 sm:p-6 border-b shrink-0">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
              
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                <Calendar className="w-3 h-3" />
                <span>{update.date}</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight pr-6">{update.title}</h2>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-grow pb-8">
              <div className="space-y-4">
                {/* Description */}
                <div className="text-sm leading-relaxed text-muted-foreground space-y-2">
                  {update.description.split('\n').map((line, i) => (
                    <p key={i} className="min-h-[1.25rem]">
                      {line.trim() ? line : <br />}
                    </p>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {update.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Authors */}
                <div className="flex items-center gap-2 pt-2 border-t mt-4">
                  <div className="flex -space-x-2">
                    {update.authors.map((author, i) => (
                      <img 
                        key={i}
                        src={author.avatar} 
                        alt={author.name}
                        className="w-8 h-8 rounded-full border-2 border-background"
                        title={author.name}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground ml-2">
                    <span className="font-medium text-foreground">生产力: </span>
                    {update.authors.map(a => a.name).join(", ")}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
