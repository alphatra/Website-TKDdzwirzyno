import { define } from "../utils.ts";
import { PageShell } from "../components/layout/PageShell.tsx";
import { NewsRecord } from "../utils/pocketbase.ts";
import { HeroSection } from "../components/sections/HeroSection.tsx";
import { PhilosophySection } from "../components/sections/PhilosophySection.tsx";
import { NewsSection } from "../components/sections/NewsSection.tsx";
import { CtaSection } from "../components/sections/CtaSection.tsx";

// deno-lint-ignore no-explicit-any
export default define.page(function Home(props: any) {
  const data = props.state.news as NewsRecord[] || [];

  return (
    <PageShell
      title="TKD Dzwirzyno - Siła i Charakter"
      description="Klub Taekwondo nad morzem. Trenuj z nami w Dźwirzynie."
      menuPages={props.state.menuPages || []}
      ogImage="/logo.jpg"
      ogType="website"
    >
      <HeroSection />
      <PhilosophySection />
      <NewsSection news={data} />
      <CtaSection />
    </PageShell>
  );
});
