import Image from "next/image";
import Link from "next/link";
import ProfileImage from "@/app/assets/profile.png";
import GitImage from "@/app/assets/git.png";
import BlogImage from "@/app/assets/t.png";

export function ProfileView() {
  return (
    <main>
      <div className="flex flex-col gap-1 mb-12 items-center justify-center">
        <div className="items-start justify-start space-y-5">
          {/* section1 이미지 + 이름/학교/직업 */}
          <div className="flex flex-row items-center">
            <div className="p-0.5 rounded-full bg-gradient-to-br from-pink-700 via-purple-300 to-indigo-500 shadow-lg">
              <div className="w-32 h-32 rounded-full overflow-hidden relative">
                <Image
                  src={ProfileImage.src}
                  alt=""
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 ml-4">
              <p className="font-bold tracking-tight">윤영헌</p>

              <p className="text-sm text-gray-600">🖥️ developer</p>

              <p className="text-sm italic text-gray-500">
                Dongguk Univ · scsc & biz
              </p>

              <p className="text-sm italic text-gray-500">
                Open Labs · 2025.06 ~
              </p>
            </div>
          </div>

          {/* section2 소개글 */}
          <div>
            <div className="flex flex-row gap-3 items-stretch mt-1">
              <div className="w-1 rounded-full bg-gradient-to-b from-pink-400 to-purple-500 self-stretch" />
              <p className="text-xs lg:text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                {`안녕하세요! 개발자 윤영헌입니다.\n융합소프트웨어와 경영학을 전공했습니다.\n비즈니스, 기술적 관점에서 변화에 유연한 소프트웨어 설계를 고민합니다.\ne-mail: iddyoon@gmail.com`}
              </p>
            </div>

            <div className="flex flex-row gap-3 mt-2">
              <Link
                href="https://github.com/yoounyoungheon"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div
                  className="w-7 h-7 rounded-full overflow-hidden shadow-md relative
                              transition-transform group-hover:scale-110"
                >
                  <Image
                    src={GitImage.src}
                    alt="github"
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              <Link
                href="https://younghun123.tistory.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <div
                  className="w-7 h-7 rounded-full overflow-hidden shadow-md relative
                              transition-transform group-hover:scale-110"
                >
                  <Image
                    src={BlogImage.src}
                    alt="blog"
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
