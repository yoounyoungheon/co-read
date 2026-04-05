export interface ProjectImageViewModel {
  src: string;
  description: string | null;
}

export interface ProjectCardViewModel {
  id: string;
  title: string;
  keyword: string[];
  href: string;
  imageSrc: string;
}

export interface ProjectReviewViewModel {
  markdown: string;
  images: ProjectImageViewModel[];
}
