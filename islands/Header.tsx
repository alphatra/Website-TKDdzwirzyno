import { useState } from "preact/hooks";

interface Page {
  title: string;
  slug: string;
}

interface HeaderProps {
  menuPages?: Page[];
}

export default function Header({ menuPages = [] }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Static home link + Dynamic Pages from CMS
  const homeLink = { title: "Start", slug: "" };
  const allLinks = [homeLink, ...menuPages];

  return (
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300">
      <nav class="container-custom py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <img src="/logo.svg" alt="TKD Dzwirzyno" class="h-12 w-auto" />
            <div>
              <h1 class="text-xl font-heading font-bold text-primary">
                TKD Dzwirzyno
              </h1>
              <p class="text-xs text-gray-600">Taekwondo Klub Sportowy</p>
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
                  class="text-gray-700 hover:text-primary transition-colors font-medium relative group text-sm uppercase tracking-wide"
                >
                  {page.title}
                  <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full">
                  </span>
                </a>
              );
            })}

            <a
              href="/kontakt"
              class="inline-flex items-center justify-center rounded bg-secondary px-6 py-2 text-sm font-bold text-white shadow-md hover:bg-secondary-600 transition-colors uppercase tracking-wider whitespace-nowrap ml-4"
            >
              Kontakt
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            class="lg:hidden p-2 text-gray-700 hover:text-primary focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
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

        {/* Mobile Menu Dropdown */}
        <div
          class={`lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl transition-all duration-300 origin-top overflow-hidden ${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div class="flex flex-col p-6 space-y-4">
            {allLinks.map((page) => {
              const href = page.slug === "" ? "/" : "/" + page.slug;
              return (
                <a
                  key={page.slug}
                  href={href}
                  class="text-lg font-medium text-gray-700 hover:text-primary hover:pl-2 transition-all border-b border-gray-50 pb-2 block"
                  onClick={() => setIsOpen(false)}
                >
                  {page.title}
                </a>
              );
            })}

            <a
              href="/kontakt"
              class="btn bg-primary text-white w-full text-center py-3 rounded-lg mt-4 shadow-lg"
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
