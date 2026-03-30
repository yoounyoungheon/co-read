export interface HeroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export interface SectionIntroProps {
  indexLabel: string;
  title: string;
  description: string;
}

export interface FlipFaceContent {
  eyebrow: string;
  title: string;
  description?: string;
  footer?: string;
  list?: string[];
}

export interface FlipCardDemoProps {
  front: FlipFaceContent;
  back: FlipFaceContent;
}

export interface ExpandableItem {
  title: string;
  body: string;
}

export interface ExpandableCardProps {
  eyebrow: string;
  title: string;
  description: string;
  items: ExpandableItem[];
}

export interface CssOnlyTabItem {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
}
