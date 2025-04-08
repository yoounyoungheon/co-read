export interface Project {
  id: string;

  userId: string;

  title: string;

  description: string[];

  thinks: string[];

  beTechs: string[];

  feTechs: string[];

  infraTechs: string[];

  imageUrl: string;

  startDate: Date;

  endDate: Date;

  createdAt?: string;

  updatedAt?: string;
}

export const createProjectDomain = (
  id: string,
  userId: string,
  title: string,
  description: string[],
  thinks: string[],
  beTechs: string[],
  feTechs: string[],
  infraTechs: string[],
  startDate: Date,
  endDate: Date,
  imageUrl: string,
  createdAt: string,
  updatedAt: string,
): Project => {
  const project: Project = { id, userId, title, description, thinks, beTechs, feTechs, infraTechs, startDate, endDate, imageUrl, createdAt, updatedAt };
  return project;
};