import { useEffect, useState } from "react";
import "./SiteHeader.css";
import { IconBrackets } from "./HeroIcons";

const LINKS = [
  { href: "#hero", label: "Home" },
  { href: "#intro", label: "About" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "/full-info", label: "Full CV" },
  { href: "#contact", label: "Contact" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("#hero");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      // Detect which section is in view
      const ids = LINKS.map((l) => l.href)
        .filter((h) => h.startsWith("#"))
        .map((h) => h.slice(1));

      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(`#${ids[i]}`);
          return;
        }
      }
      setActive("#hero");
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`site-header${scrolled ? " site-header--scrolled" : ""}`}
      style={{ position: "sticky", top: 0, zIndex: 100 }}
    >
      <a href="#hero" className="site-header__brand">
        <span className="site-header__brand-icon" aria-hidden>
          <IconBrackets />
        </span>
        Criss Nguyen
      </a>
      <nav className="site-header__nav" aria-label="Main navigation">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={`site-header__link${active === l.href ? " site-header__link--active" : ""}`}
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
