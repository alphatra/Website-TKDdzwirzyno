import { define } from "../../utils.ts";
import pb from "../../utils/pb.ts";
import { PageShell } from "../../components/layout/PageShell.tsx";
import { NewsRecord } from "../../utils/pocketbase.ts";
import { ErrorState } from "../../components/ui/ErrorState.tsx";
import { sanitize } from "../../utils/sanitize.ts";

export default define.page(async (props) => {
  const { id } = props.params;
  const { menuPages } = props.state;
  let newsItem: NewsRecord | null = null;
  const errorMsg = "Nie znaleziono aktualności.";

  try {
    newsItem = await pb.collection("news").getOne<NewsRecord>(id);
  } catch (_e) {
    // news item remains null
  }

  if (!newsItem) {
    return (
      <PageShell title="Błąd - TKD Dźwirzyno" menuPages={menuPages}>
        <ErrorState
          title="Nie znaleziono wpisu"
          message={errorMsg}
          homeLink
        />
      </PageShell>
    );
  }

  // Sanitize content
  const cleanContent = sanitize(newsItem.content, "cms");

  const ogImage = newsItem.image
    ? pb.files.getUrl(newsItem, newsItem.image)
    : "/static/logo.png";

  return (
    <PageShell
      title={`${newsItem.title} - TKD Dźwirzyno`}
      description={newsItem.summary}
      menuPages={menuPages}
      ogImage={ogImage}
      ogType="article"
    >
      <article class="pt-32 pb-20 min-h-screen bg-slate-50 dark:bg-slate-900">
        <div class="container-custom max-w-4xl">
          <a
            href="/aktualnosci"
            class="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-8 transition-colors font-bold uppercase text-xs tracking-wider"
          >
            <span class="material-icons-round text-sm">arrow_back</span>
            Wróć do listy
          </a>

          <header class="mb-12">
            <div class="flex items-center gap-4 mb-4 text-sm text-slate-500 dark:text-slate-400 font-mono">
              <span>
                {new Date(newsItem.created).toLocaleDateString("pl-PL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {newsItem.published && (
                <span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold uppercase">
                  Opublikowane
                </span>
              )}
            </div>
            <h1 class="text-4xl md:text-5xl font-heading font-black text-slate-900 dark:text-white mb-8 leading-tight">
              {newsItem.title}
            </h1>
            <p class="text-xl text-slate-600 dark:text-slate-300 font-light leading-relaxed border-l-4 border-secondary pl-6 italic">
              {newsItem.summary}
            </p>
          </header>

          {newsItem.image && (
            <div class="mb-12 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800">
              <img
                src={pb.files.getUrl(newsItem, newsItem.image)}
                alt={newsItem.title}
                class="w-full h-auto max-h-[600px] object-cover"
              />
            </div>
          )}

          <div
            class="prose prose-lg dark:prose-invert prose-headings:font-heading prose-a:text-primary hover:prose-a:text-secondary prose-img:rounded-xl max-w-none bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700"
            // deno-lint-ignore react-no-danger
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
        </div>
      </article>
    </PageShell>
  );
});
