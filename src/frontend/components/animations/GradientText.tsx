import type { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function GradientText({
  children,
  className = "",
  animate = false,
}: GradientTextProps) {
  return (
    <span
      className={`${animate ? "text-gradient-animated" : "text-gradient-primary"} ${className}`}
    >
      {children}
    </span>
  );
}
