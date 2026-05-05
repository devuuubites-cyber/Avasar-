import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  rounded?: string;
};

export function LiquidGlass({ children, rounded = 'rounded-3xl', className, ...rest }: Props) {
  return (
    <div className={cn('liquid-glass', rounded, className)} {...rest}>
      {children}
    </div>
  );
}
