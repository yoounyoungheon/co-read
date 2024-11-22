import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/app/utils/style';

const alertVariants = cva(
  'flex items-center justify-center relative w-full rounded-lg bg-slate-200 px-4 py-2 text-sm  [&>svg]:text-slate-950',
  {
    variants: {
      variant: {
        default:
          'bg-white text-black [&>svg]:text-black',
        destructive:
          'bg-red-200/50 text-red-500 [&>svg]:text-red-500',
        warning:
          'bg-orange-200/50 text-orange-500 [&>svg]:text-orange-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type CalloutProps = {
  icon?: React.ElementType;
  content: string;
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants>;

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, variant, icon, content, ...props }, ref) => {
    const Icon = icon;
    return (
      <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
        {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
        <div className='"text-sm [&_p]:leading-relaxed"'>{content}</div>
      </div>
    );
  },
);
Callout.displayName = 'Alert';

export default Callout;