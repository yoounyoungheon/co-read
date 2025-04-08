
import { Card } from "@/app/ui/components/view/molecule/card/card";
import { Dialog, DialogContent, DialogTrigger } from "@/app/ui/components/view/molecule/dialog/dialog";
import { loadProfileForGuestRequest } from "./business/profile/profile.service";
import { ProfileView } from "./ui/components/domain/ProfileView";
import AboutMe from "@/app/assets/aboutme.png"
import Project from "@/app/assets/project.png"
import Article from "@/app/assets/article.png"
import Link from "next/link";


export default async function MainPage() {
  const loadProfileReponse = await loadProfileForGuestRequest();
  const profile = loadProfileReponse.data;

  return (
    <main className="mt-40">
      <div className="mb-6 text-center text-3xl text-blue-950 font-bold">{`Younghun's Log`}</div>
      <div className="mb-5 text-center text-xl text-blue-950 font-semibold">{`Welocme! This is Younghun's portfolio web`}</div>
      <div className="px-12 grid grid-cols-1 gap-5">
        <Dialog>
            <DialogTrigger asChild>
              <Card
                className="relative p-10 border-none text-center shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 bg-cover bg-center"
                style={{ backgroundImage: `url(${AboutMe.src})` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
                <div className="relative flex items-center justify-center space-x-2 text-white text-xl font-semibold">
                  <span>ABOUT ME</span>
                </div>
                <div className="mt-3 relative text-white italic">간단한 소개글입니다.</div>
              </Card>
            </DialogTrigger>
            <DialogContent>
              {profile?
                <ProfileView profile={profile}/>:
                <div>서버 오류입니다. 잠시만 기다려주세요.</div>}
            </DialogContent>
          </Dialog>
        <div className="grid grid-cols-2 gap-5">
          
          <Link href={`/project`}>
            <Card
              className="relative p-10 border-none text-center shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 bg-cover bg-center"
              style={{ backgroundImage: `url(${Project.src})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
              <div className="relative flex items-center justify-center space-x-2 text-white text-xl font-semibold">
                <span>PROJECT</span>
              </div>
              <div className="mt-3 relative text-white italic">진행했던 프로젝트를 정리한 공간입니다.</div>
            </Card>
          </Link>

          <Link href={`/article`}>
            <Card
              className="relative p-10 border-none text-center shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 bg-cover bg-center"
              style={{ backgroundImage: `url(${Article.src})` }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
              <div className="relative flex items-center justify-center space-x-2 text-white text-xl font-semibold">
                <span>ARTICLE</span>
              </div>
              <div className="mt-3 relative text-white italic">공부하고 고민했던 내용을 기록한 공간입니다.</div>
            </Card>
          </Link>

        </div>
      </div>
    </main>
  )
}
