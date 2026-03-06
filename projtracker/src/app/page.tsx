import { HomeClient } from "@/components/HomeClient";
import { getMilestones, getUpdates, getAchievements, getTeamMembers } from "@/lib/dataLoader";

export const dynamic = 'force-dynamic'; // Ensures the page is rebuilt on request, useful for file system changes

export default function Home() {
  const milestones = getMilestones();
  const updates = getUpdates();
  const achievements = getAchievements();
  const teamMembers = getTeamMembers();

  return (
    <HomeClient 
      milestones={milestones}
      updates={updates}
      achievements={achievements}
      teamMembers={teamMembers}
    />
  );
}
