import { Project } from "@/app/business/project/project.domain";
import { Feed } from "./Feed";

interface FeedGridProps {
  projects: Project[];
}

export const FeedGrid = ({ projects }: FeedGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-1 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 lg:px-4">
      {projects.map((project) => (
        <Feed
          key={project.id}
          image={project.images.at(0) || ""}
          projectName={project.title}
          id={project.id}
        />
      ))}
    </div>
  );
};

export type { FeedGridProps };
