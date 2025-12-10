import { Project } from "@/app/business/project/project.domain";
import { Card } from "../view/molecule/card/card";
import Image from "next/image";

export const ProjectIntroduceView = ({ project }: { project: Project }) => {
  const { title, imageUrl, description, thinks } = project;

  return (
    <Card className="p-3 rounded-2xl shadow-md flex flex-col items-center space-y-5">
      <div className="text font-bold text-center">{title}</div>

      <div className="relative w-full aspect-[3/2]">
        <Image src={imageUrl} alt="" fill className="object-cover rounded-xl" />
      </div>

      <div className="w-full space-y-2">
        <div className="text text-sm font-semibold">{"Description"}</div>
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
        <div className="text text-sm w-full font-semibold">{"고민한 내용"}</div>
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
