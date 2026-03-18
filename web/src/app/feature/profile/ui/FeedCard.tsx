import { FlipCard } from "@/app/shared/ui/molecule/flip-card";
import { FeedBackCard } from "./FeedBackCard";
import { FeedFrontCard } from "./FeedFrontCard";

interface FeedCardProps {
  image: string;
  projectName: string;
  id: string;
  href?: string;
  keyword?: string[];
}

export const FeedCard = ({
  image,
  projectName,
  id,
  href,
  keyword,
}: FeedCardProps) => {
  const targetHref = href ?? `/project?id=${id}`;

  return (
    <FlipCard
      className="w-full min-w-0 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] md:min-w-[250px]"
      innerClassName="relative aspect-[5/6] h-full w-full"
      frontClassName="rounded-2xl border-none bg-white text-left shadow-[0_10px_24px_rgba(15,23,42,0.12)]"
      backClassName="rounded-2xl border-none bg-slate-900 text-left text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)]"
      frontCard={
        <FeedFrontCard
          image={image}
          projectName={projectName}
          href={targetHref}
        />
      }
      backCard={
        <FeedBackCard
          id={id}
          projectName={projectName}
          keyword={keyword}
          href={targetHref}
        />
      }
    />
  );
};

export type { FeedCardProps };
