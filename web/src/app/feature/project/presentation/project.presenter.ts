import type { Project } from "../business/project.domain";
import type {
  ProjectCardViewModel,
  ProjectImageViewModel,
  ProjectReviewViewModel,
} from "./project.view-model";

export const presentProjectImage = (
  image: Project["images"][number],
): ProjectImageViewModel => {
  return {
    src: image.path,
    description: image.description,
  };
};

export const presentProjectCard = (
  project: Project,
): ProjectCardViewModel => {
  return {
    id: project.id,
    title: project.title,
    keyword: project.keyword ?? [],
    href: `/project?id=${project.id}`,
    imageSrc: project.images.at(0)?.path ?? "",
  };
};

export const presentProjectCards = (
  projects: Project[],
): ProjectCardViewModel[] => {
  return projects.map(presentProjectCard);
};

export const presentProjectReview = (
  markdown: string,
  project: Project,
): ProjectReviewViewModel => {
  return {
    markdown,
    images: project.images.map(presentProjectImage),
  };
};
