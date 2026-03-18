import { Project } from "@/app/business/project/project.domain";
import { FeedCard } from "./FeedCard";

interface FeedGridProps {
  projects: Project[];
}

export const FeedGrid = ({ projects }: FeedGridProps) => {
  return (
    <div className="grid h-full w-full grid-cols-1 items-start gap-5 md:grid-cols-3 lg:max-w-[1500px] lg:grid-cols-4">
      {projects.map((project) => (
        <FeedCard
          key={project.id}
          image={project.images.at(0) || ""}
          projectName={project.title}
          keyword={project.keyword}
          id={project.id}
        />
      ))}
    </div>
  );
};

export type { FeedGridProps };
