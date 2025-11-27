import { Card } from "@/app/ui/components/view/molecule/card/card";
import ProfileImage from "@/app/assets/profile.png";
import GitImage from "@/app/assets/git.png";
import BlogImage from "@/app/assets/t.png";
import Article from "@/app/assets/article.png";
import Link from "next/link";
import Image from "next/image";

export default async function MainPage() {
  return (
    <main className="py-12 px-2">
      {/* 프로필 영역 */}
      <div className="flex flex-row gap-1 items-center justify-center mb-12">
        <div className="w-32 h-32 rounded-full overflow-hidden border shadow-lg relative">
          <Image
            src={ProfileImage.src}
            alt={""}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 ml-6">
          <h1 className="text-xl font-bold">윤영헌</h1>
          <p className="text-sm text-gray-600">🖥️ web-developer</p>
          <p className="text-sm italic">open labs 2025.06 ~</p>
          <div className="flex flex-row gap-2 items-stretch">
            <div className="w-0.5 bg-gray-600" />
            <p className="text-sm">안녕하세요! 개발자 윤영헌입니다.</p>
          </div>

          <div className="flex flex-row gap-2">
            <Link href={"https://younghun123.tistory.com/"}>
              <div className="w-7 h-7 rounded-full overflow-hidden shadow-lg relative">
                <Image
                  src={GitImage.src}
                  alt={""}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>

            <Link href={" https://github.com/yoounyoungheon"}>
              <div className="w-7 h-7 rounded-full overflow-hidden shadow-lg relative">
                <Image
                  src={BlogImage.src}
                  alt={""}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 피드 영역 */}
      <div className="px-12 grid grid-cols-1 gap-5">
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3 lg:grid-cols-3 base:grid-cols-3 sm:grid-cols-3">
          <Link href={`/`}>
            <Card className="aspect-square relative p-10 mt-3 border-none text-center shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 bg-cover bg-center">
              <Image
                src={ProfileImage.src}
                alt={""}
                fill
                className="rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
              <div className="relative flex items-center justify-center space-x-2 text-white text-3xl font-semibold">
                <span>PROJECT</span>
              </div>
            </Card>
          </Link>

          <Link href={`/`}>
            <Card className="aspect-square relative p-10 mt-3 border-none text-center shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 bg-cover bg-center">
              <Image src={Article.src} alt={""} fill className="rounded-lg" />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
              <div className="relative flex items-center justify-center space-x-2 text-white text-3xl font-semibold">
                <span>ARTICLE</span>
              </div>
            </Card>
          </Link>

          <Link href={`/`}>
            <Card className="aspect-square relative p-10 mt-3 border-none text-center shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 bg-cover bg-center">
              <Image src={Article.src} alt={""} fill className="rounded-lg" />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
              <div className="relative flex items-center justify-center space-x-2 text-white text-3xl font-semibold">
                <span>ARTICLE</span>
              </div>
            </Card>
          </Link>

          <Link href={`/`}>
            <Card className="aspect-square relative p-10 mt-3 border-none text-center shadow-lg rounded-lg hover:scale-105 transition-transform duration-300 bg-cover bg-center">
              <Image src={Article.src} alt={""} fill className="rounded-lg" />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg"></div>
              <div className="relative flex items-center justify-center space-x-2 text-white text-3xl font-semibold">
                <span>ARTICLE</span>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
