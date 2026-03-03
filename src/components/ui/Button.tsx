import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:scale-[1.02]",
        secondary:
          "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-lg shadow-secondary-500/25 hover:shadow-xl hover:shadow-secondary-500/35 hover:scale-[1.02]",
        outline:
          "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 hover:border-primary-600 shadow-sm hover:shadow-md",
        ghost: 
          "hover:bg-gray-100 text-gray-700 hover:text-primary-600",
        link: 
          "text-primary-500 underline-offset-4 hover:underline hover:text-primary-600",
        premium:
          "relative btn-gradient-glow bg-gradient-to-r from-indigo-500 to-primary-500 text-white hover:scale-[1.02] border border-primary-400/50",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-5 py-2.5 text-sm",
        lg: "h-14 px-8 py-4 text-base font-bold",
        xl: "h-16 px-10 py-5 text-lg font-bold",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  target?: string;
  rel?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, href, target, rel, children, type = "button", ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, className }));

    if (href) {
      return (
        <a className={classes} href={href} target={target} rel={rel}>
          {children}
        </a>
      );
    }

    return (
      <button className={classes} ref={ref} type={type} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
