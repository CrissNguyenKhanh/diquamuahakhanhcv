import { useEffect, useRef, useState } from "react";
import "./UIEnhancements.css";

export default function UIEnhancements() {
  const cursorRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Scroll progress
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? (scrolled / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Custom cursor (skip on touch/reduced-motion)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;

    if (!reduced && !isTouch) {
      const cursor = cursorRef.current;
      let mx = -200;
      let my = -200;
      let cx = -200;
      let cy = -200;

      const onMove = (e) => {
        mx = e.clientX;
        my = e.clientY;
      };
      document.addEventListener("mousemove", onMove);

      let raf;
      const animate = () => {
        cx += (mx - cx) * 0.1;
        cy += (my - cy) * 0.1;
        if (cursor) {
          cursor.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
        }
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);

      const onOver = (e) => {
        if (
          e.target.closest(
            "a, button, [role='button'], input, textarea, select, label",
          )
        ) {
          cursor?.classList.add("cursor-glow--hover");
        }
      };
      const onOut = () => cursor?.classList.remove("cursor-glow--hover");
      document.addEventListener("mouseover", onOver);
      document.addEventListener("mouseout", onOut);

      return () => {
        window.removeEventListener("scroll", onScroll);
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseover", onOver);
        document.removeEventListener("mouseout", onOut);
        cancelAnimationFrame(raf);
      };
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="scroll-progress"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
      {/* Custom cursor glow */}
      <div ref={cursorRef} className="cursor-glow" aria-hidden="true" />
    </>
  );
}
