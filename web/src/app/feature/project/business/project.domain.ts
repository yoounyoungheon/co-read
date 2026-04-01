export interface ProjectImage {
  path: string;
  description: string | null;
}

export interface Project {
  id: string;
  title: string;
  keyword?: string[];
  images: ProjectImage[];
  projectMd?: string;
  retrospectMd?: string;
}

export const createProjectDomain = (
  id: string,
  title: string,
  images: ProjectImage[],
  keyword?: string[],
  projectMd?: string,
  retrospectMd?: string,
): Project => {
  const project: Project = {
    id,
    title,
    images,
    projectMd,
    retrospectMd,
    keyword,
  };
  return project;
};
