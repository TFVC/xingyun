import { parseMarkdownData } from './utils/parseData';
const markdownModules = import.meta.glob('./markdown/*.md', { query: '?raw', import: 'default', eager: true });
const markdown = Object.keys(markdownModules)
  .sort()
  .map((key) => markdownModules[key] as string)
  .join('\n\n');

export const categories = parseMarkdownData(markdown);
