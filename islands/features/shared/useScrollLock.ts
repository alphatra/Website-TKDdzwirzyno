import { useEffect, useRef } from "preact/hooks";

/**
 * Locks the body scroll by setting overflow: hidden on mount (if isOpen is true)
 * and restores the previous value on unmount or when closed.
 */
// Global counter to handle stacked modals
let lockCount = 0;

export function useScrollLock(isOpen: boolean) {
  const prevOverflow = useRef("");
  const prevPaddingRight = useRef("");

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!isOpen) return;

    lockCount += 1;
    // Only lock on the first modal
    if (lockCount === 1) {
      const scrollBarWidth = globalThis.innerWidth -
        document.documentElement.clientWidth;

      prevOverflow.current = document.body.style.overflow;
      prevPaddingRight.current = document.body.style.paddingRight;

      document.body.style.overflow = "hidden";
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    }

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      // Only unlock when no modals are open
      if (lockCount === 0) {
        document.body.style.overflow = prevOverflow.current;
        document.body.style.paddingRight = prevPaddingRight.current;
      }
    };
  }, [isOpen]);
}
