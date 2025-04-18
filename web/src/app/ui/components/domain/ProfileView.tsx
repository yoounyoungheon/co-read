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
      <div className="text-center text-3xl font-bold">About Me! 💬</div>
      <IntoduceView introduce={`"${introduce}"`}/>
      <WordsView words={words}/>
      <div className="flex space-x-5">
        <Link href={gitUrl} className="flex space-x-1 font-semibold">
          <Image src={GitLogo.src} alt={"git logo"} width={25} height={25}/>
          <div>GitHub</div>
        </Link>
        <Link href={blogUrl} className="flex space-x-1 font-semibold">
          <Image src={BlogLogo.src} alt={"blog logo"} width={25} height={25}/>
          <div>Blog</div>
        </Link>
      </div>
    </div>
  </main>
  )
}

function IntoduceView({introduce}:{introduce: string}){
  return (
    <div className="text-center text-xl font-semibold mb-1 italic animate-fade-in">
      {introduce}
    </div>
  )
}

function WordsView({ words }: { words: string[] }) {
  return (
    <div className="border-l-2 border-black pl-2 space-y-1.5">
      {words.map((word, index) => (
        <div key={index} className={`text-gray-700 p-1 ${word[0]==='['?'font-semibold text-xl':'text italic'}`}>
          {word}
        </div>
      ))}
    </div>
  );
}
