import { useEffect } from "preact/hooks";

export default function LinkPrefetcher() {
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest("a");
      if (
        !link || !link.href || link.href.startsWith("mailto:") ||
        link.href.startsWith("tel:")
      ) return;

      // Check if already prefetched
      if (
        document.head.querySelector(`link[rel="prefetch"][href="${link.href}"]`)
      ) return;

      const prefetchLink = document.createElement("link");
      prefetchLink.rel = "prefetch";
      prefetchLink.href = link.href;
      document.head.appendChild(prefetchLink);
    };

    document.body.addEventListener("mouseover", handleMouseOver, {
      passive: true,
    });

    return () => {
      document.body.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return null;
}
