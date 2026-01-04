import { useEffect, useState } from "preact/hooks";

export default function ThemeToggle() {
  // Hydration mismatch fix: Always start with "light" (server default),
  // then sync with effective theme on mount.
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    // The _app.tsx script sets the class before hydration.
    // We just need to sync our state to match.
    if (typeof document !== "undefined") {
      if (document.documentElement.classList.contains("dark")) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    }
  }, []);

  useEffect(() => {
    if (theme === null) return;

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      class="p-2 text-gray-500 hover:text-primary transition-colors focus:outline-none rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
      aria-label={theme === "light" ? "Włącz tryb ciemny" : "Włącz tryb jasny"}
    >
      {theme === "light"
        ? (
          // Moon icon
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )
        : (
          // Sun icon
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        )}
    </button>
  );
}
