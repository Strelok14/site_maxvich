import { cn } from "@/lib/utils";
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: "default" | "premium" | "glass";
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  variant = "default",
  onClick,
  style,
}) => {
  const baseStyles = "rounded-2xl transition-all duration-500";
  
  const variantStyles = {
    default: "bg-white shadow-md border border-gray-100/50 hover:border-gray-200",
    premium: "bg-gradient-to-br from-white to-gray-50/30 shadow-xl border border-gray-100/70 backdrop-blur-sm",
    glass: "bg-white/90 backdrop-blur-xl shadow-2xl border border-white/50",
  };
  
  const hoverStyles = hover 
    ? "hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] cursor-pointer" 
    : "";

  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        baseStyles,
        variantStyles[variant],
        hoverStyles,
        "p-8",
        className
      )}
    >
      {children}
    </div>
  );
};
