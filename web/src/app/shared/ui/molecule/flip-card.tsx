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
    // The outer wrapper owns hover state and perspective so the pointer
    // target does not change while the inner layer rotates in 3D.
    <div className={cn("group [perspective:1200px]", className)} {...props}>
      <div
        ref={ref}
        className={cn(
          // Only the inner layer rotates. Using group-hover keeps the flip
          // stable even when the card face itself changes during rotation.
          "relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]",
          innerClassName
        )}
      >
        <Card
          className={cn(
            // Hide mirrored text while the front face is rotated away.
            "absolute inset-0 h-full w-full overflow-hidden [backface-visibility:hidden]",
            frontClassName
          )}
        >
          {frontCard}
        </Card>
        <Card
          className={cn(
            // The back face starts rotated and is pulled slightly forward to
            // reduce blur artifacts that can happen on 3D transformed layers.
            "absolute inset-0 h-full w-full overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(1px)] [will-change:transform]",
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
