import { useEffect, useState } from "react";

/**
 * Cycles through `words`, typing and deleting each with configurable speeds.
 * Returns the currently-displayed string + a `done` flag (true while fully typed).
 * Immediately shows first word statically when prefers-reduced-motion is set.
 */
export function useTypewriter(
  words,
  { speed = 72, deleteSpeed = 36, pause = 2400 } = {},
) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [s, setS] = useState({ idx: 0, chars: reduced ? words[0] : "", del: false });

  useEffect(() => {
    if (reduced) return;
    const target = words[s.idx % words.length];

    if (!s.del && s.chars === target) {
      const t = setTimeout(() => setS((p) => ({ ...p, del: true })), pause);
      return () => clearTimeout(t);
    }
    if (s.del && s.chars === "") {
      setS((p) => ({ ...p, idx: p.idx + 1, del: false }));
      return;
    }
    const delay = s.del ? deleteSpeed : speed;
    const t = setTimeout(() => {
      setS((p) => ({
        ...p,
        chars: p.del
          ? p.chars.slice(0, -1)
          : target.slice(0, p.chars.length + 1),
      }));
    }, delay);
    return () => clearTimeout(t);
  }, [s, words, speed, deleteSpeed, pause, reduced]);

  return { text: s.chars, done: s.chars === words[s.idx % words.length] && !s.del };
}
