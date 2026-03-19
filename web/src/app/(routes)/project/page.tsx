import { loadProjectForGuestRequest } from "@/app/feature/project/business/project.service";
import { ProjectImageList } from "@/app/feature/project/ui/ProjectImageList";
import { ProjectReview } from "@/app/feature/project/ui/ProjectReview";
import { PageQueryProps } from "@/app/utils/type";

export default async function MainPage({ searchParams }: PageQueryProps) {
  const projectId =
    typeof searchParams.id === "string" ? searchParams.id : "p1";
  const response = await loadProjectForGuestRequest(projectId);
  const project = response.data;
  console.log(project);

  return (
    <main className="flex flex-col gap-5 py-2 max-w-3xl">
      {project && <ProjectImageList images={project.images} />}
      {project && <ProjectReview markdown={project.markdown ?? ""} />}
    </main>
  );
}
