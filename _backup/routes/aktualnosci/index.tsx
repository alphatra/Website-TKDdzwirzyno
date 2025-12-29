import { Head } from "fresh/runtime";
import { PageProps } from "fresh";
import pb from "../../utils/pb.ts";
import { Handlers } from "fresh/compat";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  created: string;
  image?: string;
  collectionId?: string;
}

export const handler: Handlers<NewsItem[]> = {
  async GET(ctx) {
    try {
      // Fetch up to 50 latest items for now
      const result = await pb.collection("news").getList<NewsItem>(1, 50, {
        sort: "-created",
      });
      return ctx.render(result.items);
    } catch (e) {
      console.warn("PocketBase Fetch Error (News Page):", e);
      return ctx.render([]);
    }
  },
};

export default function NewsPage({ data }: PageProps<NewsItem[]>) {
  return (
    <>
      <Head>
        <title>Aktualności - TKD Dzwirzyno</title>
      </Head>

      <section class="py-20 bg-gray-50 min-h-screen">
        <div class="container-custom">
          <h1 class="text-4xl md:text-5xl font-heading font-bold text-primary-900 mb-12 text-center uppercase tracking-tight">
            Aktualności
          </h1>

          <div class="grid md:grid-cols-3 gap-8">
            {data.map((item) => (
              <a
                href={`/aktualnosci/${item.id}`}
                key={item.id}
                class="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col h-full border border-gray-100"
              >
                <div class="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                  {item.image
                    ? (
                      <img
                        src={`/api/files/${item.collectionId}/${item.id}/${item.image}?thumb=400x300`}
                        alt={item.title}
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )
                    : (
                      <span class="text-6xl opacity-20 group-hover:scale-110 transition-transform duration-500">
                        📰
                      </span>
                    )}
                  <div class="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">
                    News
                  </div>
                </div>
                <div class="p-6 flex-grow flex flex-col">
                  <div class="text-sm text-gray-400 mb-2 font-mono">
                    {new Date(item.created).toLocaleDateString("pl-PL")}
                  </div>
                  <h3 class="text-xl font-heading font-bold text-primary-900 mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p class="text-gray-500 text-sm line-clamp-3 mb-4 flex-grow">
                    {item.summary}
                  </p>
                  <span class="text-secondary font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform inline-block">
                    Czytaj dalej →
                  </span>
                </div>
              </a>
            ))}
            {data.length === 0 && (
              <div class="col-span-3 text-center py-12 text-gray-500">
                Brak aktualności.
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
