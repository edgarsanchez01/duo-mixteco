import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 text-slate-500",

        // personalizado (vibe vino)
        locked:
          "bg-neutral-200 text-primary-foreground hover:bg-neutral-200/90 border-neutral-400 border-b-4 active:border-b-0",

        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 border-primary border-b-4 active:border-b-0",
        primaryOutline:
          "bg-white text-primary hover:bg-background-light border border-primary",

        secondary:
          "bg-primary-light text-white hover:bg-primary-light/90 border-primary border-b-4 active:border-b-0",
        secondaryOutline:
          "bg-white text-primary-light hover:bg-background-light border border-primary-light",

        danger:
          "bg-primary-dark text-white hover:bg-primary-dark/90 border-primary-dark border-b-4 active:border-b-0",
        dangerOutline:
          "bg-white text-primary-dark hover:bg-background-light border border-primary-dark",

        super:
          "bg-accent text-white hover:bg-accent/90 border-primary border-b-4 active:border-b-0",
        superOutline:
          "bg-white text-accent hover:bg-background-light border border-accent",

        ghost:
          "bg-transparent text-slate-500 border-transparent border-0 hover:bg-slate-100",

        sidebar:
          "bg-transparent text-slate-500 border-2 border-transparent hover:bg-slate-100 transition-none",

        sidebarOutline:
          "bg-primary/15 text-primary border-primary-light border-2 hover:bg-primary/20 transition-none",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        icon: "h-10 w-10",

        // personalizado
        rounded: "rounded-full",
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
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
