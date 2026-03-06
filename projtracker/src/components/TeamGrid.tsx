import { TeamMember } from "@/types";
import { Github, Globe, Twitter } from "lucide-react";

export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {members.map((member) => (
        <div key={member.id} className="text-center group">
          <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-muted group-hover:border-primary transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={member.avatar} 
              alt={member.name} 
              className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <h4 className="font-bold text-lg">{member.name}</h4>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{member.role}</p>
          
          <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            {member.links?.github && (
              <a href={member.links.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Github className="w-4 h-4" />
              </a>
            )}
            {member.links?.website && (
              <a href={member.links.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

