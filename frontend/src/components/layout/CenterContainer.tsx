import type { ReactNode } from "react";

interface CenterContainerProps {
  children: ReactNode;
  className?: string;
}

export const CenterContainer = ({
  children,
  className,
}: CenterContainerProps) => (
  <div className={`w-full h-full max-w-4xl mx-auto px-8 py-16 ${className}`}>
    {children}
  </div>
);
