import { ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";

interface ParallaxBackgroundProps {
  children: ComponentChildren;
  speed?: number; // 0.5 = half scroll speed, -0.5 = reverse half speed
  className?: string;
}

export default function ParallaxBackground({
  children,
  speed = 0.5,
  className = "",
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const scrollY = globalThis.scrollY;
      const offset = scrollY * speed;
      ref.current.style.transform = `translateY(${offset}px)`;
    };

    globalThis.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial pos

    return () => globalThis.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      class={`absolute inset-0 pointer-events-none will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
