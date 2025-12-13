import { Card } from "@/app/ui/components/view/molecule/card/card";
import Link from "next/link";
import Image from "next/image";
import { Project } from "@/app/business/project/project.domain";

export const FeedView = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="grid grid-cols-3 gap-1 lg:grid-cols-4 lg:px-4 md:grid-cols-4 sm:grid-cols-4">
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

const Feed = ({
  image,
  projectName,
  id,
}: {
  image: string;
  projectName: string;
  id: string;
}) => {
  return (
    <Link href={`/project?id=${id}`}>
      <Card className="aspect-square relative p-2 border-none text-center shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 bg-cover bg-center">
        <Image
          src={image}
          alt={""}
          fill
          className="rounded-lg object-contain"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
        <div className="relative flex items-center justify-center space-x-2 text-white text-xs font-semibold whitespace-pre-wrap">
          <span>{projectName}</span>
        </div>
      </Card>
    </Link>
  );
};
