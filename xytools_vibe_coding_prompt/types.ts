
export interface VibeFormData {
  siteName: string;
  brand: string;
  brandLink: string;
  hasMembership: boolean;
  memberFeatures: string;
  passwordRules: string;
  requirements: string[];
  language: 'zh' | 'en';
  colorTone: 'dark' | 'light';
  additionalFeatures: string;
}

export interface RequirementOption {
  id: string;
  label: {
    zh: string;
    en: string;
  };
  icon: string;
}
