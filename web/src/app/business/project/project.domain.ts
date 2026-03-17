export interface Project {
  id: string;
  title: string;
  keyword?: string[];
  description: string[];
  thinks: string[];
  beTechs: string[];
  feTechs: string[];
  infraTechs: string[];
  images: string[];
  startDate: Date;
  endDate: Date;
  markdown?: string;
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
  images: string[],
  createdAt: string,
  updatedAt: string,
  keyword?: string[],
  markdown?: string,
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
    markdown,
    keyword,
  };
  return project;
};
