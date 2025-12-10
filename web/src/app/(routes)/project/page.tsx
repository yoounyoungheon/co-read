import { loadProjectForGuestRequest } from "@/app/business/project/project.service";
import { ProjectIntroduceView } from "@/app/ui/components/domain/ProjectIntroduceView";
import { TechStackView } from "@/app/ui/components/domain/TechStackView";
import { PageQueryProps } from "@/app/utils/type";

export default async function MainPage({ searchParams }: PageQueryProps) {
  const projectId =
    typeof searchParams.id === "string" ? searchParams.id : "p1";
  const response = await loadProjectForGuestRequest(projectId);
  const project = response.data;

  return (
    <main className="py-2 px-2">
      {project && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-1 whitespace-normal">
          <ProjectIntroduceView project={project} />
          <TechStackView
            betechs={project.beTechs}
            fetechs={project.feTechs}
            infratechs={project.infraTechs}
          />
        </div>
      )}
    </main>
  );
}
