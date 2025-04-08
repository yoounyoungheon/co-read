import { Project } from "./project.domain";

export interface UserInterface {
  id: string;
  project: Project;
  order: number;
  fileUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const createUserInterfaceDomain = (
  id: string,
  project: Project,
  order: number,
  fileUrl: string,
  description: string,
  createdAt: string,
  updatedAt: string,
): UserInterface => {
  const userInterface: UserInterface = { id, project, order, fileUrl, description, createdAt, updatedAt };
  return userInterface;
};
