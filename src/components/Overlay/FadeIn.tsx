import { useEffect, useState, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  /** ms */
  transitionDuration?: number;
  className?: string;
  resetKey?: string | number;
};

export function FadeIn({ children, delay = 0, transitionDuration = 800, className, resetKey }: Props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
    const id = window.setTimeout(() => setActive(true), delay);
    return () => window.clearTimeout(id);
  }, [delay, resetKey]);

  return (
    <div
      className={className}
      style={{
        transitionProperty: 'opacity',
        transitionDuration: `${transitionDuration}ms`,
        opacity: active ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
