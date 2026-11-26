import type { ReactNode } from 'react';

interface BlurFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function BlurFade({ children, className, delay = 0 }: BlurFadeProps) {
  return (
    <div
      style={{ animationDelay: `${0.04 + delay}s` }}
      className={`blur-fade-in ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
