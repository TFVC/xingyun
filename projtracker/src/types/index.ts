export type MilestoneStatus = "completed" | "in-progress" | "pending";

export interface Milestone {
  id?: string;
  title: string;
  date: string; // YYYY-MM-DD
  description: string;
  status: MilestoneStatus;
  link?: string;
  layer?: string;
}

export interface Update {
  id?: string;
  date: string;
  title: string;
  authors: { name: string; avatar: string }[];
  type: "bi-weekly" | "release" | "announcement";
  tags: string[];
  description: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  avatar: string;
export interface Achievement {
  title: string;
  desc: string;
  tags?: string[];
  status: "completed" | "in-progress";
  link: string;
}

export interface LayerGroup {
  id: string;
  label: string;
  levelName: string;
  color: "primary" | "secondary" | "accent";
  headerStyle: string;
  items: Achievement[];
}
