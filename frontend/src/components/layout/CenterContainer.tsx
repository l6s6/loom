import type { ReactNode } from "react";

interface CenterContainerProps {
  children: ReactNode;
  className?: string;
  navbar?: ReactNode;
}

export const CenterContainer = ({
  children,
  className,
  navbar,
}: CenterContainerProps) => (
  <div className="w-full h-full flex flex-col">
    <div className="h-navbar shrink-0">{navbar}</div>
    <div className={`w-full max-w-4xl mx-auto px-8 py-8 ${className}`}>
      {children}
    </div>
  </div>
);
