import { Project } from "@/app/business/project/project.domain";
import { Card } from "../view/molecule/card/card";
import ImageCarousel from "../view/molecule/carousel/carousel";

export const ProjectIntroduceView = ({ project }: { project: Project }) => {
  const { title, images, description, thinks } = project;

  return (
    <div className="flex flex-col gap-1">
      <div className="text font-bold text-center lg:text-lg">{title}</div>
      <div className="w-full border-t border-gray-300 my-4" />
      <Card className="p-3 rounded-2xl shadow-md flex flex-col items-center space-y-5 mx-2">
        <ImageCarousel images={images} />
      </Card>
      <div className="w-full border-t border-gray-300 my-4" />
      <div className="w-full space-y-2 px-4">
        <div className="text font-semibold text-sm md:text-base lg:text-lg">
          프로젝트 소개
        </div>
        <div className="ml-2 space-y-1">
          {description.map((desc, index) => (
            <div
              key={index}
              className="text text-xs lg:text-base mb-1 flex items-start"
            >
              <span className="mr-2">•</span>
              {desc}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full border-t border-gray-300 my-4" />
      <div className="w-full space-y-2 px-4">
        <div className="text font-semibold text-sm md:text-base lg:text-lg">
          개발 내용 및 담당 역할
        </div>
        <div className="ml-2 space-y-1">
          {thinks.map((think, index) => (
            <div
              key={index}
              className="text text-xs lg:text-base mb-1 flex items-start"
            >
              <span className="mr-2">•</span>
              {think}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full border-t border-gray-300 my-4" />
    </div>
  );
};
