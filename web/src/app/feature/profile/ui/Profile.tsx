import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Card } from "@/app/shared/ui/molecule/card";

export interface ProfileProps {
  name: string;
  job: string;
  spec: string[];
  intorudctiion: string;
  profileImage: string | StaticImageData;
  githubLink: string;
  blogLink: string;
}

export function Profile({
  name,
  job,
  spec,
  intorudctiion,
  profileImage,
  githubLink,
  blogLink,
}: ProfileProps) {
  const socialLinks = [
    { href: githubLink, alt: "github", icon: "/images/git.png" },
    { href: blogLink, alt: "blog", icon: "/images/t.png" },
  ];

  return (
    <Card className="w-full border-none bg-transparent shadow-none">
      <div className="mb-4 flex w-full flex-col items-center justify-center gap-1">
        <div className="w-full max-w-screen-sm space-y-5">
          <div className="flex flex-row items-center justify-center">
            <div className="rounded-full bg-gradient-to-br from-pink-700 via-purple-300 to-indigo-500 p-0.5 shadow-lg">
              <div className="relative h-32 w-32 overflow-hidden rounded-full">
                <Image
                  src={profileImage}
                  alt={`${name} profile image`}
                  fill
                  sizes="128px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="ml-4 flex flex-col gap-1">
              <p className="font-bold tracking-tight">{name}</p>
              <p className="text-sm text-gray-600">{job}</p>

              <div className="space-y-1">
                {spec.map((item) => (
                  <p key={item} className="text-sm italic text-gray-500">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-screen-sm">
            <div className="mt-1 flex flex-row items-stretch gap-3">
              <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-pink-400 to-purple-500" />
              <p className="whitespace-pre-line text-xs leading-relaxed text-gray-700 lg:text-sm">
                {intorudctiion}
              </p>
            </div>

            <div className="mt-2 flex flex-row gap-3">
              {socialLinks.map((link) => (
                <Link
                  key={link.alt}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="relative h-7 w-7 overflow-hidden rounded-full shadow-md transition-transform group-hover:scale-110">
                    <Image
                      src={link.icon}
                      alt={link.alt}
                      fill
                      sizes="28"
                      className="object-cover"
                    />
                  </div>
                </Link>
              ))}
              <Link href="/" className="group" aria-label="home">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white shadow-md transition-transform group-hover:scale-110">
                  H
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
