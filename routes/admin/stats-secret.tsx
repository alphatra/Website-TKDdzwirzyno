import { define } from "../../utils.ts";

export default define.page(async function AdminStats() {
  const stats: { path: string; count: number; unique: number }[] = [];
  let totalViews = 0;
  let totalUnique = 0;
  let errorMsg = "";

  try {
    if (typeof Deno.openKv === "function") {
        const kv = await Deno.openKv();
        const entries = kv.list({ prefix: ["site_views"] });
        
        for await (const entry of entries) {
            if (entry.key.length > 1) {
              const path = entry.key[1] as string;
              // Fetch unique count for this path
              const uniqueRes = await kv.get<Deno.KvU64>(["site_uniques", path]);
              const uniqueCount = uniqueRes.value ? Number(uniqueRes.value) : 0;

              stats.push({
                  path: path,
                  count: Number(entry.value),
                  unique: uniqueCount,
              });
            }
        }
        // Sort by count descending
        stats.sort((a, b) => b.count - a.count);
        totalViews = stats.reduce((acc, curr) => acc + curr.count, 0);
        totalUnique = stats.reduce((acc, curr) => acc + curr.unique, 0);
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
          <div class="text-sm text-slate-500 font-mono text-right">
             <div class="text-xs uppercase tracking-wide opacity-70">Odsłony / Unikalne</div>
             <span class="font-bold text-lg text-slate-900 dark:text-white">{totalViews}</span> 
             <span class="mx-2 text-slate-400">/</span>
             <span class="font-bold text-lg text-blue-600 dark:text-blue-400">{totalUnique}</span>
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
              <thead class="bg-slate-100 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 font-medium text-slate-500 uppercase tracking-wider text-xs">
                <tr>
                  <th class="p-4 w-16">#</th>
                  <th class="p-4">Ścieżka</th>
                  <th class="p-4 text-right">Odsłony</th>
                  <th class="p-4 text-right">Unikalne</th>
                  <th class="p-4 text-right w-24">%</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700/50">
                {stats.map((item, index) => (
                  <tr key={item.path} class="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                    <td class="p-4 text-slate-400 font-mono text-xs">{index + 1}</td>
                    <td class="p-4 font-mono text-slate-700 dark:text-slate-300 relative group">
                        <span class="relative z-10">{item.path}</span>
                         {/* Simple visual bar for proportion */}
                         <div class="absolute left-0 top-0 bottom-0 bg-primary/5 dark:bg-primary/10 transition-all duration-500" style={{ width: `${(item.count / totalViews) * 100}%` }}></div>
                    </td>
                    <td class="p-4 text-right font-bold tabular-nums">
                        {item.count}
                    </td>
                     <td class="p-4 text-right font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                        {item.unique}
                    </td>
                    <td class="p-4 text-right text-slate-400 tabular-nums text-xs">
                      {totalViews > 0 ? Math.round((item.count / totalViews) * 1000) / 10 : 0}%
                    </td>
                  </tr>
                ))}
                {stats.length === 0 && (
                  <tr>
                    <td colSpan={5} class="px-6 py-12 text-center text-slate-500">
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
