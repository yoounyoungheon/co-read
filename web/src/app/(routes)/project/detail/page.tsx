import { Project } from "@/app/business/project/project.domain";
import { loadProjectForGuestRequest, loadUserInterfaceRequest } from "@/app/business/project/project.service";
import { UserInterface } from "@/app/business/project/user-interface.domain";
import { TechStackView } from "@/app/ui/components/domain/TechStackView";
import { UserInterfaceView } from "@/app/ui/components/domain/UserInterfaceCardView";
import { Card, CardTitle } from "@/app/ui/components/view/molecule/card/card";

export default async function ProjectPage({
    searchParams,
  }: {
    searchParams: { [key: string]: string | undefined };
  }) {
  const projectId = searchParams.projectId;
  let project: Project | null =null;
  const userInterfaces: UserInterface[] = [];

  if(typeof projectId !== "undefined") {
    project = (await loadProjectForGuestRequest(projectId)).data;
  }

  if(project && project.id) {
    await loadUserInterfaceRequest(project.id).then((res)=>{
      if(res.isSuccess && res.data) {
        userInterfaces.push(...res.data);
      }
    })
  }
  return (
    <main className="grid grid-cols-1 gap-3 p-6 text-start">
      <div className="text-3xl font-bold"><span>PROJECT</span></div>
      <div className="grid grid-cols-2 gap-3">
        <Card>
            <div className="p-3 ml-3 text-xl font-bold">{project?.title}</div>
            <div className="mb-1 px-6 text-sm text-gray-500 text-end">{`${project?.startDate.toLocaleString().substring(0,8)} ~ ${project?.endDate.toLocaleString().substring(0,8)}`}</div>
            <hr/>
            <div className="pl-6 mt-2 text-lg font-semibold ">📝 프로젝트 소개</div>
            <div className="py-3 px-6 text-gray-700">
              {project?.description.map((val)=>{
                return (<p className="mb-3" key={val}>{val}</p>)})}
            </div>
            <hr/>
            <div className="pl-6 mt-2 text-lg font-semibold">💡 고민한 내용</div>
            <div className="py-3 px-6 text-gray-700">
              {project?.thinks.map((val)=>{
                return (<p className="mb-3" key={val}>{val}</p>)})}
            </div>
        </Card>
        <TechStackView betechs={project?.beTechs || []} fetechs={project?.feTechs || []} infratechs={project?.infraTechs || []}/>
      </div>
      <Card className="bg-slate-100 border-none shadow-none">
        <CardTitle className="text-xl font-bold mb-3">
          주요 기능
        </CardTitle>
        <UserInterfaceView userInterfaces={userInterfaces.sort((a, b)=>{return a.order - b.order})}/>
      </Card>
    </main>
  )
}