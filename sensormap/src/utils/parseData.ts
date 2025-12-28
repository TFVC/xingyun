import type { Category, NavItem } from '../types';

export function parseMarkdownData(markdown: string): Category[] {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const categories: Category[] = [];
  
  let currentCategory: Category | null = null;
  let currentSubcategory: { id: string; title: string; items: NavItem[] } | null = null;
  let currentItem: Partial<NavItem> | null = null;
  let currentContentLines: string[] = [];

  const finalizeItem = () => {
    if (currentItem && (currentCategory || currentSubcategory)) {
      const item: NavItem = {
        id: currentItem.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: currentItem.title || 'Untitled',
        description: currentItem.description || '',
        icon: currentItem.icon || 'Circle',
        type: currentItem.type || (currentItem.link ? 'link' : 'popup'),
        link: currentItem.link,
        content: currentContentLines.join('\n').trim(),
      };

      if (currentSubcategory) {
        currentSubcategory.items.push(item);
      } else if (currentCategory) {
        if (!currentCategory.items) currentCategory.items = [];
        currentCategory.items.push(item);
      }
    }
    currentItem = null;
    currentContentLines = [];
  };

  const finalizeSubcategory = () => {
    finalizeItem();
    if (currentSubcategory && currentCategory) {
      if (!currentCategory.subcategories) currentCategory.subcategories = [];
      currentCategory.subcategories.push(currentSubcategory);
    }
    currentSubcategory = null;
  };

  const finalizeCategory = () => {
    finalizeSubcategory();
    if (currentCategory) {
      categories.push(currentCategory);
    }
    currentCategory = null;
  };

  const idRegex = /\{id=([^}]+)\}/;
  const iconRegex = /\{icon=([^}]+)\}/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    const isCategoryHeader = trimmedLine.startsWith('# ') && idRegex.test(trimmedLine);
    const isSubcategoryHeader = trimmedLine.startsWith('## ') && idRegex.test(trimmedLine);
    const isItemHeader =
      trimmedLine.startsWith('### ') &&
      ((currentItem ? iconRegex.test(trimmedLine) : true) || iconRegex.test(trimmedLine));

    if (isItemHeader && (currentCategory || currentSubcategory)) {
      finalizeItem();

      const headerText = trimmedLine.slice(4).trim();
      const iconMatch = headerText.match(iconRegex);
      const title = headerText.replace(iconRegex, '').trim();

      currentItem = {
        title,
        icon: iconMatch ? iconMatch[1] : 'Circle',
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
      };
      continue;
    }

    if (isSubcategoryHeader) {
      finalizeSubcategory();

      const headerText = trimmedLine.slice(3).trim();
      const idMatch = headerText.match(idRegex);
      const title = headerText.replace(idRegex, '').trim();

      currentSubcategory = {
        id: idMatch ? idMatch[1] : `sub-${Date.now()}-${i}`,
        title,
        items: []
      };
      continue;
    }

    if (isCategoryHeader) {
      finalizeCategory();

      const headerText = trimmedLine.slice(2).trim();
      const idMatch = headerText.match(idRegex);
      const title = headerText.replace(idRegex, '').trim();

      currentCategory = {
        id: idMatch ? idMatch[1] : `cat-${Date.now()}-${i}`,
        title,
        items: [],
        subcategories: []
      };
      continue;
    }

    // Item Metadata processing
    if (currentItem) {
      if (trimmedLine.startsWith('> ')) {
        const descLine = trimmedLine.replace('> ', '').trim();
        currentItem.description = currentItem.description 
          ? currentItem.description + '\n' + descLine 
          : descLine;
        continue;
      }
      
      if (trimmedLine.startsWith('- Link: ')) {
        currentItem.link = trimmedLine.replace('- Link: ', '').trim();
        currentItem.type = 'link';
        continue;
      }

      if (trimmedLine.startsWith('- Type: ')) {
        const typeStr = trimmedLine.replace('- Type: ', '').trim();
        if (typeStr === 'link' || typeStr === 'popup') {
          currentItem.type = typeStr as NavItem['type'];
        }
        continue;
      }
      
      currentContentLines.push(line);
    }
  }

  finalizeCategory();

  return categories;
}
