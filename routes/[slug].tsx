import { define } from "../utils.ts";
import pb from "../utils/pb.ts";
import { PageShell } from "../components/layout/PageShell.tsx";
import { PageRecord } from "../utils/pocketbase.ts";

import { sanitize } from "../utils/sanitize.ts";

export default define.page(async function DynamicPage(props) {
  const slug = props.params.slug;
  const { menuPages } = props.state;

  // Security: Validate slug to prevent PocketBase filter injection
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return (
      <PageShell
        title="Błąd - TKD Dzwirzyno"
        menuPages={menuPages || []}
      >
        <div class="container-custom py-32 text-center">
          <h1 class="text-4xl font-bold">
            400 - Nieprawidłowy adres (Bad Request)
          </h1>
          <p>Adres URL zawiera niedozwolone znaki.</p>
          <a href="/" class="btn bg-primary text-white mt-4 inline-block">
            Wróć na start
          </a>
        </div>
      </PageShell>
    );
  }

  let page: PageRecord | null = null;

  try {
    const records = await pb.collection("pages").getList<PageRecord>(1, 1, {
      filter: `slug = "${slug}" && visible = true`,
    });
    if (records.items.length > 0) {
      page = records.items[0];
    }
  } catch (e) {
    console.error(`Page fetch error (${slug}):`, e);
  }

  if (!page) {
    // 404 Not Found
    return (
      <PageShell
        title="Nie znaleziono - TKD Dzwirzyno"
        menuPages={menuPages || []}
      >
        <div class="container-custom py-32 text-center">
          <h1 class="text-4xl font-bold">
            404 - Strona nie została znaleziona
          </h1>
          <p>Sprawdź adres URL lub wróć na stronę główną.</p>
          <a href="/" class="btn bg-primary text-white mt-4 inline-block">
            Wróć na start
          </a>
        </div>
      </PageShell>
    );
  }

  const { title, subtitle, content } = page;

  // Security: Sanitize HTML content
  const cleanContent = sanitize(content, "cms");

  return (
    <PageShell
      title={`${title} - TKD Dzwirzyno`}
      description={subtitle || title}
      menuPages={menuPages}
    >
      {/* Avant-garde Hero with Geometric Shapes */}
      <div class="relative bg-gradient-to-br from-primary-900 via-primary to-secondary text-white py-24 pb-40 overflow-hidden">
        {/* Animated Background Shapes */}
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-10 left-10 w-64 h-64 border-4 border-white rotate-45 animate-pulse">
          </div>
          <div class="absolute bottom-20 right-20 w-96 h-96 border-4 border-secondary rounded-full">
          </div>
          <div class="absolute top-1/2 left-1/3 w-48 h-48 bg-white opacity-5 clip-path-triangle">
          </div>
        </div>

        <div class="container-custom relative z-10">
          <div class="max-w-4xl mx-auto text-center">
            {/* Main Title with Bold Typography */}
            <h1 class="text-5xl md:text-7xl font-heading font-black mb-6 tracking-tight uppercase 
                       bg-clip-text text-transparent bg-gradient-to-r from-white via-secondary-200 to-white
                       drop-shadow-2xl">
              {title}
            </h1>

            {/* Dramatic Subtitle */}
            {subtitle && (
              <div class="relative inline-block mt-8">
                <div class="absolute inset-0 bg-secondary blur-xl opacity-50">
                </div>
                <p class="relative text-2xl md:text-3xl font-bold italic text-secondary-100 
                         px-8 py-4 border-l-4 border-r-4 border-secondary
                         transform -skew-x-6 hover:skew-x-0 transition-transform duration-300">
                  {subtitle}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Diagonal Cut */}
        <div
          class="absolute bottom-0 left-0 right-0 h-20 bg-gray-50"
          style="clip-path: polygon(0 50%, 100% 0, 100% 100%, 0 100%)"
        >
        </div>
      </div>

      {/* Content with Modern Card Design */}
      <div class="container-custom -mt-24 pb-20 relative z-20">
        <div class="max-w-5xl mx-auto">
          {/* Main Content Card */}
          <div class="bg-white rounded-2xl shadow-2xl overflow-hidden border-t-8 border-secondary">
            {/* Decorative Top Bar */}
            <div class="h-2 bg-gradient-to-r from-primary via-secondary to-primary">
            </div>

            <div class="p-8 md:p-16">
              {/* Content with Enhanced Typography */}
              <article class="prose prose-lg lg:prose-xl max-w-none
                            prose-headings:font-heading prose-headings:font-bold prose-headings:text-primary-900
                            prose-headings:border-l-4 prose-headings:border-secondary prose-headings:pl-4
                            prose-p:text-gray-700 prose-p:leading-relaxed
                            prose-strong:text-primary prose-strong:font-bold
                            prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
                            prose-ul:list-none prose-li:relative prose-li:pl-8
                            prose-li:before:content-['▸'] prose-li:before:absolute prose-li:before:left-0 
                            prose-li:before:text-secondary prose-li:before:font-bold prose-li:before:text-xl
                            prose-hr:border-secondary prose-hr:border-2">
                {/* deno-lint-ignore react-no-danger */}

                <div
                  // deno-lint-ignore react-no-danger
                  dangerouslySetInnerHTML={{ __html: cleanContent }}
                />
              </article>

              {/* Call to Action */}
              <div class="mt-12 pt-8 border-t-2 border-gray-100 text-center">
                <a
                  href="/kontakt"
                  class="inline-block bg-gradient-to-r from-secondary to-secondary-600 
                          text-white font-bold py-4 px-12 rounded-full
                          transform hover:scale-105 transition-all duration-300
                          shadow-lg hover:shadow-2xl
                          uppercase tracking-wider text-lg"
                >
                  Dołącz do Nas! 🥋
                </a>
              </div>
            </div>
          </div>

          {/* Side Accent Elements */}
          <div class="absolute -left-8 top-1/4 w-16 h-64 bg-secondary opacity-20 blur-xl -z-10">
          </div>
          <div class="absolute -right-8 top-2/3 w-16 h-64 bg-primary opacity-20 blur-xl -z-10">
          </div>
        </div>
      </div>
    </PageShell>
  );
});
