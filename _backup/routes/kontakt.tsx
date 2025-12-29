import { PageProps } from "fresh";
import { Handlers } from "fresh/compat";

interface SiteInfo {
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
}

interface Data {
  success?: boolean;
  error?: string;
  siteInfo?: SiteInfo;
}

export const handler: Handlers<Data> = {
  GET(ctx) {
    const req = ctx.req;
    const url = new URL(req.url);
    const success = url.searchParams.get("success") === "true";
    const error = url.searchParams.get("error") || undefined;

    // siteInfo is populated by _middleware now
    const siteInfo = ctx.state.siteInfo as SiteInfo;

    return ctx.render({ success, error, siteInfo });
  },
};

export default function Contact({ data }: PageProps<Data>) {
  const { success, error, siteInfo } = data;

  return (
    <>
      <div class="bg-primary text-white py-20 pb-32 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[url('/pattern.svg')]"></div>
        <div class="container-custom relative z-10 text-center">
          <h1 class="text-4xl md:text-5xl font-heading font-bold mb-4">
            Skontaktuj się z nami
          </h1>
          <p class="text-xl text-gray-300 max-w-2xl mx-auto">
            Masz pytania dotyczące treningów? Chcesz zapisać dziecko? Napisz do
            nas lub zadzwoń.
          </p>
        </div>
        <div class="absolute bottom-0 left-0 right-0 h-16 bg-white clip-path-slant-up">
        </div>
      </div>

      <div class="container-custom py-12 -mt-20 relative z-20">
        <div class="grid md:grid-cols-2 gap-12 bg-white rounded-xl shadow-xl p-8 md:p-12">
          {/* Info Section */}
          <div class="space-y-8">
            <div>
              <h3 class="text-2xl font-heading font-bold mb-6 text-primary">
                Dane kontaktowe
              </h3>
              <div class="space-y-4 text-lg">
                <div class="flex items-start space-x-4">
                  <div class="bg-secondary/10 p-3 rounded-lg text-secondary">
                    <svg
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      >
                      </path>
                    </svg>
                  </div>
                  <div>
                    <span class="block text-gray-500 text-sm">Email</span>
                    <a
                      href={`mailto:${
                        siteInfo?.email || "kontakt@tkddzwirzyno.pl"
                      }`}
                      class="font-medium hover:text-secondary transition-colors"
                    >
                      {siteInfo?.email || "kontakt@tkddzwirzyno.pl"}
                    </a>
                  </div>
                </div>

                <div class="flex items-start space-x-4">
                  <div class="bg-secondary/10 p-3 rounded-lg text-secondary">
                    <svg
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      >
                      </path>
                    </svg>
                  </div>
                  <div>
                    <span class="block text-gray-500 text-sm">Telefon</span>
                    <a
                      href={`tel:${siteInfo?.phone?.replace(/\s/g, "") || ""}`}
                      class="font-medium hover:text-secondary transition-colors"
                    >
                      {siteInfo?.phone || "+48 XXX XXX XXX"}
                    </a>
                  </div>
                </div>

                <div class="flex items-start space-x-4">
                  <div class="bg-secondary/10 p-3 rounded-lg text-secondary">
                    <svg
                      class="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      >
                      </path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      >
                      </path>
                    </svg>
                  </div>
                  <div>
                    <span class="block text-gray-500 text-sm">Lokalizacja</span>
                    <span class="font-medium block">
                      {siteInfo?.address || "Dźwirzyno, Polska"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials */}
            <div>
              <h4 class="font-heading font-semibold mb-4 text-gray-900">
                Znajdź nas na
              </h4>
              <div class="flex space-x-4">
                {siteInfo?.facebook && (
                  <a
                    href={siteInfo.facebook}
                    target="_blank"
                    class="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.954 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {siteInfo?.instagram && (
                  <a
                    href={siteInfo.instagram}
                    target="_blank"
                    class="w-12 h-12 bg-gradient-to-tr from-[#FFDC80] via-[#FD1D1D] to-[#833AB4] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                  >
                    <svg
                      class="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3" />
                      <circle cx="12" cy="12" r="3.5" />
                      <circle cx="18.5" cy="5.5" r="1.25" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div>
            <div class="mb-8">
              <h3 class="text-2xl font-heading font-bold mb-2">
                Wyślij wiadomość
              </h3>
              <p class="text-gray-500">
                Odpowiadamy najszybciej jak to możliwe.
              </p>
            </div>

            {success && (
              <div class="bg-green-100 text-green-700 p-4 rounded-lg mb-6 flex items-center">
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  >
                  </path>
                </svg>
                Wiadomość została wysłana! Dziękujemy.
              </div>
            )}

            {error && (
              <div class="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                Błąd: {error}
              </div>
            )}

            <form action="/send-message" method="POST" class="space-y-6">
              <div>
                <label class="block text-gray-700 font-medium mb-2" for="name">
                  Imię i nazwisko
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    class="block text-gray-700 font-medium mb-2"
                    for="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label
                    class="block text-gray-700 font-medium mb-2"
                    for="phone"
                  >
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  class="block text-gray-700 font-medium mb-2"
                  for="message"
                >
                  Wiadomość
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                >
                </textarea>
              </div>

              <button
                type="submit"
                class="w-full bg-secondary text-white font-bold py-4 rounded-lg hover:bg-secondary-600 transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-secondary/30"
              >
                Wyślij wiadomość
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
