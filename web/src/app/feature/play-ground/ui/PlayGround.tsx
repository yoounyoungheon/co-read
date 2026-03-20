import PlayGroundButton from "./PlayGroundButton";

type PlayGroundItem = {
  type: string;
  description: string;
  path: string;
};

type PlayGroundProps = {
  types: PlayGroundItem[];
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

      <div className="w-full h-full max-w-[1000px] flex flex-cols gap-5 items-center justify-center px-1">
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
