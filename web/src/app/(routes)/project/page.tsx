import { loadProjectForGuestRequest } from "@/app/business/project/project.service";
import { ProjectIntroduceView } from "@/app/ui/components/domain/ProjectIntroduceView";
import { ProjectMarkdownView } from "@/app/ui/components/domain/ProjectMarkdownView";
import { TechStackView } from "@/app/ui/components/domain/TechStackView";
import { PageQueryProps } from "@/app/utils/type";

export default async function MainPage({ searchParams }: PageQueryProps) {
  const projectId =
    typeof searchParams.id === "string" ? searchParams.id : "p1";
  const response = await loadProjectForGuestRequest(projectId);
  const project = response.data;

  return (
    <main className="py-2">
      {project && (
        <div className="grid grid-cols-1 gap-1 whitespace-normal">
          <ProjectIntroduceView project={project} />
          <TechStackView
            betechs={project.beTechs}
            fetechs={project.feTechs}
            infratechs={project.infraTechs}
          />
          <br></br>
          <ProjectMarkdownView markdown={project.markdown} />
        </div>
      )}
    </main>
  );
}
