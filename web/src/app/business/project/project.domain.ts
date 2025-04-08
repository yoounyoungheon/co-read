export interface Project {
  id: string;

  userId: string;

  title: string;

  description: string;

  beTechs: string[];

  feTechs: string[];

  infraTechs: string[];

  startDate: Date;

  endDate: Date;

  createdAt?: string;

  updatedAt?: string;
}

export const createProjectDomain = (
  id: string,
  userId: string,
  title: string,
  description: string,
  beTechs: string[],
  feTechs: string[],
  infraTechs: string[],
  startDate: Date,
  endDate: Date,
  createdAt: string,
  updatedAt: string,
): Project => {
  const project: Project = { id, userId, title, description, beTechs, feTechs, infraTechs, startDate, endDate, createdAt, updatedAt };
  return project;
};