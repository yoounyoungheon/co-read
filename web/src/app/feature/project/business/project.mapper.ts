import {
  Project,
  ProjectImage,
  createProjectDomain,
} from "./project.domain";
import { ProjectApiModel, ProjectImageApiModel } from "./project.api-model";

const mapProjectImageApiModelToDomain = (
  image: ProjectImageApiModel,
): ProjectImage => {
  return {
    path: image.path,
    description: image.description,
  };
};

export const mapProjectApiModelToDomain = (
  project: ProjectApiModel,
): Project => {
  return createProjectDomain(
    project.id,
    project.title,
    project.images.map(mapProjectImageApiModelToDomain),
    project.keyword,
    project.projectMd ?? project.markdown,
    project.retrospectMd ?? project.markdown2,
  );
};

export const mapProjectApiModelListToDomain = (
  projects: ProjectApiModel[],
): Project[] => {
  return projects.map(mapProjectApiModelToDomain);
};
