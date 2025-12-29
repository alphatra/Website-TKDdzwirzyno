// @deno-types="npm:@types/sanitize-html"
import sanitizeHtml from "sanitize-html";
import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import pb from "../utils/pb.ts";
import Header from "../islands/Header.tsx";

interface PageData {
  title: string;
  subtitle?: string;
  content: string;
  visible: boolean;
}

export default define.page(async function AboutPage(props) {
  // Real data fetch
  let record: PageData | null = null;
  try {
    const records = await pb.collection("pages").getList<PageData>(1, 1, {
      filter: 'slug = "o-klubie" && visible = true',
    });
    if (records.items.length > 0) {
      record = records.items[0];
    }
  } catch (e) {
    console.error("Error fetching o-klubie:", e);
  }

  // Fallback if DB is empty or fails (or migration incomplete)
  if (!record) {
    return (
      <>
        <Head>
          <title>Nie znaleziono - TKD Dzwirzyno</title>
        </Head>
        <Header menuPages={props.state.menuPages || []} />
        <div class="container-custom py-32 text-center">
          <h1 class="text-4xl font-bold">Strona w przygotowaniu</h1>
          <p>Nie udało się pobrać treści.</p>
        </div>
      </>
    );
  }

  const { title, subtitle, content } = record;
  const { menuPages } = props.state;

  // Split content by <hr>
  const sections = content.split("<hr>").map((s) => s.trim());
  const rawIntro = sections[0] || content;
  const rawValues = sections[1] || "";
  const rawHistory = sections[2] || "";

  // Sanitize Content
  /* Sanitize Content with strict security policy */
  const sanitizeOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'h2', 'h3', 'ul', 'li', 'br' ]),
    allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        'img': [ 'src', 'alt', 'class', 'title' ],
        '*': ['class'],
        'a': [ 'href', 'target', 'name', 'title' ]
    },
    allowedSchemes: [ 'http', 'https', 'mailto' ],
    allowedSchemesByTag: {
      img: [ 'http', 'https', 'data' ], // explicit for images
    },
    transformTags: {
      'a': sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }) // Force security on links
    }
  };

  const introContent = sanitizeHtml(rawIntro, sanitizeOptions);
  const valuesContent = sanitizeHtml(rawValues, sanitizeOptions);
  const historyContent = sanitizeHtml(rawHistory, sanitizeOptions);

  return (
    <>
      <Head>
        <title>{title} - TKD Dzwirzyno</title>
        <meta
          name="description"
          content="Poznaj historię i misję klubu TKD Dzwirzyno."
        />
      </Head>

      <Header menuPages={menuPages} />

      {/* 1. CLEAN HERO SECTION */}
      <section class="bg-primary-900 py-32 text-center text-white relative overflow-hidden">
        <div class="container-custom relative z-10 px-4">
          <h1 class="text-4xl md:text-6xl font-heading font-black tracking-wide uppercase mb-6">
            {title}
          </h1>

          {subtitle && (
            <p class="text-xl md:text-2xl text-secondary-400 font-medium max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </section>

      {/* 2. MAIN INTRO */}
      <section class="py-20 bg-white border-b border-gray-100">
        <div class="container-custom">
          <div class="max-w-4xl mx-auto">
            <div class="prose prose-lg md:prose-xl max-w-none text-gray-800 
                        prose-headings:font-heading prose-headings:font-bold prose-headings:text-primary-900 
                        prose-p:leading-8 prose-p:mb-6 prose-strong:text-secondary-600">
              {/* deno-lint-ignore react-no-danger */}
              <div dangerouslySetInnerHTML={{ __html: introContent }} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. VALUES SECTION */}
      {valuesContent && (
        <section class="py-24 bg-gray-50">
          <div class="container-custom">
            <div class="text-center mb-16">
              <h2 class="text-3xl font-heading font-bold text-primary-900">
                Nasze Fundamenty
              </h2>
              <div class="w-16 h-1 bg-secondary mx-auto mt-4"></div>
            </div>
            <div class="prose prose-lg max-w-none 
                        prose-ul:grid prose-ul:grid-cols-1 prose-ul:md:grid-cols-3 prose-ul:gap-8 prose-ul:p-0 
                        prose-li:bg-white prose-li:p-8 prose-li:rounded-lg prose-li:shadow-sm prose-li:border prose-li:border-gray-100 
                        prose-li:list-none prose-li:m-0 
                        prose-h3:text-primary-900 prose-h3:mt-0 prose-h3:mb-4 prose-h3:text-xl
                        prose-p:text-gray-600 prose-p:text-base prose-p:m-0">
              {/* deno-lint-ignore react-no-danger */}
              <div dangerouslySetInnerHTML={{ __html: valuesContent }} />
            </div>
          </div>
        </section>
      )}

      {/* 4. HISTORY SECTION */}
      {historyContent && (
        <section class="py-24 bg-white relative">
          <div class="container-custom">
            <div class="max-w-4xl mx-auto">
              <div class="flex items-center gap-4 mb-12 opacity-50">
                <div class="h-px bg-gray-300 flex-1"></div>
                <span class="text-sm font-bold tracking-widest uppercase text-gray-400">
                  Historia
                </span>
                <div class="h-px bg-gray-300 flex-1"></div>
              </div>

              <div class="prose prose-lg max-w-none text-gray-800
                           prose-headings:font-heading prose-headings:text-primary-900
                           prose-p:text-gray-600">
                {/* deno-lint-ignore react-no-danger */}
                <div dangerouslySetInnerHTML={{ __html: historyContent }} />
              </div>

              <div class="mt-16 text-center">
                <a
                  href="/kontakt"
                  class="inline-block bg-secondary hover:bg-secondary-700 text-white font-bold py-4 px-10 rounded transition-colors duration-300"
                >
                  Dołącz do Nas
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
});
