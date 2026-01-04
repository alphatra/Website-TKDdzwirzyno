interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  homeLink?: boolean;
}

export function ErrorState({
  title = "Wystąpił błąd",
  message,
  onRetry,
  homeLink = true,
}: ErrorStateProps) {
  return (
    <div class="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-500 dark:text-red-400">
        <span class="material-icons-round text-3xl">error_outline</span>
      </div>
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p class="text-gray-500 dark:text-gray-400 max-w-md mb-6">{message}</p>

      <div class="flex gap-4">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200"
          >
            <span class="material-icons-round text-sm">refresh</span>
            Spróbuj ponownie
          </button>
        )}

        {homeLink && (
          <a
            href="/"
            class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors shadow-sm"
          >
            <span class="material-icons-round text-sm">home</span>
            Strona główna
          </a>
        )}
      </div>
    </div>
  );
}
