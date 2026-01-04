import type { ComponentChildren, JSX } from "preact";
import { cn } from "../utils/cn.ts";

export interface ButtonProps
  extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, "onClick" | "size"> {
  onClick?: JSX.MouseEventHandler<HTMLButtonElement>;
  children?: ComponentChildren;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
}

export function Button({
  class: className,
  children,
  type = "button",
  disabled,
  variant = "primary",
  size = "md",
  loading = false,
  ...rest
}: ButtonProps) {
  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-600 shadow-md hover:shadow-lg border-transparent focus:ring-primary",
    secondary:
      "bg-secondary text-white hover:bg-secondary-600 shadow-md hover:shadow-lg border-transparent focus:ring-secondary",
    outline:
      "bg-transparent border-2 border-primary text-primary hover:bg-primary/5 shadow-sm focus:ring-primary",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 border-transparent shadow-none focus:ring-slate-400",
    danger:
      "bg-red-500 text-white hover:bg-red-600 border-transparent focus:ring-red-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
    xl: "px-10 py-4 text-xl",
  };

  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-heading font-bold tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none border";

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      class={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        loading && "cursor-wait opacity-80",
        className,
      )}
    >
      {loading && (
        <span class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
