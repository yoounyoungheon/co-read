import { Project } from "@/app/feature/project/business/project.domain";
import { FeedCard } from "./FeedCard";

interface FeedGridProps {
  projects: Project[];
}

export const FeedGrid = ({ projects }: FeedGridProps) => {
  return (
    <div className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <FeedCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export type { FeedGridProps };
