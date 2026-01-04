import { useRef } from "preact/hooks";

export function useOutsideClick(
  ref: preact.RefObject<HTMLElement>,
  onClose: () => void,
  isOpen: boolean,
) {
  const isPointerDownOutside = useRef(false);

  const handlePointerDown = (e: PointerEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      isPointerDownOutside.current = true;
    } else {
      isPointerDownOutside.current = false;
    }
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (
      isPointerDownOutside.current &&
      ref.current &&
      !ref.current.contains(e.target as Node)
    ) {
      if (isOpen) {
        onClose();
      }
    }
    isPointerDownOutside.current = false;
  };

  return { handlePointerDown, handlePointerUp };
}
