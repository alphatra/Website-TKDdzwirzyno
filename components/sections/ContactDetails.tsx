interface ContactDetailsProps {
  address: string;
  phone: string;
  email: string;
}

export function ContactDetails({ address, phone, email }: ContactDetailsProps) {
  return (
    <div class="lg:col-span-5 space-y-10 animate-slide-up">
      {/* Address Card */}
      <div class="group">
        <h3 class="font-heading text-base text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-3">
          <span class="w-6 h-[1px] bg-primary" /> Lokalizacja
        </h3>
        <div class="bg-white dark:bg-slate-800/50 backdrop-blur border-l-4 border-slate-200 dark:border-slate-700 hover:border-primary transition-colors duration-300 p-6">
          <p class="font-display text-xl font-bold text-slate-900 dark:text-white whitespace-pre-line leading-relaxed">
            {address}
          </p>
        </div>
      </div>

      {/* Direct Contact Grid */}
      <div class="grid sm:grid-cols-2 gap-8">
        {/* Phone */}
        <div class="group">
          <h3 class="font-heading text-xs text-slate-400 uppercase tracking-widest mb-2">
            Telefon
          </h3>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            class="block font-display text-lg font-bold text-slate-900 dark:text-white hover:text-primary transition-colors"
          >
            {phone}
          </a>
          <span class="text-xs text-slate-500 mt-1 block">
            Trener Główny
          </span>
        </div>

        {/* Email */}
        <div class="group">
          <h3 class="font-heading text-xs text-slate-400 uppercase tracking-widest mb-2">
            Email
          </h3>
          <a
            href={`mailto:${email}`}
            class="block font-display text-lg font-bold text-slate-900 dark:text-white hover:text-primary transition-colors break-words"
          >
            {email}
          </a>
          <span class="text-xs text-slate-500 mt-1 block">
            Odpowiadamy w 24h
          </span>
        </div>
      </div>

       {/* Training Schedule Teaser / CTA */}
       <a href="/o-klubie" class="block bg-primary text-white p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div class="absolute inset-0 bg-slate-900/10 transform skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          <h3 class="font-display text-xl font-bold mb-2 relative z-10">Pierwszy Trening</h3>
          <p class="mb-4 opacity-90 relative z-10 text-sm">Przyjdź i sprawdź swoje możliwości za darmo.</p>
          <div class="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-xs border-b-2 border-white/30 pb-1 relative z-10">
            Dowiedz się więcej <span class="material-icons-round text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
       </a>
    </div>
  );
}
