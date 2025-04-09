import { loadProjectsForGuestRequest } from "@/app/business/project/project.service";
import { Card } from "@/app/ui/components/view/molecule/card/card";
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
        <div className="grid grid-cols-3 gap-5 p-10">
          {projects?.map((project) => (
            <Card
              key={project.id}
              className="flex flex-col h-[400px] w-full p-6 text-start rounded-xl shadow-md"
            >
              <Image
                className="rounded-lg mb-4 object-cover"
                src={project.imageUrl}
                alt=""
                width={400}
                height={200}
                unoptimized
                style={{ width: "100%", height: "200px" }}
              />
              <div className="text-lg font-bold line-clamp-2">{project.title}</div>
              <div className="mt-auto">
                <Link href={`/project/detail?projectId=${project.id}`}>
                  <AchromaticButton>view more</AchromaticButton>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}