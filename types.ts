
export enum Category {
  LLM = 'LLM',
  AGENT = 'Agent',
  CODE = 'Code',
  PROJECT = 'Project'
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  code?: string;
  language?: string;
  category: Category;
  author: string;
  date: string;
  image: string;
  tags: string[];
}

export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  headingFont: string;
  bodyFont: string;
  borderRadius: string;
  gridColumns: number;
  heroAlignment: 'left' | 'center';
  glassEffect: boolean;
}

export interface SiteConfig {
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  authorName: string;
  authorRole: string;
  avatarUrl: string;
  theme: ThemeConfig;
}
