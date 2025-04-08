import { Profile } from "@/app/business/profile/profile.domain";
import GitLogo from "@/app/assets/git.png"
import BlogLogo from "@/app/assets/t.png"
import Image from "next/image";
import Link from "next/link";

interface ProfileViewProps {
  profile: Profile
};

export function ProfileView({profile}:ProfileViewProps){
  const { introduce, words, gitUrl, blogUrl } = profile;

  return (
  <main>
    <div className="grid grid-cols-1 mb-3 gap-5">
      <IntoduceView introduce={introduce}/>
      <WordsView words={words}/>
      <div className="grid grid-cols-[1fr_9fr]">
        <Link href={gitUrl}>
          <Image src={GitLogo.src} alt={"git logo"} width={25} height={25}/>
        </Link>
        <Link href={blogUrl}>
          <Image src={BlogLogo.src} alt={"blog logo"} width={25} height={25}/>
        </Link>
      </div>
    </div>
  </main>
  )
}

function IntoduceView({introduce}:{introduce: string}){
  return (
    <div className="text-center text-xl font-semibold mb-3">
      {introduce}
    </div>
  )
}

function WordsView({ words }: { words: string[] }) {
  return (
    <div className="border-l-2 border-black pl-2 space-y-2">
      {words.map((word, index) => (
        <div key={index} className="text-gray-800 text-base italic p-1">
          {word}
        </div>
      ))}
    </div>
  );
}
