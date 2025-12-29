import { Head } from "fresh/runtime";
import { PageProps } from "fresh";
import pb from "../utils/pb.ts";
import { Handlers } from "fresh/compat";

interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  group: string;
  location: string;
}

export const handler: Handlers<ScheduleItem[]> = {
  async GET(ctx) {
    try {
      const result = await pb.collection("schedule").getList<ScheduleItem>(
        1,
        100,
      );
      // Sort logic could also be done here or in CMS.
      // Manual sorting to order days correctly:
      const dayOrder = {
        "Poniedziałek": 1,
        "Wtorek": 2,
        "Środa": 3,
        "Czwartek": 4,
        "Piątek": 5,
        "Sobota": 6,
        "Niedziela": 7,
      };
      const sorted = result.items.sort((a, b) =>
        (dayOrder[a.day as keyof typeof dayOrder] || 10) -
        (dayOrder[b.day as keyof typeof dayOrder] || 10)
      );

      return ctx.render(sorted);
    } catch (e) {
      console.warn("PocketBase Fetch Error (Schedule):", e);
      return ctx.render([]);
    }
  },
};

export default function Grafik({ data }: PageProps<ScheduleItem[]>) {
  return (
    <>
      <Head>
        <title>Grafik Treningów - TKD Dzwirzyno</title>
      </Head>
      <section class="py-20">
        <div class="container-custom">
          <div class="text-center mb-12 animate-slide-up">
            <h1 class="text-5xl font-heading font-bold text-primary mb-4">
              Grafik Treningów
            </h1>
            <div class="w-24 h-1 bg-accent mx-auto rounded-full"></div>
            <p class="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Zaplanuj swój czas i dołącz do nas na macie!
            </p>
          </div>

          <div class="card overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-6 py-4 text-left text-sm font-bold text-gray-900">
                      Dzień
                    </th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-gray-900">
                      Godzina
                    </th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-gray-900">
                      Grupa
                    </th>
                    <th class="px-6 py-4 text-left text-sm font-bold text-gray-900">
                      Lokalizacja
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  {data.length === 0
                    ? (
                      <tr>
                        <td
                          colspan={4}
                          class="px-6 py-8 text-center text-gray-500"
                        >
                          Brak ustalonych treningów w grafiku. Skontaktuj się z
                          nami.
                        </td>
                      </tr>
                    )
                    : (
                      data.map((item) => (
                        <tr
                          key={item.id}
                          class="hover:bg-gray-50 transition-colors"
                        >
                          <td class="px-6 py-4 text-primary font-bold">
                            {item.day}
                          </td>
                          <td class="px-6 py-4 font-mono text-gray-600">
                            {item.time}
                          </td>
                          <td class="px-6 py-4">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                              {item.group}
                            </span>
                          </td>
                          <td class="px-6 py-4 text-gray-500">
                            {item.location}
                          </td>
                        </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
