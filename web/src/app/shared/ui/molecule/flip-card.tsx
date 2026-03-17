import * as React from "react";
import { cn } from "@/app/utils/style/helper";
import { Card } from "./card";

interface FlipCardProps extends React.HTMLAttributes<HTMLDivElement> {
  frontCard: React.ReactNode;
  backCard: React.ReactNode;
  innerClassName?: string;
  frontClassName?: string;
  backClassName?: string;
}

const FlipCard = React.forwardRef<HTMLDivElement, FlipCardProps>(
  (
    {
      className,
      innerClassName,
      frontClassName,
      backClassName,
      frontCard,
      backCard,
      ...props
    },
    ref
  ) => (
    <div className={cn("[perspective:1200px]", className)} {...props}>
      <div
        ref={ref}
        className={cn(
          "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]",
          innerClassName
        )}
      >
        <Card
          className={cn(
            "absolute inset-0 h-full w-full overflow-hidden [backface-visibility:hidden]",
            frontClassName
          )}
        >
          {frontCard}
        </Card>
        <Card
          className={cn(
            "absolute inset-0 h-full w-full overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]",
            backClassName
          )}
        >
          {backCard}
        </Card>
      </div>
    </div>
  )
);

FlipCard.displayName = "FlipCard";

export { FlipCard };
export type { FlipCardProps };

