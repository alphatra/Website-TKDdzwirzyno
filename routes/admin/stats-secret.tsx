import { define } from "../../utils.ts";

export default define.page(async function AdminStats() {
  let stats: { path: string; count: number }[] = [];
  let totalViews = 0;
  let errorMsg = "";

  try {
    if (typeof Deno.openKv === "function") {
        const kv = await Deno.openKv();
        const entries = kv.list({ prefix: ["site_views"] });
        
        for await (const entry of entries) {
            if (entry.key.length > 1) {
            stats.push({
                path: entry.key[1] as string,
                count: Number(entry.value),
            });
            }
        }
        // Sort by count descending
        stats.sort((a, b) => b.count - a.count);
        totalViews = stats.reduce((acc, curr) => acc + curr.count, 0);
    } else {
        errorMsg = "Deno KV is not available in this environment (try production build).";
    }
  } catch (e) {
      errorMsg = "Error accessing KV: " + String(e);
  }

  return (
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-8">
      <div class="max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h1 class="text-3xl font-bold font-heading text-primary">
            Statystyki Odwiedzin
          </h1>
          <div class="text-sm text-slate-500 font-mono">
             Total: <span class="font-bold text-lg text-slate-900 dark:text-white">{totalViews}</span>
          </div>
        </div>

        {errorMsg && (
            <div class="p-4 mb-6 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg">
                ⚠️ {errorMsg}
            </div>
        )}

        <div class="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th class="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs">
                    Ścieżka (URL)
                  </th>
                  <th class="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs text-right">
                    Odsłony
                  </th>
                  <th class="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-xs text-right">
                    % Ruchu
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                {stats.map((stat) => (
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td class="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">
                      <a href={stat.path} class="hover:text-primary transition-colors block truncate max-w-lg" target="_blank">
                        {stat.path}
                      </a>
                    </td>
                    <td class="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                      {stat.count}
                    </td>
                     <td class="px-6 py-4 text-right text-slate-500 text-xs">
                      {totalViews > 0 ? ((stat.count / totalViews) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
                {stats.length === 0 && (
                  <tr>
                    <td colSpan={3} class="px-6 py-12 text-center text-slate-500">
                      Brak danych. Odwiedź kilka stron, aby zebrać statystyki.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="mt-8 text-center">
            <a href="/" class="text-primary hover:underline text-sm font-medium">
                &larr; Powrót do strony głównej
            </a>
        </div>
      </div>
    </div>
  );
});
