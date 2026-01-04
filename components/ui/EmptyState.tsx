export interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: string;
  action?: {
    label: string;
    href: string;
  };
  homeLink?: boolean;
}

export function EmptyState(
  { title, message, icon = "info", action, homeLink = false }: EmptyStateProps,
) {
  return (
    <div
      role="status"
      class="flex flex-col items-center justify-center py-16 text-center animate-fade-in px-4"
    >
      <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500">
        <span class="material-icons-round text-3xl">{icon}</span>
      </div>
      {title && (
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
      )}
      <p class="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        {message}
      </p>
      {action && (
        <a
          href={action.href}
          class="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20"
        >
          {action.label}
          <span class="material-icons-round text-sm">arrow_forward</span>
        </a>
      )}
      {homeLink && !action && (
        <a
          href="/"
          class="mt-6 text-primary hover:text-secondary font-bold text-sm uppercase tracking-wider transition-colors"
        >
          Wróć na stronę główną
        </a>
      )}
    </div>
  );
}
