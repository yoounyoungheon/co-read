import { loadProjectForGuestRequest } from "@/app/feature/project/business/project.service";
import { ProjectImageList } from "@/app/feature/project/ui/ProjectImageList";
import { ProjectReview } from "@/app/feature/project/ui/ProjectReview";
import { Card } from "@/app/shared/ui/molecule/card";
import { PageQueryProps } from "@/app/utils/type";

export default async function MainPage({ searchParams }: PageQueryProps) {
  const projectId =
    typeof searchParams.id === "string" ? searchParams.id : "p1";
  const response = await loadProjectForGuestRequest(projectId);
  const project = response.data;

  return (
    <main className="flex flex-col gap-5 py-2 w-full max-w-7xl">
      <Card className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm px-5">
        <div className="flex flex-col">
          {project && <ProjectReview markdown={project.projectMd ?? ""} />}
          {project && <ProjectImageList images={project.images} />}
          {project && <ProjectReview markdown={project.retrospectMd ?? ""} />}
        </div>
      </Card>
    </main>
  );
}
