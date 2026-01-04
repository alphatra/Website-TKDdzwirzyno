import { SITE_CONFIG } from "../../utils/siteConfig.ts";

export function Footer() {
  return (
    <footer class="bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white pt-20 pb-10 overflow-hidden relative border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
      {/* Decorative Background Elements */}
      <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      <div class="container-custom relative z-10">
        <div class="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div class="md:col-span-1">
            <a href="/" class="block mb-6 group">
              <div class="flex items-center gap-3">
                 <img src={SITE_CONFIG.logo} alt={SITE_CONFIG.name} class="h-16 w-auto" width="967" height="967" />
                 <div>
                    <h2 class="text-2xl font-heading font-black tracking-tighter leading-none text-secondary-900 dark:text-white group-hover:text-primary transition-colors">
                      TKD
                    </h2>
                    <p class="text-xs font-mono text-slate-600 uppercase tracking-widest mt-1 group-hover:text-secondary-900 dark:group-hover:text-white transition-colors">
                      Dźwirzyno
                    </p>
                 </div>
              </div>
            </a>
            <p class="text-slate-700 dark:text-slate-400 text-sm leading-relaxed mb-6">
              {SITE_CONFIG.description}
            </p>
            <div class="flex gap-4">
              {/* Facebook Icon */}
              <a
                href={SITE_CONFIG.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                class="w-10 h-10 border border-secondary-200 dark:border-white/10 flex items-center justify-center rounded-full hover:bg-primary hover:border-primary transition-all group relative overflow-hidden"
                aria-label="Facebook"
              >
                <div class="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="relative z-10 text-secondary-900 dark:text-white group-hover:text-white transition-colors"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h3 class="text-lg font-heading font-bold mb-6 text-secondary-900 dark:text-white border-l-2 border-primary pl-3">
              Klub
            </h3>
            <ul class="space-y-3">
              {[
                { label: "Aktualności", href: "/aktualnosci" },
                { label: "Kadra", href: "/zawodnicy" },
                { label: "Treningi", href: "/kontakt" },
                { label: "Galeria", href: "/galeria" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    class="text-slate-700 dark:text-gray-400 hover:text-primary transition-colors text-sm hover:translate-x-1 transform inline-block"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 class="text-lg font-heading font-bold mb-6 text-secondary-900 dark:text-white border-l-2 border-primary pl-3">
              Kontakt
            </h3>
            <ul class="space-y-4 text-sm text-slate-700 dark:text-gray-400">
              <li class="flex items-start gap-3 group">
                <span class="text-primary mt-1">📍</span>
                <span class="group-hover:text-secondary-900 dark:group-hover:text-white transition-colors">
                  {SITE_CONFIG.contact.address.street}<br />
                  {SITE_CONFIG.contact.address.zip} {SITE_CONFIG.contact.address.city}
                </span>
              </li>
              <li class="flex items-center gap-3 group">
                <span class="text-primary">📞</span>
                <a href={`tel:${SITE_CONFIG.contact.phone.replace(/\s/g, "")}`} class="group-hover:text-secondary-900 dark:group-hover:text-white transition-colors">
                  {SITE_CONFIG.contact.phone}
                </a>
              </li>
              <li class="flex items-center gap-3 group">
                <span class="text-primary">✉️</span>
                <a href={`mailto:${SITE_CONFIG.contact.email}`} class="group-hover:text-secondary-900 dark:group-hover:text-white transition-colors">
                  {SITE_CONFIG.contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Extra Column */}
          <div>
             <h3 class="text-lg font-heading font-bold mb-6 text-secondary-900 dark:text-white border-l-2 border-primary pl-3">
              Dołącz
            </h3>
            <p class="text-xs text-gray-500 mb-4">
              Zapisy trwają cały rok. Pierwszy trening gratis.
            </p>
            <a 
              href="/kontakt"
              class="inline-block px-6 py-3 border border-primary text-primary font-bold text-sm uppercase tracking-wider hover:bg-primary hover:text-white transition-all skew-x-[-10deg]"
            >
              <div class="skew-x-[10deg]">Zapisz się</div>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div class="border-t border-gray-200 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 dark:text-gray-600 font-mono">
          <div>
            &copy; {new Date().getFullYear()} TKD Dźwirzyno. All rights reserved.
          </div>
          <div class="flex gap-6">
            <a href="#" class="hover:text-slate-900 dark:hover:text-gray-400">Polityka Prywatności</a>
            <a href="#" class="hover:text-slate-900 dark:hover:text-gray-400">Regulamin</a>
          </div>
           <div class="opacity-30">
              Designed by Antigravity
           </div>
        </div>
      </div>
    </footer>
  );
}
