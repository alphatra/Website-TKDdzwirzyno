import { cn } from "../../utils/cn.ts";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  class?: string;
  theme?: "light" | "dark";
}

export function Breadcrumbs({ items, class: className, theme = "dark" }: BreadcrumbsProps) {
  const isDark = theme === "dark";
  
  return (
    <nav aria-label="Breadcrumb" class={cn("flex text-sm mb-6", className)}>
      <ol class="flex items-center space-x-2 whitespace-nowrap overflow-x-auto custom-scrollbar pb-2">
        <li>
          <a
            href="/"
            class={cn(
              "transition-colors hover:underline flex items-center",
              isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
            )}
          >
            <span class="material-icons-round text-sm mr-1">home</span>
            Strona Główna
          </a>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.label} class="flex items-center space-x-2">
              <span class={cn("material-icons-round text-xs", isDark ? "text-slate-600" : "text-slate-400")}>
                chevron_right
              </span>
              {isLast || !item.href ? (
                <span
                  class={cn(
                    "font-medium",
                    isDark ? "text-white" : "text-slate-900"
                  )}
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  class={cn(
                    "transition-colors hover:underline",
                    isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
