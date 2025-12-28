import { PageProps } from "fresh";
import { Head } from "fresh/runtime";
import pb from "../utils/pb.ts";
import { Handlers } from "fresh/compat";
import { HttpError } from "fresh";

interface PageData {
  title: string;
  subtitle?: string;
  content: string;
  visible: boolean;
}

export const handler: Handlers<PageData> = {
  async GET(ctx) {
    try {
      const records = await pb.collection("pages").getList<PageData>(1, 1, {
        filter: 'slug = "o-klubie" && visible = true',
      });

      if (records.items.length === 0) {
        throw new HttpError(404);
      }

      return ctx.render(records.items[0]);
    } catch (e) {
      console.error("Page fetch error:", e);
      throw new HttpError(404);
    }
  },
};

export default function AboutPage({ data }: PageProps<PageData>) {
  const { title, subtitle, content } = data;

  // Split content by <hr>
  const sections = content.split("<hr>").map((s) => s.trim());
  const introContent = sections[0] || content;
  const valuesContent = sections[1] || "";
  const historyContent = sections[2] || "";

  return (
    <>
      <Head>
        <title>{title} - TKD Dzwirzyno</title>
        <meta
          name="description"
          content="Poznaj historię i misję klubu TKD Dzwirzyno."
        />
      </Head>

      {/* 1. CLEAN HERO SECTION */}
      {/* Solid Navy Background, no gradients or glows */}
      <section class="bg-primary-900 py-32 text-center text-white relative overflow-hidden">
        {/* Subtle texture or pattern if desired, but keeping it minimal for now */}
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

      {/* 2. MAIN INTRO (White, clean typography) */}
      <section class="py-20 bg-white border-b border-gray-100">
        <div class="container-custom">
          <div class="max-w-4xl mx-auto">
            <div class="prose prose-lg md:prose-xl max-w-none text-gray-800 
                        prose-headings:font-heading prose-headings:font-bold prose-headings:text-primary-900 
                        prose-p:leading-8 prose-p:mb-6 prose-strong:text-secondary-600">
              {/* Intro text */}
              <div dangerouslySetInnerHTML={{ __html: introContent }} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. VALUES SECTION (Gray bg, Cards) */}
      {valuesContent && (
        <section class="py-24 bg-gray-50">
          <div class="container-custom">
            <div class="text-center mb-16">
              <h2 class="text-3xl font-heading font-bold text-primary-900">
                Nasze Fundamenty
              </h2>
              <div class="w-16 h-1 bg-secondary mx-auto mt-4"></div>
            </div>

            {
              /*
              We use a CSS grid approach to style the list items from the CMS as cards.
              The CMS sends valid HTML like <ul><li><h3>Title</h3><p>Text</p></li>...</ul>
              We style this using Tailwind prose modifiers.
            */
            }
            <div class="prose prose-lg max-w-none 
                        prose-ul:grid prose-ul:grid-cols-1 prose-ul:md:grid-cols-3 prose-ul:gap-8 prose-ul:p-0 
                        prose-li:bg-white prose-li:p-8 prose-li:rounded-lg prose-li:shadow-sm prose-li:border prose-li:border-gray-100 
                        prose-li:list-none prose-li:m-0 
                        prose-h3:text-primary-900 prose-h3:mt-0 prose-h3:mb-4 prose-h3:text-xl
                        prose-p:text-gray-600 prose-p:text-base prose-p:m-0">
              <div dangerouslySetInnerHTML={{ __html: valuesContent }} />
            </div>
          </div>
        </section>
      )}

      {/* 4. HISTORY SECTION (Clean, white) */}
      {historyContent && (
        <section class="py-24 bg-white relative">
          <div class="container-custom">
            <div class="max-w-4xl mx-auto">
              {/* Visual Separator */}
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
}
