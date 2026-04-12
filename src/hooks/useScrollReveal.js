import { useEffect, useRef } from "react";

/**
 * Attach to any element. When the element enters the viewport,
 * `data-visible="true"` is set so CSS [data-reveal][data-visible] kicks in.
 */
export function useScrollReveal({ threshold = 0.12 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "true";
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
