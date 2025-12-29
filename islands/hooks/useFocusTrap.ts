import { RefObject } from "preact";
import { useEffect, useRef } from "preact/hooks";

export function useFocusTrap(
  isOpen: boolean,
  containerRef: RefObject<HTMLElement>,
  onClose: () => void,
  initialFocusRef?: RefObject<HTMLElement>,
) {
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const timeoutId = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (timeoutId.current) window.clearTimeout(timeoutId.current);
      timeoutId.current = null;

      if (lastFocusedElement.current && document.contains(lastFocusedElement.current)) {
        lastFocusedElement.current.focus();
      }
      return;
    }

    lastFocusedElement.current = document.activeElement as HTMLElement;

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== "Tab" || !containerRef.current) return;

      const focusable = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeydown);

    timeoutId.current = window.setTimeout(() => {
      const preferred = initialFocusRef?.current;
      if (preferred) return preferred.focus();

      const first = containerRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      first?.focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      if (timeoutId.current) window.clearTimeout(timeoutId.current);
      timeoutId.current = null;
    };
  }, [isOpen, onClose, containerRef, initialFocusRef]);
}
