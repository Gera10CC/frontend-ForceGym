import { ReactNode } from "react";

interface ErrorFormProps {
  children?: ReactNode;
  className?: string;
}

export default function ErrorForm({ children, className = "" }: ErrorFormProps) {
  if (!children) return null; 

  return (
    <p
      role="alert"
      aria-live="assertive"
      className={`text-red-600 text-sm mt-1 animate-fadeIn ${className}`}
    >
      {children}
    </p>
  );
}