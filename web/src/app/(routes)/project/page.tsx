import { loadProjectsForGuestRequest } from "@/app/business/project/project.service";
import { Card } from "@/app/ui/components/view/molecule/card/card";
import OfficeImage from "@/app/assets/officeimage.png";
import Image from "next/image";
import Link from "next/link";
import AchromaticButton from "@/app/ui/components/view/atom/button/achromatic-button";

export default async function ProjectPage() {
  const lodaProjectsReponse = await loadProjectsForGuestRequest();
  console.log(lodaProjectsReponse);
  const projects = lodaProjectsReponse.data;
  return (
    <main>
      {projects?.length === 0 || lodaProjectsReponse.isFailure ? (
        <div className="p-10 text-center text-3xl text-blue-950 font-bold">{`프로젝트가 없습니다.`}</div>
      ) : (
        <div className="grid grid-cols-4 gap-5 p-10">
          {projects?.map((project) => (
            <div key={project.id}>
              <Card key={project.id} className="grid grid-cols-1 gap-3 p-6 text-start">
                <Image className="rounded-lg mb-4" src={OfficeImage.src} alt={""} width={400} height={200}/>
                <div className="text-lg font-bold">{project.title}</div>
                <Link href={`/project/detail?projectId=${project.id}`}><AchromaticButton>view more</AchromaticButton></Link>
              </Card>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}