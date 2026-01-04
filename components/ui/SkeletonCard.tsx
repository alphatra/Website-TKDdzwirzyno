export function SkeletonCard() {
  return (
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
      <div class="aspect-video bg-gray-200"></div>
      <div class="p-4">
        <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center">
          <div class="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4"></div>
          <div class="h-8 w-8 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
