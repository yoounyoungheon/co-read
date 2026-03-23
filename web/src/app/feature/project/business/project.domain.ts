export interface ProjectImage {
  path: string;
  description: string | null;
}

export interface Project {
  id: string;
  title: string;
  keyword?: string[];
  description: string[];
  thinks: string[];
  beTechs: string[];
  feTechs: string[];
  infraTechs: string[];
  images: ProjectImage[];
  startDate: Date;
  endDate: Date;
  projectMd?: string;
  retrospectMd?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const createProjectDomain = (
  id: string,
  title: string,
  description: string[],
  thinks: string[],
  beTechs: string[],
  feTechs: string[],
  infraTechs: string[],
  startDate: Date,
  endDate: Date,
  images: ProjectImage[],
  createdAt: string,
  updatedAt: string,
  keyword?: string[],
  projectMd?: string,
  retrospectMd?: string,
): Project => {
  const project: Project = {
    id,
    title,
    description,
    thinks,
    beTechs,
    feTechs,
    infraTechs,
    startDate,
    endDate,
    images,
    createdAt,
    updatedAt,
    projectMd,
    retrospectMd,
    keyword,
  };
  return project;
};
