import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  buttonType?: "button" | "submit" | "reset";
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
}

export default function Button({
  children,
  onClick,
  buttonType = "button",
  variant = "primary",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-accent text-white hover:bg-accent-hover shadow-sm",
    secondary:
      "bg-bg-editor border border-border-subtle text-content-main hover:bg-bg-hover shadow-sm",
    ghost: "text-content-muted hover:text-content-main hover:bg-bg-hover",
  };

  return (
    <button
      onClick={onClick}
      type={buttonType}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
