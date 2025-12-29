import type { ComponentChildren, JSX } from "preact";

export interface ButtonProps extends Omit<JSX.HTMLAttributes<HTMLButtonElement>, "onClick"> {
  onClick?: JSX.MouseEventHandler<HTMLButtonElement>;
  children?: ComponentChildren;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({ class: className, children, type = "button", disabled, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      class={`px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 dark:focus:ring-offset-slate-900 transition-all shadow-sm ${
        disabled ? "opacity-50 cursor-not-allowed contrast-more:opacity-100 contrast-more:brightness-50" : "hover:shadow-md cursor-pointer"
      } ${className ?? ""}`}
    >
      {children}
    </button>
  );
}
