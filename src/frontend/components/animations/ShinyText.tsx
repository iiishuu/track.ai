import type { ReactNode } from "react";

interface ShinyTextProps {
  children: ReactNode;
  className?: string;
}

export function ShinyText({ children, className = "" }: ShinyTextProps) {
  return <span className={`text-shimmer ${className}`}>{children}</span>;
}
