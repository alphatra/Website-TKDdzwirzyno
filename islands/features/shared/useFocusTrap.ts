import { RefObject } from "preact";
import { useEffect, useRef } from "preact/hooks";

// Helper to find focusable elements
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = container.querySelectorAll(
    'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])',
  );

  return Array.from(elements).filter((el) => {
    if (el.hasAttribute("disabled")) return false;
    if (el.getAttribute("aria-disabled") === "true") return false;

    if (!(el instanceof HTMLElement)) return false;

    // Robust visibility check
    const style = globalThis.getComputedStyle(el);
    return (
      style.visibility !== "hidden" &&
      style.display !== "none" &&
      el.getClientRects().length > 0
    );
  }) as HTMLElement[];
}

const activeTraps: Set<HTMLElement> = new Set();

export function useFocusTrap(
  isOpen: boolean,
  containerRef: RefObject<HTMLElement>,
  onClose: () => void,
  initialFocusRef?: RefObject<HTMLElement>,
) {
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const timeoutId = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current) {
      if (timeoutId.current) globalThis.clearTimeout(timeoutId.current);
      timeoutId.current = null;

      // Cleanup: remove from active traps
      if (containerRef.current) activeTraps.delete(containerRef.current);

      if (
        lastFocusedElement.current &&
        document.contains(lastFocusedElement.current)
      ) {
        lastFocusedElement.current.focus();
      }
      return;
    }

    // Add to active traps
    activeTraps.add(containerRef.current);
    lastFocusedElement.current = document.activeElement as HTMLElement;

    const handleKeydown = (e: KeyboardEvent) => {
      // Check if we are the top-most trap (last added to Set is usually last in iteration, but Set order is insertion order in JS)
      // Actually obtaining the "last" element from a Set is O(N).
      // Let's assume the stack is maintained. A Set preserves insertion order.
      // So the last element in the Set is the most recently added -> the top modal.
      const trapsArray = Array.from(activeTraps);
      const isTopmost =
        trapsArray[trapsArray.length - 1] === containerRef.current;

      if (!isTopmost) return; // Allow event to propagate or be handled by top trap

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

    timeoutId.current = globalThis.setTimeout(() => {
      const preferred = initialFocusRef?.current;
      if (preferred) {
        // Ensure preferred element is focusable and visible
        const focusableInContainer = containerRef.current
          ? getFocusableElements(containerRef.current)
          : [];
        if (focusableInContainer.includes(preferred)) {
          return preferred.focus();
        }
      }

      const firstFocusable = containerRef.current
        ? getFocusableElements(containerRef.current)[0]
        : undefined;
      firstFocusable?.focus();
    }, 0);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      if (timeoutId.current) globalThis.clearTimeout(timeoutId.current);
      timeoutId.current = null;
      if (containerRef.current) activeTraps.delete(containerRef.current);
    };
  }, [isOpen, onClose, containerRef, initialFocusRef]);
}
