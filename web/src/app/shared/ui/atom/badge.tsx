import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/utils/style/helper";

const badgeVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full border text-xs font-medium tracking-tight transition-colors",
  {
    variants: {
      tone: {
        slate: "",
        rose: "",
        blue: "",
        zinc: "",
        neutral: "",
      },
      variant: {
        solid: "",
        soft: "",
        outline: "bg-transparent",
      },
      size: {
        sm: "px-2.5 py-1",
        md: "px-3 py-1.5",
      },
    },
    defaultVariants: {
      tone: "neutral",
      variant: "soft",
      size: "md",
    },
    compoundVariants: [
      {
        tone: "slate",
        variant: "solid",
        className: "border-slate-900 bg-slate-900 text-white",
      },
      {
        tone: "slate",
        variant: "soft",
        className: "border-slate-200 bg-slate-50 text-slate-700",
      },
      {
        tone: "slate",
        variant: "outline",
        className: "border-slate-300 text-slate-700",
      },
      {
        tone: "rose",
        variant: "solid",
        className: "border-rose-500 bg-rose-500 text-white",
      },
      {
        tone: "rose",
        variant: "soft",
        className: "border-rose-100 bg-rose-50 text-rose-700",
      },
      {
        tone: "rose",
        variant: "outline",
        className: "border-rose-200 text-rose-700",
      },
      {
        tone: "blue",
        variant: "solid",
        className: "border-blue-600 bg-blue-600 text-white",
      },
      {
        tone: "blue",
        variant: "soft",
        className: "border-blue-100 bg-blue-50 text-blue-700",
      },
      {
        tone: "blue",
        variant: "outline",
        className: "border-blue-200 text-blue-700",
      },
      {
        tone: "zinc",
        variant: "solid",
        className: "border-slate-800 bg-slate-800 text-white",
      },
      {
        tone: "zinc",
        variant: "soft",
        className: "border-slate-200 bg-slate-100 text-slate-700",
      },
      {
        tone: "zinc",
        variant: "outline",
        className: "border-slate-300 text-slate-700",
      },
      {
        tone: "neutral",
        variant: "solid",
        className: "border-slate-900 bg-slate-900 text-white",
      },
      {
        tone: "neutral",
        variant: "soft",
        className: "border-slate-200 bg-white text-slate-700",
      },
      {
        tone: "neutral",
        variant: "outline",
        className: "border-slate-300 text-slate-600",
      },
    ],
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({
  className,
  tone,
  variant,
  size,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ tone, variant, size }), className)}
      {...props}
    />
  );
}

export default Badge;

export { badgeVariants };
