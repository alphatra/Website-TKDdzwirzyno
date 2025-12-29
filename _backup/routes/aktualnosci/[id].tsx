import { Head } from "fresh/runtime";
import { PageProps } from "fresh";
import pb from "../../utils/pb.ts";
import { Handlers } from "fresh/compat";
import { HttpError } from "fresh";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image?: string;
  collectionId: string;
  created: string;
  updated: string;
}

export const handler: Handlers<NewsItem> = {
  async GET(ctx) {
    try {
      const { id } = ctx.params;
      const item = await pb.collection("news").getOne<NewsItem>(id);
      return ctx.render(item);
    } catch (e) {
      console.warn("PocketBase Fetch Error (News Detail):", e);
      throw new HttpError(404);
    }
  },
};

export default function NewsDetail({ data }: PageProps<NewsItem>) {
  return (
    <>
      <Head>
        <title>{data.title} - TKD Dzwirzyno</title>
      </Head>

      <section class="py-20 bg-white min-h-screen">
        <div class="container-custom max-w-4xl mx-auto">
          <div class="mb-8">
            <a
              href="/aktualnosci"
              class="text-secondary hover:text-secondary-600 font-bold transition-colors inline-flex items-center gap-2"
            >
              <span class="text-xl">←</span> Wróć do aktualności
            </a>
          </div>

          <article class="bg-white rounded-xl overflow-hidden">
            <header class="mb-8 border-b border-gray-100 pb-8">
              <div class="flex items-center gap-4 text-sm text-gray-500 mb-4 font-mono uppercase tracking-wider">
                <span>
                  {new Date(data.created).toLocaleDateString("pl-PL")}
                </span>
                <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span class="text-secondary font-bold">News</span>
              </div>

              <h1 class="text-3xl md:text-5xl font-heading font-bold text-primary-900 mb-8 leading-tight">
                {data.title}
              </h1>

              {/* Main Image */}
              {data.image && (
                <div class="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg mb-8">
                  <img
                    src={`/api/files/${data.collectionId}/${data.id}/${data.image}`}
                    alt={data.title}
                    class="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              )}
            </header>

            {/* Content - Using dangerouslySetInnerHTML for HTML content from PB */}
            <div
              class="prose prose-lg prose-slate max-w-none text-gray-700 leading-relaxed font-light
                      prose-headings:font-heading prose-headings:font-bold prose-headings:text-primary-900
                      prose-strong:text-primary-900 prose-strong:font-bold
                      prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
                      prose-img:rounded-xl prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: data.content }}
            />
          </article>
        </div>
      </section>
    </>
  );
}
