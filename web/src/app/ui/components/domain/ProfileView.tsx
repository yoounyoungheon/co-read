import ProfileImage from "@/app/assets/profile.png";
import { Profile } from "@/app/feature/profile/ui/Profile";

export function ProfileView() {
  return (
    <main>
      <Profile
        name="윤영헌"
        job="🖥️ developer"
        spec={["Dongguk Univ · scsc & biz", "Open Labs · 2025 ~"]}
        intorudctiion={"안녕하세요! 개발자 윤영헌입니다.\n융합소프트웨어와 경영학을 전공했습니다.\n비즈니스, 기술적 관점에서 변화에 유연한 소프트웨어 설계를 고민합니다.\ne-mail: iddyoon@gmail.com"}
        profileImage={ProfileImage}
        githubLink="https://github.com/yoounyoungheon"
        blogLink="https://younghun123.tistory.com/"
      />
    </main>
  );
}
