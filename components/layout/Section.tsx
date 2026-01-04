import { ComponentChildren } from "preact";
import { cn } from "../../utils/cn.ts";

interface SectionProps {
  children: ComponentChildren;
  id?: string;
  class?: string;
  container?: boolean;
  containerClass?: string;
  bg?: "white" | "light" | "dark" | "primary" | "none";
}

export function Section({
  children,
  id,
  class: className,
  container = true,
  containerClass,
  bg = "none",
}: SectionProps) {
  const bgStyles = {
    white: "bg-white dark:bg-slate-900",
    light: "bg-slate-50 dark:bg-slate-800/50",
    dark: "bg-slate-900 text-white",
    primary: "bg-primary-900 text-white", // Deep primary
    none: "",
  };

  return (
    <section
      id={id}
      class={cn(
        "relative py-16 md:py-24 overflow-hidden transition-colors duration-300",
        bgStyles[bg],
        className,
      )}
    >
      {container
        ? (
          <div class={cn("container-custom relative z-10", containerClass)}>
            {children}
          </div>
        )
        : children}
    </section>
  );
}
