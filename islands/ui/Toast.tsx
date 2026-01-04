import { useEffect, useState } from "preact/hooks";

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export default function Toast(
  { message, onClose, duration = 3000 }: ToastProps,
) {
  const [visible, setVisible] = useState(false);

  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onCloseRef.current(), 300); // Wait for fade out animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!message && !visible) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      class={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] px-6 py-3 rounded-full bg-slate-900 text-white shadow-lg flex items-center gap-3 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <span class="material-icons-round text-emerald-400 text-lg">
        check_circle
      </span>
      <span class="text-sm font-semibold">{message}</span>
    </div>
  );
}
