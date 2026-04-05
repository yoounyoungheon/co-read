export interface ProjectImageApiModel {
  path: string;
  description: string | null;
}

export interface ProjectApiModel {
  id: string;
  title: string;
  keyword?: string[];
  images: ProjectImageApiModel[];
  projectMd?: string;
  retrospectMd?: string;
  markdown?: string;
  markdown2?: string;
}
