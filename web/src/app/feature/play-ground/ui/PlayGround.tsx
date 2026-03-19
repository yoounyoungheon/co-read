import Link from "next/link";
import Button from "@/app/shared/ui/atom/button";
import { Card } from "@/app/shared/ui/molecule/card";

type PlayGroundItem = {
  type: string;
  path: string;
};

type PlayGroundProps = {
  types: PlayGroundItem[];
};

export function PlayGround({ types }: PlayGroundProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-center">
        <div className="flex flex-row items-center gap-5">
          {types.map(({ type, path }) => (
            <Button
              key={path}
              asChild
              size={"default"}
              radius="full"
              className="h-24 w-24 shadow-lg bg-gradient-to-br from-pink-700 via-purple-300 to-indigo-500 text-center font-semibold text-white hover:from-pink-700 hover:via-purple-300 hover:to-indigo-500"
            >
              <Link href={path}>{type}</Link>
            </Button>
          ))}
        </div>
      </div>

      <Card className="flex-1 rounded-2xl border-dashed bg-slate-50 p-4 shadow-none">
        <div></div>
      </Card>
    </div>
  );
}

export default PlayGround;
