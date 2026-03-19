import { loadProjectForGuestRequest } from "@/app/business/project/project.service";
import { PageQueryProps } from "@/app/utils/type";

export default async function MainPage({ searchParams }: PageQueryProps) {
  const projectId =
    typeof searchParams.id === "string" ? searchParams.id : "p1";
  const response = await loadProjectForGuestRequest(projectId);
  const project = response.data;
  console.log(project);

  return <main className="py-2"></main>;
}
