import Image from "next/image";
import Link from "next/link";
import ProfileImage from "@/app/assets/profile.png";
import GitImage from "@/app/assets/git.png";
import BlogImage from "@/app/assets/t.png";

export function ProfileView() {
  return (
    <main>
      <div className="flex flex-row items-center justify-center mb-12">
        <div className="w-32 h-32 rounded-full overflow-hidden border shadow-lg relative">
          <Image
            src={ProfileImage.src}
            alt={""}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1 ml-6">
          <h1 className="text font-bold">윤영헌</h1>
          <p className="text-sm text-gray-600">🖥️ developer</p>
          <p className="text-sm italic">open labs 2025.06 ~</p>
          <div className="flex flex-row gap-2 items-stretch">
            <div className="w-0.5 bg-gray-600" />
            <p className="text-sm">안녕하세요! 개발자 윤영헌입니다.</p>
          </div>

          <div className="flex flex-row gap-2">
            <Link href={"https://github.com/yoounyoungheon"}>
              <div className="w-6 h-6 rounded-full overflow-hidden shadow-lg relative">
                <Image
                  src={GitImage.src}
                  alt={""}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>

            <Link href={"https://younghun123.tistory.com/"}>
              <div className="w-6 h-6 rounded-full overflow-hidden shadow-lg relative">
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
    </main>
  );
}
