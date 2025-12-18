
import { Theme, GuideTemplate } from './types';

export const THEMES: Theme[] = [
  { id: 'minimal', name: '极简商务', primaryColor: '#1e293b', secondaryColor: '#f1f5f9', bgColor: '#ffffff', textColor: '#334155', fontFamily: 'sans-serif', headerLayout: 'border-left', quoteLayout: 'simple', listStyle: 'standard' },
  { id: 'chinese-red', name: '国风喜庆', primaryColor: '#c21d24', secondaryColor: '#fde68a', bgColor: '#fffcf5', textColor: '#3f3f3f', fontFamily: 'serif', headerLayout: 'ornamental', quoteLayout: 'bracket', listStyle: 'numbered-circle', containerStyle: 'border: 2px solid #c21d24; outline: 1px solid #c21d24; outline-offset: 2px;' },
  { id: 'cyber', name: '赛博矩阵', primaryColor: '#00ff41', secondaryColor: '#003b00', bgColor: '#000000', textColor: '#00ff41', fontFamily: 'monospace', headerLayout: 'terminal', quoteLayout: 'full-bg', listStyle: 'square', containerStyle: 'border: 1px solid #00ff41;' },
  { id: 'academic', name: '学术论文', primaryColor: '#000000', secondaryColor: '#e5e7eb', bgColor: '#ffffff', textColor: '#111827', fontFamily: 'serif', headerLayout: 'double-line', quoteLayout: 'simple', listStyle: 'standard', containerStyle: 'padding: 40px; border: 1px solid #ddd;' },
  { id: 'dopamine', name: '糖果巴胺', primaryColor: '#ff6b6b', secondaryColor: '#4ecdc4', bgColor: '#ffe66d', textColor: '#2f2f2f', fontFamily: 'sans-serif', headerLayout: 'pill', quoteLayout: 'sticky', listStyle: 'numbered-circle', containerStyle: 'border: 4px solid #2f2f2f; border-radius: 20px;' },
  { id: 'paper', name: '纸张质感', primaryColor: '#4b3621', secondaryColor: '#d2b48c', bgColor: '#fdfcf0', textColor: '#5d4037', fontFamily: 'serif', headerLayout: 'ornamental', quoteLayout: 'bracket', listStyle: 'standard', containerStyle: 'border: 1px solid #e5e5d1; box-shadow: 5px 5px 0px #e5e5d1;' },
  { id: 'magazine', name: '时尚大刊', primaryColor: '#000000', secondaryColor: '#000000', bgColor: '#ffffff', textColor: '#1a1a1a', fontFamily: 'serif', headerLayout: 'card', quoteLayout: 'modern', listStyle: 'numbered-circle' },
  { id: 'emerald', name: '森系清晨', primaryColor: '#065f46', secondaryColor: '#d1fae5', bgColor: '#f0fdf4', textColor: '#064e3b', fontFamily: 'sans-serif', headerLayout: 'underline-center', quoteLayout: 'full-bg', listStyle: 'checkmark' },
  { id: 'tech-blue', name: '科技深蓝', primaryColor: '#3b82f6', secondaryColor: '#1e3a8a', bgColor: '#0f172a', textColor: '#e2e8f0', fontFamily: 'sans-serif', headerLayout: 'ribbon', quoteLayout: 'box', listStyle: 'square' },
  { id: 'macaron', name: '甜心粉紫', primaryColor: '#ec4899', secondaryColor: '#fdf2f8', bgColor: '#fef2f2', textColor: '#831843', fontFamily: 'sans-serif', headerLayout: 'pill', quoteLayout: 'dialogue', listStyle: 'numbered-circle' }
];

export const LEAD_IN_TEMPLATES: GuideTemplate[] = [
  { id: 'l1', name: '极简纯净', styleId: 'simple', isPremium: false },
  { id: 'l2', name: '虚线外框', styleId: 'dashed', isPremium: false },
  { id: 'l3', name: '毛玻璃卡片', styleId: 'glass', isPremium: true },
  { id: 'l4', name: '上沿徽章', styleId: 'badge', isPremium: true },
  { id: 'l5', name: '现代线条', styleId: 'modern-line', isPremium: true },
  { id: 'l6', name: '渐变药丸', styleId: 'gradient-pill', isPremium: true },
  { id: 'l7', name: '装饰括号', styleId: 'brackets', isPremium: true },
  { id: 'l8', name: '古典双线', styleId: 'classic-double', isPremium: true },
];

export const OUTRO_TEMPLATES: GuideTemplate[] = [
  { id: 'o1', name: '极简文案', styleId: 'simple', isPremium: false },
  { id: 'o2', name: '虚线总结', styleId: 'dashed', isPremium: false },
  { id: 'o3', name: '结束标记', styleId: 'end-mark', isPremium: true },
  { id: 'o4', name: '二维码卡片', styleId: 'qr-card', isPremium: true },
  { id: 'o5', name: '通栏色块', styleId: 'color-block', isPremium: true },
  { id: 'o6', name: '手写签名', styleId: 'handwritten', isPremium: true },
  { id: 'o7', name: '马卡龙贴纸', styleId: 'pastel', isPremium: true },
  { id: 'o8', name: '点线分割', styleId: 'separator', isPremium: true },
];

export const INITIAL_CONTENT = `# 排版的极致美感
## 为什么我们需要好设计的排版？

好的排版能让信息流动得更优雅。它不仅仅是文字的排列，更是一种情绪的表达。

### 排版的三大金律
1. **呼吸感**：给眼睛留出足够的空白。
2. **层次感**：主次分明，让核心观点跳出来。
3. **一致性**：建立属于你自己的视觉语言。

> “设计就是力量，通过设计，平庸可以变得非凡。”

**立即尝试不同的风格吧！**`;

export const DEFAULT_LEAD_IN = "关注我们，获取更多排版灵感。";
export const DEFAULT_OUTRO = "感谢您的阅读，点个「在看」吧！";
