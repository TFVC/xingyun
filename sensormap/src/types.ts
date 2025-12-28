export interface NavItem {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon name from lucide-react
  link?: string;
  content?: string; // Markdown content
  type: 'link' | 'popup';
}

export interface SubCategory {
  id: string;
  title: string;
  items: NavItem[];
}

export interface Category {
  id: string;
  title: string;
  items?: NavItem[];
  subcategories?: SubCategory[];
}
