import type { ReactNode } from "react";

/**
 * Props for the CenterContainer layout component.
 */
interface CenterContainerProps {
  children: ReactNode;
  className?: string;
  navbar?: ReactNode;
}

/**
 * Layout wrapper that centers content in a max-width column while optionally
 * rendering a top navbar slot above it.
 *
 * @param props - Layout props for child content, optional extra classes, and navbar content.
 * @returns A React element with a full-height column layout.
 */
export const CenterContainer = ({
  children,
  className,
  navbar,
}: CenterContainerProps) => (
  <div className="w-full h-full flex flex-col">
    {/* Optional navbar area with a fixed height. */}
    <div className="h-navbar shrink-0">{navbar}</div>

    {/* Centered main content area with a limited width and padding. */}
    <div className={`w-full h-full max-w-4xl mx-auto p-8 ${className}`}>
      {children}
    </div>
  </div>
);
