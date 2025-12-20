
export interface Theme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  textColor: string;
  fontFamily: string;
  headerLayout: 'border-left' | 'pill' | 'underline-center' | 'double-line' | 'terminal' | 'card' | 'ornamental' | 'ribbon' | 'dot' | 'gradient';
  quoteLayout: 'simple' | 'sticky' | 'full-bg' | 'bracket' | 'dialogue' | 'modern' | 'line-top' | 'box';
  listStyle: 'standard' | 'numbered-circle' | 'square' | 'checkmark' | 'diamond' | 'handdrawn';
  containerStyle?: string;
}

export type GuideStyleId = 'simple' | 'dashed' | 'glass' | 'badge' | 'modern-line' | 'gradient-pill' | 'brackets' | 'classic-double' | 'end-mark' | 'qr-card' | 'color-block' | 'handwritten' | 'pastel' | 'separator';

export interface GuideTemplate {
  id: string;
  name: string;
  styleId: GuideStyleId;
  isPremium: boolean;
}

export type EditorMode = 'edit' | 'preview';

export interface ArticleState {
  title: string;
  content: string;
  author: string;
  summary: string;
}
