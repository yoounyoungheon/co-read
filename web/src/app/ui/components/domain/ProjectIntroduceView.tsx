import { Project } from "@/app/business/project/project.domain";
import { Card } from "../view/molecule/card/card";
import ImageCarousel from "../view/molecule/carousel/carousel";

export const ProjectIntroduceView = ({ project }: { project: Project }) => {
  const { title, images, description, thinks } = project;

  return (
    <Card className="p-3 rounded-2xl shadow-md flex flex-col items-center space-y-5">
      <div className="text font-bold text-center">{title}</div>
      <ImageCarousel images={images} />
      <div className="w-full space-y-2">
        <div className="text text-sm font-semibold">프로젝트 소개</div>
        <div className="ml-2 space-y-1">
          {description.map((desc, index) => (
            <div key={index} className="text text-xs mb-1 flex items-start">
              <span className="mr-2">•</span>
              {desc}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full space-y-2">
        <div className="text text-sm w-full font-semibold">
          무엇을 개발했나요?
        </div>
        <div className="ml-2 space-y-1">
          {thinks.map((think, index) => (
            <div key={index} className="text text-xs mb-1 flex items-start">
              <span className="mr-2">•</span>
              {think}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
