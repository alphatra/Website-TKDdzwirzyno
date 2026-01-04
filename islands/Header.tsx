import { useEffect, useRef, useState } from "preact/hooks";

import { MenuPageRecord } from "../utils/pocketbase.ts";

interface HeaderProps {
  menuPages?: MenuPageRecord[];
}

import ThemeToggle from "./ThemeToggle.tsx";
import { useScrollLock } from "./features/shared/useScrollLock.ts";
import { useFocusTrap } from "./features/shared/useFocusTrap.ts";

export default function Header({ menuPages = [] }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  /*
    Simplified menu handling:
    1. Define static links
    2. Map incoming CMS menuPages to {title, slug}
    3. Deduplicate by slug (prefer static over dynamic if collision, or merge)
  */

  const homeLink = { title: "Start", slug: "" };

  const staticLinks = [
    { title: "Kadra", slug: "kadra" },
    { title: "Zawodnicy", slug: "zawodnicy" },
    { title: "Aktualności", slug: "aktualnosci" },
    { title: "Galeria", slug: "galeria" },
  ];

  // Combine and dedupe
  const incomingLinks =
    menuPages?.map((p) => ({ title: p.title, slug: p.slug })) || [];

  // Start with home -> static -> dynamic.
  // We use a Map to ensure uniqueness by slug.
  const linksMap = new Map<string, { title: string; slug: string }>();

  // Add Home
  linksMap.set(homeLink.slug, homeLink);

  // Add Static (these might override home if slug is same, but they are distinct)
  staticLinks.forEach((link) => linksMap.set(link.slug, link));

  // Add Dynamic
  incomingLinks.forEach((link) => {
    if (!linksMap.has(link.slug)) {
      linksMap.set(link.slug, link);
    }
  });

  const allLinks = Array.from(linksMap.values());

  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  // Custom hooks for mobile menu
  useScrollLock(isOpen);
  useFocusTrap(
    isOpen,
    mobileMenuRef,
    () => setIsOpen(false),
    firstMobileLinkRef,
  );

  // Close on Click Outside
  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      const target = e.target as Node | null;
      // Close if clicking outside both header (toggle) and menu
      if (
        isOpen &&
        headerRef.current &&
        !headerRef.current.contains(target) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("pointerdown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header
      ref={headerRef}
      class="relative sticky top-0 z-50 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-sm shadow-sm dark:shadow-slate-900/50 transition-all duration-300 border-b border-transparent dark:border-slate-800"
    >
      <nav class="container-custom py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <img src="/logo.svg" alt="TKD Dźwirzyno" class="h-12 w-auto" />
            <div>
              <h1 class="text-xl font-heading font-bold text-primary">
                TKD Dźwirzyno
              </h1>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                Taekwondo Klub Sportowy
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div class="hidden lg:flex items-center gap-6">
            {allLinks.map((page) => {
              const href = page.slug === "" ? "/" : "/" + page.slug;
              return (
                <a
                  key={page.slug}
                  href={href}
                  class="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-400 transition-colors font-medium relative group text-sm uppercase tracking-wide"
                >
                  {page.title}
                  <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary dark:bg-white transition-all group-hover:w-full">
                  </span>
                </a>
              );
            })}

            <div class="flex items-center gap-4 ml-4">
              <ThemeToggle />
              <a
                href="/kontakt"
                class="inline-flex items-center justify-center rounded bg-secondary px-6 py-2 text-sm font-bold text-white shadow-md hover:bg-secondary-600 transition-colors uppercase tracking-wider whitespace-nowrap"
              >
                Kontakt
              </a>
            </div>
          </div>

          {/* Mobile Toggle & Theme */}
          <div class="lg:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              type="button"
              ref={toggleBtnRef}
              class="p-2 text-gray-700 dark:text-gray-200 hover:text-primary focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
              aria-controls="mobile-menu"
            >
              <svg
                class="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen
                  ? (
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    >
                    </path>
                  )
                  : (
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    >
                    </path>
                  )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          class={`lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-[#0F172A] border-t border-gray-100 dark:border-slate-800 shadow-xl transition-all duration-300 origin-top overflow-hidden ${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div class="flex flex-col p-6 space-y-4">
            {allLinks.map((page, index) => {
              const href = page.slug === "" ? "/" : "/" + page.slug;
              return (
                <a
                  key={page.slug}
                  href={href}
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  class="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary-400 hover:pl-2 transition-all border-b border-gray-50 dark:border-slate-800 pb-2 block outline-none focus-visible:text-primary focus-visible:pl-2"
                  onClick={() => setIsOpen(false)}
                >
                  {page.title}
                </a>
              );
            })}

            <a
              href="/kontakt"
              class="btn bg-primary text-white w-full text-center py-3 rounded-lg mt-4 shadow-lg hover:bg-primary-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Kontakt
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
