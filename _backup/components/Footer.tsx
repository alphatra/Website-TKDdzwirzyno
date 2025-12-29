interface SiteInfo {
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
}

export default function Footer({ siteInfo }: { siteInfo?: SiteInfo }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer class="bg-gray-900 text-white">
      <div class="container-custom py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-xl font-heading font-bold mb-4">TKD Dzwirzyno</h3>
            <p class="text-gray-400 leading-relaxed">
              Klub sportowy Taekwondo dla dzieci i młodzieży. Rozwijamy pasję,
              dyscyplinę i charakter.
            </p>
          </div>

          <div>
            <h4 class="font-heading font-semibold mb-4">Kontakt</h4>
            <ul class="space-y-2 text-gray-400">
              <li>📧 {siteInfo?.email || "kontakt@tkddzwirzyno.pl"}</li>
              <li>📞 {siteInfo?.phone || "+48 XXX XXX XXX"}</li>
              <li>📍 {siteInfo?.address || "Dźwirzyno, Polska"}</li>
            </ul>
          </div>

          <div>
            <h4 class="font-heading font-semibold mb-4">Social Media</h4>
            <div class="flex space-x-4">
              {siteInfo?.facebook && (
                <a
                  href={siteInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.954 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {siteInfo?.instagram && (
                <a
                  href={siteInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3" />
                    <circle cx="12" cy="12" r="3.5" />
                    <circle cx="18.5" cy="5.5" r="1.25" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {currentYear} TKD Dzwirzyno. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}
