import type { PlayGroundCardViewModel } from "../presentation/play-ground.view-model";
import PlayGroundButton from "./PlayGroundButton";

type PlayGroundProps = {
  types: PlayGroundCardViewModel[];
};

export function PlayGround({ types }: PlayGroundProps) {
  return (
    <>
      <input
        id="play-ground-empty"
        type="radio"
        name="play-ground-type"
        className="sr-only"
        defaultChecked
      />

      <div className="w-full h-full max-w-[1000px] flex flex-col gap-5 items-start justify-center px-1 md:flex-row md:items-center">
        {types.map(({ type, path, description }, index) => {
          const itemId = `play-ground-${index}`;
          const itemKey = `${type}-${path}-${index}`;

          return (
            <PlayGroundButton
              key={itemKey}
              type={type}
              description={description}
              path={path}
              itemId={itemId}
            />
          );
        })}
      </div>
    </>
  );
}

export default PlayGround;
