import Image from "next/image";
import Link from "next/link";
import { Card } from "@/app/shared/ui/molecule/card";

interface FeedProps {
  image: string;
  projectName: string;
  id: string;
}

export const Feed = ({ image, projectName, id }: FeedProps) => {
  return (
    <Link href={`/project?id=${id}`} className="block">
      <Card className="relative aspect-square overflow-hidden rounded-lg border-none p-2 text-center shadow-lg transition-transform duration-300 hover:scale-105">
        <Image
          src={image}
          alt={projectName}
          fill
          className="rounded-lg object-contain"
        />
        <div className="absolute inset-0 rounded-lg bg-black/50" />
        <div className="relative mt-2 flex items-center justify-center space-x-2 whitespace-pre-wrap text-xs font-semibold text-white lg:text-lg">
          <span>{projectName}</span>
        </div>
      </Card>
    </Link>
  );
};

export type { FeedProps };
