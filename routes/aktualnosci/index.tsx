import { define } from "../../utils.ts";
import pb from "../../utils/pb.ts";
import { PageShell } from "../../components/layout/PageShell.tsx";

import { NewsRecord } from "../../utils/pocketbase.ts";
import { EmptyState } from "../../components/ui/EmptyState.tsx";

export default define.page(async (props) => {
  const { menuPages } = props.state;
  const page = Number(props.url.searchParams.get("page")) || 1;
  const perPage = 9;

  let news: NewsRecord[] = [];
  let totalItems = 0;

  try {
    const result = await pb.collection("news").getList<NewsRecord>(
      page,
      perPage,
      {
        filter: "published=true",
        sort: "-created",
      },
    );
    news = result.items;
    totalItems = result.totalItems;
  } catch (_e) {
    // console.warn("News fetch error", _e);
  }

  const totalPages = Math.ceil(totalItems / perPage);

  return (
    <PageShell
      title="Aktualności - TKD Dźwirzyno"
      description="Najnowsze informacje z życia klubu, relacje z zawodów i komunikaty."
      menuPages={menuPages}
      ogImage="/static/bg_hero.jpg"
      ogType="website"
    >
      <div class="pt-32 pb-20 bg-slate-50 dark:bg-slate-900 min-h-screen">
        <div class="container-custom">
          <header class="text-center mb-16">
            <h1 class="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-slate-900 dark:text-white">
              Aktualności
            </h1>
            <p class="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              Bądź na bieżąco z życiem klubu.
            </p>
          </header>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {news.map((item) => (
              <a
                href={`/aktualnosci/${item.id}`}
                key={item.id}
                class="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col"
              >
                <div class="h-48 bg-slate-100 dark:bg-slate-700 relative overflow-hidden flex items-center justify-center">
                  {item.image
                    ? (
                      <img
                        src={`/api/files/${item.collectionId}/${item.id}/${item.image}`}
                        alt={item.title}
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    )
                    : <span class="text-4xl">📰</span>}
                </div>
                <div class="p-6 flex flex-col flex-grow">
                  <div class="text-xs font-bold text-primary mb-2 uppercase tracking-wider">
                    {new Date(item.created).toLocaleDateString("pl-PL")}
                  </div>
                  <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h2>
                  <p class="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-4 flex-grow">
                    {item.summary}
                  </p>
                  <span class="text-secondary font-bold text-sm uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
                    Czytaj więcej{" "}
                    <span class="material-icons-round text-sm">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </a>
            ))}
          </div>

          {news.length === 0 && (
            <EmptyState
              message="Brak aktualności do wyświetlenia."
              icon="article"
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div class="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <a
                  key={i}
                  href={`?page=${i + 1}`}
                  class={`w-10 h-10 flex items-center justify-center rounded-lg font-bold transition-colors ${
                    page === i + 1
                      ? "bg-primary text-white"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {i + 1}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
});
