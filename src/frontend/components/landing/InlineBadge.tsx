import type { ReactNode } from "react";

interface InlineBadgeProps {
  icon?: ReactNode;
  children: ReactNode;
}

export function InlineBadge({ icon, children }: InlineBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-sm font-medium text-gray-700">
      {icon && <span className="text-xs">{icon}</span>}
      {children}
    </span>
  );
}
